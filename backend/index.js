const WebSocket = require('ws');

const eventId = 'AB91BC33-D3E5-4746-9E98-EACA63421316';

const tagList = [{"tag": "tag1","users": []}, {"tag": "Pop","users": []}, {"tag": "Country","users": []}, {"tag": "Classic","users": []}]

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
       if (data.type === 'get-tags'){
        ws.send(JSON.stringify({type:'tagslist', tagList}));
       }
       if (data.type === 'add-tag'){
        if(-1 === tagList.indexOf(x => x.tag === data.tag)){
             tagList.push({tag:data.tag, users:[data.user]})              
        }
        }
       if (data.type === 'select-tag'){
           if(-1 === tagList.find(x => x.tag === data.tag).users.indexOf(o => o === data.user)){
                tagList.find(x => x.tag === data.tag).users.push(data.user);                  
           }            
       }
       if (data.type === 'deselect-tag'){
        tagList.find(x => x.tag === data.tag).users.pop(data.user);   
       }               
      ws.send(JSON.stringify({type:'tagslist', tagList}));    
    }
    catch(e) {
    }
});


var beat = 0;
setInterval(() => {
    console.log('sending clock tick...');
    ws.send(JSON.stringify({type:'clock', beat}));
    beat += 1;
}, 1000);
