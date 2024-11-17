import React, { useState, useEffect } from "react";
import { AutoComplete, Input } from "antd";
import axios from "src/Utils/axiosConfig";
import { ElementTagInterface } from "src/Interfaces/SearchInterface";
import SearchTags from "./SearchTags";
import { ReactComponent as InputSearchIcon } from "../../Assets/img/searchInputIcon.svg";
import { useAppSelector, useAppDispatch } from "src/Redux/hooks";
import { setPostsList, setShowSearchFeed } from "src/Redux/postModal";
import { useNavigate } from "react-router-dom";

const Search = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  //STATE DEFINITIONS
  const { isLoggedIn, token } = useAppSelector((state) => state.authModal);
  const { postsList } = useAppSelector((state) => state.postModal);
  const [openAutoComplete, setOpenAutoComplete] = useState({
    clicked_type: "",
    open: false,
  });
  const [inputValue, setInputValue] = useState("");
  const [tags, setTags] = useState([]);

  //API CALLS
  const searchPosts = async (searchQuery) => {
    const response = await axios.post(
      "/api/search",
      JSON.stringify({ searchQuery: searchQuery }),
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
    );

    const data = response.data;
    //CHECK FOR POSTS CURRENT USER HAS RATED/SAVED
    let tempFeed = [];
    if (isLoggedIn) {
      const postSavedData = response.data.pop();
      const postRatingData = response.data.pop();

      for (let i = 0; i < data.length; i++) {
        let tempPost = data[i];
        tempPost["userRating"] = 0;
        for (let j = 0; j < postRatingData?.postsLiked.length; j++) {
          if (tempPost.id === postRatingData.postsLiked[j].postid) {
            tempPost["userRating"] = Number(
              postRatingData.postsLiked[j].rating
            );
            break;
          }
        }
        tempPost["saved"] = false;
        for (let j = 0; j < postSavedData.postsSaved.length; j++) {
          if (tempPost.id === postSavedData.postsSaved[j].postid) {
            tempPost["saved"] = true;
            break;
          }
        }
        tempFeed.push(tempPost);
      }
    } else {
      tempFeed = data;
    }

    dispatch(setPostsList(tempFeed));
  };

  const onFocus = () => {
    if (openAutoComplete.open) {
      setOpenAutoComplete({ clicked_type: "onFocus", open: false });
    } else {
      if (inputValue) {
        setOpenAutoComplete({ clicked_type: "onFocus", open: true });
      }
    }
  };

 

  const onSelect = (value: any, option: any) => {
    if (value === "All Properties") {
      return;
    } else {
      if (openAutoComplete.open) {
        setOpenAutoComplete({ clicked_type: "onSelect", open: false });
        setInputValue("");
      } else {
        setOpenAutoComplete({ clicked_type: "onSelect", open: true });
      }
      let convertTagType = value.toLowerCase();
      if (convertTagType === "events") {
        convertTagType = "event";
      }
      if (convertTagType === "user") {
        convertTagType = "identify";
      }
      setTags([
        ...tags,

        {
          id: JSON.stringify({ type: value, value: inputValue }),
          type: convertTagType,
          value: inputValue,
        },
      ]);
    }
  };

  const onClick = () => {
    if (
      openAutoComplete.clicked_type === "onSelect" &&
      openAutoComplete.open === false
    ) {
      if (inputValue.length > 0) {
        setOpenAutoComplete({ clicked_type: "onClick", open: true });
      }
    }
  };

  const onBlur = () => {
    setOpenAutoComplete({ clicked_type: "onBlur", open: false });
  };

  const onChange = (value: string) => {
    if (value === "All Properties") {
      return;
    } else {
      setOpenAutoComplete({ clicked_type: "onFocus", open: true });
      setInputValue(value);
    }
    if (value.length === 0) {
      setOpenAutoComplete({ clicked_type: "onFocus", open: true });
    }
  };

  const onKeydown = (event: any) => {
    if (event.keyCode === 13) {
      setOpenAutoComplete({ clicked_type: "onFocus", open: false });
      //api call
      if (inputValue.trim() === "") {
        navigate("/");
        return;
      }
      searchPosts(inputValue);
      dispatch(setShowSearchFeed(true));
      navigate("/");
      // setInputValue("");
    }
  };

  const onTagClose = (event: any, element: ElementTagInterface) => {
    event.preventDefault();
    const filteredTags = tags.filter((tag) => tag.id !== element.id);
    setTags(filteredTags);
  };

  return (
    <>
      <AutoComplete
        listHeight={1000}
        className="search-auto-complete"
        dropdownClassName="certain-category-search-dropdown"
        open={openAutoComplete.open}
        onFocus={onFocus}
        onClick={onClick}
        onSelect={onSelect}
        onChange={onChange}
        onBlur={onBlur}
        onKeyDown={onKeydown}
      >
        <div>
          {tags.length > 0 && (
            <SearchTags tags={tags} onTagClose={onTagClose} />
          )}
          <Input
            prefix={<InputSearchIcon />}
            className="search-input-auto-complete"
            size="large"
            placeholder="Search for Tags, Posts, Users, etc..."
            value={inputValue}
          />
        </div>
      </AutoComplete>
    </>
  );
};

export default Search;
