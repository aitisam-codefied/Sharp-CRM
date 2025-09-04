import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.smscrm.app",
  appName: "SMSCrm",
  webDir: ".next",
  server: {
    url: "https://beta.supasystem.co.uk",
    cleartext: true,
  },
};

export default config;
