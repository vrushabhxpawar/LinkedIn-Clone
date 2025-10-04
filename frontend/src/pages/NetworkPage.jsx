import React from "react";
import { useAuthUser } from "../hooks/useAuthUser.jsx";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios.js";
import Sidebar from "../components/Sidebar.jsx";
import { UserPlus } from "lucide-react";
import FriendRequest from "../components/FriendRequest.jsx"
import UserCard from "../components/UserCard.jsx"

function NetworkPage() {
  const { authUser } = useAuthUser();

  const { data: connections } = useQuery({
    queryKey: ["connections"],
    queryFn: async () => {
      const res = await axiosInstance.get("/connection/");
      return res.data;
    },
  });

  const { data: connectionReqs } = useQuery({
    queryKey: ["connectionReqs"],
    queryFn: async () => {
      const res = await axiosInstance.get("/connection/requests");
      return res.data;
    },
  });   

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="col-span-1 lg:col-span-1">
        <Sidebar user={authUser?.user} />
      </div>
      <div className="col-span-1 lg:col-span-3">
        <div className="bg-stone-50 rounded-lg shadow p-6 mb-6">
          <h1 className="text-2xl font-bold mb-6">My Network</h1>

          {connectionReqs?.length > 0 ? (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-2">Connection Request</h2>
              <div className="space-y-4">
                {connectionReqs.map((request) => (
                  <FriendRequest key={request._id} request={request} />
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-6 text-center mb-6">
              <UserPlus size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                No Connection Requests
              </h3>
              <p className="text-gray-600">
                You don&apos;t have any pending connection requests at the
                moment.
              </p>
              <p className="text-gray-600 mt-2">
                Explore suggested connections below to expand your network!
              </p>
            </div>
          )}
          {connections?.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">My Connections</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {connections.map((connection) => (
                  <UserCard
                    key={connection._id}
                    user={connection}
                    isConnection={true}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default NetworkPage;
