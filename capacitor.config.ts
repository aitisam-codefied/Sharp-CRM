import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.smscrm.app',
  appName: 'SMSCrm',
  webDir: 'out',
  server: {
    androidScheme: "http",   // revert Capacitor 6 default to http
    cleartext: true          // allow plain‑HTTP in Android WebView
},
};

export default config;
