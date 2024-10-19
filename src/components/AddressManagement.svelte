<script lang="ts">
  import { onMount } from "svelte";
  import * as browser from "webextension-polyfill";
  import {
    tab,
    wallet,
    chain,
    typeWallet,
    user,
    selectedPackage,
    isDarkMode,
    selectedBundle,
    userPublicAddress,
    triggerModalAddAddress,
    totalTokens,
    totalNfts,
    totalAirdrops,
    totalPositions,
    unrealizedProfit,
    realizedProfit,
    pastProfit,
    showPopoverSearch,
    tonConnector,
    isTWA,
  } from "~/store";
  import dayjs from "dayjs";
  import "dayjs/locale/en";
  import "dayjs/locale/vi";
  import relativeTime from "dayjs/plugin/relativeTime";
  dayjs.extend(relativeTime);
  import { triggerToast, triggerClickOutside } from "~/utils/functions";
  import { wait } from "~/utils/index";
  import {
    chainList,
    chainMoveList,
    listProviderCEX,
    listLogoCEX,
    detectedGeneration,
    generationLogo,
    bigGeneration,
    otherGeneration,
  } from "~/lib/chains";
  import mixpanel from "mixpanel-browser";
  import { AnimateSharedLayout, Motion } from "svelte-motion";
  import CopyToClipboard from "svelte-copy-to-clipboard";
  import { API_URL, nimbus } from "~/lib/network";
  import { Avatar } from "flowbite-svelte";
  // import Vezgo from "vezgo-sdk-js/dist/vezgo.es5.js";
  import { createQuery, useQueryClient } from "@tanstack/svelte-query";
  import { getListAddress, handleValidateAddress } from "~/lib/queryAPI";
  import { useNavigate } from "svelte-navigator";
  import tooltip from "~/lib/tooltip";
  import { t } from "~/lib/i18n";
  import { isNimbusVersion } from "~/utils/constants";

  export let type = "portfolio";
  export let title;

  import Tooltip from "~/components/Tooltip.svelte";
  import LoadingPremium from "~/components/LoadingPremium.svelte";
  import Loading from "~/components/Loading.svelte";
  import Button from "~/components/Button.svelte";
  import Select from "~/components/Select.svelte";
  import AppOverlay from "~/components/Overlay.svelte";
  import Copy from "~/components/Copy.svelte";
  import HiddenValue from "../UI/HiddenValue/HiddenValue.svelte";
  import Hero from "../UI/Hero/Hero.svelte";
  import NomisPointCheck from "~/UI/NomisPointCheck/NomisPointCheck.svelte";
  import TmaTonAuth from "~/UI/Auth/TMATonAuth.svelte";

  import Bell from "~/assets/bell.svg";
  import Logo from "~/assets/logo-2.png";
  import LogoWhite from "~/assets/logo-white.svg";
  import Plus from "~/assets/plus.svg";
  import PlusBlack from "~/assets/plus-black.svg";
  import FollowWhale from "~/assets/whale-tracking.gif";
  import Success from "~/assets/shield-done.svg";

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleScroll = () => {
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainer;
    isScrollStart = scrollLeft === 0;
    isScrollEnd = scrollLeft + clientWidth >= scrollWidth - 1;
  };

  let isHoverBell = false;

  $: shakeAnimation = isHoverBell
    ? {
        x: [0, -2, 2, -2, 2, 0],
        transition: {
          duration: 0.8,
          repeat: Infinity,
          repeatType: "loop",
        },
      }
    : {};

  let showFollowTooltip = false;
  let showCommandTooltip = false;
  let showDisableAddWallet = false;
  let showDisabledSelectWallet = false;
  let listAddress: any = [];
  let address = "";
  let label = "";
  let errors: any = {};
  let isLoadingAddDEX = false;
  let isOpenFollowWhaleModal = false;
  let isOpenModal = false;
  let isLoadingSendMail = false;
  let email = "";
  let scrollContainer: any;
  let isScrollStart = true;
  let isScrollEnd = false;
  let container;
  let isLoadingConnectCEX = false;

  let isDisabled = false;
  let tooltipDisableAddBtn = "";
  let showPopover = false;

  let groupedToBundles = true;
  let selectYourWalletsBundle: any = [];

  let indexSelectedAddress = 0;

  let searchAddressParams = "";

  const isRequiredFieldValid = (value: any) => {
    return value !== null && value !== "";
  };

  const validateForm = async (data: any) => {
    const isDuplicatedAddress = listAddress.some((item: any) => {
      return item.value.toLowerCase() === data.address.toLowerCase();
    });

    if (!isRequiredFieldValid(data.address)) {
      errors["address"] = {
        ...errors["address"],
        required: true,
        msg: "Account is required",
      };
    } else {
      const addressValidate = await handleValidateAddress(data.address);

      if (data.address && addressValidate.address === "") {
        errors["address"] = {
          ...errors["address"],
          required: true,
          msg: "Please enter your account again!",
        };
        return;
      } else if (isDuplicatedAddress) {
        errors["address"] = {
          ...errors["address"],
          required: true,
          msg: "This account is duplicated!",
        };
        return;
      } else {
        errors["address"] = { ...errors["address"], required: false };
      }
    }

    if (!isRequiredFieldValid(data.label)) {
      errors["label"] = {
        ...errors["label"],
        required: true,
        msg: "Label is required",
      };
    } else {
      errors["label"] = { ...errors["label"], required: false };
    }
  };

  $: query = createQuery({
    queryKey: ["list-address"],
    queryFn: () => getListAddress(),
    retry: false,
    enabled: $user && Object.keys($user).length !== 0,
  });

  $: {
    if (
      !$query.isError &&
      $query.data !== undefined &&
      $query.data.length !== 0
    ) {
      formatDataListAddress($query.data);
    }
  }

  $: queryValidate = createQuery({
    queryKey: ["validate", searchAddressParams],
    queryFn: () => handleValidateAddress(searchAddressParams),
    retry: false,
    enabled: Boolean(searchAddressParams && searchAddressParams?.length !== 0),
  });

  $: {
    if ($queryValidate && $queryValidate?.data) {
      wallet.update((n) => (n = $queryValidate?.data?.address));
      typeWallet.update((n) => (n = $queryValidate?.data?.type));
    }
  }

  const initialUpdateStateFromParams = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const addressParams = urlParams.get("address");
    const chainParams = urlParams.get("chain");
    const typeParams = urlParams.get("type");
    const tabParams = urlParams.get("tab");

    // reset all global state if list address is empty
    if (!chainParams && listAddress.length === 0) {
      chain.update((n) => (n = ""));
    }
    if (!addressParams && listAddress.length === 0) {
      wallet.update((n) => (n = ""));
    }
    if (!typeParams && listAddress.length === 0) {
      typeWallet.update((n) => (n = ""));
    }

    if (tabParams) {
      tab.update((n) => (n = tabParams));
    }

    // update global chain state
    if (chainParams) {
      chain.update((n) => (n = chainParams));
    }

    // update global address state
    if (addressParams) {
      searchAddressParams = addressParams;
    }

    // check type address and handle logic update global state
    if (typeParams === "CEX") {
      chain.update((n) => (n = "ALL"));
      window.history.replaceState(
        null,
        "",
        window.location.pathname +
          `?tab=${$tab}&type=${$typeWallet}&address=${$wallet}`,
      );
    }

    // if list address is empty and no chain params and have address param
    if (
      !chainParams &&
      listAddress.length === 0 &&
      addressParams &&
      typeParams
    ) {
      chain.update((n) => (n = "ALL"));

      if (otherGeneration.includes(typeParams)) {
        window.history.replaceState(
          null,
          "",
          window.location.pathname +
            `?tab=${$tab}&type=${$typeWallet}&address=${$wallet}`,
        );
      }

      if (bigGeneration.includes(typeParams)) {
        window.history.replaceState(
          null,
          "",
          window.location.pathname +
            `?tab=${$tab}&type=${$typeWallet}&chain=${$chain}&address=${$wallet}`,
        );
      }
    }

    // if no chain params and list address is not empty
    if (!chainParams && listAddress.length !== 0 && typeParams) {
      if (bigGeneration.includes(typeParams)) {
        chain.update((n) => (n = "ALL"));
      }
      if (otherGeneration.includes(typeParams)) {
        window.history.replaceState(
          null,
          "",
          window.location.pathname +
            `?tab=${$tab}&type=${$typeWallet}&address=${$wallet}`,
        );
      }
    }
  };

  const handleUpdateParams = () => {
    const selected = listAddress.find((item) => {
      return item.value === $wallet;
    });

    if (selected && Object.keys(selected).length !== 0) {
      if (otherGeneration?.concat(["CEX", "BUNDLE"])?.includes(selected.type)) {
        typeWallet.update((n) => (n = selected.type));
        browser.storage.sync.set({ typeWalletAddress: selected.type });
        chain.update((n) => (n = "ALL"));
        window.history.replaceState(
          null,
          "",
          window.location.pathname +
            `?tab=${$tab}&type=${$typeWallet}&address=${$wallet}`,
        );
      }

      if (bigGeneration.includes(selected.type)) {
        typeWallet.update((n) => (n = selected.type));
        browser.storage.sync.set({ typeWalletAddress: selected.type });
        if ($chain) {
          chain.update((n) => (n = $chain));
        } else {
          chain.update((n) => (n = "ALL"));
        }
        window.history.replaceState(
          null,
          "",
          window.location.pathname +
            `?tab=${$tab}&type=${$typeWallet}&chain=${$chain}&address=${$wallet}`,
        );
      }
    } else {
      window.history.replaceState(
        null,
        "",
        window.location.pathname +
          `?tab=${$tab}&type=${$typeWallet}&chain=${$chain}&address=${$wallet}`,
      );
    }
  };

  const formatDataListAddress = async (data: any) => {
    const structWalletData = data?.map((item: any) => {
      return {
        id: item.id,
        type: item.type,
        label: item.label,
        value: item.type === "CEX" ? item.id : item.accountId,
        logo: item.type === "CEX" ? item.logo : detectedGeneration(item.type),
        accounts:
          item?.accounts?.map((account: any) => {
            return {
              id: account?.id,
              type: account?.type,
              label: account?.label,
              value: account?.type === "CEX" ? account?.id : account?.accountId,
              logo:
                account?.type === "CEX"
                  ? account?.logo
                  : detectedGeneration(account?.type),
            };
          }) || [],
      };
    });

    listAddress = structWalletData?.sort((a, b) => {
      if (a.type === "BUNDLE" && a.label === "Your wallets") return -1;
      if (b.type === "BUNDLE" && b.label === "Your wallets") return 1;
      return 0;
    });

    const selectYourBundle = listAddress.find(
      (item: any) => item.type === "BUNDLE" && item.label === "Your wallets",
    );
    selectYourWalletsBundle = selectYourBundle?.accounts.map(
      (item: any) => item.value,
    );

    if (selectYourBundle === undefined) {
      await nimbus.post("/address/personalize/bundle", {
        name: "Your wallets",
        addresses: listAddress?.map((item: any) => item.value),
      });
      queryClient.invalidateQueries(["list-bundle"]);
    }

    // check type wallet
    const selectedTypeWalletRes =
      await browser.storage.sync.get("typeWalletAddress");
    if (
      selectedTypeWalletRes?.typeWalletAddress !== null &&
      selectedTypeWalletRes?.typeWalletAddress !== "undefined"
    ) {
      typeWallet.update((n) => (n = selectedTypeWalletRes.typeWalletAddress));
    } else {
      typeWallet.update((n) => (n = listAddress[0]?.type));
    }

    // check chain wallet
    const selectedChainRes = await browser.storage.sync.get("selectedChain");
    if (
      selectedChainRes?.selectedChain !== null &&
      selectedChainRes?.selectedChain !== "undefined"
    ) {
      chain.update((n) => (n = selectedChainRes.selectedChain));
    } else {
      chain.update((n) => (n = "ALL"));
    }

    // check wallet
    const selectedWalletRes = await browser.storage.sync.get("selectedWallet");
    if (
      selectedWalletRes?.selectedWallet !== null &&
      selectedWalletRes?.selectedWallet !== "undefined"
    ) {
      wallet.update((n) => (n = selectedWalletRes.selectedWallet));
    } else {
      wallet.update(
        (n) =>
          (n =
            listAddress.find((item: any) => item.label === "Your wallets")
              ?.value || listAddress[0]?.value),
      );
    }

    initialUpdateStateFromParams();
  };

  // Add DEX address account
  const onSubmit = async (e: any) => {
    isLoadingAddDEX = true;
    try {
      const formData = new FormData(e.target);

      const data: any = {};
      for (let field of formData) {
        const [key, value] = field;
        data[key] = value;
      }

      await validateForm(data);

      if (
        !Object.keys(errors).some((inputName) => errors[inputName]["required"])
      ) {
        const dataFormat = {
          id: data.address,
          label: data.label,
          value: data.address,
        };

        const validateAccount = await handleValidateAddress(dataFormat.value);

        if (groupedToBundles || listAddress.length === 0) {
          await nimbus.put(
            `/address/personalize/bundle?name=${"Your wallets"}`,
            {
              name: "Your wallets",
              addresses: selectYourWalletsBundle?.concat([
                validateAccount?.address,
              ]),
            },
          );
          queryClient.invalidateQueries(["list-bundle"]);
        }

        const response: any = await nimbus.post("/accounts", {
          type: "DEX",
          publicAddress: validateAccount?.address,
          accountId: validateAccount?.address,
          label: dataFormat.label,
        });

        if (response?.error) {
          triggerToast("Can't add new wallet address at this time!", "fail");
          isLoadingAddDEX = false;
          return;
        }

        queryClient.invalidateQueries(["list-address"]);
        wallet.update((n) => (n = validateAccount?.address));
        chain.update((n) => (n = "ALL"));
        typeWallet.update((n) => (n = validateAccount?.type));

        browser.storage.sync.set({ selectedChain: "ALL" });
        browser.storage.sync.set({
          typeWalletAddress: validateAccount?.type,
        });
        browser.storage.sync.set({
          selectedWallet: validateAccount?.address,
        });

        if (bigGeneration.includes(validateAccount?.type)) {
          window.history.replaceState(
            null,
            "",
            window.location.pathname +
              `?tab=${$tab}&type=${validateAccount?.type}&chain=ALL&address=${validateAccount?.address}`,
          );
        }

        if (otherGeneration.includes(validateAccount?.type)) {
          window.history.replaceState(
            null,
            "",
            window.location.pathname +
              `?tab=${$tab}&type=${validateAccount?.type}&address=${validateAccount?.address}`,
          );
        }

        address = "";
        label = "";
        e.target.reset();
        errors = {};
        triggerModalAddAddress.update((n) => (n = false));
        isLoadingAddDEX = false;

        triggerToast("Successfully add On-Chain account!", "success");

        mixpanel.track("user_add_address");

        errors["address"] = {
          ...errors["address"],
          required: false,
          msg: "",
        };
        errors["label"] = { ...errors["label"], required: false, msg: "" };
      } else {
        console.error("Invalid Form");
        isLoadingAddDEX = false;
      }
    } catch (e) {
      console.error(e);
      isLoadingAddDEX = false;
      triggerToast(
        "Something wrong when add DEX account. Please try again!",
        "fail",
      );
    }
  };

  // Add CEX address account
  // const onSubmitCEX = () => {
  //   const token = localStorage.getItem("token");
  //   if (token) {
  //     isLoadingConnectCEX = true;
  //     const vezgo: any = Vezgo.init({
  //       clientId: "6st9c6s816su37qe8ld1d5iiq2",
  //       authEndpoint: `${API_URL}/auth/vezgo`,
  //       auth: {
  //         headers: {
  //           Authorization: `${
  //            token
  //           }`,
  //         },
  //       },
  //     });
  //     const userVezgo = vezgo.login();
  //     if (userVezgo) {
  //       userVezgo
  //         .connect({
  //           providers: listProviderCEX,
  //         })
  //         .onConnection(async function (account) {
  //           await nimbus.get("/accounts/sync");

  //           queryClient.invalidateQueries(["list-address"]);

  //           await wait(1000);

  //           if (listAddress[listAddress.length - 1]?.type === "CEX") {
  //             chain.update((n) => (n = "ALL"));
  //             wallet.update(
  //               (n) => (n = listAddress[listAddress.length - 1]?.id)
  //             );
  //             typeWallet.update((n) => (n = "CEX"));

  //             await nimbus.put(
  //               `/address/personalize/bundle?name=${"Your wallets"}`,
  //               {
  //                 name: "Your wallets",
  //                 addresses: selectYourWalletsBundle?.concat([
  //                   listAddress[listAddress.length - 1]?.id,
  //                 ]),
  //               }
  //             );
  //             queryClient.invalidateQueries(["list-bundle"]);
  //           }

  //           await wait(300);

  //           queryClient.invalidateQueries(["list-address"]);

  //           isLoadingConnectCEX = false;
  //           triggerModalAddAddress.update((n) => (n = false));

  //           triggerToast("Successfully add CEX account!", "success");

  //           mixpanel.track("user_add_address");
  //         })
  //         .onError(function (error) {
  //           console.error("connection vezgo error", error);
  //           queryClient.invalidateQueries(["list-address"]);
  //           isLoadingConnectCEX = false;
  //           triggerModalAddAddress.update((n) => (n = false));

  //           triggerToast(
  //             "Something wrong when add CEX account. Please try again!",
  //             "fail"
  //           );
  //         });
  //     }
  //   }
  // };

  onMount(() => {
    initialUpdateStateFromParams();
  });

  $: {
    if ($wallet || $chain) {
      if ($wallet?.length !== 0 && $chain?.length !== 0) {
        browser.storage.sync.set({ selectedWallet: $wallet });
        browser.storage.sync.set({ selectedChain: $chain });
        handleUpdateParams();
      }
    }
  }

  $: {
    if (
      address &&
      errors.address &&
      errors.address.msg === "Account is required"
    ) {
      errors["address"] = { ...errors["address"], required: false, msg: "" };
    }
    if (label && errors.label && errors.label.msg === "Label is required") {
      errors["label"] = { ...errors["label"], required: false, msg: "" };
    }
  }

  let isDisabledSelectWallet = false;
  let indexWalletDisabled = -1;

  $: listAddressWithoutBundle = listAddress.filter(
    (item: any) => item.type !== "BUNDLE",
  );

  $: listBundle = listAddress.filter((item: any) => item.type === "BUNDLE");

  $: {
    if ($selectedPackage === "FREE" && listAddressWithoutBundle?.length > 3) {
      isDisabled = true;
    } else if (
      $selectedPackage === "EXPLORER" &&
      listAddressWithoutBundle?.length > 7
    ) {
      isDisabled = true;
    } else {
      isDisabled = false;
    }
  }

  $: {
    if (isDisabled) {
      const listAddressOutsideSelect = listAddress
        .slice(0, 5)
        .filter((item: any) => item.type !== "BUNDLE");

      if ($selectedPackage === "FREE") {
        tooltipDisableAddBtn =
          "You've reached the maximum number of accounts. Upgrade to the EXPLORER Plan to add more";

        if (listAddressOutsideSelect.length === 3) {
          isDisabledSelectWallet = true;
        }
        if (listAddressOutsideSelect.length < 3) {
          isDisabledSelectWallet = true;
          switch (listAddressOutsideSelect.length) {
            case 0:
              indexWalletDisabled = 2;
              break;
            case 1:
              indexWalletDisabled = 1;
              break;
            case 2:
              indexWalletDisabled = 0;
              break;
          }
        }
      }
      if ($selectedPackage === "EXPLORER") {
        tooltipDisableAddBtn =
          "You've reached the maximum number of accounts. Upgrade to the ALPHA Plan to add more";

        if (listAddressWithoutBundle?.length > 7) {
          isDisabledSelectWallet = true;
          switch (listAddressOutsideSelect.length) {
            case 3:
              indexWalletDisabled = 3;
              break;
            case 2:
              indexWalletDisabled = 4;
              break;
            case 1:
              indexWalletDisabled = 5;
              break;
            case 0:
              indexWalletDisabled = 6;
              break;
          }
        }
      }
    } else {
      isDisabledSelectWallet = false;
      indexWalletDisabled = -1;
    }
  }

  $: {
    if ($user && Object.keys($user).length === 0) {
      tooltipDisableAddBtn = "Connect wallet to add account";
      listAddress = [];
    }
  }

  $: {
    if ($wallet) {
      const selectedDataBundle =
        listAddress.find((item: any) => item.value === $wallet) || {};
      if (Object.keys(selectedDataBundle).length !== 0) {
        selectedBundle.update((n) => (n = selectedDataBundle));
      } else {
        selectedBundle.update((n) => (n = {}));
        handleGetListAddressFromBundle();
      }
    }
  }

  const handleGetListAddressFromBundle = async () => {
    try {
      const res: any = await nimbus.get(`/accounts/bundles/${$wallet}`);
      if (res && res?.data?.length !== 0) {
        const formatData = await Promise.all(
          res?.data?.map(async (item: any) => {
            const addressValidate = await handleValidateAddress(item.address);
            return {
              type: addressValidate?.type,
              label: item.owner,
              value: item.address,
              logo: detectedGeneration(addressValidate?.type),
            };
          }),
        );
        selectedBundle.update(
          (n: any) =>
            (n = {
              type: "BUNDLE",
              accounts: formatData,
              id: $wallet,
              label: $wallet,
              logo: detectedGeneration("BUNDLE"),
              value: $wallet,
            }),
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  $: {
    if ($wallet) {
      const selectedAddress = listAddress
        .sort((a: any, b: any) => {
          if (a.type === "BUNDLE" && a.label === "Your wallets") return -1;
          if (b.type === "BUNDLE" && b.label === "Your wallets") return 1;
          return 0;
        })
        .find(
          (item: any) => item.value.toLowerCase() === $wallet.toLowerCase(),
        );
      indexSelectedAddress = listAddress.indexOf(selectedAddress);
    }
  }

  const handleSelectNextAddress = () => {
    if (indexSelectedAddress < listAddress.length - 1) {
      indexSelectedAddress = indexSelectedAddress + 1;

      const selectAddress = listAddress.sort((a: any, b: any) => {
        if (a.type === "BUNDLE" && a.label === "Your wallets") return -1;
        if (b.type === "BUNDLE" && b.label === "Your wallets") return 1;
        return 0;
      })[indexSelectedAddress];

      wallet.update((n) => (n = selectAddress.value));
      browser.storage.sync.set({ selectedWallet: $wallet });
      browser.storage.sync.set({ selectedChain: $chain });
      handleUpdateParams();
    }
  };

  const handleSelectPrevAddress = () => {
    if (indexSelectedAddress > 0) {
      indexSelectedAddress = indexSelectedAddress - 1;

      const selectAddress = listAddress.sort((a: any, b: any) => {
        if (a.type === "BUNDLE" && a.label === "Your wallets") return -1;
        if (b.type === "BUNDLE" && b.label === "Your wallets") return 1;
        return 0;
      })[indexSelectedAddress];

      wallet.update((n) => (n = selectAddress.value));
      browser.storage.sync.set({ selectedWallet: $wallet });
      browser.storage.sync.set({ selectedChain: $chain });
      handleUpdateParams();
    }
  };

  const closeMobileAddAccountModal = () => {
    triggerModalAddAddress.update((n) => (n = false));
  };
</script>

{#if $query.isFetching}
  <div class="flex items-center justify-center h-screen">
    {#if isNimbusVersion}
      <LoadingPremium />
    {:else}
      <Loading />
    {/if}
  </div>
{:else}
  <div class="xl:min-h-screen">
    {#if $wallet?.length === 0}
      <div class="flex justify-center items-center h-screen">
        {#if $query.isError && Object.keys($user).length !== 0}
          <div
            class="flex flex-col items-center justify-center w-[70%] gap-4 p-6"
          >
            <div class="text-lg">
              {$query.error}
            </div>
          </div>
        {:else}
          <div class="max-w-[1600px] m-auto md:w-[90%] w-full xl:py-0 py-12">
            <Hero />
          </div>
        {/if}
      </div>
    {:else}
      <div
        class={`${isNimbusVersion ? "header-container" : "whitelabel-header-container"}`}
      >
        <div class="capa">
          <div
            class="flex flex-col max-w-[1600px] m-auto xl:w-[82%] w-[90%] h-full pb-[144px] pt-[24px]"
          >
            <div class="flex flex-col mb-5 xl:gap-14 gap-7">
              <div
                class="flex lg:flex-row flex-col lg:items-center items-start justify-between md:gap-6 gap-0"
              >
                <!-- desktop list address wallet -->
                <div class="hidden xl:block">
                  {#if listAddress && listAddress?.length !== 0}
                    <div class="flex items-center gap-5">
                      {#if listAddress.length > 5}
                        <AnimateSharedLayout>
                          {#each listAddress?.slice(0, 5) as item, index}
                            <div
                              id={item.value}
                              class={`relative text-base text-white py-1 px-2 flex items-center rounded-[100px] gap-2 cursor-pointer transition-all hover:underline ${($selectedPackage === "FREE" ? index > 2 + listBundle.length : index > 6 + listBundle.length) ? "opacity-50" : "opacity-100"}`}
                              class:hover:no-underline={item.value === $wallet}
                              on:click={() => {
                                if (
                                  $selectedPackage === "FREE"
                                    ? index > 2 + listBundle.length
                                    : index > 6 + listBundle.length
                                ) {
                                  return;
                                }
                                if ($wallet !== item.value) {
                                  wallet.update((n) => (n = item.value));
                                  chain.update((n) => (n = "ALL"));
                                  totalTokens.update((n) => (n = 0));
                                  totalAirdrops.update((n) => (n = 0));
                                  totalNfts.update((n) => (n = 0));
                                  totalPositions.update((n) => (n = 0));
                                  unrealizedProfit.update((n) => (n = 0));
                                  realizedProfit.update((n) => (n = 0));
                                  pastProfit.update((n) => (n = 0));
                                }
                              }}
                            >
                              <img
                                src={item.logo}
                                alt=""
                                class={`w-5 h-5 xl:w-4 xl:h-4 block ${
                                  item.type !== "BUNDLE" ? "rounded-full" : ""
                                }`}
                              />
                              {item.label}
                              {#if item.value === $wallet}
                                <Motion
                                  let:motion
                                  layoutId="active-pill"
                                  transition={{
                                    type: "spring",
                                    duration: 0.6,
                                  }}
                                >
                                  <div
                                    class="absolute inset-0 rounded-full bg-[#ffffff1c]"
                                    use:motion
                                  />
                                </Motion>
                              {/if}
                            </div>
                          {/each}
                        </AnimateSharedLayout>

                        <div class="relative">
                          <div
                            class="relative z-2"
                            on:mouseenter={() => {
                              if ($user && Object.keys($user).length === 0) {
                                showDisabledSelectWallet = true;
                              }
                            }}
                            on:mouseleave={() => {
                              if ($user && Object.keys($user).length === 0) {
                                showDisabledSelectWallet = false;
                              }
                            }}
                          >
                            <Select
                              type="wallet"
                              positionSelectList="right-0"
                              listSelect={listAddress.slice(5)}
                              bind:selected={$wallet}
                              {isDisabledSelectWallet}
                              {indexWalletDisabled}
                            />
                          </div>

                          {#if listAddress
                            .slice(5)
                            .find((item) => item.value === $wallet) !== undefined}
                            <div
                              class="absolute inset-0 rounded-full bg-[#ffffff1c] z-1"
                            />
                          {/if}

                          {#if showDisabledSelectWallet}
                            <div
                              class={`absolute transform left-1/2 -translate-x-1/2 ${
                                Object.keys($user).length === 0
                                  ? "-top-8"
                                  : "-top-12"
                              }`}
                              style="z-index: 2147483648;"
                            >
                              <div
                                class="max-w-[360px] text-white bg-black py-1 px-2 text-xs rounded relative w-max normal-case"
                              >
                                {tooltipDisableAddBtn}
                              </div>
                            </div>
                          {/if}
                        </div>

                        {#if listAddress.length > 10}
                          <div
                            class={`flex items-center gap-3 ${isDisabled ? "opacity-50" : "opacity-100"}`}
                          >
                            <div
                              class={`cursor-pointer overflow-hidden border border-white rounded-full ${
                                indexSelectedAddress === 0 && !isDisabled
                                  ? "opacity-50"
                                  : ""
                              }`}
                              on:click={() => {
                                if (isDisabled) {
                                  return;
                                }
                                handleSelectPrevAddress();
                              }}
                            >
                              <div class="transform -translate-x-[1px]">
                                <svg
                                  width="24"
                                  height="24"
                                  viewBox="0 0 20 20"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    fill="#fff"
                                    fill-rule="evenodd"
                                    d="M12.79 5.23a.75.75 0 0 1-.02 1.06L8.832 10l3.938 3.71a.75.75 0 1 1-1.04 1.08l-4.5-4.25a.75.75 0 0 1 0-1.08l4.5-4.25a.75.75 0 0 1 1.06.02Z"
                                    clip-rule="evenodd"
                                  />
                                </svg>
                              </div>
                            </div>
                            <div
                              class={`cursor-pointer overflow-hidden border border-white rounded-full ${
                                indexSelectedAddress ===
                                  listAddress.length - 1 && !isDisabled
                                  ? "opacity-50"
                                  : ""
                              }`}
                              on:click={() => {
                                if (isDisabled) {
                                  return;
                                }
                                handleSelectNextAddress();
                              }}
                            >
                              <div class="transform translate-x-[1px]">
                                <svg
                                  width="24"
                                  height="24"
                                  viewBox="0 0 20 20"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    fill="#fff"
                                    fill-rule="evenodd"
                                    d="M7.21 14.77a.75.75 0 0 1 .02-1.06L11.168 10L7.23 6.29a.75.75 0 1 1 1.04-1.08l4.5 4.25a.75.75 0 0 1 0 1.08l-4.5 4.25a.75.75 0 0 1-1.06-.02Z"
                                    clip-rule="evenodd"
                                  />
                                </svg>
                              </div>
                            </div>
                          </div>
                        {/if}
                      {:else}
                        <AnimateSharedLayout>
                          {#each listAddress as item}
                            <div
                              id={item.value}
                              class="relative text-base text-white py-1 xl:pl-2 xl:pr-3 px-3 flex items-center rounded-[100px] gap-2 cursor-pointer transition-all hover:underline"
                              class:hover:no-underline={item.value === $wallet}
                              on:click={() => {
                                if ($wallet !== item.value) {
                                  wallet.update((n) => (n = item.value));
                                  chain.update((n) => (n = "ALL"));
                                  totalTokens.update((n) => (n = 0));
                                  totalAirdrops.update((n) => (n = 0));
                                  totalNfts.update((n) => (n = 0));
                                  totalPositions.update((n) => (n = 0));
                                  unrealizedProfit.update((n) => (n = 0));
                                  realizedProfit.update((n) => (n = 0));
                                  pastProfit.update((n) => (n = 0));
                                }
                              }}
                            >
                              <img
                                src={item.logo}
                                alt=""
                                class={`w-5 h-5 xl:w-4 xl:h-4 block ${
                                  item.type !== "BUNDLE" ? "rounded-full" : ""
                                }`}
                              />
                              {item.label}
                              {#if item.value === $wallet}
                                <Motion
                                  let:motion
                                  layoutId="active-pill"
                                  transition={{
                                    type: "spring",
                                    duration: 0.6,
                                  }}
                                >
                                  <div
                                    class="absolute inset-0 rounded-full bg-[#ffffff1c]"
                                    use:motion
                                  />
                                </Motion>
                              {/if}
                            </div>
                          {/each}
                        </AnimateSharedLayout>
                      {/if}
                    </div>
                  {:else}
                    <div class="font-medium text-white text-base">
                      {$t("No account added yet.")}
                    </div>
                  {/if}
                </div>

                <!-- mobile list address wallet -->
                {#if listAddress && listAddress?.length !== 0}
                  <div class="xl:hidden block w-full overflow-hidden">
                    <div
                      class="relative sm:flex hidden flex-row items-center justify-between w-full gap-3 overflow-hidden"
                      bind:this={container}
                    >
                      <div
                        class={`text-white absolute left-0 py-2 rounded-tl-lg rounded-bl-lg ${
                          isScrollStart ? "hidden" : "block"
                        }`}
                        style="background-image: linear-gradient(to right, rgba(156, 163, 175, 0.5) 0%, rgba(255,255,255,0) 100% );"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          height="24px"
                          width="24px"
                          viewBox="0 0 24 24"
                          class="sc-aef7b723-0 fKbUaI"
                        >
                          <path
                            d="M15 6L9 12L15 18"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-miterlimit="10"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                      </div>
                      <div
                        class="container flex gap-3 overflow-x-auto w-max whitespace-nowrap"
                        bind:this={scrollContainer}
                        on:scroll={handleScroll}
                      >
                        {#each listAddress.sort((a, b) => {
                          if (a.type === "BUNDLE" && a.label === "Your wallets") return -1;
                          if (b.type === "BUNDLE" && b.label === "Your wallets") return 1;
                          return 0;
                        }) as item, index}
                          <div
                            id={item.value}
                            class={`w-max flex-shrink-0 relative text-xl text-white py-1 px-3 flex items-center gap-2 rounded-[100px] ${isDisabled && ($selectedPackage === "FREE" ? index > 2 + listBundle.length : index > 6 + listBundle.length) ? "opacity-50" : "opacity-100"}`}
                            class:hover:no-underline={item.value === $wallet}
                            on:click={() => {
                              if (
                                isDisabled &&
                                ($selectedPackage === "FREE"
                                  ? index > 2 + listBundle.length
                                  : index > 6 + listBundle.length)
                              ) {
                                return;
                              }
                              if ($wallet !== item.value) {
                                wallet.update((n) => (n = item.value));
                              }
                            }}
                          >
                            <img src={item.logo} alt="" class="w-5 h-5 block" />
                            {item.label}
                            {#if item.value === $wallet}
                              <Motion
                                let:motion
                                layoutId="active-pill"
                                transition={{ type: "spring", duration: 0.6 }}
                              >
                                <div
                                  class="absolute inset-0 rounded-full bg-[#ffffff1c]"
                                  use:motion
                                />
                              </Motion>
                            {/if}
                          </div>
                        {/each}
                      </div>
                      {#if scrollContainer?.scrollWidth >= container?.offsetWidth}
                        <div
                          class={`text-white absolute right-0 py-2 rounded-tr-lg rounded-br-lg ${
                            isScrollEnd ? "hidden" : "block"
                          }`}
                          style="background-image: linear-gradient(to left,rgba(156, 163, 175, 0.5) 0%, rgba(255,255,255,0) 100%);"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            height="24px"
                            width="24px"
                            viewBox="0 0 24 24"
                            class="sc-aef7b723-0 fKbUaI"
                          >
                            <path
                              d="M9 6L15 12L9 18"
                              stroke="currentColor"
                              stroke-width="2"
                              stroke-miterlimit="10"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                          </svg>
                        </div>
                      {/if}
                    </div>
                  </div>
                {/if}

                <!-- btn add address wallet -->
                <div class="flex justify-end gap-4">
                  {#if $user && Object.keys($user).length === 0}
                    <div class="xl:w-max lg:w-[290px] w-max">
                      <Button variant="disabled" disabled>
                        <img src={Plus} alt="" class="w-3 h-3 block" />
                        <div class="text-white">{$t("Add account")}</div>
                      </Button>
                    </div>
                  {:else}
                    <div class="xl:w-max lg:w-[290px] w-max">
                      {#if isDisabled}
                        <Button
                          variant="tertiary"
                          on:click={() => {
                            isOpenModal = true;
                          }}
                        >
                          <img src={Plus} alt="" class="w-3 h-3 block" />
                          <div class="text-white">{$t("Add account")}</div>
                        </Button>
                      {:else}
                        <Button
                          variant="tertiary"
                          on:click={() => {
                            triggerModalAddAddress.update((n) => (n = true));
                          }}
                        >
                          <img src={Plus} alt="" class="w-3 h-3 block" />
                          <div class="text-white">{$t("Add account")}</div>
                        </Button>
                      {/if}
                    </div>
                    {#if listAddress && listAddress?.length !== 0}
                      <div class="block sm:hidden">
                        <Button
                          variant="no-outlined"
                          on:click={() => {
                            showPopoverSearch.update((n) => (n = true));
                          }}
                        >
                          {$t("Select account")}
                        </Button>
                      </div>
                    {/if}
                  {/if}
                </div>
              </div>

              <div class="flex items-end justify-between">
                <div class="flex flex-col gap-3">
                  <div class="flex items-end gap-4">
                    <div class="font-medium text-white text-4xl">
                      {$t(title)}
                    </div>
                    {#if type === "portfolio"}
                      <span class="-ml-1">
                        <HiddenValue />
                      </span>
                      <div class="hidden mb-[6px]">
                        <slot name="reload" />
                      </div>
                    {/if}
                  </div>

                  <div class="flex items-center gap-4">
                    {#if $selectedBundle && Object.keys($selectedBundle).length !== 0 && $selectedBundle?.type === "BUNDLE"}
                      <div
                        class="relative"
                        on:click={() => (showPopover = !showPopover)}
                      >
                        <div class="flex cursor-pointer">
                          {#if $selectedBundle && $selectedBundle?.accounts && $selectedBundle?.accounts?.length > 8}
                            {#each $selectedBundle?.accounts.slice(0, 7) as item, index}
                              <div class={`${index > 0 && "-ml-2"}`}>
                                <div class="hidden xl:block">
                                  <Avatar src={item?.logo} stacked size="sm" />
                                </div>
                                <div class="block xl:hidden">
                                  <Avatar src={item?.logo} stacked size="md" />
                                </div>
                              </div>
                            {/each}
                            <div class="-ml-2">
                              <div class="hidden xl:block">
                                <Avatar stacked size="sm">...</Avatar>
                              </div>
                              <div class="block xl:hidden">
                                <Avatar stacked size="md">...</Avatar>
                              </div>
                            </div>
                          {:else}
                            {#each $selectedBundle?.accounts as item, index}
                              <div class={`${index > 0 && "-ml-2"}`}>
                                <div class="hidden xl:block">
                                  <Avatar src={item?.logo} stacked size="sm" />
                                </div>
                                <div class="block xl:hidden">
                                  <Avatar src={item?.logo} stacked size="md" />
                                </div>
                              </div>
                            {/each}
                          {/if}
                        </div>
                        {#if showPopover}
                          <div
                            class="select_content absolute left-0 z-50 flex flex-col xl:gap-3 gap-6 px-3 xl:py-2 py-3 text-sm transform rounded-lg top-12 w-max xl:max-h-[300px] xl:max-h-[310px] max-h-[380px]"
                            style="box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.15); overflow-y: overlay;"
                            use:triggerClickOutside
                            on:click_outside={() => (showPopover = false)}
                          >
                            {#each $selectedBundle?.accounts as item}
                              <div class="hidden xl:flex xl:flex-col">
                                <div class="text-xs font-medium text_00000099">
                                  {#if listAddress.find((item) => item.value === $wallet)}
                                    {item.label}
                                  {:else}
                                    <div class="flex items-center gap-1">
                                      Owner <Copy
                                        address={item?.label}
                                        iconColor={$isDarkMode
                                          ? "#fff"
                                          : "#000"}
                                        color={$isDarkMode ? "#fff" : "#000"}
                                        isShorten
                                      />
                                    </div>
                                  {/if}
                                </div>
                                <div class="text-sm">
                                  <Copy
                                    address={item?.value}
                                    iconColor={$isDarkMode ? "#fff" : "#000"}
                                    color={$isDarkMode ? "#fff" : "#000"}
                                    isShorten
                                  />
                                </div>
                              </div>
                              <div class="flex flex-col xl:hidden">
                                <div class="text-xs font-medium text_00000099">
                                  {#if listAddress.find((item) => item.value === $wallet)}
                                    {item.label}
                                  {:else}
                                    <div class="flex items-center gap-1">
                                      Owner <Copy
                                        address={item?.label}
                                        iconColor={$isDarkMode
                                          ? "#fff"
                                          : "#000"}
                                        color={$isDarkMode ? "#fff" : "#000"}
                                        isShorten
                                      />
                                    </div>
                                  {/if}
                                </div>
                                <div class="text-sm">
                                  <Copy
                                    address={item?.value}
                                    iconColor={$isDarkMode ? "#fff" : "#000"}
                                    color={$isDarkMode ? "#fff" : "#000"}
                                    isShorten
                                    iconSize={24}
                                  />
                                </div>
                              </div>
                            {/each}
                          </div>
                        {/if}
                      </div>
                    {:else}
                      <div class="hidden text-base xl:block">
                        <Copy address={$wallet} iconColor="#fff" color="#fff" />
                      </div>
                      <div class="block text-base xl:hidden">
                        <Copy
                          address={$wallet}
                          iconColor="#fff"
                          color="#fff"
                          isShorten
                          iconSize={24}
                        />
                      </div>
                    {/if}

                    <!-- <div
                    class="relative"
                    on:mouseenter={() => {
                      showFollowTooltip = true;
                    }}
                    on:mouseleave={() => {
                      showFollowTooltip = false;
                    }}
                  >
                    <Button
                      variant="secondary"
                      on:click={() => (isOpenFollowWhaleModal = true)}
                    >
                      Follow this whale 🐳
                    </Button>
                    {#if showFollowTooltip}
                      <div
                        class="absolute transform -translate-x-1/2 -top-8 left-1/2 w-max"
                        style="z-index: 2147483648;"
                      >
                        <Tooltip
                          text={"Alert me when it makes a move"}
                        />
                      </div>
                    {/if}
                  </div> -->

                    <div class="hidden xl:block">
                      <!-- {#if $typeWallet === "BTC"}
                      <div
                        use:tooltip={{
                          content: `<tooltip-detail text="Coming soon!" />`,
                          allowHTML: true,
                          placement: "top",
                          interactive: true,
                        }}
                      >
                        <Button variant="premium" disabled>
                          <div
                            class={`${
                              $isDarkMode ? "text-gray-400" : "text-white"
                            }`}
                          >
                            Optimize return
                          </div>
                        </Button>
                      </div>
                    {:else}
                      <div>
                        {#if Object.keys($user).length !== 0}
                          <div
                            use:tooltip={{
                              content: `<tooltip-detail text="Optimize this portfolio by Minimizing risk & Maximizing return" />`,
                              allowHTML: true,
                              placement: "top",
                              interactive: true,
                            }}
                          >
                            <Button
                              variant="premium"
                              on:click={() => {
                                navigate(
                                  `/compare?address=${encodeURIComponent(
                                    $wallet
                                  )}`
                                );
                                mixpanel.track("user_compare");
                              }}
                            >
                              Optimize return
                            </Button>
                          </div>
                        {:else}
                          <Button variant="premium" disabled>
                            <div
                              class={`${$isDarkMode ? "text-gray-400" : "text-white"}`}
                            >
                              Optimize return
                            </div>
                          </Button>
                        {/if}
                      </div>
                    {/if} -->

                      <NomisPointCheck />
                    </div>
                  </div>
                </div>

                <div class="md:flex flex-col gap-6 hidden">
                  {#if ["EVM", "MOVE"].includes($typeWallet)}
                    {#if $typeWallet === "EVM"}
                      <Select
                        type="chain"
                        positionSelectList="right-0"
                        listSelect={chainList.sort((a, b) =>
                          a.label.localeCompare(b.label),
                        )}
                        bind:selected={$chain}
                        isDisabledSelectWallet={false}
                        indexWalletDisabled={-1}
                      />
                    {/if}
                    {#if $typeWallet === "MOVE"}
                      <Select
                        type="chain"
                        positionSelectList="right-0"
                        listSelect={chainMoveList.sort((a, b) =>
                          a.label.localeCompare(b.label),
                        )}
                        bind:selected={$chain}
                        isDisabledSelectWallet={false}
                        indexWalletDisabled={-1}
                      />
                    {/if}
                  {/if}

                  <div class="xl:hidden block">
                    <!-- {#if $typeWallet === "BTC"}
                    <div
                      use:tooltip={{
                        content: `<tooltip-detail text="Coming soon!" />`,
                        allowHTML: true,
                        placement: "top",
                        interactive: true,
                      }}
                    >
                      <Button variant="premium" disabled>
                        <div
                          class={`${$isDarkMode ? "text-gray-400" : "text-white"}`}
                        >
                          Optimize return
                        </div>
                      </Button>
                    </div>
                  {:else}
                    <div>
                      {#if Object.keys($user).length !== 0}
                        <div
                          use:tooltip={{
                            content: `<tooltip-detail text="Optimize this portfolio by Minimizing risk & Maximizing return" />`,
                            allowHTML: true,
                            placement: "top",
                            interactive: true,
                          }}
                        >
                          <Button
                            variant="premium"
                            on:click={() => {
                              navigate(
                                `/compare?address=${encodeURIComponent($wallet)}`
                              );
                              mixpanel.track("user_compare");
                            }}
                          >
                            Optimize return
                          </Button>
                        </div>
                      {:else}
                        <Button variant="premium" disabled>
                          <div
                            class={`${$isDarkMode ? "text-gray-400" : "text-white"}`}
                          >
                            Optimize return
                          </div>
                        </Button>
                      {/if}
                    </div>
                  {/if} -->
                  </div>
                </div>
              </div>

              <div class="flex flex-col gap-6 md:hidden w-max -mt-2">
                <!-- {#if $typeWallet === "BTC"}
                <div
                  use:tooltip={{
                    content: `<tooltip-detail text="Coming soon!" />`,
                    allowHTML: true,
                    placement: "top",
                    interactive: true,
                  }}
                >
                  <Button variant="premium" disabled>
                    <div
                      class={`${$isDarkMode ? "text-gray-400" : "text-white"}`}
                    >
                      Optimize return
                    </div>
                  </Button>
                </div>
              {:else}
                <div>
                  {#if Object.keys($user).length !== 0}
                    <div
                      use:tooltip={{
                        content: `<tooltip-detail text="Optimize this portfolio by Minimizing risk & Maximizing return" />`,
                        allowHTML: true,
                        placement: "top",
                        interactive: true,
                      }}
                    >
                      <Button
                        variant="premium"
                        on:click={() => {
                          navigate(
                            `/compare?address=${encodeURIComponent($wallet)}`
                          );
                          mixpanel.track("user_compare");
                        }}
                      >
                        Optimize return
                      </Button>
                    </div>
                  {:else}
                    <Button variant="premium" disabled>
                      <div
                        class={`${$isDarkMode ? "text-gray-400" : "text-white"}`}
                      >
                        Optimize return
                      </div>
                    </Button>
                  {/if}
                </div>
              {/if} -->

                <NomisPointCheck />

                {#if $typeWallet === "MOVE" && isNimbusVersion}
                  <a
                    class="-mt-2 flex items-center gap-2 rounded-[12px] py-2 px-3 text-sm cursor-pointer w-max text-white font-[450] bg-[#ffb800]"
                    href={`https://t.me/SuiNimbusNotifierBot?start=${$wallet.substring(2)}`}
                    target="_blank"
                    on:mouseenter={() => (isHoverBell = true)}
                    on:mouseleave={() => (isHoverBell = false)}
                  >
                    <Motion let:motion animate={shakeAnimation}>
                      <img
                        src={Bell}
                        alt=""
                        class="xl:w-5 xl:h-5 w-7 h-7"
                        use:motion
                      />
                    </Motion>
                    {$t("Get Notified")}
                  </a>
                {/if}

                {#if ["EVM", "MOVE"].includes($typeWallet)}
                  {#if $typeWallet === "EVM"}
                    <Select
                      type="chain"
                      positionSelectList="left-0"
                      listSelect={chainList.sort((a, b) =>
                        a.label.localeCompare(b.label),
                      )}
                      bind:selected={$chain}
                      isDisabledSelectWallet={false}
                      indexWalletDisabled={-1}
                    />
                  {/if}
                  {#if $typeWallet === "MOVE"}
                    <Select
                      type="chain"
                      positionSelectList="left-0"
                      listSelect={chainMoveList.sort((a, b) =>
                        a.label.localeCompare(b.label),
                      )}
                      bind:selected={$chain}
                      isDisabledSelectWallet={false}
                      indexWalletDisabled={-1}
                    />
                  {/if}
                {/if}
              </div>

              {#if $typeWallet === "MOVE" && isNimbusVersion}
                <a
                  class="xl:-mt-10 -mt-3 md:flex hidden items-center gap-2 rounded-[12px] py-2 px-3 text-sm cursor-pointer w-max text-white font-[450] bg-[#ffb800]"
                  href={`https://t.me/SuiNimbusNotifierBot?start=${$wallet.substring(2)}`}
                  target="_blank"
                  on:mouseenter={() => (isHoverBell = true)}
                  on:mouseleave={() => (isHoverBell = false)}
                >
                  <Motion let:motion animate={shakeAnimation}>
                    <img
                      src={Bell}
                      alt=""
                      class="xl:w-5 xl:h-5 w-7 h-7"
                      use:motion
                    />
                  </Motion>
                  {$t("Get Notified")}
                </a>
              {/if}
            </div>
          </div>
        </div>
      </div>

      {#key $wallet || $chain}
        <slot name="body" />
      {/key}
    {/if}
  </div>
{/if}

<!-- Modal add DEX account -->
<div class="lg:block hidden">
  <AppOverlay
    clickOutSideToClose
    isOpen={$triggerModalAddAddress}
    on:close={() => {
      triggerModalAddAddress.update((n) => (n = false));
    }}
  >
    <div class="flex flex-col gap-4">
      <div class="font-semibold title-3">{$t("Add your account")}</div>
      <div class="flex flex-col gap-7">
        <!-- <div class="flex flex-col gap-3">
        <div class="flex justify-center">
          <div class="w-max">
            <Button
              variant="tertiary"
              isLoading={isLoadingConnectCEX}
              disabled={isLoadingConnectCEX}
              on:click={onSubmitCEX}
            >
              <div class="text-white">Connect Exchange</div>
            </Button>
          </div>
        </div>
        <div class="flex items-center justify-center gap-1 text-base">
          <img src={Success} alt="success-icon" width="22" height="22" />
          Bank-level security/encryption.
          <a
            href="https://vezgo.com/security"
            class="text-blue-500 hover:underline cursor-pointer"
            target="_blank"
          >
            More detail
          </a>
        </div>
        <div class="flex items-center justify-center gap-6 my-3">
          {#each listLogoCEX as logo}
            <img
              src={logo}
              alt="logo"
              loading="lazy"
              decoding="async"
              class="w-8 h-8 rounded-full block"
            />
          {/each}
          <a
            href="https://getnimbus.io/supported-chains"
            target="_blank"
            class="text-blue-500 hover:underline cursor-pointer text-base"
          >
            More exchanges
          </a>
        </div>
      </div>
      <div class="border-t-[1px] relative">
        <div
          class={`absolute top-[-10px] left-1/2 transform -translate-x-1/2 text-gray-400 text-sm px-2 ${
            $isDarkMode ? "bg-[#0f0f0f]" : "bg-white"
          }`}
        >
          Or
        </div>
      </div> -->
        <form
          on:submit|preventDefault={onSubmit}
          class="flex flex-col gap-3 mt-2"
        >
          <div class="flex flex-col gap-3">
            <div class="flex flex-col gap-1">
              <div
                class={`flex flex-col gap-1 input-2 input-border w-full py-[6px] px-3 ${
                  address && !$isDarkMode ? "bg-[#F0F2F7]" : "bg_fafafbff"
                }`}
                class:input-border-error={errors.address &&
                  errors.address.required}
              >
                <div
                  class={`text-base font-medium ${
                    $isDarkMode ? "text-gray-400" : "text-[#666666]"
                  }`}
                >
                  {$t("Address")}
                </div>
                <input
                  type="text"
                  id="address"
                  name="address"
                  placeholder={$t("Your wallet address")}
                  bind:value={address}
                  class={`p-0 border-none focus:outline-none focus:ring-0 text-sm font-normal ${
                    address && !$isDarkMode ? "bg-[#F0F2F7]" : "bg-transparent"
                  } ${
                    $isDarkMode
                      ? "text-white"
                      : "text-[#5E656B] placeholder-[#5E656B]"
                  }
              `}
                  on:change={(event) => {
                    address = event?.target.value;
                  }}
                />
              </div>
              {#if errors.address && errors.address.required}
                <div class="text-red-500">
                  {errors.address.msg}
                </div>
              {/if}
            </div>
            <div class="flex flex-col gap-1">
              <div
                class={`flex flex-col gap-1 input-2 input-border w-full py-[6px] px-3 ${
                  label && !$isDarkMode ? "bg-[#F0F2F7]" : "bg_fafafbff"
                }`}
                class:input-border-error={errors.label && errors.label.required}
              >
                <div
                  class={`text-base font-medium ${
                    $isDarkMode ? "text-gray-400" : "text-[#666666]"
                  }`}
                >
                  {$t("Label")}
                </div>
                <input
                  type="text"
                  id="label"
                  name="label"
                  placeholder={$t("Label")}
                  bind:value={label}
                  class={`p-0 border-none focus:outline-none focus:ring-0 text-sm font-normal ${
                    label && !$isDarkMode ? "bg-[#F0F2F7]" : "bg-transparent"
                  } ${
                    $isDarkMode
                      ? "text-white"
                      : "text-[#5E656B] placeholder-[#5E656B]"
                  }
              `}
                  on:change={(event) => {
                    label = event?.target.value;
                  }}
                />
              </div>
              {#if errors.label && errors.label.required}
                <div class="text-red-500">
                  {errors.label.msg}
                </div>
              {/if}
            </div>
          </div>
          <div class="flex items-center justify-end gap-2 text-[#666666]">
            <div class="text-sm">{$t("Is it your wallet")}?</div>
            <label class="switch-address" for="switch-address">
              <input
                type="checkbox"
                id="switch-address"
                bind:checked={groupedToBundles}
              />
              <span class="slider-address" />
            </label>
          </div>
          <div class="flex items-center justify-center gap-6 my-3">
            {#each generationLogo as item}
              <img
                src={item.logo}
                loading="lazy"
                decoding="async"
                alt="logo"
                class="w-8 h-8 overflow-hidden rounded-full"
              />
            {/each}
            <a
              href="https://getnimbus.io/supported-chains"
              target="_blank"
              class="text-blue-500 hover:underline cursor-pointer text-base"
              >{$t("More chains")}</a
            >
          </div>
          <div class="flex justify-end gap-4">
            <div class="w-[120px]">
              <Button
                variant="secondary"
                on:click={() => {
                  errors = {};
                  triggerModalAddAddress.update((n) => (n = false));
                }}
              >
                {$t("Cancel")}
              </Button>
            </div>
            <div class="w-[120px]">
              <Button
                type="submit"
                variant="tertiary"
                isLoading={isLoadingAddDEX}
                disabled={isLoadingAddDEX}
              >
                {$t("Add")}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </AppOverlay>
</div>

<!-- Add DEX account Mobile -->
<div class="lg:hidden block">
  <div
    class={`fixed inset-0 w-full mobile mobile-container ${
      $triggerModalAddAddress
        ? "opacity-100 transform translate-x-[0px]"
        : "opacity-0 transform translate-x-[-100vw]"
    }`}
  >
    <div
      class="max-w-[100vw] m-auto w-[90%] h-full flex flex-col gap-8 relative"
    >
      <div class="flex justify-end py-2 border-b-[1px]">
        <div
          class="-mr-1 text-5xl"
          on:click={() => {
            triggerModalAddAddress.update((n) => (n = false));
          }}
        >
          &times;
        </div>
      </div>
      <div class="flex flex-col gap-4">
        <div class="font-medium title-2">{$t("Add your account")}</div>
        <div class="flex flex-col gap-7">
          <!-- <div class="flex flex-col gap-3">
            <div class="flex justify-center">
              <div class="w-max">
                <Button
                  variant="tertiary"
                  isLoading={isLoadingConnectCEX}
                  disabled={isLoadingConnectCEX}
                  on:click={onSubmitCEX}
                >
                  <div class="text-white">Connect Exchange</div>
                </Button>
              </div>
            </div>
            <div class="flex flex-wrap items-center justify-center gap-1">
              <img src={Success} alt="success-icon" width="22" height="22" />
              Bank-level security/encryption.
              <a
                href="https://vezgo.com/security"
                target="_blank"
                class="text-blue-500 hover:underline cursor-pointer"
              >
                More detail
              </a>
            </div>
            <div class="flex items-center justify-center gap-6 my-2">
              {#each listLogoCEX.slice(0, 3) as logo}
                <img
                  src={logo}
                  alt="logo"
                  loading="lazy"
                  decoding="async"
                  class="w-8 h-8 rounded-full block"
                />
              {/each}
              <a
                href="https://getnimbus.io/supported-chains"
                target="_blank"
                class="text-blue-500 hover:underline cursor-pointer text-sm"
              >
                More exchanges
              </a>
            </div>
          </div>
          <div class="border-t-[1px] relative">
            <div
              class={`absolute top-[-14px] left-1/2 transform -translate-x-1/2 text-gray-400 ${
                $isDarkMode ? "bg-[#0f0f0f]" : "bg-white"
              } text-lg px-2`}
            >
              Or
            </div>
          </div> -->
          <form
            on:submit|preventDefault={onSubmit}
            class="flex flex-col gap-3 mt-2"
          >
            <div class="flex flex-col gap-3">
              <div class="flex flex-col gap-1">
                <div
                  class={`flex flex-col gap-1 input-2 input-border w-full py-[6px] px-3 ${
                    address && !$isDarkMode ? "bg-[#F0F2F7]" : "bg_fafafbff"
                  }`}
                  class:input-border-error={errors.address &&
                    errors.address.required}
                >
                  <div
                    class={`text-lg font-medium ${
                      $isDarkMode ? "text-gray-400" : "text-[#666666]"
                    }`}
                  >
                    {$t("Address")}
                  </div>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    placeholder={$t("Your wallet address")}
                    bind:value={address}
                    class={`p-0 border-none focus:outline-none focus:ring-0 text-base font-normal ${
                      address && !$isDarkMode
                        ? "bg-[#F0F2F7]"
                        : "bg-transparent"
                    } ${
                      $isDarkMode
                        ? "text-white"
                        : "text-[#5E656B] placeholder-[#5E656B]"
                    }`}
                    on:change={(event) => {
                      address = event?.target?.value;
                    }}
                  />
                </div>
                {#if errors.address && errors.address.required}
                  <div class="text-red-500">
                    {errors.address.msg}
                  </div>
                {/if}
              </div>

              <div class="flex flex-col gap-1">
                <div
                  class={`flex flex-col gap-1 input-2 input-border w-full py-[6px] px-3 ${
                    label && !$isDarkMode ? "bg-[#F0F2F7]" : "bg_fafafbff"
                  }`}
                  class:input-border-error={errors.label &&
                    errors.label.required}
                >
                  <div
                    class={`text-lg font-medium ${
                      $isDarkMode ? "text-gray-400" : "text-[#666666]"
                    }`}
                  >
                    {$t("Label")}
                  </div>
                  <input
                    type="text"
                    id="label"
                    name="label"
                    placeholder={$t("Label")}
                    bind:value={label}
                    class={`p-0 border-none focus:outline-none focus:ring-0 text-base font-normal ${
                      label && !$isDarkMode ? "bg-[#F0F2F7]" : "bg-transparent"
                    } ${
                      $isDarkMode
                        ? "text-white"
                        : "text-[#5E656B] placeholder-[#5E656B]"
                    }
              `}
                    on:change={(event) => {
                      label = event?.target?.value;
                    }}
                  />
                </div>
                {#if errors.label && errors.label.required}
                  <div class="text-red-500">
                    {errors.label.msg}
                  </div>
                {/if}
              </div>
            </div>
            <div
              class="flex items-center justify-end gap-2 text-[#666666] mt-2"
            >
              <div class="text-base">{$t("Is it your wallet")}?</div>
              <label class="switch-address" for="switch-address">
                <input
                  type="checkbox"
                  id="switch-address"
                  bind:checked={groupedToBundles}
                />
                <span class="slider-address" />
              </label>
            </div>
            <div class="flex items-center justify-center gap-6 my-2">
              {#each generationLogo.slice(0, 4) as item}
                <img
                  src={item.logo}
                  loading="lazy"
                  decoding="async"
                  alt="logo"
                  class="w-8 h-8 overflow-hidden rounded-full block"
                />
              {/each}
              <a
                href="https://getnimbus.io/supported-chains"
                target="_blank"
                class="text-blue-500 hover:underline cursor-pointer text-sm"
                >{$t("More chains")}</a
              >
            </div>

            <div class="flex justify-end gap-4">
              <div class="w-[120px]">
                <Button
                  variant="secondary"
                  on:click={() => {
                    errors = {};
                    triggerModalAddAddress.update((n) => (n = false));
                  }}
                >
                  {$t("Cancel")}
                </Button>
              </div>
              <div class="w-[120px]">
                <Button
                  type="submit"
                  variant="tertiary"
                  isLoading={isLoadingAddDEX}
                  disabled={isLoadingAddDEX}
                >
                  <div class="text-white">{$t("Add")}</div>
                </Button>
              </div>
            </div>
          </form>

          {#if $isTWA}
            <div class="border-t-[1px] relative">
              <div
                class={`absolute top-[-10px] left-1/2 transform -translate-x-1/2 text-gray-400 text-sm px-2 ${
                  $isDarkMode ? "bg-[#0f0f0f]" : "bg-white"
                }`}
              >
                Or
              </div>
            </div>

            <div class="flex items-center justify-center">
              <TmaTonAuth
                {selectYourWalletsBundle}
                {closeMobileAddAccountModal}
              />
            </div>
          {/if}
        </div>
      </div>
    </div>
  </div>
</div>

<!-- Modal navigate to Upgrade page -->
<AppOverlay
  clickOutSideToClose
  isOpen={isOpenModal}
  on:close={() => {
    isOpenModal = false;
  }}
>
  <div class="flex flex-col gap-4 xl:mt-0 mt-4">
    <div class="flex flex-col gap-1 items-start">
      <div class="title-3 font-semibold">
        {$t("Let's upgrade your Plan!")}
      </div>
      <div class="text-sm text-gray-500">
        {$t(tooltipDisableAddBtn)}
      </div>
    </div>
    <div class="flex justify-start">
      <div class="w-max">
        <Button
          variant="premium"
          on:click={() => {
            navigate("/upgrade");
          }}
        >
          {$t("Upgrade Plan")}
        </Button>
      </div>
    </div>
  </div>
</AppOverlay>

<!-- Modal follow Whales -->
<!-- <AppOverlay
  clickOutSideToClose
  isOpen={isOpenFollowWhaleModal}
  on:close={() => (isOpenFollowWhaleModal = false)}
>
  <div class="flex flex-col gap-4">
    <div class="flex flex-col gap-1">
      <div class="text-base">
        Go to <a
          href="https://t.me/GetNimbusBot"
          target="_blank"
          class="text-blue-500 cursor-pointer hover:underline"
          >https://t.me/GetNimbusBot</a
        >
      </div>
      <div class="text-base">Use the command as follow video</div>
    </div>
    <div class="xl:h-[350px] h-[650px]">
      <img src={FollowWhale} alt="" loading="lazy" decoding="async" class="object-contain w-full h-full block" />
    </div>
    <div class="flex justify-end w-full">
      <CopyToClipboard
        text={`/start ${$wallet} ${
          listAddress.filter((item) => item.value === $wallet)?.[0]?.label || ""
        }`}
        let:copy
      >
        <div
          class="relative w-max"
          on:mouseenter={() => {
            showCommandTooltip = true;
          }}
          on:mouseleave={() => {
            showCommandTooltip = false;
          }}
        >
          <Button
            on:click={() => {
              copy();
              isOpenFollowWhaleModal = false;
              showCommandTooltip = false;
            }}>Copy command</Button
          >

          {#if showCommandTooltip}
            <div
              class="absolute transform -translate-x-1/2 -top-8 left-1/2 w-max"
              style="z-index: 2147483648;"
            >
              <Tooltip
                text={`/start ${$wallet} ${
                  listAddress.filter((item) => item.value === $wallet)?.[0]
                    ?.label || ""
                }`}
              />
            </div>
          {/if}
        </div>
      </CopyToClipboard>
    </div>
  </div>
</AppOverlay> -->

<style>
  .input-border {
    border: 1px solid rgb(229, 231, 235);
  }

  .input-border-error {
    border: 1px solid red;
  }

  .container::-webkit-scrollbar {
    display: none;
  }

  /* Hide scrollbar for IE, Edge and Firefox */
  .container {
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
  }

  :global(body) .capa {
    background-repeat: no-repeat;
    background-size: auto;
    background-position: top right;
    background-image: url("~/assets/capa.svg");
  }

  :global(body.dark) .capa {
    background-repeat: no-repeat;
    background-size: auto;
    background-position: top right;
    background-image: url("~/assets/capa-dark.svg");
  }

  :global(body) .whitelabel-header-container {
    background-image: linear-gradient(130deg, #167e0a 0%, #3fd681 100%);
  }
  :global(body.dark) .whitelabel-header-container {
    background-image: linear-gradient(130deg, #072b03 0%, #167e0a 100%);
  }

  :global(body) .header-container {
    background-color: #27326f;
  }
  :global(body.dark) .header-container {
    background-color: #080808;
  }

  :global(body) .select_content {
    background: #ffffff;
    border: 0.5px solid transparent;
  }
  :global(body.dark) .select_content {
    background: #131313;
    border: 0.5px solid #cdcdcd59;
  }

  :global(body) .bg_fafafbff {
    background: #fafafbff;
  }
  :global(body.dark) .bg_fafafbff {
    background: #212121;
  }

  .switch-address {
    position: relative;
    display: inline-block;
    width: 40px;
    height: 20px;
  }

  .switch-address input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .slider-address {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    -webkit-transition: 0.4s;
    transition: 0.4s;
    border-radius: 34px;
  }
  .slider-address:before {
    position: absolute;
    content: "";
    height: 16px;
    width: 16px;
    left: 4px;
    bottom: 2px;
    background-color: white;
    -webkit-transition: 0.4s;
    transition: 0.4s;
    border-radius: 50%;
  }
  input:checked + .slider-address {
    background-color: #2196f3;
  }
  input:checked + .slider-address {
    box-shadow: 0 0 1px #2196f3;
  }
  input:checked + .slider-address:before {
    -webkit-transform: translateX(16px);
    -ms-transform: translateX(16px);
    transform: translateX(16px);
  }

  @media screen and (max-width: 1280px) {
    .switch-address {
      width: 60px;
      height: 30px;
    }

    .slider-address {
      border-radius: 44px;
    }

    .slider-address:before {
      height: 26px;
      width: 26px;
      left: 4px;
      bottom: 2px;
    }

    input:checked + .slider-address:before {
      -webkit-transform: translateX(26px);
      -ms-transform: translateX(26px);
      transform: translateX(26px);
    }
  }

  .mobile {
    height: 100vh;
    z-index: 21;

    transition-property: all;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 250ms;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);

    --tw-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1),
      0 8px 10px -6px rgb(0 0 0 / 0.1);
    --tw-shadow-colored: 0 20px 25px -5px var(--tw-shadow-color),
      0 8px 10px -6px var(--tw-shadow-color);
    box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000),
      var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
  }

  @media (min-width: 1536px) {
    :global(body) .absolute-center {
      /* position: absolute; */
      left: 49.5%;
      transform: translate(-50%, -50%);
    }
  }

  @supports (height: 100dvh) {
    .mobile {
      height: 100dvh;
    }
  }

  :global(body) .mobile-container {
    background: white;
  }
  :global(body.dark) .mobile-container {
    background: black;
  }
</style>
