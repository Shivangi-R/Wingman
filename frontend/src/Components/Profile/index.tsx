import React, { useEffect, useState } from "react";
import { Divider, Tabs, Spin } from "antd";
import { useParams } from "react-router-dom";
import { useAppSelector } from "src/Redux/hooks";
import axios from "src/Utils/axiosConfig";
import Notification from "../Utils/Notification";
import PostCard from "./PostCard";
import CommentCard from "./CommentCard";
import { LoadingOutlined } from "@ant-design/icons";
const { TabPane } = Tabs;
const LoadingIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />;

const Profile = () => {
  const { profileUsername } = useParams();
  const { username, email, token, isLoggedIn } = useAppSelector(
    (state) => state.authModal
  );

  const [loading, setLoading] = useState(false);
  const [postList, setPostList] = useState([]);
  const [commentList, setCommentList] = useState([]);
  const [savedPostList, setSavedPostList] = useState([]);

  const getProfile = async () => {
    try {
      const response = await axios.get(`/api/profile/${profileUsername}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = response.data;

      if (profileUsername === username && isLoggedIn) {
        let posts = [...data[0]["posts"]];
        const comments = [...data[1]["comments"]];
        const savedPost = [...data[2]["postsSaved"]];
        const anonymousPost = [...data[3]["anonymousPostsByUser"]];
        posts = [...posts, ...anonymousPost];

        posts.sort((a, b) => (Number(a.id) < Number(b.id) ? 1 : -1));
        setPostList((prevState) => posts);
        setCommentList((prevState) => comments);
        setSavedPostList((prevState) => savedPost);
        setLoading(false);
      } else {
        let posts = [...data[0]["posts"]];
        const comments = [...data[1]["comments"]];
        posts.sort((a, b) => (Number(a.id) < Number(b.id) ? 1 : -1));

        setPostList((prevState) => posts);
        setCommentList((prevState) => comments);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      Notification("error", "Error", "An error occurred");
    }
  };

  useEffect(() => {
    setLoading(true);
    getProfile();
  }, []);

  return (
    <>
      <div className="profile-container">
        <div className="profile-info">
          <div className="profile-avatar">
            <span>{profileUsername.charAt(0)}</span>
          </div>
          <div className="profile-data">
            <span>
              Username:{" "}
              <span
                style={{
                  background: "#e0dcdc",
                  padding: "2px 4px",
                }}
              >
                {profileUsername}
              </span>
            </span>
            {username === profileUsername && (
              <span>
                Email:{" "}
                <span
                  style={{
                    background: "#e0dcdc",
                    padding: "2px 4px",
                  }}
                >
                  {email}
                </span>
              </span>
            )}
          </div>
        </div>
        <Divider style={{ borderTop: "2.5px solid rgba(0, 0, 0, 0.06)" }} />
        {loading && <Spin className="loader" indicator={LoadingIcon} />}
        {!loading && (
          <Tabs defaultActiveKey="1" className="profile-tabs">
            <TabPane tab="Posts" key="1">
              {postList.length > 0 ? (
                postList.map((post, _) => {
                  return (
                    <>
                      <PostCard
                        key={post.id}
                        id={post.id}
                        title={post.title}
                        description={post.description}
                        ratings={Number(post.ratings)}
                        comments={Number(post.comments)}
                        timestamp={post.timestamp}
                        edited={post.edited}
                        tags={post.tags}
                        media={post.media}
                        author={post.author}
                      />
                    </>
                  );
                })
              ) : (
                <span className="no-posts">No posts yet</span>
              )}
            </TabPane>
            <TabPane tab="Comments" key="2">
              {commentList.length > 0 ? (
                commentList.map((comment, _) => {
                  return (
                    <>
                      <CommentCard
                        key={comment.id}
                        id={comment.id}
                        comment={comment.comment}
                        ratings={Number(comment.ratings)}
                        timestamp={comment.timestamp}
                        edited={comment.edited}
                        author={comment.author}
                        postid={comment.postid}
                      />
                    </>
                  );
                })
              ) : (
                <span className="no-posts">No comments yet</span>
              )}
            </TabPane>
            {username === profileUsername && (
              <TabPane tab="Saved" key="3">
                {savedPostList.length > 0 ? (
                  savedPostList.map((post, _) => {
                    return (
                      <>
                        <PostCard
                          key={post.id}
                          id={post.id}
                          title={post.title}
                          description={post.description}
                          ratings={Number(post.ratings)}
                          comments={Number(post.comments)}
                          timestamp={post.timestamp}
                          edited={post.edited}
                          tags={post.tags}
                          media={post.media}
                          author={post.author}
                        />
                      </>
                    );
                  })
                ) : (
                  <span className="no-posts">No posts saved.</span>
                )}
              </TabPane>
            )}
          </Tabs>
        )}
      </div>
    </>
  );
};

export default Profile;
