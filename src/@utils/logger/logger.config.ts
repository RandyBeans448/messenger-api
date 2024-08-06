import { format, transports } from 'winston';

export const loggerConfig = (level: 'info' | 'error' | 'debug') => {
    return {
        level,
        transports: [new transports.Console()],
        format: format.combine(
            format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            format.json(),
            // printf allows us to order which data we want to log first
            format.printf((info) => {
                return JSON.stringify({
                    timestamp: info.timestamp,
                    context: info.context,
                    level: info.level,
                    message: info.message,
                });
            }),
            format.colorize({
                all: true,
                colors: { info: 'green', error: 'red', warn: 'yellow' },
            }),
        ),
    };
};
