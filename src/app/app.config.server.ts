import { ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { appConfig } from './app.config';

const serverConfig: ApplicationConfig = {
  ...appConfig,
  providers: [...appConfig.providers, provideServerRendering()],
};

export default serverConfig;
