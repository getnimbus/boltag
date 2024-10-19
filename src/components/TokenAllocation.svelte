<script lang="ts">
  import { onMount } from "svelte";
  import { nimbus } from "~/lib/network";
  import {
    formatCurrency,
    handleFormatDataPieChart,
    handleFormatDataTable,
    handleFormatDataTableBundle,
    formatPercent,
    formatValue,
  } from "~/utils/index";
  import { typeList } from "~/utils/constants";
  import { flatten, groupBy } from "lodash";
  import {
    wallet,
    chain,
    isDarkMode,
    typeWallet,
    selectedBundle,
  } from "~/store";

  export let handleSelectedTableTokenHolding = (
    data: any,
    selectDataPieChart: any,
  ) => {};
  export let holdingTokenData;
  export let dataPieChartToken;
  export let listOptionTypeCategory;
  export let selectedOption;
  export let id;
  export let isComparePage = false;

  import Select from "~/components/Select.svelte";
  import EChart from "~/components/EChart.svelte";
  import defaultToken from "~/assets/defaultToken.png";

  let optionPie: any = {
    title: {
      text: "",
    },
    tooltip: {
      trigger: "item",
      extraCssText: "z-index: 9997",
      formatter: function (params: any) {
        return `
            <div style="display: flex; flex-direction: column; gap: 12px; min-width: 220px;">
              <div style="display: flex; align-items: centers; gap: 4px">
                <img src=${params?.data?.logo || defaultToken}
                onerror="this.onerror=null;this.src='${defaultToken}';"
                alt="" width=20 height=20 style="border-radius: 100%" />
                <div style="font-weight: 500; font-size: 16px; line-height: 19px; color: ${
                  $isDarkMode ? "white" : "black"
                }">
                  ${params?.name} ${
                    params?.data?.symbol ? `(${params?.data?.symbol})` : ""
                  }
                </div>
              </div>

              ${
                params?.data?.name_balance.length !== 0
                  ? `
                <div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); color: ${
                  $isDarkMode ? "white" : "black"
                }">
                  <div style="grid-template-columns: repeat(1, minmax(0, 1fr)); font-weight: 500; font-size: 14px; line-height: 17px;">
                    Balance
                  </div>
                  <div style="grid-template-columns: repeat(1, minmax(0, 1fr)); font-weight: 500; font-size: 14px; line-height: 17px;">
                    ${formatCurrency(params?.data?.value_balance)}
                  </div>
                </div>
              `
                  : ""
              }

              <div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); color: ${
                $isDarkMode ? "white" : "black"
              }">
                <div style="grid-template-columns: repeat(1, minmax(0, 1fr)); font-weight: 500; font-size: 14px; line-height: 17px;">
                  Value
                </div>
                <div style="grid-template-columns: repeat(1, minmax(0, 1fr)); font-weight: 500; font-size: 14px; line-height: 17px;">
                  ${formatValue(params?.data?.value_value)}
                </div>
              </div>
              
              <div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); color: ${
                $isDarkMode ? "white" : "black"
              }">
                <div style="grid-template-columns: repeat(1, minmax(0, 1fr)); font-weight: 500; font-size: 14px; line-height: 17px;">
                  Ratio
                </div>
                <div style="grid-template-columns: repeat(1, minmax(0, 1fr)); font-weight: 500; font-size: 14px; line-height: 17px;">
                  ${formatPercent(params?.value)}%
                </div>
              </div>
            </div>`;
      },
    },
    legend: {
      type: "scroll",
      top: "0%",
      left: "center",
    },
    series: [
      {
        type: "pie",
        radius: ["40%", "60%"],
        left: 0,
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: "center",
        },
        emphasis: {
          label: {
            show: false,
            fontSize: 40,
            fontWeight: "bold",
          },
        },
        labelLine: {
          show: false,
        },
        data: [],
      },
    ],
  };

  $: typeListCategory =
    $typeWallet === "BUNDLE" && !isComparePage
      ? [
          {
            label: "All",
            value: "All",
          },
          {
            label: "Account",
            value: "Account",
          },
          {
            label: "Chain",
            value: "Chain",
          },
          ...typeList,
        ]
      : [
          {
            label: "All",
            value: "All",
          },
          {
            label: "Chain",
            value: "Chain",
          },
          ...typeList,
        ];

  let dataPersonalizeTag: any = [];
  let selectedType = {
    label: "All",
    value: "All",
  };

  let tokenDataCustomCategory: any = [];
  let tokenDataHolding = {
    value: "",
    dataPie: [],
    dataTable: {
      data: {
        name: "All",
        data: [],
      },
      select: [],
    },
  };
  let tokenDataRank: any = {
    value: "",
    dataPie: [],
    dataTable: {
      data: [],
      select: [],
    },
  };
  let tokenDataCategory: any = {
    value: "",
    dataPie: [],
    dataTable: {
      data: [],
      select: [],
    },
  };
  let tokenDataSector: any = {
    value: "",
    dataPie: [],
    dataTable: {
      data: [],
      select: [],
    },
  };
  let tokenDataChain: any = {
    value: "",
    dataPie: [],
    dataTable: {
      data: [],
      select: [],
    },
  };
  let dataAccounts: any = {
    value: "",
    dataPie: [],
    dataTable: {
      data: {
        name: "All",
        data: [],
      },
      select: [],
    },
  };

  const formatDataOverviewBundlePieChart = (data: any) => {
    const dataTable = handleFormatDataTableBundle(
      holdingTokenData || [],
      $selectedBundle?.accounts || [],
    );

    const formatDataTable = dataTable?.data?.map((item: any) => {
      return {
        ...item,
        networth: (item?.data || []).reduce(
          (prev: any, item: any) => prev + Number(item.value),
          0,
        ),
      };
    });

    const totalNetworth = (formatDataTable || []).reduce(
      (prev: any, item: any) => prev + Number(item.networth),
      0,
    );

    const dataOverviewBundlePieChart = formatDataTable
      ?.map((item: any) => {
        const selectedAccount = $selectedBundle?.accounts?.find(
          (data: any) =>
            data?.value?.toLowerCase() === item?.name?.toLowerCase(),
        );

        return {
          logo: selectedAccount?.logo,
          label: selectedAccount?.label,
          type: selectedAccount?.type,
          value: item?.networth || 0,
        };
      })
      ?.map((item: any) => {
        return {
          logo: item?.logo,
          name: item?.label,
          name_balance: "",
          name_ratio: "Ratio",
          name_value: "Value",
          symbol: item?.type,
          value: (Number(item?.value || 0) / Number(totalNetworth || 0)) * 100,
          value_balance: 0,
          value_value: Number(item?.value || 0),
        };
      })
      ?.sort((a: any, b: any) => {
        if (a.value_value < b.value_value) {
          return 1;
        }
        if (a.value_value > b.value_value) {
          return -1;
        }
        return 0;
      });

    dataAccounts = {
      value: "Account",
      dataPie: dataOverviewBundlePieChart,
      dataTable,
    };
  };

  $: {
    if (holdingTokenData && $typeWallet === "BUNDLE") {
      formatDataOverviewBundlePieChart(holdingTokenData);
    }
  }

  const formatDataPie = (data: any) => {
    return data?.map((item: any) => {
      if (isNaN(item.value)) {
        return {
          ...item,
          value: 0,
        };
      } else {
        return item;
      }
    });
  };

  const getPersonalizeTag = async () => {
    try {
      const response: any = await nimbus.get(
        `/address/${$wallet}/personalize/tag`,
      );
      if (response && response.data) {
        const categoriesData = Object.getOwnPropertyNames(response.data);
        const categoriesDataList = categoriesData?.map((item) => {
          return {
            category: item,
            dataTag: groupBy(response.data[item], "tag"),
          };
        });
        const formatDataCategory = categoriesDataList?.map((item) => {
          return {
            category: item.category,
            dataTag: Object.getOwnPropertyNames(item.dataTag)?.map((tag) => {
              return {
                name: tag,
                tokens: item.dataTag[tag],
              };
            }),
          };
        });

        dataPersonalizeTag = formatDataCategory;
      }
    } catch (e) {
      console.error("e: ", e);
    }
  };

  onMount(() => {
    if (selectedOption && Object.keys(selectedOption).length !== 0) {
      selectedType = selectedOption;
    } else {
      selectedType = {
        label: "All",
        value: "All",
      };
    }
  });

  $: {
    if (selectedOption && Object.keys(selectedOption).length !== 0) {
      selectedType = selectedOption;
    }
  }

  $: {
    if (dataPersonalizeTag && holdingTokenData && dataPieChartToken) {
      const listCategory = dataPersonalizeTag?.map((item: any) => {
        return {
          label: item.category,
          value: item.category,
        };
      });

      const tokenDataEachCategory = dataPersonalizeTag?.map((item: any) => {
        return {
          category: item.category,
          dataTokens: flatten(
            item.dataTag
              ?.filter((item: any) => item.name !== "Other")
              ?.map((item: any) => item.tokens),
          ),
        };
      });

      const formatTokenDataEachCategory = tokenDataEachCategory?.map(
        (item: any) => {
          const formatDataTokens = holdingTokenData?.map(
            (tokenHolding: any) => {
              const isSelected = item.dataTokens.some(
                (selectedToken: any) =>
                  selectedToken.contractAddress ===
                  tokenHolding.contractAddress,
              );

              const selected = item.dataTokens.filter(
                (selectedToken: any) =>
                  selectedToken.contractAddress ===
                  tokenHolding.contractAddress,
              );

              return {
                ...tokenHolding,
                [item.category]: isSelected ? selected[0].tag : "Other",
              };
            },
          );

          return {
            category: item.category,
            dataTokens: formatDataTokens,
          };
        },
      );

      tokenDataCustomCategory = formatTokenDataEachCategory?.map(
        (item: any) => {
          return {
            value: item.category,
            dataPie: handleFormatDataPieChart(item.dataTokens, item.category),
            dataTable: handleFormatDataTable(item.dataTokens, item.category),
          };
        },
      );

      tokenDataHolding = {
        value: "All",
        dataPie:
          dataPieChartToken.sumOrderBreakdownToken > 0
            ? dataPieChartToken.formatDataPieChartTopFiveToken?.concat(
                dataPieChartToken.dataPieChartOrderBreakdownToken,
              )
            : dataPieChartToken.formatDataPieChartTopFiveToken,
        dataTable: {
          data: {
            name: "All",
            data: holdingTokenData,
          },
          select: [],
        },
      };

      tokenDataChain = {
        value: "Chain",
        dataPie: handleFormatDataPieChart(holdingTokenData, "chain"),
        dataTable: handleFormatDataTable(holdingTokenData, "chain"),
      };

      tokenDataRank = {
        value: "rank",
        dataPie: handleFormatDataPieChart(holdingTokenData, "rank"),
        dataTable: handleFormatDataTable(holdingTokenData, "rank"),
      };

      tokenDataCategory = {
        value: "category",
        dataPie: handleFormatDataPieChart(holdingTokenData, "category"),
        dataTable: handleFormatDataTable(holdingTokenData, "category"),
      };

      tokenDataSector = {
        value: "sector",
        dataPie: handleFormatDataPieChart(holdingTokenData, "sector"),
        dataTable: handleFormatDataTable(holdingTokenData, "sector"),
      };

      if (listCategory.length !== 0) {
        typeListCategory = [...typeListCategory, ...listCategory].reduce(
          (unique, o) => {
            if (
              !unique.some(
                (obj: any) => obj.label === o.label && obj.value === o.value,
              )
            ) {
              unique.push(o);
            }
            return unique;
          },
          [],
        );
      }
    }
  }

  $: {
    if ($wallet || $chain) {
      if ($wallet?.length !== 0 && $chain?.length !== 0) {
        typeListCategory =
          $typeWallet === "BUNDLE" && !isComparePage
            ? [
                {
                  label: "All",
                  value: "All",
                },
                {
                  label: "Account",
                  value: "Account",
                },
                {
                  label: "Chain",
                  value: "Chain",
                },
                ...typeList,
              ]
            : [
                {
                  label: "All",
                  value: "All",
                },
                {
                  label: "Chain",
                  value: "Chain",
                },
                ...typeList,
              ];

        dataPersonalizeTag = [];
        selectedType = {
          label: "",
          value: "",
        };
        tokenDataCustomCategory = [];
        tokenDataHolding = {
          value: "",
          dataPie: [],
          dataTable: {
            data: {
              name: "",
              data: [],
            },
            select: [],
          },
        };
        tokenDataRank = {
          value: "",
          dataPie: [],
          dataTable: {
            data: [],
            select: [],
          },
        };
        tokenDataCategory = {
          value: "",
          dataPie: [],
          dataTable: {
            data: [],
            select: [],
          },
        };
        tokenDataSector = {
          value: "",
          dataPie: [],
          dataTable: {
            data: [],
            select: [],
          },
        };
        getPersonalizeTag();
      }
    }
  }

  $: {
    if (selectedType) {
      if (selectedType.value === "sector") {
        optionPie = {
          ...optionPie,
          series: [
            {
              ...optionPie.series[0],
              data: formatDataPie(
                tokenDataSector.dataPie?.map((item: any) => {
                  return {
                    ...item,
                    value_balance: 0,
                    name_balance: "",
                  };
                }),
              ),
            },
          ],
        };
        handleSelectedTableTokenHolding(tokenDataSector.dataTable, optionPie);
      } else if (selectedType.value === "rank") {
        optionPie = {
          ...optionPie,
          series: [
            {
              ...optionPie.series[0],
              data: formatDataPie(
                tokenDataRank.dataPie?.map((item: any) => {
                  return {
                    ...item,
                    value_balance: 0,
                    name_balance: "",
                  };
                }),
              ),
            },
          ],
        };
        handleSelectedTableTokenHolding(tokenDataRank.dataTable, optionPie);
      } else if (selectedType.value === "category") {
        optionPie = {
          ...optionPie,
          series: [
            {
              ...optionPie.series[0],
              data: formatDataPie(
                tokenDataCategory.dataPie?.map((item: any) => {
                  return {
                    ...item,
                    value_balance: 0,
                    name_balance: "",
                  };
                }),
              ),
            },
          ],
        };
        handleSelectedTableTokenHolding(tokenDataCategory.dataTable, optionPie);
      } else if (selectedType.value === "All") {
        optionPie = {
          ...optionPie,
          legend: {
            ...optionPie.legend,
            formatter: function (name: any) {
              const selected: any = tokenDataHolding.dataPie.find(
                (item: any) => item.name.toLowerCase() === name.toLowerCase(),
              );
              return selected?.symbol || name;
            },
          },
          series: [
            {
              ...optionPie.series[0],
              data: formatDataPie(tokenDataHolding.dataPie),
            },
          ],
        };
        handleSelectedTableTokenHolding(tokenDataHolding.dataTable, optionPie);
      } else if (selectedType.value === "Account") {
        optionPie = {
          ...optionPie,
          series: [
            {
              ...optionPie.series[0],
              data: formatDataPie(dataAccounts.dataPie),
            },
          ],
        };
        handleSelectedTableTokenHolding(dataAccounts.dataTable, optionPie);
      } else if (selectedType.value === "Chain") {
        optionPie = {
          ...optionPie,
          series: [
            {
              ...optionPie.series[0],
              data: formatDataPie(
                tokenDataChain.dataPie?.map((item: any) => {
                  return {
                    ...item,
                    value_balance: 0,
                    name_balance: "",
                  };
                }),
              ),
            },
          ],
        };
        handleSelectedTableTokenHolding(tokenDataChain.dataTable, optionPie);
      } else {
        const indexOfType = tokenDataCustomCategory
          ?.map((item: any) => item.value)
          ?.indexOf(selectedType.value);

        const selectedData = tokenDataCustomCategory[indexOfType];

        if (selectedData !== undefined) {
          optionPie = {
            ...optionPie,
            series: [
              {
                ...optionPie.series[0],
                data: formatDataPie(
                  selectedData.dataPie?.map((item: any) => {
                    return {
                      ...item,
                      value_balance: 0,
                      name_balance: "",
                    };
                  }),
                ),
              },
            ],
          };
          handleSelectedTableTokenHolding(selectedData.dataTable, optionPie);
        }
      }
    }
  }

  $: theme = $isDarkMode ? "dark" : "white";
</script>

<div class="w-full">
  {#if listOptionTypeCategory && listOptionTypeCategory.length === 0}
    {#if $typeWallet !== "BTC" && $typeWallet === "BUNDLE"}
      <div class="flex md:justify-end justify-start">
        <div class="md:block hidden">
          <Select
            type="lang"
            positionSelectList="right-0"
            listSelect={listOptionTypeCategory &&
            listOptionTypeCategory.length !== 0
              ? listOptionTypeCategory
              : typeListCategory}
            bind:selected={selectedType}
            isDisabledSelectWallet={false}
            indexWalletDisabled={-1}
          />
        </div>
        <div class="md:hidden block">
          <Select
            type="lang"
            positionSelectList="left-0"
            listSelect={listOptionTypeCategory &&
            listOptionTypeCategory.length !== 0
              ? listOptionTypeCategory
              : typeListCategory}
            bind:selected={selectedType}
            isDisabledSelectWallet={false}
            indexWalletDisabled={-1}
          />
        </div>
      </div>
    {/if}
  {/if}
  <div class="xl:block hidden mt-15">
    <EChart
      id={id + "desktop"}
      {theme}
      notMerge={true}
      option={optionPie}
      height={465}
    />
  </div>
  <div class="xl:hidden block mt-15">
    <EChart
      id={id + "mobile"}
      {theme}
      notMerge={true}
      option={optionPie}
      height={265}
    />
  </div>
</div>

<style></style>
