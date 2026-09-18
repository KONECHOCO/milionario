import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.ikonet.milionario',
  appName: 'Milionario Quiz',
  webDir: 'dist',
  ios: { contentInset: 'always', backgroundColor: '#04091e' },
};

export default config;
