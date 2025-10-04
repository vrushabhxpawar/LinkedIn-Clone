import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../../lib/axios.js";
import { toast } from "react-hot-toast";
import { Eye, EyeClosed, Loader } from "lucide-react";

function LoginForm() {
  const queryClient = useQueryClient();

  const [hidden, setHidden] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { mutate: loginMutation, isPending } = useMutation({
    mutationFn: async (data) => {
      const res = await axiosInstance.post("/auth/login", data);
      return res.data;
    },
    onSuccess: () => {
      toast.success("User logged successfully");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
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
    <form onSubmit={handleLogin} className="space-y-4 w-full max-w-md relative">
      <input
        type="text"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border-gray-400 border h-[35px] rounded-sm w-full p-2"
        required
      />
      <input
        type={hidden ? "password" : "text"}
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border-gray-400 border h-[35px] rounded-sm w-full p-2"
        required
      />
      {hidden ? (
        <EyeClosed
          size={20}
          className="absolute top-12 right-5 hover:cursor-pointer"
          onClick={() => setHidden(!hidden)}
        />
      ) : (
        <Eye
          size={20}
          className="absolute top-12 right-5 hover:cursor-pointer"
          onClick={() => setHidden(!hidden)}
        />
      )}
      <button
        type="submit"
        className="btn btn-primary w-full"
        disabled={isPending}
      >
        {isPending ? <Loader className="size-5 animate-spin" /> : "Login"}
      </button>
    </form>
  );
}

export default LoginForm;
