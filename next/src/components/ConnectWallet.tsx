import { useWalletStore } from "@/context/WalletContextProvider";
import React from "react";

type Props = {};

const ConnectWallet = (props: Props) => {
  const { connectWallet, injectiveAddress } = useWalletStore();
  const btnText = injectiveAddress
    ? `${injectiveAddress.slice(0, 5)}...${injectiveAddress.slice(-3)}`
    : "Connect Wallet";
  return (
    <button
      onClick={connectWallet}
      className='btn'
    >
      {btnText}
    </button>
  );
};

export default ConnectWallet;
