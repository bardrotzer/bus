/** 
 *  @fileOverview Controller for sending SMS as response to a POST from somewhere.
 *
 *  @author       {@link http://kartoteket.as/team/bard.html}  Bård Røtzer
 *
 *  @requires     NPM:lodash
 *  @requires     NPM:winston
 *  @requires     NPM:Axios
 *  @requires     src/utils:urls.js
 */
import { isArray, map, get } from 'lodash';
import { isString } from 'util';
import urls from '@/utils/urls';
import Axios from 'axios';

/**
 * A class to handle sending and receiving SMS from and endpoint
 * @class Sms
 *
 * @property licensePlate the car's license plate number
 * @property vehicleType  the type of car
 */
export default class Sms {
  /**
   * @constructor
   * 
   * @param {SMS} data - The data passed in the post 
   * 
   */
  constructor(data) {
    this.config = {
      headers: {
        "Content-Type": "application/json",
        "Authorization": "AccessKey " + process.env.MESSAGEBIRD_API_KEY,
      }
    };
  }

  /**
   *  @memberOf Sms
   *  
   *  @private
   *  
   *  @function _getContacts
   *  @description retrieves the list of contacts from messagebird (if list is a id) or returns the array of numbers if passed
   *  
   *  @param {Array|String} recipients - (optional) the id of the list of a real list of recipients (defaults to process.env.DEFAULT_SMS_LIST)
   *  @returns {Promise} a promise that resolves with the recipients or fails with a message
   */
  _getContacts(recipients) {
    return new Promise((resolve, reject) => {
      //
      // If a list of numbers, just use the numbers to perform a post
      //
      if(isArray(recipients) && recipients.length) {
        resolve(recipients);
        return;
      }
      //
      // if the recipient is a group id, the grop needs to be fetched first before performing a send
      // 
      recipients = isString(recipients) && recipients.length > 10 ? recipients : process.env.DEFAULT_SMS_LIST;
    
      const url = urls('mb_group_contacts', recipients);
      //
      // request recipients from the group
      //
      Axios.get(url, this.config)
        .then((list) => {
          // extract the recipients only from the list
          const items = map(get(list, 'data.items'), (d) => {
            return d.msisdn;
          });
          if (isArray(items) && items.length) {
            resolve(items);
          } else {
            reject({
              message: 'no valid recipients found'
            });
          }
        });
    });
  }

  /**
   *  @typedef {Object} messagebody
   *  @property {String} message - the message to send
   *  @property {String} originator - (optional) the name of the sender  (defaults to process.env.ORIGINATOR)
   *  @property {Array|String} recipients - (optional) the id of the list of a real list of recipients (defaults to process.env.DEFAULT_SMS_LIST)
   * 
   *  @memberOf Sms
   * 
   *  @function send
   *  @description Sends the message specified in this.message to the list or number's specifies
   *  @param {messagebody} data
   *  @returns {Promise} a promise that resolves or fails if the message is sent
   */
  send(data) {
    const message = data.message;
    const originator = data.originator || process.env.ORIGINATOR
    const url = urls('mb_messages');
    // assemble the message object
    var messageObj = {
      'originator': originator,
      'recipients': [],
      'body': message
    };

    // the function will return a promise
    return new Promise((resolve, reject) => {
     
      this._getContacts(data.recipients)
        .then((recipients) => {
          // 
          // set the recipienta snd post the message
          //
          messageObj.recipients = recipients;
          Axios.post(url, messageObj, this.config)
            .then((r) => {
              resolve(r.data);
            })
            .catch((e) => {
              reject(e.data);
            });
        })
        .catch((e) => {
          reject(e);
        });
      });
  }

  /**
   *  @memberOf Sms
   * 
   *  @function addContact
   *  @description Adds a contact to the group specified, or to the default group
   *  @param {Contact} contact - the contact to add
   *  @returns {Promise} a promise that resolves or fails if the user is added
   */
  addContact(contact) {
    const contactsUrl = urls('mb_contacts');
    const groupId = contact.groupId || process.env.DEFAULT_SMS_LIST;
    const groupsUrl = urls('mb_group_contacts', groupId);
    const name = isString(contact.name) ? contact.name.split(' ') : ['No Name'];
    // the object for the contact
    const contactObj = {
      msisdn: contact.phone,
      firstName: name[0],
      lastName: name[1] || ''
    }
    // preliminary object for the group
    const groupObj = {
      ids: []
    }
    return new Promise((resolve, reject) => {
      // create the contact
      Axios.post(contactsUrl, contactObj, this.config)
        .then((r) => {
          groupObj.ids.push(r.data.id);
          // add the contact to the group
          Axios.put(groupsUrl, groupObj, this.config)
            .then((d) => {
              resolve(d.data);
            })
            .catch((e) => {
              reject(e.response.data);
            })
        })
        .catch((e) => {
          reject(e.response.data);
        })
    })
  }

};