import 'zone.js/node';
import * as express from 'express';
import { APP_BASE_HREF } from '@angular/common';
import { existsSync } from 'fs';
import { join } from 'path';
import { ngExpressEngine } from '@nguniversal/express-engine';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideServerRendering } from '@angular/platform-server';
import { AppComponent } from './src/app/app.component';
import { provideRouter } from '@angular/router';
import { importProvidersFrom } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

// Create Express server
export function app(): express.Express {
  const server = express();
  const distFolder = join(
    process.cwd(),
    'dist/org-management-dashboard/browser'
  );
  const indexHtml = existsSync(join(distFolder, 'index.original.html'))
    ? 'index.original.html'
    : 'index.html';

  // Set up Angular Universal engine for standalone components
  server.engine('html', (_, options, callback) => {
    bootstrapApplication(AppComponent, {
      providers: [
        provideServerRendering(),
        provideRouter([]), // Define your routes here
        importProvidersFrom(
          CommonModule,
          MatToolbarModule,
          MatButtonModule,
          MatIconModule,
          MatMenuModule
        ),
      ],
    })
      .then((appRef) => {
        ngExpressEngine({ bootstrap: appRef.componentTypes[0] })(
          _,
          options,
          callback
        );
      })
      .catch((err) => callback(err));
  });

  server.set('view engine', 'html');
  server.set('views', distFolder);

  // Serve static files
  server.get(
    '*.*',
    express.static(distFolder, {
      maxAge: '1y',
    })
  );

  // Handle Angular routes
  server.get('*', (req, res) => {
    res.render(indexHtml, { req });
  });

  return server;
}

// Start server
function run(): void {
  const port = process.env.PORT || 4000;
  const server = app();

  server.listen(port, () => {
    console.log(`Node Express server is running on http://localhost:${port}`);
  });
}

run();
