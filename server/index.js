var Hapi = require('hapi');


var server = new Hapi.Server();


server.connection({
    port: 7843,
    cors: true
});


server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {

        return reply('Oh hai!');
    }
});


server.start();
