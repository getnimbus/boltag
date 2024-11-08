import { useQuery } from "@tanstack/react-query";
import { nimbus } from "../../lib/network";
import { useEffect, useState } from "react";
import { FormatNumber } from "../../components/FormatNumber";
import { TailSpin } from "react-loader-spinner";
import { shorterAddress } from "../../utils";

const getRecentTrx = async (address: string, page: number) => {
  const response = await nimbus.get(
    `/swap/${address}/transaction-ref?page=${page}`,
  );
  return response;
};

const formatAggregator = (aggregator: string) => {
  let info = {
    name: "",
    logo: "",
  };

  switch (aggregator) {
    case "flowx":
      info = {
        name: "FlowX",
        logo: "https://assets.coingecko.com/coins/images/33317/standard/logo_flx.png?1701435649",
      };
      break;
    case "7k":
      info = {
        name: "7K",
        logo: "https://avatars.githubusercontent.com/u/171641380?s=48&v=4",
      };
      break;
    case "hop":
      info = {
        name: "Hop",
        logo: "https://avatars.githubusercontent.com/u/161168710?s=200&v=4",
      };
      break;
    default:
      info = {
        name: "",
        logo: "",
      };
      break;
  }

  return info;
};

export const RecentTransaction = ({ userAddress }: { userAddress: string }) => {
  const [page, setPage] = useState<number>(1);
  const [dataRecentTrx, setDataRecentTrx] = useState<any[]>([]);

  // query recent trx
  const { isLoading, isError, data } = useQuery({
    queryKey: ["recent-tx", userAddress, page],
    queryFn: () => getRecentTrx(userAddress, page),
    enabled: Boolean(userAddress.length !== 0 && page > 0),
  });

  useEffect(() => {
    if (
      data &&
      data?.data &&
      data?.data?.result &&
      data?.data?.result?.length !== 0
    ) {
      setDataRecentTrx((prev) => [...prev, ...data?.data?.result?.data]);
    }
  }, [data]);

  return (
    <div className="flex flex-col gap-5">
      <div className="text-xl font-medium">Recent Transaction with Ref</div>
      <div className="flex flex-col gap-4">
        <div className="xl:block hidden w-full overflow-hidden rounded-[10px] border border-[#0000000d] bg-white">
          <table className="relative w-full h-full table-auto">
            <thead>
              <tr className="bg-[#f4f5f8]">
                <th className="pl-3 py-3 rounded-tl-[10px]">
                  <div className="text-xs font-medium text-left uppercase">
                    Transaction Hash
                  </div>
                </th>
                <th className="py-3">
                  <div className="text-xs font-medium text-left uppercase">
                    Aggregator
                  </div>
                </th>
                <th className="pr-3 py-3 rounded-tr-[10px]">
                  <div className="text-xs font-medium text-right uppercase">
                    Trade Volume
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="h-full">
              {isError && !isLoading ? (
                <tr>
                  <td colSpan={3}>
                    <div className="flex items-center justify-center h-full px-3 py-4 text-base text-gray-400">
                      Empty
                    </div>
                  </td>
                </tr>
              ) : (
                <>
                  {dataRecentTrx?.map((item: any, index: number) => {
                    return (
                      <tr
                        key={index}
                        className="group transition-all border-b-[0.5px] border-[#0000000d] last:border-none"
                      >
                        <td className="py-3 pl-3 bg-white group-hover:bg-gray-100">
                          <a
                            href={`https://suiscan.xyz/mainnet/tx/${item.txHash}`}
                            className="text-sm font-medium underline cursor-pointer transition-all hover:text-[#1e96fc]"
                          >
                            {item.txHash}
                          </a>
                        </td>

                        <td className="py-3 bg-white group-hover:bg-gray-100">
                          <div className="text-sm font-medium">
                            {item.aggregator ? (
                              <div className="flex items-center gap-2">
                                <img
                                  src={formatAggregator(item.aggregator)?.logo}
                                  alt={item.aggregator}
                                  className="w-6 h-6 rounded-full"
                                />
                                {formatAggregator(item.aggregator)?.name}
                              </div>
                            ) : (
                              "-"
                            )}
                          </div>
                        </td>

                        <td className="py-3 pr-3 bg-white group-hover:bg-gray-100">
                          <div className="text-sm font-medium">
                            <FormatNumber
                              number={Number(item.trade_vol)}
                              type="value"
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </>
              )}
            </tbody>

            {isLoading ? (
              <tbody>
                <tr>
                  <td colSpan={3}>
                    <div className="flex items-center justify-center h-full px-3 py-3">
                      <TailSpin
                        visible={true}
                        height="30"
                        width="30"
                        color="#1e96fc"
                        ariaLabel="tail-spin-loading"
                        radius="1"
                        wrapperStyle={{}}
                        wrapperClass=""
                      />
                    </div>
                  </td>
                </tr>
              </tbody>
            ) : null}
          </table>
        </div>

        <div className="xl:hidden block p-2 w-full overflow-hidden rounded-[10px] border border_0000000d bg-white">
          {isError && !isLoading ? (
            <div className="flex items-center justify-center h-full px-3 py-4 text-base text-gray-400">
              Empty
            </div>
          ) : (
            <>
              {dataRecentTrx?.map((item: any, index: number) => {
                return (
                  <div
                    key={index}
                    className="flex flex-col gap-4 border-b-[1px] border_0000000d last:border-none py-4"
                  >
                    <div className="flex items-start justify-between">
                      <div className="text-sm font-medium text-right uppercase">
                        Transaction Hash
                      </div>
                      <div className="text-sm w-max">
                        <a
                          href={`https://suiscan.xyz/mainnet/tx/${item.txHash}`}
                          className="text-sm font-medium underline cursor-pointer transition-all hover:text-[#1e96fc]"
                        >
                          {shorterAddress(item.txHash)}
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start justify-between">
                      <div className="text-sm font-medium text-right uppercase">
                        Aggregator
                      </div>
                      <div className="text-sm font-medium w-max">
                        {item.aggregator ? (
                          <div className="flex items-center gap-2">
                            <img
                              src={formatAggregator(item.aggregator)?.logo}
                              alt={item.aggregator}
                              className="w-6 h-6 rounded-full"
                            />
                            {formatAggregator(item.aggregator)?.name}
                          </div>
                        ) : (
                          "-"
                        )}
                      </div>
                    </div>

                    <div className="flex items-start justify-between">
                      <div className="text-sm font-medium text-right uppercase">
                        Trade Volume
                      </div>
                      <div className="text-sm font-medium w-max">
                        <FormatNumber
                          number={Number(item.trade_vol)}
                          type="value"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}

              {isLoading ? (
                <div className="flex items-center justify-center h-full px-3 py-3">
                  <TailSpin
                    visible={true}
                    height="30"
                    width="30"
                    color="#1e96fc"
                    ariaLabel="tail-spin-loading"
                    radius="1"
                    wrapperStyle={{}}
                    wrapperClass=""
                  />
                </div>
              ) : null}
            </>
          )}
        </div>

        <div className="flex items-center justify-center">
          <div
            className={`w-[140px] border border-[#1e96fc] text-[#1e96fc] rounded-[10px] py-1 px-3 cursor-pointer flex items-center justify-center ${
              page < data?.data?.result?.page ? "" : "opacity-45"
            }`}
            onClick={() => {
              if (page < data?.data?.result?.page) {
                const nextPage = page + 1;
                setPage(nextPage);
              }
            }}
          >
            Load more
          </div>
        </div>
      </div>
    </div>
  );
};
