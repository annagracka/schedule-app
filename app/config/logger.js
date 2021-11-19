const winston = require('winston');
const { format } = require('winston');

const logger = winston.createLogger({
  transports: [
    new winston.transports.File({
      filename: 'combined.log',
      level: 'info',
      format: winston.format.combine(format.timestamp(), format.json()),
    }),
    new winston.transports.File({
      filename: 'errors.log',
      level: 'error',
      format: winston.format.combine(format.timestamp(), format.json()),
    }),
  ],
});

module.exports = logger;
