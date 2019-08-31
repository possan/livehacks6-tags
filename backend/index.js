const WebSocket = require('ws');

const eventId = 'AB91BC33-D3E5-4746-9E98-EACA63421316';

const ws = new WebSocket(`wss://stagecast.se/api/events/${eventId}/ws`)

ws.on('open', function open() {
    console.log('logging in...');
    ws.send(JSON.stringify({
        "email": "po@spotify.com",
        "password": "EventPassword1234"
    }));
});

ws.on('message', function incoming(data) {
    console.log(data.toString());
    try {
       var data = JSON.parse(data.toString())
       console.log(JSON.stringify(data));
    } catch(e) {
    }
});

var beat = 0;
setInterval(() => {
    console.log('sending clock tick...');
    ws.send(JSON.stringify({type:'clock', beat}));
    beat += 1;
}, 1000);
