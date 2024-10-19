<script lang="ts">
  import { onMount } from "svelte";
  import mixpanel from "mixpanel-browser";
  import { isNimbusVersion } from "~/utils/constants";

  const MIXPANEL_KEY = isNimbusVersion
    ? "d56364b743cd70634fe5bea51e1d7e1c"
    : "fa49c00f14cf85adf213f10911662b28";

  onMount(() => {
    mixpanel.init(MIXPANEL_KEY, {
      debug: false,
      ignore_dnt: true,
    });
  });
</script>

<slot />
