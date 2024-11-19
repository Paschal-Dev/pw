import CryptoJS from 'crypto-js';
import { Buffer } from 'buffer';

const encryptPayload = (payload: unknown) => {
   
    // Define your secret key (should be kept secure)
    const secretKey = CryptoJS.enc.Utf8.parse('password');

    // Define JWT HeaderI
    const header = {
        alg: 'HS256',
        typ: 'JWT'
    };

    // Encode the Header and Payload
    const encodedHeader = base64UrlEncode(header);
    const encodedPayload = base64UrlEncode(payload);

    const sign = signature(encodedHeader, encodedPayload, secretKey)

    // Create the signature

    // Construct the JWT
    return { payload: `${encodedHeader}.${encodedPayload}.${sign}` };

}

const signature = (header: string, payload: string, secret: string | CryptoJS.lib.WordArray) => CryptoJS.HmacSHA256(header + '.' + payload, secret)
    .toString(CryptoJS.enc.Base64)
    .replace(/=+$/, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');


const base64UrlEncode = (obj: unknown) => {
    return Buffer.from(JSON.stringify(obj)).toString('base64')
        .replace(/=+$/, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
}


export default encryptPayload;