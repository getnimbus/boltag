import { useContext, useEffect, useState } from "react";
import { nimbus } from "../../lib/network";
import { useQuery } from "@tanstack/react-query";
import { TailSpin } from "react-loader-spinner";
import { EChartsOption } from "echarts";
import dayjs from "dayjs";
import ReactECharts from "echarts-for-react";
import { formatValue } from "../../utils";
import { GlobalStateContext } from "../../providers/ContextProvider";

const listTimeRange = [
  {
    label: "Day",
    value: "day",
  },
  {
    label: "Week",
    value: "week",
  },
  {
    label: "Month",
    value: "month",
  },
];

const getTradingVolume = async (address: string, timeRange: string) => {
  const response = await nimbus
    .get(`/swap/${address}/trading-volume-ref?timeRange=${timeRange}`)
    .then((res: any) => res?.data);
  return response;
};

export const TradingVolume = ({
  userAddress,
  token,
}: {
  userAddress: string;
  token: string;
}) => {
  const { handleSetTotalTradeVol } = useContext(GlobalStateContext);
  const [selectedTimeRange, setSelectedTimeRange] = useState<string>("day");
  const [chartOptions, setChartOptions] = useState<EChartsOption>({
    tooltip: {
      trigger: "axis",
      padding: 0,
      borderRadius: 12,
      backgroundColor: "#fff",
      borderWidth: 0,

      formatter: (params: any) => {
        if (Array.isArray(params) && params.length > 0) {
          const date = dayjs(params[0].axisValue).format("YYYY-MM-DD");
          return `
            <div style="display: flex; flex-direction: column; gap: 12px; min-width: 220px; background: #fff; border: 1px solid #fdcf29; padding: 12px; border-radius: 12px; color: #000;">
              <div style="font-weight: 500; font-size: 16px; line-height: 19px;">
                ${date}
              </div>

              <div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr));">
                <div style="grid-template-columns: repeat(1, minmax(0, 1fr)); display: flex; align-items: centers; gap: 4px; font-weight: 500;">
                  Trade Volume
                </div>
                <div style="grid-template-columns: repeat(1, minmax(0, 1fr)); text-align: right;">
                  ${params[0].value[1] < 0 ? "-" : ""}$${formatValue(
                    Math.abs(params[0].value[1]),
                  )}
                </div>
              </div>
            </div>
          `;
        }

        return "";
      },
    },
    animationDuration: 2000,
    legend: {
      show: false,
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    xAxis: {
      type: "time",
      boundaryGap: ["3%", "3%"],
      axisLabel: {
        color: "#000",
      },
    },
    yAxis: {
      type: "value",
      name: "",
      nameTextStyle: {
        color: "#000",
      },
      nameLocation: "middle",
      nameGap: 60,
      axisLabel: {
        formatter: (value: number) => `$${value.toFixed(2)}`,
        color: "#000",
      },
      splitLine: {
        show: true,
      },
    },
    series: [
      {
        type: "bar",
        emphasis: {
          focus: "series",
          itemStyle: {
            borderWidth: 2,
            shadowColor: "rgba(0, 0, 0, 0.5)",
            shadowBlur: 10,
          },
        },
        itemStyle: {
          color: "#fdcf29",
        },
        data: [],
      },
    ],
  });

  // query user profile
  const { isLoading, isError, data } = useQuery({
    queryKey: ["trading-volume", userAddress, selectedTimeRange, token],
    queryFn: () => getTradingVolume(userAddress, selectedTimeRange),
    enabled: Boolean(userAddress.length !== 0),
  });

  useEffect(() => {
    if (data && data?.length !== 0) {
      setChartOptions({
        ...chartOptions,
        series: [
          {
            ...((chartOptions as any)?.series[0] || {}),
            data:
              (data || [])?.map((item: any) => [item.date, item.trade_vol]) ||
              [],
          },
        ],
      });

      const totalVolume = data.reduce((total: number, item: any) => {
        return total + Number(item?.trade_vol || 0);
      }, 0);

      handleSetTotalTradeVol(totalVolume);
    }
  }, [data]);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col items-start justify-between gap-3 md:gap-4 md:flex-row md:items-center">
        <div className="text-xl font-medium">Trading Volume with Ref</div>
        <div className="flex items-center">
          {listTimeRange.map((item: any, index: number) => {
            return (
              <div
                key={index}
                className={`cursor-pointer py-1 text-sm rounded-[20px] w-[70px] flex items-center justify-center font-medium ${isError ? "opacity-45" : ""} ${selectedTimeRange === item.value ? "bg-[#1e96fc] text-white" : ""}`}
                onClick={() => {
                  if (!isLoading && !isError) {
                    if (selectedTimeRange === item.value) {
                      return;
                    }
                    setSelectedTimeRange(item.value);
                  }
                }}
              >
                {item.label}
              </div>
            );
          })}
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-[300px] px-3 py-3">
          <TailSpin
            visible={true}
            height="40"
            width="40"
            color="#1e96fc"
            ariaLabel="tail-spin-loading"
            radius="1"
            wrapperStyle={{}}
            wrapperClass=""
          />
        </div>
      ) : (
        <div className="flex items-center justify-center h-full px-3 pb-12">
          <ReactECharts
            option={chartOptions}
            notMerge={true}
            style={{ width: "100%", height: "400px" }}
            showLoading={false}
            loadingOption={{
              text: "Loading data...",
              color: "#1e96fc",
              textColor: "#000",
              maskColor: "#fff",
              zlevel: 0,
            }}
          />
        </div>
      )}
    </div>
  );
};
