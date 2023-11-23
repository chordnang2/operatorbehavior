import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.operatorbehavior.app',
  appName: 'operator-behavior',
  webDir: 'build',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    "CapacitorUpdater": {
      "autoUpdate": false
    }
  }
};

export default config;
