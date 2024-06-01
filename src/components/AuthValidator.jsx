/* eslint-disable react/prop-types */
import React from "react";
import { LINK_ROOT } from "../routes";

class AuthValidator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    if (localStorage.getItem("userInfo") === null) {
      window.location.href = LINK_ROOT;
      return;
    }

    return <div>{this.props?.children ?? null}</div>;
  }
}

export default AuthValidator;
