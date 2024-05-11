import {Server} from 'socket.io';
import { createServer } from 'http';
import logger from './utils/logger.js'
import KeysLoader from './utils/keysLoader.js'
import sock from './utils/sock.js'
import myCrypto from './utils/mycrypto.js'
import generator from './utils/generator.js'

// load configurations
import config from '../config/config.js';

// load and manage keys
const keysLoader = new KeysLoader('Alice');
// set diffie-hellman object to generate session key
keysLoader.dhObj = generator
    .serverDiffieHellman(    
        config.server.dh.primeLength,  // prime p length
        config.server.dh.generator
);

const httpServer = createServer();
const io = new Server(httpServer,{
    // options
});


io.on("connection", (socket)=>{
    logger.info({
        msg:`connected, socketId = ${socket.id}`
    })

    //send Alice's certificate
    sock.sockEmit(
        'certificate',
        socket,
        keysLoader.selfPubJson
    );

    //receive Bob's certificate
    sock.sockOn(
        'certificate',socket,
        (msg)=>{
        
        //check Bob's public key is fair
        if(!myCrypto.checkKey(msg, keysLoader.arbiterPub)){
            // failed verification
            logger.error('unfair connection')
            socket.disconnect();    //disconnect
        }

        /* -------- Success ---------- */

        // set Bob's public key
        keysLoader.peerPub = msg.publicKey;
        keysLoader.symAlgo = config.symmetricEncry.algorithm;

        // swap dh param
        keysLoader.iv = generator.generateIv(config.symmetricEncry.ivNumber);
        logger.info({
            msg: `iv: ` + keysLoader.iv
        })
        logger.info({
            msg: 'session key: ' + keysLoader.dhObj.getPublicKey().toString(config.server.dh.encoding)
        })
        sock.sockEmit('dh',socket,
            myCrypto.publicEncry( //encrypt by Bob's public key
            keysLoader.peerPub,
            {
                a:      keysLoader.dhObj.getGenerator().toString(config.server.dh.enconding),
                p:      keysLoader.dhObj.getPrime().toString(config.server.dh.encoding),
                pub:    keysLoader.dhObj.getPublicKey().toString(config.server.dh.encoding),
                // set symmetric encryption algorithm
                algo:   config.symmetricEncry.algorithm,
                iv: keysLoader.iv
            }
        ));

    })

    // generate session key and decry a msg to check
    sock.sockOn('dh',socket, (msg)=>{
        try{
            msg = myCrypto.privateDecry(keysLoader.selfPri, msg);
            keysLoader.sessionKey =
                keysLoader.dhObj.computeSecret(
                    Buffer.from(msg.pub, config.server.dh.encoding)
                )

            logger.info({
                msg: 'chipher: '+msg.result
            });

            logger.info({
                msg: 'cleartext: '
                    + myCrypto.symmetricDecry(
                        keysLoader.symAlgo,
                        msg.result,
                        keysLoader.sessionKey,
                        keysLoader.iv,
                        msg.options
                    )
            })
            

        }catch(err){
            logger.error({
                msg:err
            })
            logger.error({
                msg: 'message format error'
            });
            socket.disconnect();
        }      
        
        

    })


})

// listen port 3000
logger.info({
    msg: `listening port ${config.server.port} ...`
});
httpServer.listen(config.server.port);