var Boom = require('boom');
var Handlebars = require('handlebars');
var Hapi = require('hapi');
var Fs = require('fs');
var Level = require('level');
var Path = require('path');


//Decalare internals
var internals = {};

var server = new Hapi.Server();


server.connection({
    port: 7843,
    routes: {
        security: {
            xframe: {
                rule: 'allow-from',
                source: 'https://thefantasyfix.com'
            }
        }
    }//,
    //tls: {
    //    key: Fs.readFileSync('/root/selfsigned.key'),
    //    cert: Fs.readFileSync('/root/selfsigned.crt')
    //}
});


var viewOptions = {
    engines: {
        html: Handlebars
    },
    layout: true,
    layoutPath: Path.join(__dirname, '../views/layouts'),
    path: Path.join(__dirname, '../views'),
    isCached: false
};

server.views(viewOptions)


server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {

        return reply().view('lineups');
    }
});

server.route({
    method: 'GET',
    path: '/lineups',
    handler: function (request, reply) {

        var lineups = request.server.app.lineups;
        var day = request.query.day;

        if (day) {
            if (lineups[day]) {
                return reply(lineups[day]);
            }

            var db = Level(request.server.app.dbpath, { valueEncoding: 'json' });
            return db.get(day, function (err, daysLineups) {

                if (err) {
                    return reply(Boom.wrap(err), 404);
                }

                lineups[day] = internals.convertLineups(daysLineups);
                return reply(daysLineups);
            });
        }

        day = new Date();
        day = new Date(day.getFullYear(), day.getMonth(), day.getDate());
        day = day.getTime();
        day = 1422594000000;

        if (lineups[day]) {
            return reply(lineups[day]);
        }

        return reply(Boom.internal());
    }
});


server.start(function () {

    server.app.dbpath = './data/lineups';

    day = new Date();
    day = new Date(day.getFullYear(), day.getMonth(), day.getDate());
    day = day.getTime();
    day = 1422594000000;

    var db = Level(server.app.dbpath, { valueEncoding: 'json' });
    db.get(day, function (err, daysLineups) {

        if (err) {
            return console.log(':: ERR ::', err);
        }

        server.app.lineups = {};
        server.app.lineups[day] = internals.convertLineups(daysLineups);

        console.log('Look what you have done');
    });
});

internals.convertLineups = function (rawLineups) {

    var lineups = [];
    for (var i in rawLineups) {
        if (rawLineups.hasOwnProperty(i)) {
            lineups.push(internals.convertLineup(rawLineups[i]));
        }
    }

    return lineups;
}


internals.convertLineup = function (rawLineup) {

    var lineup = {};

    lineup.home = rawLineup.home;
    lineup.home['sp'] = rawLineup.home_prob;

    lineup.away = rawLineup.away;
    lineup.away['sp'] = rawLineup.away_prob;

    delete rawLineup.home;
    delete rawLineup.away;
    delete rawLineup.home_prob;
    delete rawLineup.away_prob;

    lineup.info = rawLineup;

    return lineup;
}
