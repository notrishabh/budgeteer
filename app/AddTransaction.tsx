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
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function AddTransaction() {
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
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      setOpen(false);
    },
  });
  const formSchema = z.object({
    name: z.string(),
    price: z.coerce.number(),
    category: z.string(),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  function onSubmit(data: z.infer<typeof formSchema>) {
    mutate(data);
  }

  return (
    <Drawer open={open}>
      <DrawerTrigger asChild className="fixed bottom-10 right-10">
        <Button
          size="icon"
          className="rounded-full w-12 h-12"
          onClick={() => setOpen(true)}
        >
          <Plus />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-5/6 bg-white px-6">
        <DrawerHeader className="relative">
          <DrawerClose>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-0 top-3"
            >
              <X />
            </Button>
          </DrawerClose>
          <DrawerTitle>Add an expense</DrawerTitle>
        </DrawerHeader>
        <Form {...form}>
          <form
            autoComplete="off"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 pt-20"
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
            <DrawerFooter>
              <Button type="submit">Submit</Button>
            </DrawerFooter>
          </form>
        </Form>
      </DrawerContent>
    </Drawer>
  );
}
