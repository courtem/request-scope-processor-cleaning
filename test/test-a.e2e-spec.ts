import { BullModule, getQueueToken } from '@nestjs/bullmq';
import { INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { Queue, QueueEvents } from 'bullmq';
import { v4 as uuidv4 } from 'uuid';

import { AppModule } from '../src/app.module';

describe('Test A', () => {
  let testId: string;

  let app: INestApplication;
  let queue: Queue;
  let queueEvents: QueueEvents;

  beforeAll(async () => {
    testId = uuidv4();

    process.env.WHO = testId;

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [() => ({ WHO: testId })],
          isGlobal: true,
        }),
        BullModule.forRoot({
          connection: {
            host: 'localhost',
            port: 6379,
            maxRetriesPerRequest: null,
          },
        }),
        AppModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.enableShutdownHooks();
    await app.init();

    queue = app.get(getQueueToken('test'));
    queueEvents = new QueueEvents(queue.name, {
      connection: await queue.client,
    });
  });

  afterAll(async () => {
    await app.close();
  });

  const waitForJobCompletion = async () => {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Job completion timeout'));
      }, 30000);

      queueEvents.once('completed', async (job) => {
        clearTimeout(timeout);
        resolve(job.returnvalue);
      });

      queueEvents.once('failed', async (job) => {
        clearTimeout(timeout);
        reject(new Error(`Job failed: ${job.failedReason}`));
      });
    });
  };

  it('1', async () => {
    const jobPromise = waitForJobCompletion();

    await queue.add('test', null);

    const result = await jobPromise;

    expect(result).toEqual({ who: testId });
  });

  it('2', async () => {
    const jobPromise = waitForJobCompletion();

    await queue.add('test', null);

    const result = await jobPromise;

    expect(result).toEqual({ who: testId });
  });

  it('3', async () => {
    const jobPromise = waitForJobCompletion();

    await queue.add('test', null);

    const result = await jobPromise;

    expect(result).toEqual({ who: testId });
  });

  it('4', async () => {
    const jobPromise = waitForJobCompletion();

    await queue.add('test', null);

    const result = await jobPromise;

    expect(result).toEqual({ who: testId });
  });
});
