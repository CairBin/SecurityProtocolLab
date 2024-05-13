

const log = (options)=>{
    console[options.type](`[${options.type.toUpperCase()}] ${options.msg}`)
}

const info = (msg)=>{
    log({
        type:"info",
        msg:msg
    });
}

const warn = (msg)=>{
    log({
        type:'warn',
        msg:msg
    });
}

const error = (msg)=>{
    log({
        type:'error',
        msg:msg
    });
}

export default{
    info,warn,error
}