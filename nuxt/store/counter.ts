import { defineStore } from "pinia";
import { chainGrpcWasmApi } from "@/app/Services";
import { COUNTER_CONTRACT_ADDRESS } from "@/app/utils/constants";
import {
  toBase64,
  fromBase64,
  MsgExecuteContractCompat,
} from "@injectivelabs/sdk-ts";
import { useWalletStore } from "./wallet";
import { msgBroadcastClient } from "@/app/Services";
import { sleep } from "@injectivelabs/utils";
import { backupPromiseCall } from "@/app/utils/index";

export const useCounterStore = defineStore("counter", {
  state: () => ({
    count: 0,
  }),
  actions: {
    async fetchCount() {
      const counterStore = useCounterStore();

      const response = await chainGrpcWasmApi.fetchSmartContractState(
        COUNTER_CONTRACT_ADDRESS,
        toBase64({ get_count: {} })
      );

      const { count } = fromBase64(
        Buffer.from(response.data).toString("base64")
      ) as { count: number };

      counterStore.$patch({ count });
    },

    async incrementCount() {
      const counterStore = useCounterStore();
      const walletStore = useWalletStore();

      if (!walletStore.injectiveAddress) {
        throw new Error("No Wallet Connected");
      }

      const msg = MsgExecuteContractCompat.fromJSON({
        contractAddress: COUNTER_CONTRACT_ADDRESS,
        sender: walletStore.injectiveAddress,
        msg: {
          increment: {},
        },
      });

      await msgBroadcastClient.broadcast({
        msgs: msg,
        injectiveAddress: walletStore.injectiveAddress,
      });

      await sleep(3000);
      await backupPromiseCall(() => counterStore.fetchCount());
    },

    async setCount(number: string) {
      const counterStore = useCounterStore();
      const walletStore = useWalletStore();

      if (!walletStore.injectiveAddress) {
        throw new Error("No Wallet Connected");
      }

      const msg = MsgExecuteContractCompat.fromJSON({
        contractAddress: COUNTER_CONTRACT_ADDRESS,
        sender: walletStore.injectiveAddress,
        msg: {
          reset: {
            count: parseInt(number, 10),
          },
        },
      });

      await msgBroadcastClient.broadcast({
        msgs: msg,
        injectiveAddress: walletStore.injectiveAddress,
      });

      await sleep(3000);
      await backupPromiseCall(() => counterStore.fetchCount());
    },
  },
});
