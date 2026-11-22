import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module.js';
import { LoggingModule } from './common/logging.module.js';
import { validateEnv } from './config.js';
import { DatabaseModule } from './database/database.module.js';
import { InferenceModule } from './inference/inference.module.js';
import { SessionsModule } from './sessions/sessions.module.js';
import { TrainingModule } from './training/training.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate: validateEnv }),
    LoggingModule,
    DatabaseModule,
    AuthModule,
    // Before SessionsModule: its `GET :type/:sessionId` would otherwise capture
    // `/inference/statistics` and `/training/types` and reject them with a 400.
    InferenceModule,
    TrainingModule,
    SessionsModule,
  ],
})
export class AppModule {}
