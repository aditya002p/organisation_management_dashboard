import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';
import { AppModule } from './app.module';
import { AppComponent } from './app.component';

@NgModule({
  imports: [
    AppModule, // Import your main app module
    ServerModule, // This is required for server-side rendering
  ],
  bootstrap: [AppComponent],
})
export class AppServerModule {}
