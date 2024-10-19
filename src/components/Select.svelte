<script lang="ts">
  import { isNimbusVersion } from "~/utils/constants";
  import {
    wallet,
    chain,
    totalTokens,
    totalNfts,
    totalAirdrops,
    totalPositions,
    unrealizedProfit,
    realizedProfit,
    pastProfit,
    isDarkMode,
  } from "~/store";
  import { triggerClickOutside } from "~/utils/functions";

  import All from "~/assets/all.svg";

  export let isWhitePage = false;
  export let listSelect;
  export let selected: any;
  export let type: "whales-chain" | "chain" | "wallet" | "lang" | "filter";
  export let positionSelectList = "left-0";
  export let disabled = false;
  export let isDisabledSelectWallet;
  export let indexWalletDisabled;

  const disabledChains: any = [];

  let open = false;

  $: {
    if (listSelect && type === "lang") {
      selected = listSelect[0];
    }
    if (listSelect && type === "filter") {
      selected = listSelect[1];
    }
  }

  $: selectedChain =
    (["whales-chain", "chain"].includes(type) &&
      listSelect &&
      selected &&
      listSelect.filter((item: any) => item.value === selected)) ||
    [];
</script>

<div
  class="wrapper"
  use:triggerClickOutside
  on:click_outside={() => (open = false)}
>
  <div
    class={`button group ${
      ["lang", "filter"].includes(type) ? "bg-[#1E96FC]" : ""
    } ${isNimbusVersion ? "" : "button-whitelabel"}`}
    class:active={open}
    on:click={() => {
      if (!disabled) {
        open = !open;
      }
    }}
  >
    <div
      class={`flex items-center gap-2 ${isWhitePage ? ($isDarkMode ? "text-white" : "text-black group-hover:text-white") : "text-white"}`}
    >
      {#if ["whales-chain", "chain", "lang", "filter"].includes(type)}
        {#if selected?.logo || selectedChain[0]?.logo}
          <img
            src={selected?.value === "ALL" || selectedChain[0]?.value === "ALL"
              ? All
              : selected?.logo || selectedChain[0]?.logo}
            alt=""
            class="xl:w-5 xl:h-5 w-7 h-7 rounded-full block"
          />
        {/if}
        <div class="text-sm">
          {selected?.label || selectedChain[0]?.label}
        </div>
      {:else}
        <div class="text-sm">
          Other ({listSelect.length})
        </div>
      {/if}
    </div>

    <div class="transform rotate-180 w-3 h-3 block" class:rotate-0={open}>
      {#if isWhitePage}
        {#if $isDarkMode}
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10 8.36365L6 4.00001L2 8.36365"
              stroke="white"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        {:else}
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10 8.36365L6 4.00001L2 8.36365"
              stroke="black group-hover:white"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        {/if}
      {:else}
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10 8.36365L6 4.00001L2 8.36365"
            stroke="white"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      {/if}
    </div>
  </div>

  {#if open}
    <div
      class={`select_content content group xl:max-h-[300px] xl:w-[200px] xl:min-w-[200px] xl:max-h-[310px] max-h-[380px] md:w-[300px] md:min-w-[300px] w-[240px] min-w-[240px] mt-2 ${positionSelectList}`}
    >
      {#each listSelect as item, index}
        <div
          class={`content_item ${isDisabledSelectWallet && index > indexWalletDisabled ? "opacity-50" : "opacity-100"}`}
          class:active={!["lang", "filter"].includes(type)
            ? item.value === selected
            : item.value === selected?.value}
          id={item.value}
          on:click={() => {
            if (type === "wallet" && $wallet !== item.value) {
              if (isDisabledSelectWallet && index > indexWalletDisabled) {
                return;
              } else {
                wallet.update((n) => (n = item.value));
                chain.update((n) => (n = "ALL"));
                selected = item.value;
                open = false;
                totalTokens.update((n) => (n = 0));
                totalAirdrops.update((n) => (n = 0));
                totalNfts.update((n) => (n = 0));
                totalPositions.update((n) => (n = 0));
                unrealizedProfit.update((n) => (n = 0));
                realizedProfit.update((n) => (n = 0));
                pastProfit.update((n) => (n = 0));
              }
            }
            if (type === "chain" && $chain !== item.value) {
              chain.update((n) => (n = item.value));
              selected = item.value;
              open = false;
            }
            if (type === "whales-chain" && selected !== item.value) {
              selected = item.value;
              open = false;
            }
            if (["lang", "filter"].includes(type)) {
              selected = item;
              open = false;
            }
          }}
        >
          {#if item.logo}
            <img
              src={item.value === "ALL" ? All : item.logo}
              alt=""
              class="w-5 h-5 rounded-full block"
            />
          {/if}
          <div
            class={`text-sm name ${
              type === "chain" && disabledChains.includes(item.value)
                ? "text-gray-400"
                : ""
            }`}
          >
            {item.label}
            {#if type === "chain" && disabledChains.includes(item.value)}
              (Soon)
            {/if}
            {#if type === "chain" && item.value === "MANTA"}
              (Testnet)
            {/if}
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .wrapper {
    position: relative;
    width: max-content;
  }

  .button {
    width: max-content;
    border-radius: 1000px;
    padding: 8px 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  :global(body) .button.active {
    background: #20295b;
  }
  :global(body.dark) .button.active {
    background: #cdcdcd59;
  }

  :global(body) .button:hover {
    background: #525b8c;
  }
  :global(body.dark) .button:hover {
    background: #cdcdcd59;
  }

  :global(body) .button-whitelabel.active {
    background: #3bda32;
  }
  :global(body.dark) .button-whitelabel.active {
    background: #cdcdcd59;
  }

  :global(body) .button-whitelabel:hover {
    background: #3bda32;
  }
  :global(body.dark) .button-whitelabel:hover {
    background: #cdcdcd59;
  }

  .content {
    overflow-y: overlay;
    position: absolute;
    z-index: 8;
    box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.15);
    border-radius: 10px;
    padding: 8px;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .content::-webkit-scrollbar {
    display: none;
  }

  .content_item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 14px;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .content_item.active > .name {
    color: #1e96fc;
  }

  .content_item .name {
    font-weight: 500;
    transition: all 0.3s ease;
  }

  :global(body) .select_content {
    background: #ffffff;
    border: 0.5px solid transparent;
  }
  :global(body.dark) .select_content {
    background: #131313;
    border: 0.5px solid #cdcdcd59;
  }

  :global(body) .select_content .content_item.active {
    background: #eff0f4;
  }
  :global(body.dark) .select_content .content_item.active {
    background: #343434;
  }

  :global(body) .select_content .content_item:hover {
    background: #eff0f4;
  }
  :global(body.dark) .select_content .content_item:hover {
    background: #222222;
  }
</style>
