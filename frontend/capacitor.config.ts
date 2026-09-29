import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'in.gov.sih.jaldrishti',
  appName: 'JalDrishti',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
