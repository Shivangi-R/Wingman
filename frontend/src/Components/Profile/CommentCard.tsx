import React, { useEffect, useState } from "react";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { API_URL } from "src/Utils/constants";
import { Divider, Tooltip } from "antd";
import { CommentOutlined, StarOutlined } from "@ant-design/icons";

interface CommentCardInterface {
  id: string;
  comment: string;
  ratings: number;
  timestamp: string;
  edited: boolean;
  author: string;
  postid: string;
}

const CommentCard = ({
  id,
  comment,
  ratings,
  timestamp,
  edited,
  author,
  postid,
}: CommentCardInterface) => {
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
    navigate(`/post/${postid}`);
  };

  return (
    <>
      <div className="comment-card-container">
        <div className="comment-card-header">
          <div>
            <div className="comment-card-author">
              {author !== null && (
                <>
                  <div className="comment-card-author-avtaar">
                    <span>
                      {author !== null &&
                        author !== undefined &&
                        author.charAt(0)}
                    </span>
                  </div>
                </>
              )}
              {author !== null && <>Posted by {author}</>}

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
            <div className="comment-card-comment" onClick={getPost}>
              {comment}
            </div>
          </div>
        </div>
        <Divider style={{ margin: "10px 0" }} />
        <div className="comment-card-footer">
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

export default CommentCard;
