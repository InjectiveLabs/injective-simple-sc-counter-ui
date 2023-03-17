import React from "react";
import ConnectWallet from "./ConnectWallet";

type Props = {};

const Navbar = (props: Props) => {
  return (
    <div className='bg-gray-100'>
      <div className='container mx-auto flex justify-between items-center p-2'>
        <h1>Counter Example</h1>
        <ConnectWallet />
      </div>
    </div>
  );
};

export default Navbar;
