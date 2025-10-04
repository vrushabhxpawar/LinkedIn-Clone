import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../../lib/axios.js";
import { toast } from "react-hot-toast";
import { Loader, Eye, EyeClosed } from "lucide-react";

function SignUpForm() {
  const queryClient = useQueryClient();

  const [hidden, setHidden] = useState(true);
  const [fullname, setFullname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { mutate: signupMutation, isPending } = useMutation({
    mutationFn: async (data) => {
      const res = await axiosInstance.post("/auth/signup", data);
      return res.data;
    },
    onSuccess: () => {
      toast.success("User Registered successfully");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (err) => {
      toast.error(err.response.data.message || "Something went wrong");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    signupMutation({ fullname, email, username, password });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 relative">
      <input
        type="text"
        placeholder="Full Name"
        value={fullname}
        onChange={(e) => setFullname(e.target.value)}
        className="border-gray-400 border h-[35px] rounded-sm w-full p-2"
        required
      />
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="border-gray-400 border h-[35px] rounded-sm w-full p-2"
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border-gray-400 border h-[35px] rounded-sm w-full p-2"
        required
      />
      <input
        type={ hidden ? "password" : "text"}
        placeholder="Password (6+ characters)"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border-gray-400 border h-[35px] rounded-sm w-full p-2"
        required
      />
      {hidden ? (
        <EyeClosed
          size={20}
          className="absolute top-[158px] right-5 hover:cursor-pointer"
          onClick={() => setHidden(!hidden)}
        />
      ) : (
        <Eye
          size={20}
          className="absolute top-[158px] right-5 hover:cursor-pointer"
          onClick={() => setHidden(!hidden)}
        />
      )}
      <button
        type="submit"
        disabled={isPending}
        className="btn btn-primary w-full text-white"
      >
        {isPending ? (
          <Loader className="size-5 animate-spin" />
        ) : (
          "Agree & Join"
        )}
      </button>
    </form>
  );
}

export default SignUpForm;
