import { defineStore } from "pinia";
import { getAddresses } from "@/app/services/wallet";
import { getInjectiveAddress } from "@injectivelabs/sdk-ts";

export const useWalletStore = defineStore("wallet", {
  state: () => ({
    ethereumAddress: "",
    injectiveAddress: "",
  }),

  actions: {
    async connectWallet() {
      const walletStore = useWalletStore();

      const [address] = await getAddresses();

      walletStore.$patch({
        ethereumAddress: address,
        injectiveAddress: getInjectiveAddress(address),
      });
    },
  },
});
