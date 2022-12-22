
const express = require('express');
const sphp = require("sphp");
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json());
app.use(sphp.express('./'));
app.use(express.static('./'))
app.use('/favicon.ico', express.static('./media/favicon.ico'));

let port = 80;
app.listen(port);
console.log('server on', port);
