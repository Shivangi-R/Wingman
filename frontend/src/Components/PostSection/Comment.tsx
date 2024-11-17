import React, { useState } from "react";
import moment from "moment";
import { Comment, Modal, Space, Button, Tooltip, Avatar } from "antd";
import Notification from "../Utils/Notification";
import axios from "src/Utils/axiosConfig";
import { useAppDispatch, useAppSelector } from "src/Redux/hooks";
import { ReactComponent as DownvoteIcon } from "../../Assets/img/downvote.svg";
import { ReactComponent as UpvoteIcon } from "../../Assets/img/upvote.svg";
import { ReactComponent as UpvoteIconColored } from "../../Assets/img/upvote-colored.svg";
import { ReactComponent as DownvoteIconColored } from "../../Assets/img/downvote-colored.svg";
import { ReactComponent as AnonymousIconColored } from "../../Assets/img/avatar.svg";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import {
  setCommentUpdateReload,
  setCurrentComment,
  setEditComment,
} from "src/Redux/commentModal";

//Utility Stuff
const randomColor = [
  { backgroundColor: "#fde3cf", color: "#f56a00" },
  { backgroundColor: "#f4c2de", color: "rgb(237 48 211)" },
  { backgroundColor: "#c2dff4", color: "rgb(7 168 213)" },
  { backgroundColor: "#d6f4c2", color: "rgb(9 181 3)" },
  { backgroundColor: "#f1f0b3", color: "rgb(198 170 0)" },
  { backgroundColor: "#f6bdbd", color: "rgb(198 0 24)" },
];

const getTimeDifference = (timestamp) => {
  if (timestamp !== "") {
    const postTime = moment(moment.utc(timestamp).format("DD-MMM-YYYY HH:mm"));
    const currentTime = moment(moment.utc().format("DD-MMM-YYYY HH:mm"));
    const duration = moment.duration(currentTime.diff(postTime));

    var days = duration.asDays();
    var hours = duration.hours();
    var minutes = duration.minutes();

    return {
      days: Math.floor(days),
      hours: hours,
      minutes: minutes,
    };
  }
};

const CommentComponent = ({ comment, ratings, vote, postId }) => {
  const randIndex = Number(comment.id) % randomColor.length;
  const { editComment } = useAppSelector((state) => state.commentModal);
  const dispatch = useAppDispatch();

  
  const { token, isLoggedIn, username } = useAppSelector(
    (state) => state.authModal
  );

  const [ratingsCount, setRatingsCount] = useState(Number(comment.ratings));
  const [userVote, setUserVote] = useState(Number(vote));
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [edited, setEdited] = useState(comment.edited);

  const loginCheck = (message) => {
    if (!isLoggedIn) {
      Notification("warning", "Warning", `Please Login ${message}`);
      return false;
    }
    return true;
  };

  const handleEditComment = () => {
    if (!loginCheck("Invalid Operation")) {
      return;
    }
    dispatch(setEditComment(true));
    dispatch(
      setCurrentComment({
        editingCommentId: comment.id,
        editingComment: comment.comment,
        editingPostId: postId,
      })
    );
  };

  const updateRatings = async (newUserVote, id) => {
    const response = await axios.put(
      `/api/comments/ratings/${id}`,
      { userVote: newUserVote, postId: postId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  };

  const handleUpvote = () => {
    if (!loginCheck("to vote the comment")) {
      return;
    }
    let newUserVote = 0;
    setRatingsCount((prevState) => prevState - userVote);
    if (userVote !== 1) {
      setUserVote(1);
      newUserVote = 1;
    } else {
      setUserVote(0);
      newUserVote = 0;
    }
    setRatingsCount((prevState) => prevState + newUserVote);

    updateRatings(newUserVote, comment.id);
  };

  const handleDownvote = () => {
    if (!loginCheck("to vote the comment")) {
      return;
    }
    let newUserVote = 0;
    setRatingsCount((prevState) => prevState - userVote);
    if (userVote !== -1) {
      setUserVote(-1);
      newUserVote = -1;
    } else {
      setUserVote(0);
      newUserVote = 0;
    }
    setRatingsCount((prevState) => prevState + newUserVote);

    updateRatings(newUserVote, comment.id);
  };

  const handleDeleteComment = () => {
    if (!loginCheck("Invalid Operation")) {
      return;
    }
    setDeleteModalVisible(true);
  };

  const hideModal = () => {
    setDeleteModalVisible(false);
  };

  const renderAction = [
    <div style={{ display: "flex" }}>
      <div className="comment-ratings">
        {userVote === 1 ? (
          <>
            <UpvoteIconColored
              className="upvoteIcon"
              style={{ width: "17px", height: "17px" }}
              onClick={handleUpvote}
            />
          </>
        ) : (
          <>
            <UpvoteIcon
              className="upvoteIcon"
              style={{ width: "17px", height: "17px" }}
              onClick={handleUpvote}
            />
          </>
        )}

        {ratingsCount}
        {userVote === -1 ? (
          <>
            <DownvoteIconColored
              className="downvoteIcon"
              style={{ width: "17px", height: "17px" }}
              onClick={handleDownvote}
            />
          </>
        ) : (
          <>
            <DownvoteIcon
              className="downvoteIcon"
              style={{ width: "17px", height: "17px" }}
              onClick={handleDownvote}
            />
          </>
        )}
      </div>
      {comment["author"] !== null &&
      comment["author"] === username &&
      !comment["anonymous"] ? (
        <Tooltip placement="top" title="Edit comment">
          <EditOutlined
            onClick={handleEditComment}
            style={{ fontSize: "19px", cursor: "pointer" }}
          />
        </Tooltip>
      ) : (
        <></>
      )}
      {comment["author"] !== null &&
      comment["author"] === username &&
      !comment["anonymous"] ? (
        <Tooltip placement="top" title="Delete comment">
          <DeleteOutlined
            onClick={handleDeleteComment}
            style={{ fontSize: "19px", marginLeft: "20px", cursor: "pointer" }}
          />
        </Tooltip>
      ) : (
        <></>
      )}
    </div>,
  ];

  const renderTimestamp = (timestamp) => {
    const timeDifference = getTimeDifference(timestamp);
    return (
      <>
        {" "}
        <div style={{ display: "flex", gap: "5px" }}>
          {timeDifference.days !== null && timeDifference.days > 0 && (
            <>
              {timeDifference.days} day{timeDifference.days > 1 ? "s" : ""} ago
            </>
          )}
          {timeDifference.days !== null &&
            timeDifference.days <= 0 &&
            timeDifference.hours > 0 && (
              <>
                {timeDifference.hours} hour{timeDifference.hours > 1 ? "s" : ""}{" "}
                ago
              </>
            )}
          {timeDifference.days !== null &&
            timeDifference.days <= 0 &&
            timeDifference.hours <= 0 &&
            timeDifference.minutes > 0 && (
              <>
                {timeDifference.minutes} minute
                {timeDifference.minutes > 1 ? "s" : ""} ago
              </>
            )}
          {timeDifference.days !== null &&
            timeDifference.days <= 0 &&
            timeDifference.hours <= 0 &&
            timeDifference.minutes <= 0 && <>a few seconds ago</>}
          {edited && <div>(edited)</div>}
        </div>
      </>
    );
  };

  const deleteComment = async (commentId) => {
    hideModal();
    dispatch(setCommentUpdateReload(true));
    try {
      const response = await axios.delete(`/api/delete-comment/${commentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      Notification("success", "Successfull", "Comment deleted successfully");
    } catch (error) {
      console.log(error);
      Notification("error", "Error", "An error occurred");
    }
  };

  return (
    <>
      <Comment
        author={comment["author"] ? comment["author"] : "Anonymous"}
        actions={renderAction}
        avatar={
          comment["author"] ? (
            <Avatar
              style={{
                color: randomColor[randIndex].color,
                backgroundColor: randomColor[randIndex].backgroundColor,
                textTransform: "capitalize",
              }}
            >
              {comment["author"].charAt(0)}
            </Avatar>
          ) : (
            <AnonymousIconColored />
          )
        }
        content={comment["comment"]}
        datetime={renderTimestamp(comment["timestamp"])}
      />
      <Modal
        title={"Confirm"}
        visible={deleteModalVisible}
        onOk={() => deleteComment(comment.id)}
        onCancel={hideModal}
        okText="Confirm"
        cancelText="Cancel"
      >
        <p>Are you sure you want to delete this comment?</p>
      </Modal>
    </>
  );
};

export default CommentComponent;
