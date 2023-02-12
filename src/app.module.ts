import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ClaimsFormGenerationProcessor } from './events/claims-form-generation.processor';
import { ClaimsNotificationProcessor } from './events/claims-notification.processor';
import { QueueService } from './queues';
import { QueueUiController } from './queue-ui.controller';

@Module({
  imports: [
    BullModule.forRoot({
      connection: {
        host: 'localhost',
        port: 6379,
      },
    }),
    ...QueueService.registerQueues(),
  ],
  controllers: [AppController, QueueUiController],
  providers: [
    QueueService,
    ClaimsFormGenerationProcessor,
    ClaimsNotificationProcessor,
  ],
})
export class AppModule {}
