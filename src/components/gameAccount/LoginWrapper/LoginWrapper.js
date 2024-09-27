import React from "react";
import PropTypes from "prop-types";
import classes from "./LoginWrapper.module.css";

function LoginWrapper({ img, children, style }) {
  return (
    <div
      // style={{
      //   backgroundImage: `url(${img})`,
      //   ...style
      // }}
      className={classes.container}
      style={style}
    >
      {children}
    </div>
  );
}

LoginWrapper.propTypes = {
  img: PropTypes.string,
  children: PropTypes.any,
  style: PropTypes.object,
};

LoginWrapper.defaultProps = {
  // img: loginBackground,
};

export default LoginWrapper;
