import React, { Suspense } from "react";
import { Toaster } from "sonner";
import { TailSpin } from "react-loader-spinner";
import { RouterProvider, createRouter } from "@tanstack/react-router";

import { routeTree } from "./routeTree.gen";

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

function App() {
  function addSchemaJsonLd() {
    return {
      __html: `{
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "Bolt.ag",
        "alternateName": "Bolt.ag",
        "url": "https://bolt.ag/",
        "logo": "https://getnimbus.io/static/Light.webp",
        "sameAs": [
          "https://github.com/getnimbus/boltag",
          "https://bolt.ag/"
        ]
      }`,
    };
  }

  return (
    <React.Fragment>
      <head>
        <link
          rel="icon"
          type="image/svg+xml"
          href="/bolt.png"
          className="w-full h-full"
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={addSchemaJsonLd()}
          key="product-jsonld"
        />

        <script
          dangerouslySetInnerHTML={{
            __html: `
                      window.dataLayer = window.dataLayer || [];
                      function gtag(){dataLayer.push(arguments);}
                      gtag('js', new Date());
                      
                      gtag('config', 'G-V1Z13C1LRM');
                    `,
          }}
        />

        <title>
          Bolt.ag by Nimbus - Get the best swap routes from FlowX, Cetus,
          Aftermath, NAVI and 7K
        </title>
        <meta
          name="description"
          content="Bolt.ag by Nimbus is a crypto swap application on the SUI blockchain that finds the best routes from FlowX, and 7K for optimal trading rates"
        />

        <meta property="og:url" content="https://bolt.ag/" />
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="Bolt.ag by Nimbus - Get the best swap routes from FlowX, Cetus,
          Aftermath, NAVI and 7K"
        />
        <meta
          property="og:description"
          content="Bolt.ag by Nimbus is a crypto swap application on the SUI blockchain that finds the best routes from FlowX, and 7K for optimal trading rates"
        />
        <meta
          property="og:image"
          content="https://darefun.s3.ap-southeast-1.amazonaws.com/images/0192aa88-0697-703f-818f-a58664a373bd.png"
        />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://bolt.ag/" />
        <meta
          name="twitter:title"
          content="Bolt.ag by Nimbus - Get the best swap routes from FlowX, Cetus,
          Aftermath, NAVI and 7K"
        />
        <meta
          name="twitter:description"
          content="Bolt.ag by Nimbus is a crypto swap application on the SUI blockchain that finds the best routes from FlowX, and 7K for optimal trading rates"
        />
        <meta
          property="twitter:image"
          content="https://darefun.s3.ap-southeast-1.amazonaws.com/images/0192aa88-0697-703f-818f-a58664a373bd.png"
          data-react-helmet="true"
        />

        <link rel="canonical" href="https://bolt.ag/" />
        <meta
          name="keywords"
          content="web3 portfolio for tracking crypto, crypto portfolio trackers, web3 portfolio website, web3 trading, defi portfolio tracking, tracking crypto portfolio, portfolio tracker for crypto, multichain portfolio tracker, online crypto portfolio tracker, portfolio tracker crypto and stocks, best crypto portfolio tracking app, portfolio tracking crypto, uniswap portfolio tracker,What is nimbus, nimbus blog, invest with nimbus, nimbus tools, tools for invest,How to invest bitcoin, how to make money with bitcoin, tools helping invest bitcoin, What is portfolio, how to make portfolio for invest, portfolio invest, What is nimbus, what is nimbus web3, nimbus, getnimbus, nimbus portfolio, why is nimbus, invest with nimbus, invest tools, web3 portfolio, web3 nimbus, web3 portfolio, web3 portfolio management, portfolio management, What is an investment, how to invest, Wherever you invest, you will have a lot of money, which platform is good for investment, what is investing crypto, how to invest crypto, how to invest, tool for investment, invest tools, top tools for investing, how to invest, crypto investment, crypto trading, tools for helping trading, make money with crypto but low cost, make money but don’t want to loss money, Crypto tracking, how to track crypto, how to update crypto info, how to track crypto, how to know my crypto is lost, tracking crypto profit, crypto tracking notification, whale tracking, whale crypto reading, whale crypto tracking, tracking whale crypto, What is blockchain, what is block, what is crypto, what should i know about crypto, what i should know about blockchain, make money with blockchain, make money with crypto, how to make money with crypto, how to make money with blockchain"
        />
      </head>

      <Suspense
        fallback={
          <div className="flex items-center justify-center h-screen">
            <TailSpin
              visible={true}
              height="60"
              width="60"
              color="#1e96fc"
              ariaLabel="tail-spin-loading"
              radius="1"
              wrapperStyle={{}}
              wrapperClass=""
            />
          </div>
        }
      >
        <Toaster expand={true} position="top-center" theme="light" />
        <RouterProvider router={router} />
      </Suspense>
    </React.Fragment>
  );
}

export default App;
