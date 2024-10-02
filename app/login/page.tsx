"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export default function Login() {
  // use react hook form here with shadcn
  const router = useRouter();
  const { mutate } = useMutation({
    mutationFn: async (body: { username: string; password: string }) => {
      const response = await fetch("http://localhost:8080/login", {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(body),
      });
      return response.json();
    },
    onSuccess: () => {
      router.push("/");
    },
  });
  const handleSumbit = () => {
    const x = {
      username: "tester",
      password: "hi",
    };
    mutate(x);
  };
  return (
    <section>
      <form
        className="flex flex-col gap-4"
        onSubmit={(e) => e.preventDefault()}
      >
        <input type="text" placeholder="Email" />
        <input type="password" placeholder="Password" />
        <button onClick={handleSumbit} className="p-4 bg-red-500">
          Login
        </button>
      </form>
    </section>
  );
}
