import Link from "next/link";
import { Fragment, useEffect } from "react";

import '@/styles/globals.css'

import { useRouter } from "next/router";

export default function App({ Component, pageProps }) {

  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = () => {
      
    };
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  return (
    <Fragment>
      <Component {...pageProps} />
    </Fragment>
  )
}
