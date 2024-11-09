"use client";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
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
import { useMutation, useQueryClient } from "@tanstack/react-query";
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

const languages = [
  { label: "English", value: "en" },
  { label: "French", value: "fr" },
  { label: "German", value: "de" },
  { label: "Spanish", value: "es" },
  { label: "Portuguese", value: "pt" },
  { label: "Russian", value: "ru" },
  { label: "Japanese", value: "ja" },
  { label: "Korean", value: "ko" },
  { label: "Chinese", value: "zh" },
] as const;

export default function AddTransaction() {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: async (body: {
      name: string;
      price: number;
      category: string;
    }) => {
      const response = await fetch("http://localhost:8080/expenses", {
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
  });
  function onSubmit(data: z.infer<typeof formSchema>) {
    //mutate(data, {
    //  onSuccess: () => {
    //    form.reset();
    //    setOpen(false);
    //  },
    //});
    console.log(data);
  }

  return (
    <Drawer open={open}>
      <DrawerTrigger asChild>
        <Button size="icon" onClick={() => setOpen(true)}>
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
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            " justify-between",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value
                            ? languages.find(
                                (language) => language.value === field.value,
                              )?.label
                            : "Select category"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="p-0">
                      <Command>
                        <CommandInput placeholder="Search category..." />
                        <CommandList>
                          <CommandEmpty>No language found.</CommandEmpty>
                          <CommandGroup>
                            {languages.map((language) => (
                              <CommandItem
                                value={language.label}
                                key={language.value}
                                onSelect={() => {
                                  form.setValue("category", language.value);
                                }}
                              >
                                {language.label}
                                <Check
                                  className={cn(
                                    "ml-auto",
                                    language.value === field.value
                                      ? "opacity-100"
                                      : "opacity-0",
                                  )}
                                />
                              </CommandItem>
                            ))}
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
