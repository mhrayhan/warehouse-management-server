const express = require('express');
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
const cors = require('cors');

require('dotenv').config();


app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DV_USER}:${process.env.DV_PASS}@cluster0.zu4zx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        await client.connect();
        const itemsCollection = client.db('inventory').collection('items');
        // get multiple data from mongoDb
        app.get('/items', async(req, res) => {
            const query = {};
            const cursor = itemsCollection.find(query);
            const item = await cursor.toArray();
            res.send(item);
        })

        // get single data from mongoDb by id
        app.get('/items/:id', async(req, res) => {
            const id = req.params.id;
            console.log(req.params);
            const query = {_id: ObjectId(id)};
            const items = await itemsCollection.findOne(query);
            res.send(items);
        } )

        // POST -> input data store in mongoDb server
        app.post('/items', async(req, res) => {
            const newItem = req.body;
            const result = await itemsCollection.insertOne(newItem);
            res.send(result);
        })

        //UPDATE USER 
       app.put('/items/:id', async(req, res) =>{
            const id = req.params.id;
            const updatedUser = req.body;
            const filter = {_id: ObjectId(id)};
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    quantity: updatedUser.quantity
                }
            };
            const result = await itemsCollection.updateOne(filter, updatedDoc, options);
            res.send(result);

        })

        // Item collectiton api
        app.get('items', async(req, res) => {
            const email = req.query.email;
            const query = {email: email};
            const cursor = itemsCollection.find(query);
            const item = await cursor.toArray();
            res.send(item);
        })

    // DELETE 
      app.delete('/items/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: ObjectId(id)};
      const result = await itemsCollection.deleteOne(query);
      res.send(result);
    })

    }

    finally{}
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('Inventory Server is running')
})

app.listen(port, ()=> {
    console.log(`inventory server is running with PORT:${port}`);
})