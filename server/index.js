var Hapi = require('hapi');
var Fs = require('fs');


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
    },
    tls: {
        key: Fs.readFileSync('/root/selfsigned.key'),
        cert: Fs.readFileSync('/root/selfsigned.crt')
    }
});


server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {

        return reply('Oh hai!');
    }
});


server.start(function () {

    console.log('Look what you have done');
});
