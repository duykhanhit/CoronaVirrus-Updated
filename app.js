const express = require('express')
const app = express();
const request = require('request');
const co = require('co');
const axios = require('axios');

app.set("views", __dirname + "/apps/views");
app.set("view engine", "ejs");

app.use("/static", express.static(__dirname + "/public"));


app.get('/', function (req, res) {

  function totalC(list){
    return list.reduce(function(a, b){
      return (a + parseInt(b.Confirmed));
    }, 0);
  }
  function totalD(list){
    return list.reduce(function(a, b){
      return (a + parseInt(b.Deaths));
    }, 0);
  }
  function totalR(list){
    return list.reduce(function(a, b){
      return (a + parseInt(b.Recovered));
    }, 0);
  }

  function read(link) {
    axios.get(link)
      .then(function (resp) {
        //  console.log('Data: ', res.data);
        totalCVN = totalC(resp.data.provinces);
        totalCG = totalC(resp.data.countries);
        totalDVN = totalD(resp.data.provinces);
        totalDG = totalD(resp.data.countries);
        totalRVN = totalR(resp.data.provinces);
        totalRG = totalR(resp.data.countries);
        res.render('index', { data: resp.data,
                              ConfirmedVN: totalCVN,
                              ConfirmedG: totalCG,
                              DeathsVN: totalDVN,
                              DeathsG: totalDG,
                              RecoveredVN: totalRVN,
                              RecoveredG: totalRG
                            });
      });
  }

  var api = [
    'https://coronaapivn.herokuapp.com/api',
  //  'https://code.junookyo.xyz/api/ncov-moh/data.json'
  ];

  var readAPI = co.wrap(function* (links) {
    var values = yield links.map(function (link) {
      return read(link);
    });
    return values;
  });

  readAPI(api);

});

app.listen(3000);