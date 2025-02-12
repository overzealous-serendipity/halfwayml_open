import "@/styles/globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import store from "@/config/redux/store/store";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import Head from "next/head";
import ModalManager from "@/components/UI/Modal/ModalManager";
import { ReduxMonitor } from "@/components/Debug/ReduxMonitor";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      retry: 1,
    },
  },
});

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          {process.env.NODE_ENV === "development" && <ReduxMonitor />}
          <Head>
            <title>Transcription App</title>
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1"
            />
          </Head>
          <ModalManager />
          <Component {...pageProps} />
        </QueryClientProvider>
      </Provider>
    </SessionProvider>
  );
}
