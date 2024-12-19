import React from "react";

const Skeleton = (theme) => {
  return (
    <div>
      <img
        src={
          theme.theme === "theme-dark"
            ? "https://cdn.worldofdypians.com/tools/placeholder-black.svg"
            : "https://cdn.worldofdypians.com/tools/placeholder.svg"
        }
        alt=""
      />
    </div>
  );
};

export default Skeleton;
