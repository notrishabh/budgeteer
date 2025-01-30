"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "nextjs-toploader/app";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { useState } from "react";

export default function Login() {
  const { toast } = useToast();
  const router = useRouter();

  const [showSignup, setShowSignup] = useState(false);

  const { mutate } = useMutation({
    mutationFn: async (body: { username: string; password: string }) => {
      const response = await fetch(`/api/${showSignup ? "user" : "login"}`, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        const errorMessage = await response.json();
        throw new Error(errorMessage.error || "Something went wrong");
      }
      return response.json();
    },
    onSuccess: () => {
      router.push("/");
      toast({
        title: "Success 🎉",
        description: "Logged in",
        variant: "default",
        duration: 2000,
        className: "p-2",
      });
    },
    onError: (err) => {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
        duration: 2000,
        className: "p-2",
      });
    },
  });

  const formSchema = z.object({
    username: z.string(),
    password: z.string(),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  function onSubmit(data: z.infer<typeof formSchema>) {
    mutate(data);
  }

  return (
    <section className="px-6 py-8 w-full flex flex-col justify-center items-center h-screen overflow-hidden relative">
      <div className="fixed top-0 left-0 flex items-center">
        <Image
          src="/logo.png"
          alt="finance-graph"
          width={0}
          height={0}
          sizes="100vw"
          className="w-12 h-auto"
        />
        <p className="text-lg">Budgeteer</p>
      </div>
      <Image
        src="/val-2.jpg"
        alt="abstract-bg"
        width={0}
        height={0}
        sizes="100vw"
        className="absolute z-0 object-cover opacity-15 w-full h-auto left-1/4 scale-150"
      />
      <div className="pb-12 z-10">
        <p>A sleek and easy to use</p>
        <h1 className="text-3xl">Finance Management System</h1>
      </div>
      <div className="w-full sm:w-96 z-10">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Username"
                      className="border-black"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      placeholder="Password"
                      className="border-black"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full p-6 rounded-lg">
              {showSignup ? "Create Account" : "Sign In"}
            </Button>
          </form>
        </Form>
        <Button
          variant="link"
          className="text-blue-800 float-right p-0 mt-2"
          onClick={() => setShowSignup((prev) => !prev)}
        >
          {showSignup ? "Login to an existing account" : "Create Account"}
        </Button>
      </div>
    </section>
  );
}
