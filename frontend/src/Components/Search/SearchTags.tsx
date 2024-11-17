import React from "react";
import { capitalizeFirstLetter } from "../../Utils/commonHelpers";
import { Tag } from "antd";



const SearchTags = ({ tags, onTagClose }) => {
  return tags.map((element, index) => {
    return (
      <Tag
        className="search-input-tag"
        closable
        key={index}
        onClose={(e) => onTagClose(e, element)}
      >
        {capitalizeFirstLetter(
          element.type === "event" ? "events" : element.type
        )}
        : {element.value}
      </Tag>
    );
  });
};

SearchTags.propTypes = {};

export default SearchTags;
