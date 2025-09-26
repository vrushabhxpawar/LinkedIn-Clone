import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { useAuthUser } from "./hooks/useAuthUser.jsx";

import Layout from "./components/layout/Layout.jsx";
import Signup from "./pages/auth/Signup.jsx";
import Login from "./pages/auth/Login.jsx";
import HomePage from "./pages/HomePage.jsx";
import NotificationPage from "./pages/NotificationPage.jsx";
import NetworkPage from "./pages/NetworkPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import PostPage from "./pages/PostPage.jsx";

function App() {
  const { authUser, isLoading } = useAuthUser();

  if (isLoading) return null;
  return (
    <Layout>
      <Routes>
        <Route
          path="/"
          element={authUser ? <HomePage /> : <Navigate to={"/signup"} />}
        />

        <Route
          path="/signup"
          element={!authUser ? <Signup /> : <Navigate to={"/"} />}
        />

        <Route
          path="/login"
          element={!authUser ? <Login /> : <Navigate to={"/"} />}
        />

        <Route
          path="/notifications"
          element={
            authUser ? <NotificationPage /> : <Navigate to={"/signup"} />
          }
        />

        <Route
          path="/network"
          element={authUser ? <NetworkPage /> : <Navigate to={"/signup"} />}
        />

        <Route
          path="/profile/:username"
          element={authUser ? <ProfilePage /> : <Navigate to={"/signup"} />}
        />

        <Route
          path="/post/:postId"
          element={authUser ? <PostPage /> : <Navigate to={"/signup"} />}
        />
      </Routes>
      <Toaster />
    </Layout>
  );
}

export default App;
