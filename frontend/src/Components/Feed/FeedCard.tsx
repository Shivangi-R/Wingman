import React, { useEffect, useState } from "react";
import { Divider, Tooltip, Modal, Typography } from "antd";
import { API_URL } from "src/Utils/constants";
import anonymousIcon from "src/Assets/img/anonymous.png";
import { ReactComponent as DownvoteIcon } from "../../Assets/img/downvote.svg";
import { ReactComponent as UpvoteIcon } from "../../Assets/img/upvote.svg";
import { ReactComponent as UpvoteIconColored } from "../../Assets/img/arrow-up.svg";
import { ReactComponent as DownvoteIconColored } from "../../Assets/img/arrow-down.svg";
import { ReactComponent as SaveIconColored } from "../../Assets/img/bookmark.svg";
import { ReactComponent as SaveIcon } from "../../Assets/img/save.svg";
import { CommentOutlined, ShareAltOutlined } from "@ant-design/icons";
import axios from "src/Utils/axiosConfig";
import { useAppSelector } from "src/Redux/hooks";
import Notification from "../Utils/Notification";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { CLIENT_URL } from "src/Utils/constants";

const { Paragraph } = Typography;

interface FeedCardInterface {
  id: string;
  title: string;
  description: string;
  author?: string | null;
  media?: string[] | null;
  ratings?: number;
  userRating?: number;
  comments?: number | null;
  tags?: string[] | null;
  saved?: boolean;
  timestamp?: string;
  edited?: boolean;
}

const FeedCard = ({
  id,
  title,
  description,
  author,
  media,
  ratings,
  userRating,
  comments,
  tags,
  saved,
  timestamp,
  edited,
}: FeedCardInterface) => {
  //STATE DEFINITIONS
  const [ratingsCount, setRatingsCount] = useState(Number(ratings));
  const [userVote, setUserVote] = useState(Number(userRating)); //1,-1,0
  const [isSavedPost, setIsSavedPost] = useState(saved);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [timeDifference, setTimeDifference] = useState({
    days: null,
    hours: null,
    minutes: null,
  });
  const { isLoggedIn, token } = useAppSelector((state) => state.authModal);
  const navigate = useNavigate();

  useEffect(() => {
    if (timestamp !== "") {
      const postTime = moment(
        moment.utc(timestamp).format("DD-MMM-YYYY HH:mm")
      );
      const currentTime = moment(moment.utc().format("DD-MMM-YYYY HH:mm"));
      const duration = moment.duration(currentTime.diff(postTime));

      var days = duration.asDays();
      var hours = duration.hours();
      var minutes = duration.minutes();

      setTimeDifference({
        days: Math.floor(days),
        hours: hours,
        minutes: minutes,
      });
    }
  }, [timestamp]);

  //API CALLS
  const updateRatings = async (newUserVote) => {
    const response = await axios.put(
      `/api/ratings/${id}`,
      { userVote: newUserVote },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  };

  const savePost = async (postId, save) => {
    const response = await axios.post(
      `/api/save/${id}`,
      { savePost: save },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  };

  //UTILITY FUNCTIONS
  const loginCheck = (message) => {
    if (!isLoggedIn) {
      Notification("warning", "Warning", `Please Login ${message}`);
      return false;
    }
    return true;
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleUpvote = () => {
    if (!loginCheck("to vote the post")) {
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

    updateRatings(newUserVote);
  };

  const handleDownvote = () => {
    if (!loginCheck("to the the post")) {
      return;
    }
    setRatingsCount((prevState) => prevState - userVote);
    let newUserVote = 0;
    if (userVote !== -1) {
      setUserVote(-1);
      newUserVote = -1;
    } else {
      setUserVote(0);
      newUserVote = 0;
    }
    setRatingsCount((prevState) => prevState + newUserVote);

    updateRatings(newUserVote);
  };

  const handleSavePost = () => {
    if (!loginCheck("to save the post")) {
      return;
    }
    try {
      savePost(id, !isSavedPost);
    } catch (error) {
      console.log(error);
    }

    setIsSavedPost((prevState) => !prevState);
  };

  const getPost = () => {
    navigate(`/post/${id}`);
  };

  return (
    <>
      <div className="feed-card-container">
        <div className="feed-header">
          <div className="feed-ratings">
            {userVote === 1 ? (
              <>
                <UpvoteIconColored
                  className="upvoteIcon"
                  style={{ width: "25px", height: "25px" }}
                  onClick={handleUpvote}
                />
              </>
            ) : (
              <>
                <UpvoteIcon
                  className="upvoteIcon"
                  style={{ width: "25px", height: "25px" }}
                  onClick={handleUpvote}
                />
              </>
            )}

            {ratingsCount}
            {userVote === -1 ? (
              <>
                <DownvoteIconColored
                  className="downvoteIcon"
                  style={{ width: "25px", height: "25px" }}
                  onClick={handleDownvote}
                />
              </>
            ) : (
              <>
                <DownvoteIcon
                  className="downvoteIcon"
                  style={{ width: "25px", height: "25px" }}
                  onClick={handleDownvote}
                />
              </>
            )}
          </div>
          <div>
            <div className="feed-author">
              {author !== null ? (
                <>
                  <div className="feed-author-avtaar">
                    <span>
                      {author !== null &&
                        author !== undefined &&
                        author.charAt(0)}
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <img
                    src={anonymousIcon}
                    alt="avtaar"
                    width="18px"
                    height="15px"
                  />
                </>
              )}
              {author !== null ? <>Posted by {author}</> : <>Anonymous</>}
              <div className="separator-dot"></div>
              <div className="post-timestamp">
                {timeDifference.days !== null && timeDifference.days > 0 && (
                  <>
                    {timeDifference.days} day
                    {timeDifference.days > 1 ? "s" : ""} ago
                  </>
                )}
                {timeDifference.days !== null &&
                  timeDifference.days <= 0 &&
                  timeDifference.hours > 0 && (
                    <>
                      {timeDifference.hours} hour
                      {timeDifference.hours > 1 ? "s" : ""} ago
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
              </div>
              {edited && <div> (edited)</div>}
            </div>
            <div className="feed-title" onClick={getPost}>
              {title}
            </div>
            {tags.length > 0 && tags[0] !== "" && (
              <div className="feed-tags" onClick={getPost}>
                {tags.length > 0 &&
                  tags
                    .filter((tag, _) => tag.trim() !== "")
                    .map((tag, index) => <span key={"" + index}>{tag}</span>)}
              </div>
            )}
          </div>
        </div>
        <div onClick={getPost}>
          {media.length > 0 ? (
            <div className="media">
              <img src={API_URL + media[0]} alt="media" />
            </div>
          ) : (
            <div className="feed-description">{description}</div>
          )}
        </div>
        <Divider style={{ margin: "10px 0" }} />
        <div className="feed-footer">
          <Tooltip placement="top" title="Comments">
            <div className="comments" onClick={getPost}>
              <CommentOutlined
                style={{
                  fontSize: "20px",
                  marginRight: "5px",
                }}
              />{" "}
              {comments} Comments
            </div>
          </Tooltip>
          <Tooltip placement="top" title="Save Post">
            <div className="save" onClick={handleSavePost}>
              {isSavedPost === true ? (
                <>
                  <SaveIconColored
                    style={{
                      width: "21px",
                      height: "21px",
                      marginRight: "5px",
                    }}
                  />
                  Saved
                </>
              ) : (
                <>
                  <SaveIcon
                    style={{
                      width: "21px",
                      height: "21px",
                      marginRight: "5px",
                    }}
                  />
                  Save
                </>
              )}
            </div>
          </Tooltip>
          <Tooltip placement="top" title="Share Post">
            <div className="share" onClick={showModal}>
              <ShareAltOutlined
                style={{
                  fontSize: "20px",
                  marginRight: "5px",
                }}
              />
              Share
            </div>
          </Tooltip>
        </div>
      </div>
      <Modal
        title="Share"
        visible={isModalVisible}
        footer={null}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <div className="share-input-container">
          <Paragraph copyable>{CLIENT_URL + `/post/${id}`}</Paragraph>
        </div>
      </Modal>
    </>
  );
};

export default FeedCard;
