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
import { TTransaction } from "@/types/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Pencil, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function EditTransaction({ data }: { data: TTransaction }) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: async (body: {
      name: string;
      price: number;
      category: string;
    }) => {
      const response = await fetch(
        "http://localhost:8080/expenses/" + data.id,
        {
          method: "PATCH",
          credentials: "include",
          body: JSON.stringify(body),
        },
      );
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["transactions"],
      });
      queryClient.invalidateQueries({
        queryKey: ["transactions-details", data.id],
      });
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
    category: z.string(),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      name: data.name,
      price: data.price,
      category: data.category.name,
    },
    resolver: zodResolver(formSchema),
  });
  function onSubmit(data: z.infer<typeof formSchema>) {
    mutate(data, {
      onSuccess: () => {
        setOpen(false);
      },
    });
  }

  return (
    <Drawer open={open}>
      <DrawerTrigger asChild>
        <Button size="icon" variant="ghost" onClick={() => setOpen(true)}>
          <Pencil />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-full bg-white">
        <DrawerHeader className="flex justify-between items-center">
          <DrawerClose>
            <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
              <X />
            </Button>
          </DrawerClose>
          <DrawerTitle className="ml-8">Edit expense</DrawerTitle>
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
            className="space-y-8 pt-20 px-6"
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
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
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
