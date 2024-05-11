import fs from 'fs';
import config from '../../config/config.js';


export default class KeysLoader{
    constructor(name){
        this.sessionKey = '';
        
        // my public key with signature
        this.selfPubJson = JSON.parse(
            fs.readFileSync(
                config.certificate.dist
                + config.certificate.filename.publicKey.prefix
                + name
                + config.certificate.filename.publicKey.suffix
                + '.json'
            )
        );

        // my private key
        this.selfPri = fs.readFileSync(
            config.certificate.dist
            + config.certificate.filename.privateKey.prefix
            + name
            + config.certificate.filename.privateKey.suffix
            + '.'
            + config.certificate.generateKeysPairOptions.privateKeyEncoding.format
        ).toString(config.certificate.readEncoding)
        // peer's public  key (from handshake)
        this.peerPub = '';

        // diffie-hellman object
        this.dhObj = null;

        // arbiter public key (from certificate file)
        this.arbiterPub = fs.readFileSync(
            config.certificate.dist
            + config.certificate.filename.publicKey.prefix
            + config.arbiterName
            + config.certificate.filename.publicKey.suffix
            + '.'
            + config.certificate.generateKeysPairOptions.privateKeyEncoding.format
        ).toString(config.certificate.readEncoding);

        this.iv = "";
        this.symAlgo = ''
    }
}