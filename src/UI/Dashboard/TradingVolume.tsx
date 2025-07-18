import { useEffect, useState } from "react";
import { nimbus } from "../../lib/network";
import { useQuery } from "@tanstack/react-query";
import { TailSpin } from "react-loader-spinner";
import { EChartsOption } from "echarts";
import dayjs from "dayjs";
import ReactECharts from "echarts-for-react";
import { formatValue } from "../../utils";
import { useTheme } from "../../contexts/ThemeProvider";
import { AnimatePresence, motion } from "framer-motion";

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
  const { theme } = useTheme();
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
        color:
          theme === "system"
            ? window.matchMedia("(prefers-color-scheme: dark)").matches
              ? "#fff"
              : "#000"
            : theme === "dark"
              ? "#fff"
              : "#000",
      },
    },
    yAxis: {
      type: "value",
      name: "",
      nameTextStyle: {
        color:
          theme === "system"
            ? window.matchMedia("(prefers-color-scheme: dark)").matches
              ? "#fff"
              : "#000"
            : theme === "dark"
              ? "#fff"
              : "#000",
      },
      nameLocation: "middle",
      nameGap: 60,
      axisLabel: {
        formatter: (value: number) => `$${value.toFixed(2)}`,
        color:
          theme === "system"
            ? window.matchMedia("(prefers-color-scheme: dark)").matches
              ? "#fff"
              : "#000"
            : theme === "dark"
              ? "#fff"
              : "#000",
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

  useEffect(() => {
    setChartOptions({
      ...chartOptions,
      xAxis: {
        ...chartOptions.xAxis,
        axisLabel: {
          color:
            theme === "system"
              ? window.matchMedia("(prefers-color-scheme: dark)").matches
                ? "#fff"
                : "#000"
              : theme === "dark"
                ? "#fff"
                : "#000",
        },
      },
      yAxis: {
        ...chartOptions.yAxis,
        nameTextStyle: {
          color:
            theme === "system"
              ? window.matchMedia("(prefers-color-scheme: dark)").matches
                ? "#fff"
                : "#000"
              : theme === "dark"
                ? "#fff"
                : "#000",
        },
        axisLabel: {
          formatter: (value: number) => `$${value.toFixed(2)}`,
          color:
            theme === "system"
              ? window.matchMedia("(prefers-color-scheme: dark)").matches
                ? "#fff"
                : "#000"
              : theme === "dark"
                ? "#fff"
                : "#000",
        },
      },
    });
  }, [theme]);

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
    }
  }, [data]);

  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-3 justify-between items-start md:gap-4 md:flex-row md:items-center">
        <div className="text-xl font-medium">Trading Volume with Ref</div>
        <div className="flex items-center">
          <AnimatePresence mode="wait">
            {listTimeRange.map(
              (item: { label: string; value: string }, index: number) => {
                return (
                  <motion.div
                    key={index}
                    layout
                    className={`relative cursor-pointer py-1.5 text-sm rounded-[20px] w-[70px] flex items-center justify-center font-medium ${isError ? "opacity-45" : ""}`}
                    onClick={() => {
                      if (!isLoading && !isError) {
                        if (selectedTimeRange === item.value) {
                          return;
                        }
                        setSelectedTimeRange(item.value);
                      }
                    }}
                  >
                    <div
                      className={`relative z-20 ${selectedTimeRange === item.value ? "text-white" : ""}`}
                    >
                      {item.label}
                    </div>

                    {selectedTimeRange === item.value && (
                      <motion.div
                        layoutId="active-pill"
                        transition={{
                          type: "spring",
                          duration: 0.6,
                        }}
                        className="absolute z-10 inset-0 rounded-full bg-[#1e96fc]"
                      />
                    )}
                  </motion.div>
                );
              },
            )}
          </AnimatePresence>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-[450px] px-3 py-3">
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
        <div className="flex justify-center items-center h-full">
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
