const fs = require('fs');

function saveWeltmeister(path, json) {
    let result = { error: 0 };
    if (path && json && path.length > 0 && json.length > 0) {
        if (path.endsWith('.js')) {
            try {
                fs.writeFileSync(path, json);
            } catch (err) {
                result = { error: 2, msg: `Couldn't write to file: ${path}` };
            }
        } else {
            result = { error: 3, msg: 'File must have a .js suffix' };
        }
    } else {
        result = { error: 1, msg: 'No Data or Path specified' };
    }
    return JSON.stringify(result);
}

function writeGameData(data){
    let result = { error: 0 };
    try {
        fs.writeFileSync('gamedata.js', data, 'utf8');
    } catch (err) {
        result = { error: 1, msg: "Couldn't write data" };
    }
    return JSON.stringify(result);
}

function loadGameData(){
    let result = { error: 0 };
    try {
        if(fs.existsSync(path)){
            result.data = fs.readFileSync('gamedata.js', 'utf8');
        } else {
            result = { error: 2, msg: "Data doesn't exists" };
        }
    } catch (err) {
        result = { error: 1, msg: "Couldn't read data" };
    }
    return JSON.stringify(result);
}


const express = require('express');
const sphp = require("sphp");
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());

app.post('/lib/weltmeister/api/save.php', (req, res, next) => {
    let result = saveWeltmeister(req.body.path, req.body.data);
    res.send(result);
});

app.get('/gamedata.js', (req, res, next) => {
    let result = loadGameData(req.body.data);
    res.send(result);
});

app.post('/gamedata.js', (req, res, next) => {
    let result = writeGameData(req.body.data);
    res.send(result);
});

app.use(sphp.express('./'));
app.use(express.static('./'))
app.use('/favicon.ico', express.static('./media/favicon.ico'));

let port = 80;
app.listen(port);
console.log('server on', port);
