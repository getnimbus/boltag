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

export const RecentTransaction = ({
  userAddress,
  token,
}: {
  userAddress: string;
  token: string;
}) => {
  const [page, setPage] = useState<number>(1);
  const [dataRecentTrx, setDataRecentTrx] = useState<any[]>([]);

  // query recent trx
  const { isLoading, isError, data } = useQuery<any>({
    queryKey: ["recent-tx", userAddress, page, token],
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
      setDataRecentTrx((prev) => [
        ...prev,
        ...(data?.data?.result?.data || []),
      ]);
    }
  }, [data]);

  return (
    <div className="flex flex-col gap-4">
      <div className="text-xl font-medium">Recent Transactions with Ref</div>
      <div className="flex flex-col gap-4">
        <div className="xl:block hidden w-full overflow-hidden rounded-[10px] border border-[#0000000d] dark:border-[#cdcdcd26] bg-[#fff] dark:bg-[#131313]">
          <table className="relative w-full h-full table-auto">
            <thead>
              <tr className="bg-[#f4f5f8] dark:bg-[#222222]">
                <th className="pl-3 py-3 rounded-tl-[10px]">
                  <div className="text-xs font-medium text-left uppercase">
                    Tx Hash
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
              {(isError || token.length === 0) && !isLoading ? (
                <tr>
                  <td colSpan={3}>
                    <div className="flex justify-center items-center px-3 py-4 h-full text-base text-gray-400">
                      Empty
                    </div>
                  </td>
                </tr>
              ) : (
                <>
                  {dataRecentTrx?.map((item: any, index: number) => {
                    return (
                      <tr key={index} className="transition-all group">
                        <td className="py-3 pl-3 bg-[#fff] dark:bg-[#131313] group-hover:dark:bg-black/30 group-hover:bg-gray-100">
                          <a
                            href={`https://suiscan.xyz/mainnet/tx/${item.txHash}`}
                            className="text-sm underline cursor-pointer transition-all hover:text-[#1e96fc] hover:dark:text-[#1e96fc] text-[#00000099] dark:text-gray-400"
                          >
                            {item.txHash}
                          </a>
                        </td>

                        <td className="py-3 bg-[#fff] dark:bg-[#131313] group-hover:bg-gray-100 group-hover:dark:bg-black/30">
                          <div className="text-sm text-[#00000099] dark:text-gray-400">
                            {item.aggregator ? (
                              <div className="flex gap-2 items-center">
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

                        <td className="py-3 pr-3 bg-[#fff] dark:bg-[#131313] group-hover:bg-gray-100 group-hover:dark:bg-black/30">
                          <div className="flex justify-end text-sm text-[#00000099] dark:text-gray-400">
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
                    <div className="flex justify-center items-center px-3 py-3 h-full">
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

        <div className="xl:hidden block p-2 w-full overflow-hidden rounded-[10px] border border-[#0000000d] dark:border-[#cdcdcd26] bg-white dark:bg-[#131313]">
          {isError && !isLoading ? (
            <div className="flex justify-center items-center px-3 py-4 h-full text-base text-gray-400">
              Empty
            </div>
          ) : (
            <>
              {dataRecentTrx?.map((item: any, index: number) => {
                return (
                  <div
                    key={index}
                    className="flex flex-col gap-4 border-b-[1px] border-[#0000000d] dark:border-[#cdcdcd26] last:border-none py-4"
                  >
                    <div className="flex justify-between items-start">
                      <div className="text-sm font-medium text-right uppercase">
                        Tx Hash
                      </div>
                      <div className="w-max text-sm">
                        <a
                          href={`https://suiscan.xyz/mainnet/tx/${item.txHash}`}
                          className="text-sm underline cursor-pointer transition-all hover:text-[#1e96fc] hover:dark:text-[#1e96fc] text-[#00000099] dark:text-gray-400"
                        >
                          {shorterAddress(item.txHash)}
                        </a>
                      </div>
                    </div>

                    <div className="flex justify-between items-start">
                      <div className="text-sm text-right uppercase">
                        Aggregator
                      </div>
                      <div className="text-sm w-max text-[#00000099] dark:text-gray-400">
                        {item.aggregator ? (
                          <div className="flex gap-2 items-center">
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

                    <div className="flex justify-between items-start">
                      <div className="text-sm font-medium text-right uppercase">
                        Trade Volume
                      </div>
                      <div className="text-sm w-max text-[#00000099] dark:text-gray-400">
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
                <div className="flex justify-center items-center px-3 py-3 h-full">
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

        <div className="flex justify-center items-center">
          <div
            className={`w-[120px] border border-[#1e96fc] text-[#1e96fc] rounded-[10px] py-2 px-3 cursor-pointer flex items-center justify-center text-sm ${
              page < data?.data?.result?.page ? "" : "opacity-45"
            }`}
            onClick={() => {
              if (isLoading) {
                return;
              }
              if (page < data?.data?.result?.page) {
                const nextPage = page + 1;
                setPage(nextPage);
              }
            }}
          >
            {isLoading ? "Loading..." : "Load more"}
          </div>
        </div>
      </div>
    </div>
  );
};
