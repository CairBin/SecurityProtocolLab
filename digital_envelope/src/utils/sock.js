import logger from './logger.js';

const sockOn = (event,socket,callback)=>{
    socket.on(event,(msg)=>{
        logger.info({
            msg:'RECEIVED EVENT...',
            event:event
        });
        callback && callback(msg)
    })
}

const sockEmit = (event,socket,msg)=>{
    logger.info({
        msg:'EMITTED EVENT...',
        event:event
    });
    socket.emit(event,msg);
}

export default{
    sockOn,
    sockEmit
}