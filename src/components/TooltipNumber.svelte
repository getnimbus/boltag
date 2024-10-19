<script lang="ts">
  import {
    formatBigBalance,
    formatPercent,
    formatCurrency,
    formatValue,
  } from "~/utils/index";
  import numeral from "numeral";
  import tooltip from "~/lib/tooltip";
  import { isHidePortfolio } from "~/store";

  export let number;
  export let type: "amount" | "balance" | "percent" | "value" = "value";
  export let personalValue: boolean = false;
  export let isTooltip = true;

  let numberFormat: any = 0;
  let numberSize: any = "";

  $: {
    const { number_format, number_size } = formatBigBalance(number);
    numberFormat = number_format;
    numberSize = number_size;
  }

  const convertMiniumNumber = (number: any) => {
    if (number.toString().includes("e-")) {
      const numStr = number.toString();
      const eIndex = numStr.indexOf("e");
      if (eIndex !== -1) {
        const exponent = parseInt(numStr.slice(eIndex + 2), 10);
        const significand = parseFloat(
          numStr
            .slice(0, 4)
            .split("")
            .filter((e) => e != ".")
            .join(""),
        );

        return `0.0<sub>${exponent - 1}</sub>${significand}`;
      }
    } else {
      return number;
    }
  };

  const removeTrailingZeros = (value: string) => {
    const [integerPart, decimalPart] = value.split(".");
    if (decimalPart) {
      // If there's a decimal part, ensure it has at least 2 digits
      const formattedDecimal = decimalPart
        .padEnd(2, "0")
        .replace(/0+$/, "")
        .padEnd(2, "0");
      return `${integerPart}.${formattedDecimal}`;
    }
    // If there's no decimal part, add .00
    return `${integerPart}.00`;
  };
</script>

{#if personalValue && $isHidePortfolio}
  <span class="w-max">*******</span>
{:else if type === "percent"}
  <span class="w-max">
    {formatPercent(number) === "NaN" ? 0 : formatPercent(number)}
  </span>
{:else}
  <span class="w-max">
    {#if (numberSize && numberSize !== "K") || formatPercent(number) === "NaN"}
      {#if isTooltip}
        <span
          use:tooltip={{
            content: `<tooltip-detail text="${removeTrailingZeros(formatCurrency(number))}" />`,
            allowHTML: true,
            placement: "top",
          }}
          class="flex items-center"
        >
          <span>
            {#if type === "value"}${/if}{#if numeral(numberFormat).format("0,0.00") === "NaN"}
              {@html convertMiniumNumber(numberFormat)}
            {:else}
              {numeral(numberFormat).format("0,0.00")}
            {/if}
          </span>
          <span>
            {numberSize}
          </span>
        </span>
      {:else}
        <span class="flex items-center">
          <span>
            {#if type === "value"}${/if}{#if numeral(numberFormat).format("0,0.00") === "NaN"}
              {@html convertMiniumNumber(numberFormat)}
            {:else}
              {numeral(numberFormat).format("0,0.00")}
            {/if}
          </span>
          <span>
            {numberSize}
          </span>
        </span>
      {/if}
    {:else}
      <span>
        {#if type === "value"}
          <span>
            {#if number !== 0 && number > 0 && number < 0.01}
              {#if isTooltip}
                <span
                  use:tooltip={{
                    content: `<tooltip-detail text="${removeTrailingZeros(
                      formatCurrency(number),
                    )}" />`,
                    allowHTML: true,
                    placement: "top",
                  }}
                >
                  {removeTrailingZeros(formatValue(number))}
                </span>
              {:else}
                <span>
                  {removeTrailingZeros(formatValue(number))}
                </span>
              {/if}
            {:else}
              {removeTrailingZeros(formatValue(number))}
            {/if}
          </span>
        {:else}
          {removeTrailingZeros(formatCurrency(number))}
        {/if}
      </span>
    {/if}
  </span>
{/if}

<style>
</style>
