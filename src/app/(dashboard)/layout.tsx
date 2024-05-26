import Navbar from "@/components/global/navbar";
import React from "react";

type Props = { children: React.ReactNode };

const Layout = (props: Props) => {
  return (
    <div className="w-full">
      {props.children}
    </div>
  );
};

export default Layout;
