/** 
 *  @fileOverview Controller for sending adding and writing to files as response to a POST from somewhere.
 *
 *  @author       {@link http://kartoteket.as/team/bard.html}  Bård Røtzer
 *
 *  @requires     NPM:lodash
 *  @requires     NPM:winston
 *  @requires     NPM:Axios
 *  @requires     NPM:fs
 *  @requires     src/utils:urls.js
 */
import fs from 'fs';


/**
 * A class to handle appending and getting data from files
 * 
 * @class FileController
 */
export default class FileController {

  /**
   * @constructor
   * 
   * @param {Object} logger - The winston logger
   * 
   */
  constructor(logger) {
    this.logger = logger

  }

  append(data) {
    const fileName = data.fileName;
    const stub = data.data;
  
    return new Promise((resolve, reject) => {
      const filePath = `${process.env.BASE_PATH}/${fileName}`;

      fs.readFile(filePath, 'utf8', (err, data) => {
        //
        // log and return an error if failed
        //
        if(err) {
          reject({
            message: `failed to open ${filePath}`
          });
        } else {
          //
          // no errors, append the node
          // 
          const obj = JSON.parse(data);
          obj.push(stub);
          const json = JSON.stringify(obj);

          // write back andx say yay
          fs.writeFile(filePath, json, 'utf8', (err) => {
            if(err) {
              reject({
                message: `failed to write to  ${filePath}`
              });
            } else {
              resolve(stub);
            }
          });
        }
      });
    });
  }
}