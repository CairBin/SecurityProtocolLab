

const defaultFunc = (req, res, next)=>{
    res.status(500).send('Hello World!')
}

export default{
    defaultFunc
}