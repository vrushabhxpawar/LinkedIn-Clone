import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios.js";
import { toast } from "react-hot-toast";

export const useAuthUser = () => {
  const { data: authUser, isLoading } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get("/auth/me");
        return res.data;
      } catch (error) {
        if (error.response) {
          return null;
        }
        toast.error(error.message || "Something went wrong");
        return null;
      }
    },
  });

  return { authUser, isLoading };
};
