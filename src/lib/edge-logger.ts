/**
 * Edge-compatible logger for use in middleware and edge functions.
 * This logger doesn't use Node.js-specific modules like 'path' or 'winston'
 * which are not supported in the Edge Runtime.
 */

type LogLevel = 'error' | 'warn' | 'info' | 'http' | 'debug';

const LOG_LEVELS: Record<LogLevel, number> = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
};

const currentLogLevel = (process.env.LOG_LEVEL as LogLevel) || 'info';

function shouldLog(level: LogLevel): boolean {
    return LOG_LEVELS[level] <= LOG_LEVELS[currentLogLevel];
}

function formatMessage(level: LogLevel, message: string, ...args: unknown[]): string {
    const timestamp = new Date().toISOString();
    const formattedArgs = args.length > 0 ? ' ' + args.map(arg =>
        typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
    ).join(' ') : '';
    return `${timestamp} [${level.toUpperCase()}]: ${message}${formattedArgs}`;
}

const EdgeLogger = {
    error(message: string, ...args: unknown[]): void {
        if (shouldLog('error')) {
            console.error(formatMessage('error', message, ...args));
        }
    },

    warn(message: string, ...args: unknown[]): void {
        if (shouldLog('warn')) {
            console.warn(formatMessage('warn', message, ...args));
        }
    },

    info(message: string, ...args: unknown[]): void {
        if (shouldLog('info')) {
            console.info(formatMessage('info', message, ...args));
        }
    },

    http(message: string, ...args: unknown[]): void {
        if (shouldLog('http')) {
            console.log(formatMessage('http', message, ...args));
        }
    },

    debug(message: string, ...args: unknown[]): void {
        if (shouldLog('debug')) {
            console.debug(formatMessage('debug', message, ...args));
        }
    },
};

export default EdgeLogger;
