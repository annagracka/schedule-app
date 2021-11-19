const winston = require('winston');

const logger = winston.createLogger({
    transports: [
      new winston.transports.File({
        filename: 'combined.log',
        level: 'info'
      }),
      new winston.transports.File({
        filename: 'errors.log',
        level: 'error'
      })
    ]
  });


module.exports = logger;

