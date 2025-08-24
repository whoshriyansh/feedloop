import React from "react";
import { Logo } from "../shared/logo/Logo";

const Header = () => {
  return (
    <div>
      <div>
        <Logo width={400} height={400} />
        <h1>FeedLoop</h1>
      </div>
    </div>
  );
};

export default Header;
