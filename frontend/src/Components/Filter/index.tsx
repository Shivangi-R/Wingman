import React, { useState } from "react";
import { useAppSelector, useAppDispatch } from "src/Redux/hooks";
import { setPostsList } from "src/Redux/postModal";

const FilterComponent = () => {
  const dispatch = useAppDispatch();
  const { postsList } = useAppSelector((state) => state.postModal);
  const [filterOptionSelected, setFilterOptionSelected] = useState({
    hot: false,
    best: false,
    new: true,
  });

  const handleSortByRating = () => {
    setFilterOptionSelected({ hot: true, best: false, new: false });
    let updatedPostsList = [...postsList];
    updatedPostsList.sort((a, b) =>
      Math.abs(Number(a.ratings)) < Math.abs(Number(b.ratings)) ? 1 : -1
    );

    dispatch(setPostsList(updatedPostsList));
  };
  const handleSortByUpvotes = () => {
    setFilterOptionSelected({ hot: false, best: true, new: false });

    let updatedPostsList = [...postsList];
    updatedPostsList.sort((a, b) =>
      Number(a.ratings) < Number(b.ratings) ? 1 : -1
    );

    dispatch(setPostsList(updatedPostsList));
  };
  const handleSortById = () => {
    setFilterOptionSelected({ hot: false, best: false, new: true });

    let updatedPostsList = [...postsList];
    updatedPostsList.sort((a, b) => (Number(a.id) < Number(b.id) ? 1 : -1));

    dispatch(setPostsList(updatedPostsList));
  };

  return (
    <>
      <div className="filter-container">
        <div className="filter-header">Filter By:</div>
        <div className="filter-options">
          <div
            className="filter-option"
            style={{ color: filterOptionSelected.hot ? "#1890ff" : "" }}
            onClick={handleSortByRating}
          >
            Hot &#128293;
          </div>
          <div
            className="filter-option"
            style={{ color: filterOptionSelected.best ? "#1890ff" : "" }}
            onClick={handleSortByUpvotes}
          >
            Best ❤️
          </div>
          <div
            className="filter-option"
            style={{ color: filterOptionSelected.new ? "#1890ff" : "" }}
            onClick={handleSortById}
          >
            New &#129321;
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterComponent;
