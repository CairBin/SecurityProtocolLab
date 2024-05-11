import config from "../../config/config.js";
import crypto from 'crypto';
import fs from 'fs';
import stringRandom from 'string-random';

function writeKeysFile
(name) {
    const pair = crypto.generateKeyPairSync(
        config.certificate.algorithm,
        config.certificate.generateKeysPairOptions
    );

    fs.writeFileSync(`${config.certificate.dist}${config.certificate.filename.publicKey.prefix}${name}${config.certificate.filename.publicKey.suffix}.${config.certificate.generateKeysPairOptions.publicKeyEncoding.format}`, pair.publicKey);
    fs.writeFileSync(`${config.certificate.dist}${config.certificate.filename.privateKey.prefix}${name}${config.certificate.filename.privateKey.suffix}.${config.certificate.generateKeysPairOptions.privateKeyEncoding.format}`, pair.privateKey);
    return pair;
}

//sign with arbiter's private key
function signPublic
(name, privateKey) {
    const val = fs.readFileSync(`${config.certificate.dist}${config.certificate.filename.publicKey.prefix}${name}${config.certificate.filename.publicKey.suffix}.${config.certificate.generateKeysPairOptions.privateKeyEncoding.format}`)
        .toString(config.certificate.readEncoding);
    const sign = crypto.createSign(config.certificate.sign.hash);
    sign.update(val).end();

    fs.writeFileSync(`${config.certificate.dist}${config.certificate.filename.publicKey.prefix}${name}${config.certificate.filename.publicKey.suffix}.json`, JSON.stringify({
        publicKey: val,
        sign: sign.sign(privateKey)
            .toString(config.certificate.sign.encoding)
    }));
}

//check public key by arbiter's public key
function checkKey
(msg, publicKey) {
    let verify = crypto.createVerify(config.certificate.sign.hash);
    verify.update(msg.publicKey);
    verify.end();
    return verify.verify(
        publicKey, 
        Buffer.from(msg.sign, config.certificate.sign.encoding)
    );
}

function serverDiffieHellman(primeLength, generator){
    let server = crypto.createDiffieHellman(primeLength,generator);
    server.generateKeys();
    return server;
}

function clientDiffieHellman(prime,generator){
    let client = crypto.createDiffieHellman(prime,generator);
    client.generateKeys();
    return client;
}

function generateIv(n){
    return stringRandom(n,{letters:false});
    // return '0123456789012345'
}

export default{
    writeKeysFile,
    signPublic,
    checkKey,
    serverDiffieHellman,
    clientDiffieHellman,
    generateIv
}