import 'zone.js/node';
import * as express from 'express';
import { APP_BASE_HREF } from '@angular/common';
import { existsSync } from 'fs';
import { join } from 'path';

// Import the generated Angular server module
import { AppServerModule } from './src/app/app.server.module';
import { ngExpressEngine } from '@nguniversal/express-engine';

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

  // Set up Angular Universal engine
  server.engine(
    'html',
    ngExpressEngine({
      bootstrap: AppServerModule,
    })
  );

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
    res.render(indexHtml, {
      req,
      providers: [{ provide: APP_BASE_HREF, useValue: req.baseUrl }],
    });
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
