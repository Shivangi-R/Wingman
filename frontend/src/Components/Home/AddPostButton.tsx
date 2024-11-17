import React from "react";
import { Tooltip } from "antd";

const AddPostButton = () => {
  return (
    <>
      <Tooltip placement="top" title="Add Post" color="blue">
        <div className="add-post-btn">
          <span className="add-icon">+</span>
        </div>
      </Tooltip>
    </>
  );
};

export default AddPostButton;
