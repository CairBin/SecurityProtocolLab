import express from "express";
import defaultController from './../controller/defaultController.js';

const router = express.Router();

router.get('/',(req,res,next)=>{
    defaultController.defaultFunc(req, res, next);
})

export default router;