import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';

import { AppProcessor } from './app.processor';

@Module({
  imports: [BullModule.registerQueue({ name: 'test' })],
  providers: [AppProcessor],
})
export class AppModule {}
