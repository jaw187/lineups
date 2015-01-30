var Hapi = require('hapi');


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
    }
});


server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {

        return reply('Oh hai!');
    }
});


server.start();
