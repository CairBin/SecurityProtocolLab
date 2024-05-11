import crypto from 'crypto';
import config from '../../config/config.js'
import lzStr from 'lz-string';


//check public key by arbiter's public key
function checkKey
(msg, publicKey) {
    let verify = crypto.createVerify(
        config
            .certificate
            .sign
            .hash
    );

    verify.update(msg.publicKey);
    verify.end();
    return verify.verify(publicKey, Buffer.from(msg.sign, 
        config.certificate.sign.encoding));
}

function publicEncry
(publicKey, val) {
    val = JSON.stringify(val).toString(config.crypto.cleartextEncoding);
    const buf = Buffer.from(val, config.crypto.cleartextEncoding);
    const inputLen = buf.byteLength;
    const bufs = [];
    let offset = 0;
    let endOffset = config.crypto.max_encry_block;

    //block
    while(inputLen-offset>0){
        if (inputLen - offset > config.crypto.max_encry_block) {
            const bufTmp = buf.slice(offset, endOffset);
            bufs.push(crypto.publicEncrypt({
                key:publicKey,
                padding:config.crypto.encry.padding
            }, bufTmp));
        } else {
            const bufTmp = buf.slice(offset, inputLen);
            bufs.push(crypto.publicEncrypt({
                key:publicKey,
                padding:config.crypto.encry.padding
            }, bufTmp));
        }
        offset += config.crypto.max_encry_block;
        endOffset += config.crypto.max_encry_block;
    }

    const result = Buffer.concat(bufs)
        .toString(config.crypto.cryptoEncoding);
    return result;
}

function privateDecry
(privateKey, val) {
    const buf = Buffer.from(val, config.crypto.cryptoEncoding);
    const inputLen = buf.byteLength;
    const bufs = [];
    let offSet = 0;
    let endOffSet = config.crypto.max_decry_block;
    
    while (inputLen - offSet > 0) {
        if (inputLen - offSet > config.crypto.max_decry_block) {
            const bufTmp = buf.slice(offSet, endOffSet);
            bufs.push(crypto.privateDecrypt({
                key:privateKey,
                padding:config.crypto.decry.padding
            }, bufTmp));
        } else {
            const bufTmp = buf.slice(offSet, inputLen);
            bufs.push(crypto.privateDecrypt({
                key: privateKey,
                padding: config.crypto.decry.padding
            }, bufTmp));
        }
        offSet += config.crypto.max_decry_block;
        endOffSet += config.crypto.max_decry_block;
    }
    const result = Buffer.concat(bufs)
        .toString(config.crypto.cleartextEncoding);

    return JSON.parse(result);
}

function symmetricEncry
(algo, val, key, iv, options){

    if(algo.toUpperCase() === 'AES-256-GCM'){
        let cipher = crypto.createCipheriv(algo, crypto.hash(config.symmetricEncry.hash, key), iv);
        const encrypted = Buffer.concat([
            cipher.update(Buffer.from(val, config.symmetricEncry.cleartextEncoding)),
            cipher.final(),
        ]);

        return {
            encrypted:encrypted.toString(config.crypto.cryptoEncoding),
            authTag: cipher.getAuthTag().toString(config.crypto.cryptoEncoding)
        };
    }else if(algo.toUpperCase() === 'AES-256-CBC'){
        let cipher = crypto.createCipheriv(algo, crypto.hash(config.symmetricEncry.hash, key), iv);
        const encrypted = Buffer.concat([
            cipher.update(Buffer.from(val, config.symmetricEncry.cleartextEncoding)),
            cipher.final(),
        ]);

        return {
            encrypted: encrypted.toString(config.crypto.cryptoEncoding)
        };
    }
    
}

function symmetricDecry(algo,val,key,iv,options){
    if (algo.toUpperCase() === 'AES-256-GCM'){
        let decipher = crypto.createDecipheriv(algo, crypto.hash(config.symmetricEncry.hash, key), iv);
        decipher.setAuthTag(Buffer.from(options.authTag, config.symmetricEncry.cryptoEncoding));
        const decrypted = Buffer.concat([
            decipher.update(Buffer.from(val,config.symmetricEncry.cryptoEncoding)),
            decipher.final(),
        ]);
        return {
            decrypted:decrypted.toString(config.symmetricEncry.cleartextEncoding)
        };
    }else if(algo.toUpperCase() === 'AES-256-CBC'){
        let decipher = crypto.createDecipheriv(algo, crypto.hash(config.symmetricEncry.hash, key),iv);
        // decipher.setAuthTag(Buffer.from(options.authTag, config.symmetricEncry.cryptoEncoding));
        const decrypted = Buffer.concat([
            decipher.update(Buffer.from(val, config.symmetricEncry.cryptoEncoding)),
            decipher.final(),
        ]);
        return {
            decrypted: decrypted.toString(config.symmetricEncry.cleartextEncoding)
        };
    }
}


export default{
    publicEncry,
    privateDecry,
    checkKey,
    symmetricDecry,
    symmetricEncry
}