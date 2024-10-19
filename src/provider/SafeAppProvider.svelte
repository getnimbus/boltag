<script lang="ts">
  import SafeAppsSDK from "@safe-global/safe-apps-sdk";

  type Opts = {
    allowedDomains?: RegExp[];
    debug?: boolean;
  };

  const opts: Opts = {
    allowedDomains: [/app.safe.global$/, /([a-zA-Z0-9-]+\.)blockscout\.com/],
    debug: true,
  };

  const safeAppsSdk = new SafeAppsSDK(opts);
</script>

<slot {safeAppsSdk} />

<style></style>
