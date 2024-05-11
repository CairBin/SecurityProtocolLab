import {io} from 'socket.io-client';
import logger from './utils/logger.js'
import KeysLoader from './utils/keysLoader.js'
import sock from './utils/sock.js'
import myCrypto from './utils/mycrypto.js'
import generator from './utils/generator.js'

// load configurations
import config from '../config/config.js';

const keysLoader = new KeysLoader('Bob')

const socket = io(`http://${config.server.host}:${config.server.port}`);

sock.sockOn('connect',socket,()=>{
    logger.info({
        msg: `connected server ${config.server.host}:${config.server.port}`
    })
})

//receive Bob's certificate
sock.sockOn('certificate',socket, (msg) => {
    if (!generator.checkKey(msg, keysLoader.arbiterPub)){
        logger.error('unfair peer public key')
        socket.disconnect();
    }
    // set Alice's public key
    keysLoader.peerPub = msg.publicKey;
    sock.sockEmit('certificate', socket, keysLoader.selfPubJson);
})

sock.sockOn('dh', socket, (msg) => {
    try{
        msg = myCrypto.privateDecry(keysLoader.selfPri, msg);
    }catch{
        logger.error({
            msg: 'message format error'
        });
        socket.disconnect();
    }
    
    keysLoader.dhObj = generator.clientDiffieHellman(
        msg.p,
        msg.a       
    );

    keysLoader.sessionKey = keysLoader.dhObj.computeSecret(
        Buffer.from(msg.pub,config.server.dh.encoding)
    )

    // set symmetric encryption's iv
    logger.info({
        msg:'iv: ' + msg.iv
    })
    logger.info({
        msg:'session key: ' + msg.pub
    })
    keysLoader.iv = msg.iv
    
    logger.info({
        msg: 'algorithm: ' + msg.algo
    })

    const encry = myCrypto.symmetricEncry(msg.algo, 'hello, world!', keysLoader.sessionKey, keysLoader.iv);
    logger.info({
        msg: 'chipher: '+encry.encrypted
    })
    sock.sockEmit('dh', socket, myCrypto.publicEncry(
        keysLoader.peerPub,
        {
            p:msg.p,
            a:msg.a,
            pub:keysLoader.dhObj
                .getPublicKey()
                .toString(config.server.dh.encoding),
            algo:msg.algo,
            result:encry.encrypted,
            options:{
                authTag:encry.authTag
            }
        }
    ))
})
