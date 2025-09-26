import React, { useState } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useAuthUser } from "../hooks/useAuthUser.jsx";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import {
  Camera,
  Clock,
  Loader,
  MapPin,
  UserCheck,
  UserPlus,
  X,
} from "lucide-react";

function ProfileHeader({ userData, onSave, isOwnProfile }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});
  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();

  const { data: connectionReqs } = useQuery({
    queryKey: ["connectionReqs"],
    queryFn: async () => {
      const res = await axiosInstance.get("/connection/requests");
      return res.data;
    },
  });

  const { data: connectionStatus, refetch: refetchConnectionStatus } = useQuery(
    {
      queryKey: ["connectionStatus", userData._id],
      queryFn: async () => {
        const res = await axiosInstance.get(
          `/connection/status/${userData._id}`
        );
        return res.data;
      },
      enabled: !isOwnProfile,
    }
  );

  const isConnected = userData.connections.some(
    (connection) => connection === authUser.user._id
  );

  const { mutate: sendConnectionReqMutation, isPending: sendingRequest } =
    useMutation({
      mutationFn: async (userId) => {
        const res = await axiosInstance.post(`/connection/request/${userId}`);
        return res.data;
      },
      onSuccess: () => {
        toast.success("Connection request sent");
        refetchConnectionStatus();
        queryClient.invalidateQueries({
          queryKey: ["connectionReqs"],
        });
      },
      onError: (err) => {
        toast.error(err?.response?.data?.message || "An error occured");
      },
    });

  const {
    mutate: acceptConnectionReqMutation,
    isPending: acceptingConnection,
  } = useMutation({
    mutationFn: async (requestId) => {
      const res = await axiosInstance.put(`/connection/accept/${requestId}`);
      return res.data;
    },
    onSuccess: () => {
      toast.success(`Your are connected to ${userData.fullname}`);
      refetchConnectionStatus();
      queryClient.invalidateQueries({
        queryKey: ["connectionReqs"],
      });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "An error occured");
    },
  });

  const {
    mutate: rejectConnectionReqMutation,
    isPending: rejectingConnection,
  } = useMutation({
    mutationFn: async (requestId) => {
      const res = await axiosInstance.put(`/connection/reject/${requestId}`);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Connection request rejected");
      refetchConnectionStatus();
      queryClient.invalidateQueries({
        queryKey: ["connectionReqs"],
      });
    },
  });

  const { mutate: removeConnectionMutation, isPending: removingConnection } =
    useMutation({
      mutationFn: async (userId) => {
        const res = await axiosInstance.put(`/connection/${userId}`);
        return res.data;
      },
      onSuccess: () => {
        refetchConnectionStatus();
        queryClient.invalidateQueries({
          queryKey: ["connectionReqs"],
        });
        queryClient.invalidateQueries({
          queryKey : ["connectionStatus"]
        })
      },
    });

  const getConnectionStatus = () => {
    if (isConnected) return "connected";
    return connectionStatus?.status;
  };

  const renderConnectionButton = () => {
    const baseClass =
      "text-white py-2 px-4 rounded-full transition duration-300 flex items-center justify-center";

    switch (getConnectionStatus()) {
      case "connected":
        return (
          <div className="flex gap-2 justify-center">
            <div className={`${baseClass} bg-green-500 hover:bg-green-600`}>
              <UserCheck size={20} className="mr-2" />
              Connected
            </div>
            <button
              className={`${baseClass} bg-red-500 hover:bg-red-600`}
              onClick={() => removeConnectionMutation(userData._id)}
            >
              <X size={20} className="mr-2" />
              {removingConnection ? (
                <Loader className="animate-spin" size={20} />
              ) : (
                "Remove"
              )}
            </button>
          </div>
        );

      case "pending":
        return (
          <button className={`${baseClass} bg-yellow-500 hover:bg-yellow-600`}>
            <Clock size={20} className="mr-2" />
            Pending
          </button>
        );

      case "received":
        return (
          <div className="flex gap-2 justify-center">
            <button
              onClick={() =>
                acceptConnectionReqMutation(connectionStatus?.requestId)
              }
              className={`${baseClass} bg-green-500 hover:bg-green-600`}
            >
              {acceptingConnection ? <Loader /> : "Accept"}
            </button>
            <button
              onClick={() =>
                rejectConnectionReqMutation(connectionStatus?.requestId)
              }
              className={`${baseClass} bg-red-500 hover:bg-red-600`}
            >
              {rejectingConnection ? (
                <Loader className="animate-spin" size={20} />
              ) : (
                "Reject"
              )}
            </button>
          </div>
        );
      default:
        return (
          <button
            onClick={() => sendConnectionReqMutation(userData._id)}
            className="bg-primary hover:bg-primary-dark text-white py-2 px-4 rounded-full transition duration-300 flex items-center justify-center"
          >
            <UserPlus size={20} className="mr-2" />
            {sendingRequest ? (
              <Loader className="animate-spin" size={20} />
            ) : (
              "Connect"
            )}
          </button>
        );
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedData((prev) => ({ ...prev, [e.target.name]: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    onSave(editedData);
    setIsEditing(false);
  };

  return (
    <div className="bg-white shadow rounded-lg mb-6">
      <div
        className="relative h-48 rounded-t-lg bg-cover bg-center"
        style={{
          backgroundImage: `url('${
            editedData.bannerImg || userData.bannerImg || "/banner.png"
          }')`,
        }}
      >
        {isEditing && (
          <label className="absolute top-2 right-2 bg-white p-2 rounded-full shadow cursor-pointer">
            <Camera size={20} />
            <input
              type="file"
              className="hidden"
              name="bannerImg"
              onChange={handleImageChange}
              accept="image/*"
            />
          </label>
        )}
      </div>

      <div className="p-4">
        <div className="relative -mt-20 mb-4">
          <img
            className="w-32 h-32 rounded-full mx-auto object-cover"
            src={editedData.profilePic || userData.profilePic || "/avatar.png"}
            alt={userData.fullname}
          />

          {isEditing && (
            <label className="absolute bottom-0 right-1/2 transform translate-x-16 bg-white p-2 rounded-full shadow cursor-pointer">
              <Camera size={20} />
              <input
                type="file"
                className="hidden"
                name="profilePic"
                onChange={handleImageChange}
                accept="image/*"
              />
            </label>
          )}
        </div>

        <div className="text-center mb-4">
          {isEditing ? (
            <input
              type="text"
              value={editedData.fullname ?? userData.fullname}
              onChange={(e) =>
                setEditedData({ ...editedData, fullname: e.target.value })
              }
              className="text-2xl font-bold mb-2 text-center w-full"
            />
          ) : (
            <h1 className="text-2xl font-bold mb-2">{userData.fullname}</h1>
          )}

          {isEditing ? (
            <input
              type="text"
              value={editedData.headline ?? userData.headline}
              onChange={(e) =>
                setEditedData({ ...editedData, headline: e.target.value })
              }
              className="text-gray-600 text-center w-full"
            />
          ) : (
            <p className="text-gray-600">{userData.headline}</p>
          )}

          <div className="flex justify-center items-center mt-2">
            <MapPin size={16} className="text-gray-500 mr-1" />
            {isEditing ? (
              <input
                type="text"
                value={editedData.location ?? userData.location}
                onChange={(e) =>
                  setEditedData({ ...editedData, location: e.target.value })
                }
                className="text-gray-600 text-center"
              />
            ) : (
              <span className="text-gray-600">{userData.location}</span>
            )}
          </div>
        </div>

        {isOwnProfile ? (
          isEditing ? (
            <button
              className="w-full bg-primary text-white py-2 px-4 rounded-full hover:bg-primary-dark
							 transition duration-300"
              onClick={handleSave}
            >
              Save Profile
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="w-full bg-primary text-white py-2 px-4 rounded-full hover:bg-primary-dark
							 transition duration-300"
            >
              Edit Profile
            </button>
          )
        ) : (
          <div className="flex justify-center">{renderConnectionButton()}</div>
        )}
      </div>
    </div>
  );
}

export default ProfileHeader;
