import CryptoJS from 'crypto-js';

export function generateHMACSignature(data: any, secret: string): string {
    const jsonData = JSON.stringify(data);
    const signature = CryptoJS.HmacSHA256(jsonData, secret).toString();
    return signature;
}