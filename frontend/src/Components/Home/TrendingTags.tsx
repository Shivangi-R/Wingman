import React, { useEffect, useState } from "react";
import axios from "src/Utils/axiosConfig";
import { Divider } from "antd";

const TrendingTags = () => {
  const [tags, setTags] = useState([]);

  const getTags = async () => {
    const response = await axios.get("/api/tags", {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    const data = response.data;
    let tagsList = [];
    for (let i = 0; i < data.length; i++) {
      tagsList.push(data[i].word);
    }
    setTags((prevState) => [...tagsList]);
  };

  useEffect(() => {
    getTags();
  }, []);

  return (
    <>
      <div className="trending-container">
        <span className="heading">Trending Tags &#128293;</span>
        <Divider />
        <div className="tags-list">
          {tags.length > 0 &&
            tags.map((tag, _) => {
              return (
                <>
                  <div className="trending-tags">{tag}</div>
                </>
              );
            })}
        </div>
      </div>
    </>
  );
};

export default TrendingTags;
