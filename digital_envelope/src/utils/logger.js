
const log = (options)=>{
    console[options.type](`[${options.type.toUpperCase()}] ${options.event?'['+options.event.toUpperCase()+']' : ''} ${options.msg}`);
}

const info = (options)=>{
    options.type = 'info';
    log(options);
}


const warn = (options)=>{
    options.type = 'warn';
    log(options);
}

const error = (options)=>{
    options.type = 'error';
    log(options);
}

export default{
    info,warn,error
}