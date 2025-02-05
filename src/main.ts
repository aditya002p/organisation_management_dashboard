import { bootstrapApplication } from '@angular/platform-browser';
import { environment } from './environments/environment';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

console.log(environment.firebase.apiKey);

bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error('Error bootstrapping app:', err)
);
