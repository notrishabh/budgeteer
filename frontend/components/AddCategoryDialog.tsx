import { Plus } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

type TAddCategoryDialog = {
  dialogOpen: boolean;
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function AddCategoryDialog({
  dialogOpen,
  setDialogOpen,
}: TAddCategoryDialog) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: async (body: { name: string }) => {
      const response = await fetch("/api/expenses/category", {
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
      queryClient.invalidateQueries({ queryKey: ["categories"] });
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
  const categoryFormSchema = z.object({
    name: z.string(),
  });
  const categoryForm = useForm<z.infer<typeof categoryFormSchema>>({
    resolver: zodResolver(categoryFormSchema),
  });
  function onCategorySubmit(data: z.infer<typeof categoryFormSchema>) {
    mutate(data, {
      onSuccess: () => {
        categoryForm.reset();
        setDialogOpen(false);
      },
    });
  }
  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild className="w-full">
        <Button className="w-full">
          Add New
          <Plus className="ml-2" />
        </Button>
      </DialogTrigger>
      <DialogContent className="px-16">
        <DialogHeader>
          <DialogTitle>Create new category</DialogTitle>
          <DialogDescription>
            Created category will be available in the list and will be private
            to you only.
          </DialogDescription>
        </DialogHeader>
        <Form {...categoryForm}>
          <form
            autoComplete="off"
            onSubmit={categoryForm.handleSubmit(onCategorySubmit)}
            className="py-4"
          >
            <FormField
              control={categoryForm.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <Button onClick={categoryForm.handleSubmit(onCategorySubmit)}>
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
