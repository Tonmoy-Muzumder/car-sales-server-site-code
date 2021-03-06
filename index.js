const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();
require('dotenv').config();
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jodbj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
  try{
    await client.connect();
    console.log('connected to db')
    const database = client.db("carSales");
          const productsCollection = database.collection("products");
          const usersCollection = database.collection('users');
          const reviewsCollection = database.collection('reviews');

          
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
      //   GET API
      app.get('/reviews', async(req, res) => {
        const cursor = reviewsCollection.find({});
        const reviews = await cursor.toArray();
        res.send(reviews);
      });
        //   POST API
        app.post('/reviews', async (req, res) => {
          const review = req.body;
        console.log('hit the post api', review)
          const result = await reviewsCollection.insertOne(review);
          console.log(result)
         res.json(result)
      });


      // GET SINGLE PRODUCT
      app.get('/products/:id', async(req, res) => {
        const id = req.params.id;
        const query = {_id:ObjectId(id)};
        const product = await productsCollection.findOne(query);
        res.json(product);
    });
// user collection post
    app.post('/users', async (req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      console.log(result);
      res.json(result);
  });
// user Update
  app.put('/users', async (req, res) => {
    const user = req.body;
    const filter = { email: user.email };
    const options = { upsert: true };
    const updateDoc = { $set: user };
    const result = await usersCollection.updateOne(filter, updateDoc, options);
    res.json(result);
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