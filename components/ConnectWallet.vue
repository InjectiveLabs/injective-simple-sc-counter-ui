<script setup>
import { useWalletStore } from "~~/store/wallet";

const walletStore = useWalletStore();

const injAddressShort = computed(
  () =>
    `${walletStore.injectiveAddress.slice(
      0,
      6
    )}...${walletStore.injectiveAddress.slice(-3)}`
);

function handleClick() {
  walletStore.connectWallet().catch(alert);
}
</script>

<template>
  <Button v-if="walletStore.injectiveAddress">{{ injAddressShort }}</Button>
  <Button
    v-else
    @click="handleClick"
  >
    Connect Wallet
  </Button>
</template>
