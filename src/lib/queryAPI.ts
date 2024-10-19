import { nimbus } from "~/lib/network";
import { uniqBy } from "lodash";
import type { IAirdropData } from "~/types/IAirdropData";
import type { ILinkAccountInfo } from "~/types/ILinkAccountInfo";
import type { IPointData } from "~/types/IPointData";
import type { IReferrals } from "~/types/IReferrals";
import type { ITokenMobulaInfo } from "~/types/ITokenMobulaInfo";
import type { IUserInfo } from "~/types/IUserInfo";
import type { IValidateAddressData } from "~/types/IValidateAddressData";

export const handleSearchToken = async (searchValue: string) => {
  const response: ITokenMobulaInfo[] = await nimbus
    .get(`/token/${searchValue}/info/mobula`)
    .then((res: any) => res?.data?.data);
  return response;
};

export const handleMarketTokens = async (search: string) => {
  const response: any = await nimbus
    .get(`/tokens/coingecko?search=${search}`)
    .then((res: any) => res?.data || []);
  return response;
};

export const getPackagePrice = async (currency: string) => {
  const response: any = await nimbus
    .get(`/v3/payments/package-price?currency=${currency}`)
    .then((res: any) => res?.data);
  return response;
};

export const getReferralInvitation = async () => {
  const response: IReferrals = await nimbus
    .get("/referrals")
    .then((res: any) => res?.data);
  return response;
};

export const getTokenInfo = async (address: string, chain: string) => {
  const response: any = await nimbus
    .post(`/v2/tokens/list`, {
      address: address,
      platform: chain,
    })
    .then((res: any) => {
      return uniqBy(res?.data, "contract_address");
    });
  return response;
};

export const getUserInfo = async () => {
  const response: IUserInfo = await nimbus.get("/users/me").then((res: any) => {
    if (res.error) {
      throw new Error(res.error);
    }
    return res?.data;
  });
  return response;
};

export const getLinkData = async () => {
  const response: ILinkAccountInfo = await nimbus
    .get("/accounts/link")
    .then((res: any) => res?.data || []);
  return response;
};

export const getAirdrops = async (address: string) => {
  const response: IAirdropData[] = await nimbus
    .get(`/airdrops/${address}`)
    .then((res: any) => res?.data || []);
  return response;
};

export const getPoints = async (address: string) => {
  const response: IPointData = await nimbus
    .get(`/points/${address}`)
    .then((res: any) => res?.data);
  return response;
};

export const handleValidateAddress = async (address: string) => {
  const response: IValidateAddressData = await nimbus
    .get(`/v2/address/${address}/validate`)
    .then((res: any) => {
      return res && res?.data
        ? res?.data
        : {
            address: "",
            type: "",
          };
    });
  return response;
};

export const getVirtualPortfolioProfile = async (address: string) => {
  const response: any = await nimbus.get(
    `/address/${address}/personalize/virtual-portfolio-profile`,
  );
  return response;
};

export const getVirtualPortfolio = async (
  address: string,
  portfolioProfileId: string,
  owner: string,
) => {
  const response = await nimbus.get(
    `/address/${address}/personalize/virtual-portfolio?portfolioProfileId=${portfolioProfileId}&owner=${owner}`,
  );
  return response;
};

export const getVirtualPortfolioPerformance = async (
  address: string,
  portfolioProfileId: string,
  owner: string,
) => {
  const response = await nimbus.get(
    `/address/${address}/personalize/virtual-portfolio/performance?portfolioProfileId=${portfolioProfileId}&owner=${owner}`,
  );
  return response;
};

export const getVirtualPortfolioDashboard = async (
  pagination: number,
  sort: string,
) => {
  const response = await nimbus.get(
    `/address/personalize/virtual-portfolio-dashboard?page=${
      pagination - 1
    }&sort=${sort}`,
  );
  return response;
};

export const getListAddress = async () => {
  const response: any = await nimbus
    .get("/accounts/list")
    .then((res: any) => res?.data || []);
  return response;
};

export const getTradingStats = async (address: string) => {
  const response: any = await nimbus
    .get(`/v2/analysis/${address}/trading-stats`)
    .then((res: any) => res?.data);
  return response;
};

export const getPositionList = async (address: string) => {
  const response: any = await nimbus
    .get(`/v2/address/${address}/positions-prepare`)
    .then((res: any) => res?.data);
  return response;
};

export const getPositions = async (address: string, protocol: any) => {
  const response: any = await nimbus
    .get(`/v2/address/${address}/positions?protocol=${protocol}`)
    .then((res: any) => res?.data);
  return response;
};

export const getOverview = async (
  wallet: string,
  chain: string,
  validatedAccount: any,
) => {
  let addressChain = chain;

  if (addressChain === "ALL") {
    addressChain = validatedAccount?.type;
  }

  let formatChain = "";

  switch (addressChain) {
    case "MOVE":
      formatChain = "SUI";
      break;
    case "TON":
      formatChain = "TON";
      break;
    case "SOL":
      formatChain = "SOL";
      break;
    case "AURA":
      formatChain = "AURA";
      break;
    case "INJ":
      formatChain = "INJ";
      break;
    case "BTC":
      formatChain = "BTC";
      break;
    case "EVM":
      formatChain = "ETH";
      break;
    case "BUNDLE":
      formatChain = "";
      break;
    default:
      formatChain = addressChain;
      break;
  }

  const response: any = await nimbus
    .get(`/v2/address/${wallet}/overview?chain=${formatChain}`)
    .then((res: any) => res?.data);
  return response;
};

export const getHoldingToken = async (
  wallet: string,
  chain: string,
  validatedAccount: any,
) => {
  let addressChain = chain;

  if (addressChain === "ALL") {
    addressChain = validatedAccount?.type;
  }

  const response: any = await nimbus
    .get(
      `/v2/address/${wallet}/holding?chain=${
        addressChain === "BUNDLE" ? "" : addressChain
      }`,
    )
    .then((res: any) => res?.data);
  return response;
};

export const getVaults = async (
  wallet: string,
  chain: string,
  validatedAccount: any,
) => {
  let addressChain = chain;

  if (addressChain === "ALL") {
    addressChain = validatedAccount?.type;
  }

  const response: any = await nimbus
    .get(
      `/v2/investment/${wallet}/vaults?chain=${
        addressChain === "BUNDLE" ? "" : addressChain
      }`,
    )
    .then((res: any) => res?.data);
  return response;
};

export const getHoldingNFT = async (
  wallet: string,
  chain: string,
  validatedAccount: any,
) => {
  let addressChain = chain;

  if (addressChain === "ALL") {
    addressChain = validatedAccount?.type;
  }

  const response: any = await nimbus
    .get(
      `/v2/address/${wallet}/nft-holding?chain=${
        addressChain === "BUNDLE" ? "" : addressChain
      }`,
    )
    .then((res: any) => res?.data);
  return response;
};

export const handleGetListQuest = async () => {
  const response: any = await nimbus
    .get("/v2/checkin/quest")
    .then((res: any) => res?.data || []);
  return response;
};

export const handleGetDataDailyCheckin = async () => {
  const response: any = await nimbus
    .get("/v2/checkin")
    .then((res: any) => res?.data);
  return response;
};

export const handleGetDataLeaderboard = async () => {
  const response: any = await nimbus
    .get("/v2/checkin/leaderboard")
    .then((res: any) => res?.data);
  return response;
};

export const handleGetDataRewards = async (address: string) => {
  const response: any = await nimbus
    .post(`/v2/reward`, {
      address,
    })
    .then((res: any) => res?.data);
  return response;
};

export const getCampaignReferrals = async () => {
  const response: any = await nimbus
    .get("/v2/campaign/sui-unlock/referral")
    .then((res: any) => res?.data);
  return response;
};

export const getCampaignQuestsBoard = async () => {
  const response: any = await nimbus
    .get("/v2/campaign/sui-unlock/quest-board")
    .then((res: any) => res?.data);
  return response;
};

export const getCampaignPartnerList = async () => {
  const response: any = await nimbus
    .get("/v2/campaign/sui-unlock/partners")
    .then((res: any) => res?.data);
  return response;
};

export const getCampaignPartnerDetail = async (id: any) => {
  const response: any = await nimbus
    .get(`/v2/campaign/${id}/quest-board`)
    .then((res: any) => res?.data);
  return response;
};

export const getLootBoxStatus = async () => {
  const response = await nimbus.get("/v2/rewards/lootbox/status");
  return response;
};

export const getLootBoxWLStatus = async () => {
  const response = await nimbus.get("/v2/campaign/sui-unlock/whitelist");
  return response;
};
