import React, { useEffect } from "react";
import { useAuthUser } from "../hooks/useAuthUser.jsx";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { axiosInstance } from "../lib/axios.js";

import ProfileHeader from "../components/ProfileHeader.jsx";
import AboutSection from "../components/AboutSection.jsx";
import ExperienceSection from "../components/ExperienceSection.jsx";
import SkillsSection from "../components/SkillsSection.jsx";
import toast from "react-hot-toast";
import EducationSection from "../components/EducationSection.jsx";

function ProfilePage() {
  const { username } = useParams();
  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();

  const { data: userProfile, isLoading: isLoadingUserProfile } = useQuery({
    queryKey: ["userProfile", username],
    queryFn: async () => {
      const res = await axiosInstance.get(`/users/${username}`);
      return res.data;
    },
  });

  const { mutate: updateProfile, isPending } = useMutation({
    mutationFn: async (updatedData) => {
      const res = await axiosInstance.put("/users/updateProfile", updatedData);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Profile updated successfully");
      queryClient.invalidateQueries(["userProfile", username]);
    },
  });

  if (isLoadingUserProfile || isPending) return null;

  const isOwnProfile = authUser?.user?.username === userProfile?.user?.username;
  const userData = isOwnProfile ? authUser.user : userProfile.user;
  
  const handleSave = (updatedData) => {
    updateProfile(updatedData);
  };

  return (
    <div>
      <div className="max-w-4xl mx-auto p-4">
        <ProfileHeader
          userData={userData}
          isOwnProfile={isOwnProfile}
          onSave={handleSave}
        />
        <AboutSection
          userData={userData}
          isOwnProfile={isOwnProfile}
          onSave={handleSave}
        />
        <ExperienceSection
          userData={userData}
          isOwnProfile={isOwnProfile}
          onSave={handleSave}
        />
        <EducationSection
          userData={userData}
          isOwnProfile={isOwnProfile}
          onSave={handleSave}
        />
        <SkillsSection
          userData={userData}
          isOwnProfile={isOwnProfile}
          onSave={handleSave}
        />
      </div>
    </div>
  );
}

export default ProfilePage;
