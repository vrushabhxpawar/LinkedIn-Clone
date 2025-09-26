import React from "react";
import { Link } from "react-router-dom";
import { useAuthUser } from "../hooks/useAuthUser";

function UserCard({ user }) {
  const { authUser } = useAuthUser();
  const isConnection = authUser.user.connections.includes(user._id);
  return (
    <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center transition-all hover:shadow-md">
      <Link
        to={`/profile/${user.username}`}
        className="flex flex-col items-center"
      >
        <img
          src={user.profilePic || "/avatar.png"}
          alt={user.fullname}
          className="w-24 h-24 rounded-full object-cover mb-4"
        />
        <h3 className="font-semibold text-lg text-center">{user.fullname}</h3>
      </Link>
      <p className="text-gray-600 text-center">{user.headline}</p>
      <p className="text-sm text-gray-500 mt-2">
        {user.connections?.length} connections
      </p>
      <button className="mt-4 bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors w-full">
        {isConnection ? "Connected" : "Connect"}
      </button>
    </div>
  );
}

export default UserCard;
