import { Injectable, Logger } from '@nestjs/common';
import { QueueService } from 'src/queues';
import { SqsMessageHandler } from '@ssut/nestjs-sqs';

@Injectable()
export class ClaimsFormGenerationProcessor {
  private readonly logger = new Logger(ClaimsFormGenerationProcessor.name);

  constructor(private readonly queueService: QueueService) {}

  @SqsMessageHandler('claims-form-generation')
  async process(job: AWS.SQS.Message) {
    const { name, data } = this.queueService.parseJobPayload(
      job,
      'claimsFormGeneration',
    );

    this.logger.debug(`Generating form for claim ${data.claimId}...`);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    this.logger.debug(`Success generating form for claim ${data.claimId}...`);

    await this.queueService.queue.claimsNotification.add('send-slack', {
      type: 'PENDING_PARTNER_APPROVAL',
      channel: 'test-channel',
      claimId: data.claimId,
      transformToNumber: 123,
    });

    await this.queueService.queue.claimsNotification.add('send-email', {
      type: 'MEMBER_DRAFT_SUBMISSION',
      email: 'test@gmail.com',
      claimId: data.claimId,
    });
  }
}
