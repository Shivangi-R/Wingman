import React, { useEffect, useState } from "react";
import anonymousIcon from "src/Assets/img/anonymous.png";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { API_URL } from "src/Utils/constants";
import { Divider, Tooltip } from "antd";
import { CommentOutlined, StarOutlined } from "@ant-design/icons";

interface PostCardInterface {
  id: string;
  title: string;
  description: string;
  ratings: number;
  comments: number;
  timestamp: string;
  tags: string[];
  edited: boolean;
  media: string[];
  author: string;
}

const PostCard = ({
  id,
  title,
  description,
  ratings,
  comments,
  timestamp,
  tags,
  edited,
  media,
  author,
}: PostCardInterface) => {
  const [timeDifference, setTimeDifference] = useState({
    days: null,
    hours: null,
    minutes: null,
  });
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

  const getPost = () => {
    navigate(`/post/${id}`);
  };
  return (
    <>
      <div className="post-card-container">
        <div className="post-card-header">
          <div>
            <div className="post-card-author">
              {author !== null ? (
                <>
                  <div className="post-card-author-avtaar">
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
            <div className="post-card-title" onClick={getPost}>
              {title}
            </div>
            {tags.length > 0 && tags[0] !== "" && (
              <div className="post-card-tags" onClick={getPost}>
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
            <div className="post-card-description">{description}</div>
          )}
        </div>
        <Divider style={{ margin: "10px 0" }} />
        <div className="post-card-footer">
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
          <Tooltip placement="top" title="Votes">
            <div className="comments" onClick={getPost}>
              <StarOutlined
                style={{
                  fontSize: "20px",
                  marginRight: "5px",
                }}
              />{" "}
              {ratings} Votes
            </div>
          </Tooltip>
        </div>
      </div>
    </>
  );
};

export default PostCard;
