import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Scope } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Processor({ name: 'test', scope: Scope.REQUEST })
export class AppProcessor extends WorkerHost {
  constructor(private readonly configService: ConfigService) {
    super();
  }

  async process() {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return { who: this.configService.get('WHO') };
  }
}
