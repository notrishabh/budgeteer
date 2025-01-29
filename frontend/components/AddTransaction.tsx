"use client";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, ChevronsUpDown, Plus, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import { cn } from "@/lib/utils";
import { TCategory } from "@/types/types";
import AddCategoryDialog from "./AddCategoryDialog";

export default function AddTransaction() {
  const { toast } = useToast();
  const [categoryPopoverOpen, setCategoryPopoverOpen] =
    useState<boolean>(false);
  const [addCategoryDialogOpen, setAddCategoryDialogOpen] =
    useState<boolean>(false);
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const { data: categories, isLoading } = useQuery<TCategory[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await fetch("/api/expenses/category", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.json();
    },
  });
  const { mutate } = useMutation({
    mutationFn: async (body: {
      name: string;
      price: number;
      category: string;
    }) => {
      const response = await fetch("/api/expenses", {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        const errorMessage = await response.json();
        throw new Error(errorMessage.error);
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
    onError: (err) => {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
        duration: 3000,
        className: "p-2",
      });
    },
  });
  const formSchema = z.object({
    name: z.string(),
    price: z.coerce.number(),
    category: z.string({
      required_error: "Please select a category",
    }),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
  });
  function onSubmit(data: z.infer<typeof formSchema>) {
    mutate(data, {
      onSuccess: () => {
        form.reset();
        setOpen(false);
      },
    });
  }

  return (
    <Drawer open={open}>
      <DrawerTrigger asChild>
        <Button
          className="h-11 bg-gradient-to-br from-green-600 via-green-700 to-green-400"
          onClick={() => setOpen(true)}
        >
          <Plus />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-full bg-white">
        <DrawerHeader className="flex justify-between items-center">
          <DrawerClose>
            <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
              <X />
            </Button>
          </DrawerClose>
          <DrawerTitle className="ml-8">Add expense</DrawerTitle>
          <Button
            variant="link"
            className="font-semibold text-green-600 text-md"
            onClick={form.handleSubmit(onSubmit)}
          >
            Save
          </Button>
        </DrawerHeader>
        <Form {...form}>
          <form
            autoComplete="off"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 pt-20 px-16"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem className="flex flex-col space-y-3">
                  <FormLabel>Category</FormLabel>
                  <Popover open={categoryPopoverOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            " justify-between",
                            !field.value && "text-muted-foreground",
                          )}
                          onClick={() => setCategoryPopoverOpen(true)}
                        >
                          {field.value
                            ? categories?.find(
                                (category) => category.name === field.value,
                              )?.name
                            : "Select category"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent
                      className="p-0"
                      onInteractOutside={() => setCategoryPopoverOpen(false)}
                    >
                      <Command>
                        <CommandInput placeholder="Search category..." />
                        <CommandItem>
                          <AddCategoryDialog
                            dialogOpen={addCategoryDialogOpen}
                            setDialogOpen={setAddCategoryDialogOpen}
                          />
                        </CommandItem>
                        <CommandList>
                          <CommandEmpty>
                            No category found.
                            <div className="p-2">
                              <AddCategoryDialog
                                dialogOpen={addCategoryDialogOpen}
                                setDialogOpen={setAddCategoryDialogOpen}
                              />
                            </div>
                          </CommandEmpty>
                          <CommandGroup className="max-h-32 overflow-y-scroll">
                            {!isLoading && categories ? (
                              <>
                                {categories.map((category: TCategory) => (
                                  <CommandItem
                                    value={category.name}
                                    key={category.id}
                                    onSelect={() => {
                                      form.setValue("category", category.name);
                                      setCategoryPopoverOpen(false);
                                    }}
                                  >
                                    {category.name}
                                    <Check
                                      className={cn(
                                        "ml-auto",
                                        category.name === field.value
                                          ? "opacity-100"
                                          : "opacity-0",
                                      )}
                                    />
                                  </CommandItem>
                                ))}
                              </>
                            ) : (
                              <></>
                            )}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </DrawerContent>
    </Drawer>
  );
}
