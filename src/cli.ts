import { CommandFactory } from 'nest-commander';
import { WinstonModule } from 'nest-winston';
import { AppModule } from 'src/app.module';
import { format } from 'winston';
import { loggerConfig } from './@utils/logger/logger.config';

const contextFilter = format((info, opts) => {
    return info.context !== 'InstanceLoader' ? info : false;
});

async function bootstrap() {
    const logConfig = loggerConfig('info');
    logConfig.format = format.combine(
        contextFilter(),
        format.json(),
        format.colorize({
            all: true,
            colors: { info: 'green', error: 'red', warn: 'yellow' },
        }),
    );

    const winstonLogger = WinstonModule.createLogger(logConfig);
    await CommandFactory.run(AppModule, winstonLogger);
}
bootstrap();
