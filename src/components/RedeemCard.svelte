<script lang="ts">
  import { isDarkMode } from "~/store";
  import { triggerToast } from "~/utils/functions";

  export let isRedeem = false;
  export let redeemData;
  export let handleRedeem = (value: any) => {};
  export let isLoadingRedeem;

  import Button from "~/components/Button.svelte";
  import Copy from "~/components/Copy.svelte";

  import Diamond from "~/assets/Diamond.png";
  import Crown from "~/assets/crown.svg";

  let selectedData: any;
</script>

<div
  class={`py-4 max-w-[438px] w-full min-h-[280px] rounded-[16px] border border_0000000d flex flex-col justify-between gap-4 mx-auto ${
    $isDarkMode ? "bg-[#212121]" : "bg-white"
  }`}
>
  <div
    class="px-[16px] flex md:flex-row flex-col items-center h-full gap-[27px]"
  >
    <div
      class={`md:w-[135px] w-full rounded-2xl p-2 flex items-center h-full justify-center ${
        $isDarkMode ? "" : "bg-white"
      }`}
    >
      <div class="w-20 h-20">
        <img
          src={redeemData?.logo}
          alt=""
          class="w-full h-full object-contain block"
        />
      </div>
    </div>

    <div class="flex-1 flex flex-col md:items-start items-center gap-2">
      <div class="flex items-center gap-2">
        <img src={Crown} alt="" class="w-[26px] h-[26px] block" />
        <div class="text-[#FFB800] text-lg font-medium uppercase">Premium</div>
      </div>
      <div class="text-3xl font-normal md:text-left text-center">
        {redeemData?.title}
      </div>
      <div class="text-sm font-normal md:text-left text-center">
        {redeemData?.description}
      </div>
    </div>
  </div>

  <div class="flex flex-col gap-5 pb-1">
    <div class="relative border-b-2 border-dashed">
      <div
        class={`w-4 h-10 rounded-l-none rounded-full absolute -left-[1px] -bottom-5 border-r border-t border-b border_0000000d ${
          $isDarkMode ? "bg-[#161616]" : "bg-[#fff]"
        }`}
      />
      <div
        class={`w-4 h-10 rounded-r-none rounded-full absolute -right-[1px] -bottom-5 border-l border-t border-b border_0000000d ${
          $isDarkMode ? "bg-[#161616]" : "bg-[#fff]"
        } `}
      />
    </div>

    <div class="px-[16px]">
      {#if isRedeem}
        <div
          class="flex items-center md:justify-start justify-between gap-[40px]"
        >
          <div class="w-[220px] text-base font-normal text-center">
            {#if redeemData?.remains === 0}
              Out of stock
            {:else}
              {redeemData?.remains} left
            {/if}
          </div>

          {#if redeemData?.remains === 0}
            <div class="relative w-full">
              <Button
                variant="tertiary"
                on:click={() => {
                  triggerToast("There are not available now", "fail");
                }}
              >
                <div class="flex items-center gap-1">
                  <img src={Diamond} alt="" class="w-[28px] h-[28px] block" />
                  <div class="text-white sm:text-lg text-smxs font-medium">
                    {redeemData?.cost}
                  </div>
                </div>
                <div class="text-white text-smxs">Redeem</div>
              </Button>
            </div>
          {:else}
            <Button
              on:click={() => {
                if (!isLoadingRedeem) {
                  handleRedeem(redeemData);
                  selectedData = redeemData;
                }
              }}
              variant={`${isLoadingRedeem && selectedData?.campaignName === redeemData?.campaignName ? "disabled" : "tertiary"}`}
              disabled={isLoadingRedeem &&
                selectedData?.campaignName === redeemData?.campaignName}
            >
              <div class="flex items-center gap-1">
                <img src={Diamond} alt="" class="w-[28px] h-[28px] block" />
                <div class="text-white sm:text-lg text-smxs font-medium">
                  {redeemData?.cost}
                </div>
              </div>
              <div class="text-white text-smxs">Redeem</div>
            </Button>
          {/if}
        </div>
      {:else}
        <div
          class="flex items-center justify-between p-[12px] bg-[#EEEEEE] rounded-[12px]"
        >
          <div class="text-[#131313] text-sm">Your gift code</div>
          {#if redeemData?.code}
            <Copy
              address={redeemData?.code || "N/A"}
              iconColor="#000"
              iconSize={20}
              color="#000"
              isShorten
            />
          {:else}
            <div class="text-black">N/A</div>
          {/if}
        </div>
      {/if}
    </div>
  </div>
</div>

<style>
  @media (max-width: 320) {
    .text-smxs {
      font-size: 14px;
      line-height: 20px;
    }

    .gap-320-sx {
      grid-gap: 10px !important;
      gap: 10px !important;
    }
  }
</style>
