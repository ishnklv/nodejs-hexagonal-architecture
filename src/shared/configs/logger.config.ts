import { Environment } from '@config/env.config';

type LogLevel = 'log' | 'error' | 'warn' | 'debug' | 'verbose'

export const loggerConfig = (): LogLevel[] => {
    switch (process.env.NODE_ENV as Environment) {
        case Environment.Local:
        case Environment.E2e:
            return ['verbose', 'debug', 'log', 'warn', 'error'];
        case Environment.Production:
        default:
            return ['log', 'warn', 'error'];
    }
}
