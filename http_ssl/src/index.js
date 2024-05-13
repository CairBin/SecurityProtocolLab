import express from 'express';
import https from 'https';
import http from 'http';
import defaultRoute from './route/defaultRoute.js'
import fs, { copyFile } from 'fs';
import path from 'path';
import { dirname } from "node:path";
import { fileURLToPath } from "node:url"
import config from './../config/config.js';
import logger from './utils/logger.js';

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express();
const httpsServer = https.createServer({
    key:fs.readFileSync('keys/private.pem'),
    cert:fs.readFileSync('keys/file.crt')
},app)
const httpServer = http.createServer({});

//static path
app.use(express.static(
    path.join(__dirname, config.server.static)));

app.use('/',defaultRoute);
// 404 page
app.use('*',(req,res)=>{
    res.redirect('html/404.html')
})


httpsServer.listen(config.server.https.port, config.server.https.host, ()=>{
    logger.info(`https service is running on https://${config.server.https.host}:${config.server.https.port}`);
})

httpServer.listen(config.server.http.port, config.server.http.host, ()=>{
    logger.info(`http service is running on http://${config.server.http.host}:${config.server.http.port}`);
})