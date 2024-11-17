import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "src/Utils/axiosConfig";
import { useAppSelector, useAppDispatch } from "src/Redux/hooks";
import {
  Tooltip,
  Divider,
  Spin,
  Dropdown,
  Menu,
  Modal,
  Typography,
  Carousel,
} from "antd";
import { API_URL } from "src/Utils/constants";
import Notification from "../Utils/Notification";
import CommentEditor from "./CommentEditor";
import CommentList from "./CommentList";
import anonymousIcon from "src/Assets/img/anonymous.png";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { setCommentUpdateReload } from "src/Redux/commentModal";
import { setCurrentPost, setEditingPost } from "src/Redux/postModal";
import { ReactComponent as DownvoteIcon } from "../../Assets/img/downvote.svg";
import { ReactComponent as UpvoteIcon } from "../../Assets/img/upvote.svg";
import { ReactComponent as UpvoteIconColored } from "../../Assets/img/arrow-up.svg";
import { ReactComponent as DownvoteIconColored } from "../../Assets/img/arrow-down.svg";
import { ReactComponent as SaveIconColored } from "../../Assets/img/bookmark.svg";
import { ReactComponent as SaveIcon } from "../../Assets/img/save.svg";
import { Link } from "react-router-dom";
import AddPostButton from "../Home/AddPostButton";
import {
  CommentOutlined,
  ShareAltOutlined,
  EllipsisOutlined,
  LoadingOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { CLIENT_URL } from "src/Utils/constants";


const { Paragraph } = Typography;

const LoadingIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />;

const PostSection = () => {
  //STATE DEFINITIONS
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, isLoggedIn, username } = useAppSelector(
    (state) => state.authModal
  );
  const [isShareModalVisible, setIsShareModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [userVote, setUserVote] = useState(0);
  const [commentsData, setCommentsData] = useState([]);
  const [commentsLiked, setCommentsLiked] = useState([]);
  const [timestamp, setTimestamp] = useState("");
  const [timeDifference, setTimeDifference] = useState({
    days: null,
    hours: null,
    minutes: null,
  });
  const { editComment, commentUpdateReload } = useAppSelector(
    (state) => state.commentModal
  );
  const [ratingsCount, setRatingsCount] = useState(0);
  const [post, setPost] = useState({
    id: null,
    title: null,
    description: null,
    author: null,
    media: null,
    ratings: 0,
    userRating: 0,
    comments: null,
    tags: null,
    anonymous: null,
    edited: false,
    anonymousPostByCurrentUser: false,
  });

  const [isSavedPost, setIsSavedPost] = useState(false);
  const [anonymousPostByCurrentUser, setAnonymousPostByCurrentUser] =
    useState(false);

  const scrollRef = useRef(null);
  const dispatch = useAppDispatch();

  //API CALLS
  const getPostById = async () => {
    try {
      const response = await axios.get(`/api/post/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = response.data;

      setPost({ ...data[0]["post"][0] });
      if (isLoggedIn) {
        setUserVote(Number(data[1]["userRating"]));
        setIsSavedPost(data[2]["postSaved"]);
        setCommentsLiked(data[4]["comments"].pop()["commentsLiked"]);
        setCommentsData(data[4]["comments"]);
        setAnonymousPostByCurrentUser(data[3]["anonymousPostsByUser"]);
        setTimestamp(data[0]["post"][0]["timestamp"]);
      } else {
        setCommentsData(data[1]["comments"]);
        setTimestamp(data[0]["post"][0]["timestamp"]);
      }
    } catch (error) {
      navigate("/error");
      setLoading(false);
      return;
    }
    setLoading(false);
  };

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

  const deletePost = async (postId) => {
    hideModal();
    navigate(`/`);
    try {
      const response = await axios.delete(`/api/delete-post/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      Notification("success", "Successfull", "Post deleted successfully");
    } catch (error) {
      console.log(error);
      Notification("error", "Error", "An error occurred");
    }
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

  //USE-EFFECTS
  useEffect(() => {
    if (editComment) {
      scrollRef.current.scrollIntoView();
    }
  }, [editComment]);

  useEffect(() => {
    if (commentUpdateReload) {
      setLoading(true);
      getPostById();
      setTimeout(() => {
        setLoading(false);
        dispatch(setCommentUpdateReload(false));
      }, 1000);
    }
  }, [commentUpdateReload]);

  useEffect(() => {
    getPostById();
  }, [isLoggedIn]);

  useEffect(() => {
    setRatingsCount(Number(post.ratings));
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
  }, [post, timestamp]);

  //UTILITY FUNCTIONS

  const getUser = (username:string) => {
    navigate(`/profile/${username}`);
  };

  const hideModal = () => {
    setModalVisible(false);
  };

  const showShareModal = () => {
    setIsShareModalVisible(true);
  };

  const handleShareOk = () => {
    setIsShareModalVisible(false);
  };

  const handleShareCancel = () => {
    setIsShareModalVisible(false);
  };

  const loginCheck = (message) => {
    if (!isLoggedIn) {
      Notification("warning", "Warning", `Please Login ${message}`);
      return false;
    }
    return true;
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
    if (!loginCheck("to vote the post")) {
      return;
    }
    setRatingsCount((prevState) => prevState - userVote);
    let newUserVote = 0;
    if (userVote !== -1) {
      setUserVote(-1);
      newUserVote = -1;
    } else {
      setUserVote(0);
      newUserVote = 1;
    }
    setRatingsCount((prevState) => prevState + newUserVote);

    updateRatings(newUserVote);
  };

  const handleEditPost = () => {
    dispatch(setEditingPost(true));

    const values = {
      postId: Number(post.id),
      title: post.title,
      description: post.description,
      anonymous: post.anonymous,
      tags: post.tags,
    };
    setCurrentPost(dispatch(setCurrentPost(values)));
    navigate("/post");
  };

  const menu = (
    <Menu
      items={[
        {
          key: "1",
          label: (
            <div onClick={handleEditPost}>
              <EditOutlined style={{ marginRight: "10px" }} />
              Edit Post
            </div>
          ),
        },
        {
          key: "2",
          label: (
            <div onClick={() => setModalVisible(true)}>
              <DeleteOutlined style={{ marginRight: "10px" }} />
              Delete Post
            </div>
          ),
        },
      ]}
    />
  );

  return (
    <>
      {loading && <Spin className="loader" indicator={LoadingIcon} />}
      {!loading && (
        <div className="post-container-parent">
          <div className="post-container">
            <div className="post-header">
              <div className="post-ratings">
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
              <div style={{ width: "100%" }}>
                <div className="post-author">
                  <div
                    style={{
                      display: "flex",
                      gap: "3px",
                      alignItems: "center",
                    }}
                  >
                    {post.author !== null ? (
                      <>
                        <div className="post-author-avtaar">
                          <span>{post.author.charAt(0)}</span>
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
                    {post.author !== null ? (
                      <>
                        Posted by{" "}
                        <span className="author-name" onClick={()=>getUser(post.author)}>{post.author}</span>
                      </>
                    ) : (
                      <>Anonymous</>
                    )}
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
                        timeDifference.minutes <= 0 && <>a few seconds ago</>}
                    </div>
                    {post.edited && <div> (edited)</div>}
                  </div>
                  {isLoggedIn &&
                    ((username != null && post.author === username) ||
                      anonymousPostByCurrentUser) && (
                      <div className="header-menu">
                        <Dropdown overlay={menu} placement="bottom">
                          <EllipsisOutlined
                            style={{ fontSize: "20px", cursor: "pointer" }}
                          />
                        </Dropdown>
                      </div>
                    )}
                </div>
                <div className="post-title">{post.title}</div>
                {post.tags && post.tags.length > 0 && post.tags[0] !== "" && (
                  <div className="post-tags">
                    {post.tags &&
                      post.tags.length > 0 &&
                      post.tags
                        .filter((tag, _) => tag.trim() !== "")
                        .map((tag, index) => (
                          <span key={"" + index}>{tag}</span>
                        ))}
                  </div>
                )}
              </div>
            </div>

            <div className="post-description">{post.description}</div>
            <div className="post-media">
              {post.media &&
                post.media.map((image, _) => {
                  return (
                    <div className="post-image-container">
                      <img src={API_URL + image} alt="media" />
                    </div>
                  );
                })}
            </div>
            <div ref={scrollRef}></div>
            <Divider style={{ margin: "10px 0" }} />
            <div className="post-footer">
              <div className="comments">
                <CommentOutlined
                  style={{
                    fontSize: "20px",
                    marginRight: "5px",
                  }}
                />{" "}
                {commentsData.length} Comments
              </div>
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
                <div className="share" onClick={showShareModal}>
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
          <div className="post-comments-container">
            <CommentEditor postId={id} addComment={setCommentsData} />
            {commentsData.length > 0 && (
              <CommentList
                commentsData={commentsData}
                commentsLiked={commentsLiked}
                postId={id}
              />
            )}
          </div>
        </div>
      )}
      <Link to="/post">
        <AddPostButton />
      </Link>
      <Modal
        title={"Confirm"}
        visible={modalVisible}
        onOk={() => deletePost(id)}
        onCancel={hideModal}
        okText="Confirm"
        cancelText="Cancel"
      >
        <div style={{ fontFamily: "Inter", fontSize: "17px" }}>
          Are you sure you want to delete this post?
        </div>
      </Modal>
      <Modal
        title="Share"
        visible={isShareModalVisible}
        footer={null}
        onOk={handleShareOk}
        onCancel={handleShareCancel}
      >
        <div className="share-input-container">
          <Paragraph copyable>{CLIENT_URL + `/post/${id}`}</Paragraph>
        </div>
      </Modal>
    </>
  );
};

export default PostSection;
