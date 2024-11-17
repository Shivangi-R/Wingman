import React, { useEffect, useState } from "react";
import { List } from "antd";
import CommentComponent from "./Comment";

const CommentList = ({ commentsData, commentsLiked, postId }) => {
  commentsData.sort((a, b) => (Number(a.id) > Number(b.id) ? 1 : -1));
  return (
    <div className="comment-list-container">
      <List
        className="comment-list"
        header={`${commentsData.length} Comment${
          commentsData.length > 1 ? "s" : ""
        }`}
        itemLayout="horizontal"
        dataSource={commentsData}
        renderItem={(item) => {
          let userVote = 0;
          for (let i = 0; i < commentsLiked.length; i++) {
            if (commentsLiked[i].commentid === item["id"]) {
              userVote = Number(commentsLiked[i].rating);
              break;
            }
          }

          return (
            <li>
              <CommentComponent
                comment={item}
                vote={userVote}
                ratings={item["ratings"]}
                postId={postId}
              />
            </li>
          );
        }}
      />
    </div>
  );
};

export default CommentList;
