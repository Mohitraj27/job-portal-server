import { createLogger, format, transports } from 'winston';


const customFormat = format.combine(
  format.colorize(),
  format.printf(({ timestamp, level, message }) => {
    let colorizedMessage = message;

    if (message && typeof message === 'string') {
      
      if (message.includes('POST')) {
        colorizedMessage = `\x1b[32m${message}\x1b[0m`; 
      } else if (message.includes('PUT')) {
        colorizedMessage = `\x1b[33m${message}\x1b[0m`; 
      } else if (message.includes('DELETE')) {
        colorizedMessage = `\x1b[31m${message}\x1b[0m`; 
      } else {
        colorizedMessage = `\x1b[36m${message}\x1b[0m`; 
      }
    }

    return `${timestamp} [${level}]: ${colorizedMessage}`;
  }),
);

export const logger = createLogger({
  level: 'info',
  format: format.combine(format.timestamp(), customFormat),
  transports: [new transports.Console()],
});
