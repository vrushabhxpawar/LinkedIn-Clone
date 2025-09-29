import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../../lib/axios.js";
import { toast } from "react-hot-toast";
import { Loader } from "lucide-react"


function LoginForm() {

  const queryClient = useQueryClient()

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { mutate: loginMutation, isPending } = useMutation({
    mutationFn: async (data) => {
      const res = await axiosInstance.post("/auth/login", data);
      return res.data;
    },
    onSuccess: () => {
      toast.success("User logged successfully");
      queryClient.invalidateQueries({ queryKey : ['authUser']})
    },
    onError: (err) => {
      toast.error(err.response.data.message || "Something went wrong");
    },
  });
  const handleLogin = async (e) => {
    e.preventDefault();
    loginMutation({ email, password });
  };
  return (
    <form onSubmit={handleLogin} className="space-y-4 w-full max-w-md">
      <input
        type="text"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="input input-bordered w-full"
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="input input-bordered w-full"
        required
      />

      <button type="submit" className="btn btn-primary w-full" disabled={isPending}>
        {isPending ? <Loader className="size-5 animate-spin" /> : "Login"}
      </button>
    </form>
  );
}

export default LoginForm;
