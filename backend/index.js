const express = require('express');
const cors = require('cors');


const app = express();

app.use(express.json());
app.use(cors());

const messages = [];

app.post('/messages', (req, res)=>{
    let {body} = req;
    messages.push(body);
    console.log(body);
    res.status(204).end();
});

app.get('/messages', (req, res)=>{
    res.json(messages);
});


//long polling
const subscribers={}; //subscribers={1:res, 2:res, ....}

app.get('/long-messages-sub', (req, res)=>{
    const ID = Math.ceil(Math.random() * 1000000)
    subscribers[ID] = res;  //no res (hang)
})

app.post('/long-messages', (req, res)=>{
    const { body } = req;
    //to convert obj into array
    //send the incomming new messages to all subscribers
    Object.entries(subscribers).forEach(([ID, response])=>{
        response.json(body)
        delete subscribers[ID]   //response sent 1111
    })
    res.status(204).end()
})


app.listen(3000, ()=>{
    console.log('App up and running on: http://localhost:3000');
})