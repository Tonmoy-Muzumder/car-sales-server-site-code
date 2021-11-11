const express = require('express');
const { MongoClient } = require('mongodb');
const app = express()
require('dotenv').config();
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
const port = process.env.PORT || 5000

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jodbj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
  try{
    await client.connect();
    console.log('connect to db')
    const database = client.db("carSales");
          const productsCollection = database.collection("products");

          
        //   GET API
        app.get('/products', async(req, res) => {
          const cursor = productsCollection.find({});
          const products = await cursor.toArray();
          res.send(products);
        });

        //   POST API
        app.post('/products', async (req, res) => {
          const product = req.body;
        console.log('hit the post api', product)
          const result = await productsCollection.insertOne(product);
          console.log(result)
         res.json(result)
      });

  }finally{
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Welcome to car shop server!')
})

app.listen(port, () => {
  console.log("listening", port)
})