import React from "react";
import Navbar from "./Navbar";

type Props = {
  children?: React.ReactNode;
};

const Layout = (props: Props) => {
  return (
    <div>
      <Navbar />
      {props.children}
    </div>
  );
};

export default Layout;
