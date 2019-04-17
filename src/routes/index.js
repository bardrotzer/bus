/** 
 *  @fileOverview The router that handles all REST calls and passes them on.
 *
 *  @author       {@link http://kartoteket.as/team/bard.html}  Bård Røtzer
 *
 *  @requires     NPM:express
 *  @requires     NPM:lodash
 *  @requires     NPM:winston
 *  @requires     src/controllers/Sms.js
 *  @requires     src/controllers/FileController.js
 */

import express from 'express';
import { isArray } from 'lodash';
import Sms from '../controllers/Sms';
import FileController from '@/controllers/FileController';
import winston from 'winston';

const logpath = process.env.LOG_PATH || './';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'user-service' },
  transports: [
    //
    // - Write to all logs with level `error` and below to `combined.log` 
    // - Write all logs error (and below) to `error.log`.
    //
    new winston.transports.File({ filename: `${logpath}sms_error.log`, level: 'error' }),
    new winston.transports.File({ filename: `${logpath}sms_combined.log` })
  ]
});


let router = express.Router()


/**
 * Handles and responds to a request
 * @param {Object} res - the resource, used to wrap the response
 * @param {Object} data - The data to pass on as a successful response
 * @returns {Objedt} tha data object as json
 */
const wrapAndReturn = (res, data) => {
  logger.log({
    level: 'info',
    message: data
  });
  res.json(data);
}

/**
 * Handles and responds to an error. Will write to the log specified in wilson
 * @param {Object} res - the resource, used to wrap the response
 * @param {Object} data - The data to pass on as a successful response
 * @returns {Objedt} tha data object as json
 */
const wrapAndReturnError = (res, data) => {
  logger.log({
    level: 'error',
    message: data
  });
  res.json(data);
}


/**
 * GET the home page
 * @return {Object} a simple json object with message 
 */
router.get('/', (req, res) => {
  let output = [
   {
    message: "This is the Kartoteket Bus, used for some communications, unless you have a valid key, there's nothing here"
   }
  ];
  res.json(output);
});

/**
 * @typedef {Object} SMS
 * @param {String} message - the message to send
 * @param {String|Array} sendTo - the name of list to send to, or an array of 1 - n numbers
 * 
 * @typedef {Object} SmsBody
 * @param {SMS} body - The data passed on in the request
 * 
 * POST to send an sms
 * @param {SmsBody} req
 */
router.post('/sms/', (req, res) => {

  const smsController = new Sms(logger);
  smsController.send(req.body)
    .then(data => wrapAndReturn(res, data))
    .catch(data => wrapAndReturnError(res, data));

});

/**
 * @typedef {Object} Contact
 * @property {String} groupId - the group to add the user to
 * @property {String} name - the name of the user to add
 * @property {String} phone - the phone to add to the user
 * 
 * @param {Contact} req - The data passed on in the request
 * 
 * POST to send an sms
 * @param {SmsBody} req
 */
router.post('/contacts/', (req, res) => {

  const smsController = new Sms(logger);
  smsController.addContact(req.body)
    .then(data => wrapAndReturn(res, data))
    .catch(data => wrapAndReturnError(res, data));
});


/**
 * 
 * @typedef {Object} FileInfo
 * @property {String} filename - the name of the file, could be a full path, but i'd recommend against it
 * @property {String} data - the data to add
 * 
 * @param {FileInfo} req - The data passed on in the request
 * 
 */
router.post('/appendFile/', (req, res) => {

  const fileController = new FileController(logger);
  fileController.append(req.body)
    .then(data => wrapAndReturn(res, data))
    .catch(data => wrapAndReturnError(res, data));
});


/**
 * 
 * Some special routes added here that is used to forward mail to a file writer uing mailguns forwarding
 */
router.post('/travellog/', (req, res) => {
  const fileController = new FileController(logger);
  fileController.travellog(req.body)
    .then(data => wrapAndReturn(res, data))
    .catch(data => wrapAndReturnError(res, data));
})

export default router;