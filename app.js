const express = require('express')
const app = express();
const request = require('request');

app.set("views", __dirname + "/apps/views");
app.set("view engine", "ejs");

app.use("/static", express.static(__dirname + "/public"));


function load(path) {
  return new Promise(function (resolve, reject) {
    request(path, function (error, response, body) {
      if (error) {
        reject(error);
      } else {
        resolve(body);
      }
    });
  });
}

app.get('/', function (req, res) {

  load('https://code.junookyo.xyz/api/ncov-moh/data.json')
    .then(function (body) {
        body = JSON.parse(body);
        res.render('index', {body: body});
    });
})

app.listen(3000);