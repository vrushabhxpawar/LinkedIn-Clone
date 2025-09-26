import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import { Check, Clock, Loader, UserCheck, UserPlus, X } from "lucide-react";

function RecommendedUser({ user }) {
  const queryClient = useQueryClient();

  const handleConnect = () => {
    if (connectionStatus?.status === "not-connected") {
      sendConnectionReqMutation(user._id);
    }
  };

  const { data: connectionStatus, isLoading } = useQuery({
    queryKey: ["connectionStatus", user._id],
    queryFn: async () => {
      const res = await axiosInstance.get(`/connection/status/${user._id}`);
      return res.data;
    },
  });

  const { mutate: sendConnectionReqMutation, isPending: sendingRequest } =
    useMutation({
      mutationFn: async (userId) => {
        const res = await axiosInstance.post(`/connection/request/${userId}`);
        return res.data;
      },
      onSuccess: () => {
        toast.success("Connection request sent");
        queryClient.invalidateQueries({
          queryKey: ["connectionStatus", user._id],
        });
      },
      onError: (err) => {
        toast.error(err?.response?.data?.message || "An error occured");
      },
    });

  const { mutate: acceptConnectionReqMutation } = useMutation({
    mutationFn: async (requestId) => {
      const res = await axiosInstance.put(`/connection/accept/${requestId}`);
      return res.data;
    },
    onSuccess: () => {
      toast.success(`Your are connected to ${user.fullname}`);
      queryClient.invalidateQueries({
        queryKey: ["connectionStatus", user._id],
      });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "An error occured");
    },
  });

  const { mutate: rejectConnectionReqMutation } = useMutation({
    mutationFn: async (requestId) => {
      const res = await axiosInstance.put(`/connection/reject/${requestId}`);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Connection request rejected");
      queryClient.invalidateQueries({
        queryKey: ["connectionStatus", user._id],
      });
    },
  });

  const renderButton = () => {
    if (isLoading) {
      return (
        <button
          className="px-3 py-1 rounded-full text-sm bg-gray-200 text-gray-500"
          disabled
        >
          Loading...
        </button>
      );
    }
    switch (connectionStatus?.status) {
      case "pending":
        return (
          <button
            className="px-3 py-1 rounded-full text-sm bg-yellow-500 text-white flex items-center"
            disabled
          >
            <Clock size={16} className="mr-1" />
            Pending
          </button>
        );
      case "received":
        return (
          <div className="flex gap-2 justify-center">
            <button
              onClick={() =>
                acceptConnectionReqMutation(connectionStatus.requestId)
              }
              className={`rounded-full p-1 flex items-center justify-center bg-green-500 hover:bg-green-600 text-white`}
            >
              <Check size={16} />
            </button>
            <button
              onClick={() =>
                rejectConnectionReqMutation(connectionStatus.requestId)
              }
              className={`rounded-full p-1 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white`}
            >
              <X size={16} />
            </button>
          </div>
        );
      case "connected":
        return (
          <button
            className="px-3 py-1 rounded-full text-sm bg-green-500 text-white flex items-center"
            disabled
          >
            <UserCheck size={16} className="mr-1" />
            Connected
          </button>
        );
      default:
        return (
          <button
            className="px-3 py-1 rounded-full text-sm border border-primary text-primary hover:bg-primary hover:text-white transition-colors duration-200 flex items-center"
            onClick={handleConnect}
            disabled={sendingRequest}
          >
            {sendingRequest ? (
              <Loader size={16} className="mr-1" />
            ) : (
              <div className="flex justify-center items-center">
                <UserPlus size={16} className="mr-1" />
                Connect
              </div>
            )}
          </button>
        );
    }
  };

  return (
    <div className="flex items-center justify-between mb-4">
      <Link
        to={`/profile/${user.username}`}
        className="flex items-center flex-grow"
      >
        <img
          src={user.profilePic || "/avatar.png"}
          alt={user.fullname}
          className="w-12 h-12 rounded-full mr-3"
        />
        <div>
          <h3 className="font-semibold text-sm">{user.fullname}</h3>
          <p className="text-xs text-info">{user.headline}</p>
        </div>
      </Link>
      {renderButton()}
    </div>
  );
}

export default RecommendedUser;
