import { Global, Injectable, Module } from '@nestjs/common';
import { toDateOnly } from '../dates/date-only.js';

/** Abstração do relógio para permitir datas fixas nos testes. */
@Injectable()
export class Clock {
  now(): Date {
    return new Date();
  }

  /** Data atual (fuso do processo) no formato AAAA-MM-DD. */
  today(): string {
    return toDateOnly(this.now());
  }
}

@Global()
@Module({ providers: [Clock], exports: [Clock] })
export class ClockModule {}
