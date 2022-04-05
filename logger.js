// var appRoot = require('app-root-path');
// var winston = require('winston');

// // define the custom settings for each transport (file, console)

// const customerFormat = winston.format.combine(winston.format.timestamp(), winston.format.printf((info) => {
//   return `${info.timestamp} - [${info.level.toUpperCase().padEnd(7)}] --> ${info.message}`

// }));

// var options = {
//   file: {
//     level: 'info',
//     filename: `${appRoot}/app.log`,
//     handleExceptions: true,
//     json: true,
//     maxsize: 5242880, // 5MB
//     maxFiles: 5,
//     colorize: false,
//   },
//   console: {
//     level: 'debug',
//     handleExceptions: true,
//     json: false,
//     colorize: true,
//   },
// };

// // instantiate a new Winston Logger with the settings defined above
// var logger = new winston.createLogger({
//   format: customerFormat,
//   transports: [
//     new winston.transports.File(options.file),
//     new winston.transports.Console(options.console)
//   ],
//   exitOnError: false // do not exit on handled exceptions
// });

// // // create a stream object with a 'write' function that will be used by `morgan`
// // logger.stream = {
// //   write: function (message, encoding) {
// //     // use the 'info' log level so the output will be picked up by both transports (file and console)
// //     logger.info(message);
// //   },
// // };

// module.exports = logger;

const {
  createLogger,
  transports,
  format
} = require('winston');



const customerFormat = format.combine(format.timestamp(), format.printf((info) => {

  return `${info.timestamp} - [${info.level.toUpperCase().padEnd(7)}] --> ${info.message}`

}));



const logger = createLogger({

  level: 'debug',

  format: customerFormat,

  transports: [

    new transports.Console(),

    new transports.File({
      filename: 'csye6225.log'
    })

  ]

});

module.exports = logger;