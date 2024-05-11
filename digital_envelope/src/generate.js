import generator from './utils/generator.js'
// load config file
import config from '../config/config.js'



function main(){
    // generate arbiter's certificate
    const arbiterPair = generator.writeKeysFile(config.arbiterName)
    // generate A's certificate
    generator.writeKeysFile('Alice')
    // generate B's certificate
    generator.writeKeysFile('Bob')

    //sign with arbiter's private key
    generator.signPublic('Alice', arbiterPair.privateKey);
    generator.signPublic('Bob', arbiterPair.privateKey);

}

main();