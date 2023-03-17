import Layout from "@/components/Layout";
import ContextProvider from "@/context/ContextProvider";
import CounterContextProvider from "@/context/CounterContextProvider";
import WalletContextProvider from "@/context/WalletContextProvider";
import "@/styles/globals.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WalletContextProvider>
      <CounterContextProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </CounterContextProvider>
    </WalletContextProvider>
  );
}
