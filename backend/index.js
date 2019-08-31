const WebSocket = require('ws');

const eventId = 'AB91BC33-D3E5-4746-9E98-EACA63421316';

const tagList = [{"tag": "Laser", "color": 1,"users": []}, {"tag": "Fixies", "color": 2,"users": []}, {"tag": "Kombucha", "color": 3,"users": []}
                , {"tag": "Hiking", "color": 4,"users": []}, {"tag": "Hackathon", "color": 5,"users": []}]

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
       }
       if (data.type === 'add-tag'){
        if(!tagList.find(x => x.tag.toLowerCase() === data.tag.toLowerCase())){
            var maxnum = Math.max(...tagList.map(x => x.color));
             tagList.push({tag:data.tag, color: maxnum+=1, users:[data.user]})            
        }
       }
       if (data.type === 'select-tag'){
           if(-1 === tagList.find(x => x.tag.toLowerCase() === data.tag.toLowerCase()).users.indexOf(data.user)){
                tagList.find(x => x.tag.toLowerCase() === data.tag.toLowerCase()).users.push(data.user);                  
           }            
       }
       if (data.type === 'deselect-tag'){
        tagList.find(x => x.tag.toLowerCase() === data.tag.toLowerCase()).users.pop(data.user);   
       }
       //tagList.sort(function(a, b){return b.users.length-a.users.length});             
       ws.send(JSON.stringify({type:'tagslist', tagList}));    
    }
    catch(e) {
    }
});

var beat = 0;
setInterval(() => {
    console.log('sending clock tick...');
    ws.send(JSON.stringify({type:'clock', beat}));
    ws.send(JSON.stringify({type:'tagslist', tagList}));
    beat += 1;
}, 1000);
