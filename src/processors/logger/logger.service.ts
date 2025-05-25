import { Injectable, LoggerService } from '@nestjs/common';
import Consola from 'consola';

@Injectable()
export class CustomLoggerService implements LoggerService {
  private readonly consolaLogger = Consola;
  private context: string;

  log(message: string, ...args: any[]) {
    this.consolaLogger.info(this.formatMessage(message), ...args);
  }

  error(message: string, ...args: any[]) {
    this.consolaLogger.error(this.formatMessage(message), ...args);
  }

  warn(message: string, ...args: any[]) {
    this.consolaLogger.warn(this.formatMessage(message), ...args);
  }

  debug(message: string, ...args: any[]) {
    this.consolaLogger.debug(this.formatMessage(message), ...args);
  }

  verbose(message: string, ...args: any[]) {
    this.consolaLogger.log(this.formatMessage(message), ...args);
  }

  setContext(context: string) {
    this.context = context;
  }

  private formatMessage(message: string): string {
    return this.context ? `[${this.context}] ${message}` : message;
  }
}
