import 'reflect-metadata';

import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule } from '@nestjs/swagger';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

import { AppModule } from './app.module.js';
import { ENV_KEYS } from './envKeys.constants.js';
import { UPLOADS_URL_PREFIX } from './files/files.constants.js';
import { FilesService } from './files/files.service.js';
import { setup } from './setup.js';

const app = await NestFactory.create<NestExpressApplication>(AppModule, {
  bufferLogs: true,
});
app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
const document = setup(app);

app.useStaticAssets(app.get(FilesService).uploadsDir, {
  prefix: `/${UPLOADS_URL_PREFIX}/`,
  // Helmet defaults to same-origin, which would block the client (another
  // origin) from displaying the images.
  setHeaders: (res) =>
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin'),
});

if (app.get(ConfigService).get(ENV_KEYS.NODE_ENV) !== 'production') {
  SwaggerModule.setup('api/docs', app, document);
}

await app.listen(
  app.get(ConfigService).getOrThrow<number>(ENV_KEYS.PORT),
  '0.0.0.0',
);
