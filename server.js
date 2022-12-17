
const express = require('express');
const sphp = require("sphp");

const app = express();
app.use(sphp.express('./'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('./'))
app.use('/favicon.ico', express.static('.adax.ico'));


let port = 80;

app.listen(port);
console.log('server on', port);