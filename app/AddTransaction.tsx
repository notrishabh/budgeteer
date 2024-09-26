"use client";
import { useMutation } from "@tanstack/react-query";
import { Plus } from "lucide-react";

export default function AddTransaction() {
  const { mutate } = useMutation({
    mutationFn: async () => {
      const response = await fetch("http://localhost:8080/expenses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3RlciIsInJvbGUiOiJ1c2VyIiwiZXhwIjoxNzI3NDY2MjY3fQ.--EyeVUj7pR0wD3hw1sSyN7K5mguRHjcutbgY7x3IGI",
        },
        body: JSON.stringify({
          name: "Milkman",
          price: 56,
          category: "grocery",
        }),
      });
      return response.json();
    },
  });

  const addTransaction = () => {
    mutate();
  };
  return (
    <div
      className="bg-gradient-to-br from-emerald-800 to-emerald-400 text-white rounded-full p-2"
      onClick={addTransaction}
    >
      <Plus className="h-10 w-10" />
    </div>
  );
}
