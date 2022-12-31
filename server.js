const fs = require('fs');

const Weltmeister = {
    save: function(path, json) {
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
};


const express = require('express');
const sphp = require("sphp");
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());

app.post('/lib/weltmeister/api/save.php', (req, res, next) => {
    res.send(Weltmeister.save(req.body.path, req.body.data));
});

app.get('/lib/weltmeister/api/glob.php', (req, res, next) => {
    console.log(req.body);
    next();
});

app.use(sphp.express('./'));
app.use(express.static('./'))
app.use('/favicon.ico', express.static('./media/favicon.ico'));

let port = 80;
app.listen(port);
console.log('server on', port);
