// Load modules
var Level = require('level');
var Wreck = require('wreck');


var db = Level('./lineups', { valueEncoding: 'json' });


var url = 'http://test.baseballpress.com/restricted/lineups.pull.server.php'
var options = {
    headers: {
        authorization: 'Basic ' + new Buffer('alan@thefantasyfix.com:Alan2125').toString('base64')
    },
    json: true
};


Wreck.get(url, options, function (err, res, payload) {

    if (err) {
        return console.log(':: ERR ::', err);
    }

    var day = new Date();
    day = new Date(day.getFullYear(), day.getMonth(), day.getDate());
    day = day.getTime();

    db.put(day, payload, function (err) {

        if (err) {
            return console.log(':: ERR ::', err);
        }

        console.log(day);
    });
});
