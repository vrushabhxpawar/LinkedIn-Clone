import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { Loader } from "lucide-react";
function FriendRequest({ request }) {
  const queryClient = useQueryClient();

  const { mutate: acceptConnectionRequest, isPending: accepting } = useMutation(
    {
      mutationFn: async (requestId) => {
        const res = await axiosInstance.put(`/connection/accept/${requestId}`);
        return res.data;
      },
      onSuccess: () => {
        toast.success("Connection request accepted");
        queryClient.invalidateQueries({ queryKey: ["connectionReqs"] });
        queryClient.invalidateQueries({ queryKey: ["connections"] });
      },
      onError: () => {
        toast.error("Oops!! something went wrong");
      },
    }
  );

  const { mutate: rejectConnectionRequest, isPending: rejecting } = useMutation(
    {
      mutationFn: async (requestId) => {
        const res = await axiosInstance.put(`/connection/reject/${requestId}`);
        return res.data;
      },
      onSuccess: () => {
        toast.success("Connection request rejected");
        queryClient.invalidateQueries({ queryKey: ["connectionReqs"] });
        queryClient.invalidateQueries({ queryKey: ["connections"] });
      },
      onError: () => {
        toast.error("Oops!! something went wrong");
      },
    }
  );

  return (
    <div className="bg-white rounded-lg shadow p-4 flex items-center justify-between transition-all hover:shadow-md">
      <div className="flex items-center gap-4">
        <Link to={`/profile/${request.sender.username}`}>
          <img
            src={request.sender.profilePic || "/avatar.png"}
            alt={request.sender.fullname}
            className="w-16 h-16 rounded-full object-cover"
          />
        </Link>

        <div>
          <Link
            to={`/profile/${request.sender.username}`}
            className="font-semibold text-lg"
          >
            {request.sender.fullname}
          </Link>
          <p className="text-gray-600">{request.sender.headline}</p>
        </div>
      </div>

      <div className="space-x-2">
        <button
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors"
          onClick={() => acceptConnectionRequest(request._id)}
        >
          {accepting ? <Loader size={18} /> : "Accept"}
        </button>
        <button
          className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
          onClick={() => rejectConnectionRequest(request._id)}
        >
          {rejecting ? <Loader size={18} /> : "Reject"}
        </button>
      </div>
    </div>
  );
}

export default FriendRequest;
