const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3
};

class Logger {
  constructor() {
    this.level = process.env.NODE_ENV === 'development' ? LOG_LEVELS.DEBUG : LOG_LEVELS.INFO;
  }

  debug(message, context = {}) {
    if (this.level <= LOG_LEVELS.DEBUG) {
      console.debug(`[IOC-TOOLS DEBUG] ${message}`, context);
    }
  }

  info(message, context = {}) {
    if (this.level <= LOG_LEVELS.INFO) {
      console.info(`[IOC-TOOLS INFO] ${message}`, context);
    }
  }

  warn(message, context = {}) {
    if (this.level <= LOG_LEVELS.WARN) {
      console.warn(`[IOC-TOOLS WARN] ${message}`, context);
    }
  }

  error(message, context = {}) {
    if (this.level <= LOG_LEVELS.ERROR) {
      console.error(`[IOC-TOOLS ERROR] ${message}`, context);
    }
  }
}

export const logger = new Logger();
