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

function App() {
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
          Bolt.ag - Best Crypto Swap Aggregator on SUI | Compare FlowX, Cetus,
          Aftermath, NAVI & 7K
        </title>
        <meta
          name="description"
          content="Bolt.ag is the leading crypto swap aggregator on SUI blockchain. Get the best trading rates by comparing prices across FlowX, Cetus, Aftermath, NAVI and 7K. Trade with confidence using our advanced routing algorithm."
        />

        <meta property="og:url" content="https://bolt.ag/" />
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="Bolt.ag - Best Crypto Swap Aggregator on SUI | Compare FlowX, Cetus, Aftermath, NAVI & 7K"
        />
        <meta
          property="og:description"
          content="Bolt.ag is the leading crypto swap aggregator on SUI blockchain. Get the best trading rates by comparing prices across FlowX, Cetus, Aftermath, NAVI and 7K. Trade with confidence using our advanced routing algorithm."
        />
        <meta
          property="og:image"
          content="https://darefun.s3.ap-southeast-1.amazonaws.com/images/0192aa88-0697-703f-818f-a58664a373bd.png"
        />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://bolt.ag/" />
        <meta
          name="twitter:title"
          content="Bolt.ag - Best Crypto Swap Aggregator on SUI | Compare FlowX, Cetus, Aftermath, NAVI & 7K"
        />
        <meta
          name="twitter:description"
          content="Bolt.ag is the leading crypto swap aggregator on SUI blockchain. Get the best trading rates by comparing prices across FlowX, Cetus, Aftermath, NAVI and 7K. Trade with confidence using our advanced routing algorithm."
        />
        <meta
          property="twitter:image"
          content="https://darefun.s3.ap-southeast-1.amazonaws.com/images/0192aa88-0697-703f-818f-a58664a373bd.png"
          data-react-helmet="true"
        />

        <link rel="canonical" href="https://bolt.ag/" />

        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#1e96fc" />
        <meta name="robots" content="index, follow" />
        <meta name="language" content="English" />
        <meta name="revisit-after" content="7 days" />
        <meta name="author" content="Bolt.ag" />

        <meta
          name="keywords"
          content="crypto swap, SUI blockchain, DEX aggregator, FlowX, Cetus, Aftermath, NAVI, 7K, best crypto rates, DeFi trading, crypto exchange, SUI token swap, decentralized exchange, crypto trading platform, DeFi aggregator, best swap rates, cryptocurrency exchange, digital asset trading, blockchain trading, crypto liquidity aggregator, SUI DeFi, crypto portfolio management, automated trading, smart order routing, cross-chain swap, token exchange"
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
