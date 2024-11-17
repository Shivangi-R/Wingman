import { PlusOutlined } from "@ant-design/icons";
import type { InputRef } from "antd";
import { Input, Tag, Tooltip } from "antd";
import { TweenOneGroup } from "rc-tween-one";
import React, { useEffect, useRef, useState } from "react";

const TagField = ({ setTagsProp, initialTags }) => {
  const [tags, setTags] = useState<string[]>(initialTags);
  const [inputVisible, setInputVisible] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<InputRef>(null);

  useEffect(() => {
    if (inputVisible) {
      inputRef.current?.focus();
    }
  }, []);

  useEffect(() => {
    setTagsProp(tags);
  }, [tags]);

  const handleClose = (removedTag: string) => {
    const newTags = tags.filter((tag) => tag !== removedTag);
    setTags(newTags);
  };

  const showInput = () => {
    setInputVisible(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const reg = /^[A-Za-z][A-Za-z0-9]*$/;
    if (e.target.value === "" || reg.test(e.target.value)) {
      setInputValue(e.target.value);
    }
  };

  const handleInputConfirm = () => {
    if (tags.length<6 && inputValue && tags.indexOf(inputValue) === -1) {
      setTags([...tags, inputValue]);
    }
    setInputVisible(false);
    setInputValue("");
  };

  const forMap = (tag: string) => {
    const tagElem = (
      <Tag
        closable
        onClose={(e) => {
          e.preventDefault();
          handleClose(tag);
        }}
        className="tag-children"
      >
        {tag}
      </Tag>
    );
    return (
      <span key={tag} style={{ display: "inline-block" }}>
        {tagElem}
      </span>
    );
  };

  const tagChild = tags.map(forMap);
  return (
    <>
      <div
        style={{
          display: tags.length > 0 ? "block" : "none",
          marginBottom: "12px",
        }}
      >
        <TweenOneGroup
          enter={{
            scale: 0.8,
            opacity: 0,
            type: "from",
            duration: 100,
          }}
          onEnd={(e) => {
            if (e.type === "appear" || e.type === "enter") {
              (e.target as any).style = "display: inline-block";
            }
          }}
          leave={{ opacity: 0, width: 0, scale: 0, duration: 200 }}
          appear={false}
        >
          {tagChild}
        </TweenOneGroup>
      </div>
      {inputVisible && (
        <Input
          ref={inputRef}
          type="text"
          size="small"
          style={{ width: "100px" }}
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputConfirm}
          onPressEnter={handleInputConfirm}
        />
      )}
      {!inputVisible && (
        <Tooltip
          color="blue"
          trigger="hover"
          visible={tags.length === 10}
          placement="right"
          title="Can't add more tags"
        >
          <Tag
            onClick={showInput}
            style={{
              pointerEvents: tags.length === 10 ? "none" : "initial",
            }}
            className="site-tag-plus"
          >
            <PlusOutlined /> Add Tags
          </Tag>
        </Tooltip>
      )}
    </>
  );
};

export default TagField;
