import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios.js";
import { toast } from "react-hot-toast";

export const useAuthUser = () => {
  const { data: authUser, isLoading, isError, error } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get("/auth/me");
        return res.data;
      } catch (err) {
        if (err.response) {
          // Unauthorized or no user
          return null;
        }
        // Network or unexpected error
        toast.error(err.message || "Something went wrong");
        return null;
      }
    },
    retry: false, // disable automatic retries in production
  });

  if (isError) {
    console.error("Auth User Query Error:", error);
  }

  return { authUser, isLoading };
};
