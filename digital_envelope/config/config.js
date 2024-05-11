import crypto from 'crypto';

export default{
    arbiterName:'arbiter', //name of the trusted midman
    certificate:{
        readEncoding: 'utf-8',
        writeEncoding:'utf-8',
        generateKeysPairOptions: {
            modulusLength: 1024,
            publicKeyEncoding: {
                type: 'pkcs1',
                format: 'pem'
            },
            privateKeyEncoding: {
                type: 'pkcs8',
                format: 'pem'
            }
        },
        algorithm:'rsa',
        //please end with '/'
        dist:'keys/', 
        filename:{
            privateKey:{
                prefix: '',
                suffix: '_private_key'
            },
            publicKey:{
                prefix:'',
                suffix:'_public_key'
            }
        },
        sign:{
            hash:'MD5',
            encoding:'base64'
        }
    },
    crypto:{
        cleartextEncoding:'utf-8',
        cryptoEncoding:'base64',
        max_encry_block:117-31,
        max_decry_block:128,
        encry:{
            padding:crypto.constants.RSA_PKCS1_PADDING,
        },
        decry:{
            padding:crypto.constants.RSA_PKCS1_PADDING
        }
    },
    server:{
        port:3000,
        host:'localhost',
        dh:{
            primeLength: 1024,   //length of the prime p
            generator: 5,        // prime a
            encoding:'base64',
        }
    },
    symmetricEncry:{
        algorithm: 'AES-256-GCM',
        cryptoEncoding:'base64',
        cleartextEncoding:'utf-8',
        hash:'MD5',
        ivNumber:16,    //16bytes
    }
    
}