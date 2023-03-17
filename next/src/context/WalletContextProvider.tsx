import { getAddresses } from "@/services/wallet";
import { getInjectiveAddress } from "@injectivelabs/sdk-ts";
import React, { createContext, useContext, useEffect, useState } from "react";

type StoreState = {
  injectiveAddress: string;
  ethereumAddress: string;
  connectWallet: () => void;
};

const WalletContext = createContext<StoreState>({
  ethereumAddress: "",
  injectiveAddress: "",
  connectWallet: () => {},
});

export const useWalletStore = () => useContext(WalletContext);

type Props = {
  children?: React.ReactNode;
};

const WalletContextProvider = (props: Props) => {
  const [ethereumAddress, setEthereumAddress] = useState("");
  const [injectiveAddress, setInjectiveAddress] = useState("");

  async function connectWallet() {
    const [address] = await getAddresses();
    setEthereumAddress(address);
    setInjectiveAddress(getInjectiveAddress(address));
  }

  return (
    <WalletContext.Provider
      value={{
        ethereumAddress,
        injectiveAddress,
        connectWallet,
      }}
    >
      {props.children}
    </WalletContext.Provider>
  );
};

export default WalletContextProvider;
