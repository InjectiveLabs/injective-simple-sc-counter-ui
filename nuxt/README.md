# Injective Counter Contract Example

This Nuxt app is an example of how to implement the connection and interact with a Smart Contract deployed on the Injective Chain using the `injective-ts` module.

More about `injective-ts` here: [injective-ts wiki](https://github.com/InjectiveLabs/injective-ts/wiki)

Link to the Smart Contract Repo: [cw-counter](https://github.com/InjectiveLabs/cw-counter)

## 1. Preparation

Start by installing the node module dependencies you are going to use (like `@injectivelabs/sdk-ts` etc...)

We can see the modules used in this example in `package.json`

Before we start using the `@injectivelabs` modules, we first need to configure Nuxt, by adding some plugins like `node-modules-polyfill` and configuring nuxt to build with webpack for production instead of Vite, because of the native node modules we are adding in the app.
There are currently some issues when using the native modules and building with Vite.
Also make sure the needeed dependecies for Webpack are installed (like `@nuxt/webpack-builder`)

For this its best to copy the configuration used in this example.

- the `nuxt-config` folder
- the `nuxt-config.ts` file

## 2. Setting up the Services

Next, we need to setup the services we are going to use.
For interacting with the smart contract, we are going to use `ChainGrpcWasmApi` from `@injectivelabs/sdk-ts`.
Also we will need the Network Endpoints we are going to use (Mainnet or Testnet), which we can find in `@injectivelabs/networks`

Example:

```js
// app/services.ts

import { ChainGrpcWasmApi } from "@injectivelabs/sdk-ts";
import { Network, getNetworkEndpoints } from "@injectivelabs/networks";

export const NETWORK = Network.TestnetK8s;
export const ENDPOINTS = getNetworkEndpoints(NETWORK);

export const chainGrpcWasmApi = new ChainGrpcWasmApi(ENDPOINTS.grpc);
```

## 3. Wallet Strategy and Broadcast

Next we need to setup Wallet Strategy And Broadcasting Client, by importing `WalletStrategy` and `MsgBroadcaster` from `@injectivelabs/wallet-ts`.

The main purpose of the `@injectivelabs/wallet-ts` is to offer developers a way to have different wallet implementations on Injective. All of these wallets implementations are exposing the same `ConcreteStrategy` interface which means that users can just use these methods without the need to know the underlying implementation for specific wallets as they are abstracted away.

To start, you have to make an instance of the WalletStrategy class which gives you the ability to use different wallets out of the box. You can switch the current wallet that is used by using the setWallet method on the walletStrategy instance.
The default is `Metamask`.

```js
// app/wallet.ts

import { WalletStrategy } from "@injectivelabs/wallet-ts";
import { Web3Exception } from "@injectivelabs/exceptions";

import {
  CHAIN_ID,
  ETHEREUM_CHAIN_ID,
  IS_TESTNET,
  alchemyRpcEndpoint,
  alchemyWsRpcEndpoint,
} from "@/app/constants";

export const walletStrategy = new WalletStrategy({
  chainId: CHAIN_ID,
  ethereumOptions: {
    ethereumChainId: ETHEREUM_CHAIN_ID,
    wsRpcUrl: alchemyWsRpcEndpoint,
    rpcUrl: alchemyRpcEndpoint,
  },
});
```

To get the addresses from the wallet we can use the following function:

```js
export const getAddresses = async (): Promise<string[]> => {
  const addresses = await walletStrategy.getAddresses();

  if (addresses.length === 0) {
    throw new Web3Exception(
      new Error("There are no addresses linked in this wallet.")
    );
  }

  return addresses;
};
```

In this example, we are calling this function from the `wallet` pinia store, when we click the `Connect Wallet` button.
Note that this function returns an ethereum address which we need to convert to injective address using the `getInjectiveAddress` utility function.

We will also need the `walletStrategy` for the `BroadcastClient`, including the networks used, which we defined earlier.

```js
// app/services.ts

import { Network } from "@injectivelabs/networks";
export const NETWORK = Network.TestnetK8s;

export const msgBroadcastClient = new MsgBroadcaster({
  walletStrategy,
  network: NETWORK,
});
```

## 4. Querying the Smart Contract

Now everything is setup and we can interact with the Smart Contract.

We will begin by Quering the The Smart Contract to get the current count using the `chainGrpcWasmApi` service we created earlier,
and calling `get_count` on the Smart Contract.

```js
// store/counter.ts -> fetchCount()

const counterStore = useCounterStore();

      const response = (await chainGrpcWasmApi.fetchSmartContractState(
        COUNTER_CONTRACT_ADDRESS, // The address of the contract
        toBase64({ get_count: {} }) // We need to convert our query to Base64
      )) as { data: string };

      const { count } = fromBase64(response.data) as { count: number }; // we need to convert the response from Base64

      counterStore.$patch({ count });
```

## 5. Modifying the State

Next we will modify the `count` state.
We can do that by sending messages to the chain using the `Broadcast Client` we created earlier and `MsgExecuteContractCompat` from `@injectivelabs/sdk-ts`

The Smart Contract we use for this example has 2 methods for altering the state:

- `increment`
- `reset`

`increment` increment the count by 1, and `reset` sets the count to a given value.
Note that `reset` can only be called if you are the creator of the smart contract.

Heres an example for both:

```js
// store/counter.ts -> incrementCount()

const counterStore = useCounterStore();
const walletStore = useWalletStore();

if (!walletStore.injectiveAddress) {
  throw new Error("No Wallet Connected");
}

// Preparing the message

const msg = MsgExecuteContractCompat.fromJSON({
  contractAddress: COUNTER_CONTRACT_ADDRESS,
  sender: walletStore.injectiveAddress,
  msg: {
    increment: {},
  },
});

// Signing and broadcasting the message

await msgBroadcastClient.broadcast({
  msgs: msg,
  injectiveAddress: walletStore.injectiveAddress,
});

// sleep and backupPromiseCall are helper functions for waiting some time before executing

await sleep(3000);
await backupPromiseCall(() => counterStore.fetchCount());
```

```js
// store/counter.ts -> setCount()

const counterStore = useCounterStore();
const walletStore = useWalletStore();

if (!walletStore.injectiveAddress) {
  throw new Error("No Wallet Connected");
}

// Preparing the message

const msg = MsgExecuteContractCompat.fromJSON({
  contractAddress: COUNTER_CONTRACT_ADDRESS,
  sender: walletStore.injectiveAddress,
  msg: {
    reset: {
      count: parseInt(number, 10),
    },
  },
});

// Signing and broadcasting the message

await msgBroadcastClient.broadcast({
  msgs: msg,
  injectiveAddress: walletStore.injectiveAddress,
});

await sleep(3000);
await backupPromiseCall(() => counterStore.fetchCount());
```
