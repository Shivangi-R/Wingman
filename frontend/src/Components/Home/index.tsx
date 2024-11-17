import React from "react";
import TrendingTags from "./TrendingTags";
import FilterComponent from "../Filter";
import FeedContainer from "../Feed";
import AddPostButton from "./AddPostButton";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";


const Home = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.2 } }}
    >
      <FilterComponent/>
      <TrendingTags />
      <FeedContainer />
      <Link to="/post">
        <AddPostButton />
      </Link>
    </motion.div>
  );
};

export default Home;
