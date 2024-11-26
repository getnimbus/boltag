import styled, { keyframes } from "styled-components";
import { motion } from "framer-motion";

const listDefaultToken = [
  {
    logo: "https://assets.coingecko.com/coins/images/33243/standard/voloSUI_%283%29.png",
    symbol: "vSUI",
    address:
      "0x549e8b69270defbfafd4f94e17ec44cdbdd99820b33bda2278dea3b9a32d3f55::cert::CERT",
  },
  {
    logo: "https://s2.coinmarketcap.com/static/img/coins/64x64/7192.png",
    symbol: "wBNB",
    address:
      "0xb848cce11ef3a8f62eccea6eb5b35a12c4c2b1ee1af7755d02d7bd6218e8226f::coin::COIN",
  },
  {
    logo: "https://api.movepump.com/uploads/Asset_10geckos_square_c7be378110.PNG",
    symbol: "GECKO",
    address:
      "0x9f9cd83d94e8f53c6505956539afc0c852cb57c9bcae3e55d275877900ce9ed9::gecko::GECKO",
  },
  {
    logo: "https://assets.coingecko.com/coins/images/33610/standard/pug-head.png?1702513072",
    symbol: "FUD",
    address:
      "0x76cb819b01abed502bee8a702b4c2d547532c12f25001c9dea795a5e631c26f1::fud::FUD",
  },
  {
    logo: "https://imagedelivery.net/cBNDGgkrsEA-b_ixIp9SkQ/bluemove.png/public",
    symbol: "MOVE",
    address:
      "0xd9f9b0b4f35276eecd1eea6985bfabe2a2bbd5575f9adb9162ccbdb4ddebde7f::smove::SMOVE",
  },
  {
    logo: "https://i.ibb.co/ySTnZB2/image.png",
    symbol: "TURBOS",
    address:
      "0x5d1f47ea69bb0de31c313d7acf89b890dbb8991ea8e03c6c355171f84bb1ba4a::turbos::TURBOS",
  },
  {
    logo: "https://ipfs.io/ipfs/QmXGaEc2XPKZetBesrZrDUfYF6UgQ7VRk8wuCVCobDt6wg",
    symbol: "PepeGOAT",
    address:
      "0xc2edf324c59ad2481b47e327a710cb5353074af254560b3182d91b3a7feab6c0::PEPEGOAT::PEPEGOAT",
  },
  {
    logo: "https://i.imgur.com/xH1sEC5.png",
    symbol: "SHUI",
    address:
      "0x239e9725bdab1fcb2e4798a057da809e52f13134a09bc9913659d4a80ddfdaad::shui::SHUI",
  },
  {
    logo: "https://ipfs.io/ipfs/bafkreig53olo3ewrkph3hfrhjuwvuj53pmbntl2cwxd4zlyfnj5eznoxcu",
    symbol: "FLX",
    address:
      "0x6dae8ca14311574fdfe555524ea48558e3d1360d1607d1c7f98af867e3b7976c::flx::FLX",
  },
  {
    logo: "https://gateway.pinata.cloud/ipfs/QmQv4usd5eMQYMp93E5pASEWyQP9JCi7QM3bAaWhVfz4pn",
    symbol: "HOPI",
    address:
      "0xc9e497ea76280864615dc97dce4479585ac9b767a014428448df3b8f95310e3f::hopi::HOPI",
  },
  {
    logo: "https://pntvpw2m7uxvx7j4roojxy3sb2lrc57jqzwo66kafwdjaj5v3oea.arweave.net/e2dX20z9L1v9PIucm-NyDpcRd-mGbO95QC2GkCe124g",
    symbol: "SBOX",
    address:
      "0xbff8dc60d3f714f678cd4490ff08cabbea95d308c6de47a150c79cc875e0c7c6::sbox::SBOX",
  },
  {
    logo: "https://ipfs.io/ipfs/QmYH4seo7K9CiFqHGDmhbZmzewHEapAhN9aqLRA7af2vMW",
    symbol: "BUCK",
    address:
      "0xce7ff77a83ea0cb6fd39bd8748e2ec89a3f41e8efdc3f4eb123e0ca37b184db2::buck::BUCK",
  },
  {
    logo: "https://assets.haedal.xyz/logos/hasui.svg",
    symbol: "haSUI",
    address:
      "0xbde4ba4c2e274a60ce15c1cfff9e5c42e41654ac8b6d906a57efa4bd3c29f47d::hasui::HASUI",
  },
];

const random = () => {
  return {
    randomX: Math.random() * 100,
    randomY: Math.random() * 100,
    token: Math.random() * 5,
  };
};

const tokenAnimation = (_index: number) => {
  return keyframes`
    0%, 100% {
      transform: translateY(${-random().token * _index}px);
    }
    50% {
      transform: translateY(${random().token * _index}px);
    }
  `;
};

const AnimatedDiv = styled.div<{ $index: number }>`
  animation: ${(props) => {
      return tokenAnimation(props.$index);
    }}
    5522.1ms infinite linear;
`;

const listDefaultTokenPosition = listDefaultToken.map((item, index) => {
  const randomSize = Math.round(Math.random() * (120 - 60) + 60);

  return {
    ...item,
    randomSize,
    left: random().randomX + index,
    top: random().randomY + index,
  };
});

export const BubbleAnimateBg = ({
  handleSelectedToken,
  isMainPage,
}: {
  handleSelectedToken?: (token: any) => void;
  isMainPage: boolean;
}) => {
  return (
    <div className="absolute inset-0 z-10 w-full h-full backdrop-blur-sm bg-white/30 dark:bg-black/50">
      <div
        className="relative w-full h-full"
        style={{
          flexShrink: 0,
        }}
      >
        {listDefaultTokenPosition.map((token, index) => {
          return (
            <motion.div
              key={token.symbol}
              className="absolute group"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 100 }}
              style={{
                width: `${token.randomSize}px`,
                height: `${token.randomSize}px`,
                left: `${token.left}%`,
                top: `${token.top}%`,
              }}
            >
              <AnimatedDiv $index={index + 1}>
                <div
                  className={`flex items-center justify-center w-full h-full p-4 transition-all rounded-full hover:border group ${
                    isMainPage ? "cursor-pointer" : ""
                  }`}
                  style={{
                    borderColor: "rgba(30, 150, 252, 0.2)",
                  }}
                  onClick={() => {
                    if (isMainPage) {
                      if (handleSelectedToken) {
                        handleSelectedToken(token);
                      }
                    }
                  }}
                >
                  <img
                    src={token.logo}
                    alt=""
                    style={{
                      borderColor: "rgba(30, 150, 252, 0.4)",
                    }}
                    className="w-full h-full overflow-hidden transition-all rounded-full group-hover:border group-hover:scale-125 group-hover:rotate-12 group-hover:p-1"
                  />
                </div>

                <div className="absolute hidden text-sm transform -translate-x-1/2 group-hover:block -bottom-6 left-1/2">
                  {token.symbol}
                </div>

                <div className="absolute inset-0 block rounded-full bg-white/30 dark:bg-black/10 backdrop-blur-sm group-hover:hidden"></div>
              </AnimatedDiv>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
