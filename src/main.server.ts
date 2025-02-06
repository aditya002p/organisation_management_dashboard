import { enableProdMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { provideServerRendering } from '@angular/platform-server';
import { environment } from './environments/environment';
import { importProvidersFrom } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    provideServerRendering(), // Required for SSR
    provideRouter([]), // Add your routes
    importProvidersFrom(
      CommonModule,
      MatToolbarModule,
      MatButtonModule,
      MatIconModule,
      MatMenuModule
    ),
  ],
}).catch((err) => console.error(err));
