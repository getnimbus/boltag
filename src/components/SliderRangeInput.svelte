<script lang="ts">
  import numeral from "numeral";
  import tooltip from "~/lib/tooltip";

  import TooltipNumber from "./TooltipNumber.svelte";

  export let currentPrice;
  export let lowerPrice;
  export let upperPrice;
  export let isFullRange;

  let sliderValue = 0;

  $: {
    if (Number(currentPrice) > Number(upperPrice)) {
      sliderValue = 120;
    } else if (Number(currentPrice) < Number(lowerPrice)) {
      sliderValue = -20;
    } else if (
      Number(currentPrice) >= Number(lowerPrice) &&
      Number(currentPrice) <= Number(upperPrice)
    ) {
      const range = Number(upperPrice) - Number(lowerPrice);

      const normalizedCurrentPrice =
        (Number(currentPrice) - Number(lowerPrice)) / range;

      if (
        (upperPrice.toString().includes("e-") ||
          upperPrice.toString().includes("e+")) &&
        (lowerPrice.toString().includes("e-") ||
          lowerPrice.toString().includes("e+"))
      ) {
        const formatPercentValue = normalizedCurrentPrice
          .toString()
          .slice(0, normalizedCurrentPrice.toString().indexOf("e"));

        sliderValue = Number(formatPercentValue) * 10;
      } else {
        const condition = (Number(currentPrice) / Number(upperPrice)) * 100;
        if (condition > 0 && condition < 97) {
          sliderValue = normalizedCurrentPrice * 100 + 3;
        } else {
          sliderValue = normalizedCurrentPrice * 100;
        }
      }
    }
  }

  const convertMiniumNumber = (number: any) => {
    if (number.toString().includes("e-")) {
      const numStr = number.toString();
      const eIndex = numStr.indexOf("e");
      if (eIndex !== -1) {
        const significand = parseFloat(
          numStr
            .slice(0, 4)
            .split("")
            .filter((e) => e != ".")
            .join(""),
        );

        return `0.0...0${significand}`;
      }
    } else {
      return number;
    }
  };
</script>

{#if isFullRange}
  <div class="w-[90%] h-1 relative bg-[#1e96fc] rounded-lg appearance-none">
    <div
      class="absolute top-[50%] left-[0%] -translate-y-1/2 w-2 h-2 rounded-full bg-[#1e96fc] z-1"
    >
      <div
        class="absolute bottom-3 left-1/2 transform -translate-x-1/2 text-xs z-1"
      >
        0
      </div>
    </div>

    <div
      class="absolute top-[50%] -translate-y-1/2 -translate-x-1/2 w-1 h-3 bg-yellow-300 z-1"
      style={`left: ${50}%;`}
      use:tooltip={{
        content: `<tooltip-detail text="Current: ${currentPrice.toString().includes("e+") ? currentPrice : currentPrice < 1 ? convertMiniumNumber(parseFloat(currentPrice)) : numeral(currentPrice).format("0,0.0000")}" />`,
        allowHTML: true,
        placement: "top",
        interactive: true,
      }}
    ></div>

    <div
      class="absolute top-[50%] right-[0%] -translate-y-1/2 w-2 h-2 rounded-full bg-[#1e96fc] z-1"
    >
      <div
        class="absolute bottom-3 left-1/2 transform -translate-x-1/2 text-xs z-1 flex"
      >
        ∞
      </div>
    </div>
  </div>
{:else}
  <div class="w-[90%] h-1 relative bg-gray-200 rounded-lg appearance-none">
    <div
      class="absolute top-[50%] -translate-y-1/2 h-1 left-1/2 transform -translate-x-1/2 w-[70%] bg-[#1e96fc]"
    >
      <div
        class="absolute top-[50%] left-[0%] -translate-y-1/2 w-2 h-2 rounded-full bg-[#1e96fc] z-1"
        use:tooltip={{
          content: `<tooltip-detail text="${lowerPrice.toString().includes("e+") ? lowerPrice : lowerPrice < 1 ? convertMiniumNumber(parseFloat(lowerPrice)) : numeral(lowerPrice).format("0,0.0000")}" />`,
          allowHTML: true,
          placement: "top",
          interactive: true,
        }}
      >
        <div
          class="absolute bottom-3 left-1/2 transform -translate-x-1/2 text-xs z-1"
        >
          {#if lowerPrice < 0.01}
            <TooltipNumber
              type="amount"
              number={lowerPrice}
              isTooltip={false}
            />
          {:else}
            {numeral(lowerPrice).format("0,0.0000")}
          {/if}
        </div>
      </div>

      <div
        class="absolute top-[50%] -translate-y-1/2 -translate-x-1/2 w-1 h-3 bg-yellow-300 z-1"
        style={`left: ${sliderValue}%;`}
        use:tooltip={{
          content: `<tooltip-detail text="Current: ${currentPrice.toString().includes("e+") ? currentPrice : currentPrice < 1 ? convertMiniumNumber(parseFloat(currentPrice)) : numeral(currentPrice).format("0,0.0000")}" />`,
          allowHTML: true,
          placement: "top",
          interactive: true,
        }}
      ></div>

      <div
        class="absolute top-[50%] right-[0%] -translate-y-1/2 w-2 h-2 rounded-full bg-[#1e96fc] z-1"
        use:tooltip={{
          content: `<tooltip-detail text="${upperPrice.toString().includes("e+") ? upperPrice : upperPrice < 1 ? convertMiniumNumber(parseFloat(upperPrice)) : numeral(upperPrice).format("0,0.0000")}" />`,
          allowHTML: true,
          placement: "top",
          interactive: true,
        }}
      >
        <div
          class="absolute bottom-3 left-1/2 transform -translate-x-1/2 text-xs z-1 flex"
        >
          {#if upperPrice > 10000}
            <TooltipNumber
              number={upperPrice}
              isTooltip={false}
              type="amount"
            />
          {:else}
            {numeral(upperPrice).format("0,0.0000")}
          {/if}
        </div>
      </div>
    </div>
  </div>
{/if}

<style></style>
