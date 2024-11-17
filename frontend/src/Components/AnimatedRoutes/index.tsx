import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Home from "../Home";
import CreatePost from "../Form/CreatePostForm";
import PostSection from "../PostSection";
import ErrorPage from "../ErrorPage";
import { AnimatePresence } from "framer-motion";
import VerifiedPage from "../VerifiedPage";
import Profile from "../Profile";


const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />{" "}
        <Route path="/post" element={<CreatePost />} />
        <Route path="/post/:id" element={<PostSection />} />
        <Route path="/profile/:profileUsername" element={<Profile />} />
        <Route path="/verfied" element={<VerifiedPage />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </AnimatePresence>
  );
};

export default AnimatedRoutes;
