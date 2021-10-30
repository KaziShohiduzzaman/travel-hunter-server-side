const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;


const app = express();
const port = 5000;

// middleware 
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9zo1c.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('travelHunter');
        const eventCollection = database.collection('events');
        const orderCollection = database.collection('orders');

        //GET events api
        app.get('/events', async (req, res) => {
            const cursor = eventCollection.find({});
            const order = await cursor.toArray();
            res.send(order);
        })
        //Post api for Tour 
        app.post('/events', async (req, res) => {
            const event = req.body;
            const result = await eventCollection.insertOne(event);
            res.json(result)
        })

        //GET api for manage All Events
        app.get('/orders', async (req, res) => {
            const cursor = orderCollection.find({});
            const events = await cursor.toArray();
            res.send(events);
        })



        // for dynamic route 
        app.get('/events/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const event = await eventCollection.findOne(query);
            res.send(event);
        })

        //add orders api
        app.post('/orders', async (req, res) => {
            const order = req.body;
            const result = await orderCollection.insertOne(order);
            res.json(result)
        })

        //Get api for order
        app.get('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const event = await orderCollection.findOne(query);
            res.send(event);
        })


        //DELETE api for manage tour
        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await orderCollection.deleteOne(query);
            console.log(result);
            res.json(result)
        })
    }
    finally {
        // await client.close()
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Server Running')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
