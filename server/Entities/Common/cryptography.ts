
// const crypto = require('crypto');
import * as crypto from 'crypto';
const config = require('../../Controllers/jwtConfig/jwtConfig');

class Cryptography {
  algorithm = 'aes-256-ctr';
  password = config.jwt_secret;

  encrypt(text) {
    // @ts-ignore
    const encryptcipher = crypto.createCipher(this.algorithm, this.password);
    let crypted = encryptcipher.update(text, 'utf8', 'hex');
    crypted += encryptcipher.final('hex');
    return crypted;
  }

  decrypt(text) {
    // @ts-ignore
    const decipher = crypto.createDecipher(this.algorithm, this.password);
    let dec = decipher.update(text, 'hex', 'utf8');
    dec += decipher.final('utf8');
    return dec;
  }
}

export const cipher = new Cryptography();
