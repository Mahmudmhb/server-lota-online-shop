const express = require('express')
const cors = require('cors');
const app = express()
const port = process.PORT || 5000;
require('dotenv').config()


app.use(cors())
app.use(express.json())



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.LOTA_KEY}:${process.env.LOTA_PASS}@cluster0.gegfn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");





const productsCollection = client.db('lotaOnlineShop').collection('products')
const wishlistCollection = client.db('lotaOnlineShop').collection('wishlist')
const AddToCartCollection = client.db('lotaOnlineShop').collection('AddtoCart')
const BlogsCollection = client.db('lotaOnlineShop').collection('blogs')
const userCollection = client.db('lotaOnlineShop').collection('Users')


// get items 
app.get('/products', async(req,res)=>{
    res.send(await productsCollection.find().toArray())
})
app.get('/users', async(req,res)=>{
    res.send(await userCollection.find().toArray())
})
app.get('/addtocart', async(req,res)=>{
    res.send(await AddToCartCollection.find().toArray())
})

app.get('/blogs', async(req,res)=>{
    res.send(await BlogsCollection.find().toArray())
})




// get single items 

app.get('/blogs/:id', async(req,res)=>{
  const id = req.params.id;
  const query = {_id: new ObjectId(id)}
  res.send(await BlogsCollection.findOne(query))
})
app.get('/products/:id', async(req,res)=>{
  const id = req.params.id;
  const query = {_id: new ObjectId(id)}
  res.send(await productsCollection.findOne(query))
})
// get multiple items 
app.get('/product/:categories', async(req,res)=>{
  const name = req.params.categories;
  const query = { categories: name }
  res.send(await productsCollection.find(query).toArray())

})


app.get('/wishlist/:email', async(req,res)=>{
  const email = req.params.email;
  const query = { userEmail: email}
  res.send(await wishlistCollection.find(query).toArray())

})
app.get('/wishlist/:id', async(req,res)=>{
  const id = req.params.id;
  const query = { _id: new ObjectId(id)}
  res.send(await wishlistCollection.findOne(query))

})
app.get('/addtocart/:email', async(req,res)=>{
  const email = req.params.email;
  const query = { userEmail: email}
  res.send(await AddToCartCollection.find(query).toArray())

})

// post otion 


// post user 



app.post('/users', async(req, res)=>{
  const user = req.body.email;
  // console.log(id);
  const newUser = req.body;
  const query = {email: user}
  const result = await userCollection.findOne(query)
  if(result){
    return res.send( {message: 'user alreay have', insertId: null})
  }
  // console.log(wishlist)
  res.send(await userCollection.insertOne(newUser))

})
app.post('/wishlist', async(req, res)=>{
  // const id = req.body.productId;
  // console.log(id);
  const wishlist = req.body;
  // const query = {productId: id}
  // const result = await wishlistCollection.findOne(query)
  // if(result){
  //   return res.send( {message: 'user alreay have', insertId: null})
  // }
  // console.log(wishlist)
  res.send(await wishlistCollection.insertOne(wishlist))

})

app.post('/addtocart', async(req,res)=>{
  const id = req.body.userEmail
const cart = req.body;
// console.log('card of req', cart);
  const query = {userEmail:  id }
  // console.log("find email",query);
  const findWishlist = await wishlistCollection.findOne(query)
  // console.log("find wishlist",findWishlist);
  if(findWishlist){
    await wishlistCollection.deleteOne({userEmail: id})
    const addCart = await AddToCartCollection.insertOne(cart);

    return res.send( {message: 'wishlist item moved to cart', insertId: addCart.insertedId})
  } 

})
 
//  delete item 
app.delete('/wishlist/:id', async (req,res)=>{
  const id = req.params.id;
  const query = {_id: new ObjectId(id)}
  res.send(await wishlistCollection.deleteOne(query))
})
app.delete('/addtocart/:id', async (req,res)=>{
  const id = req.params.id;
  console.log(id);
  const query = {_id: new ObjectId(id)}
  console.log(query);
  const result = await AddToCartCollection.deleteOne(query)
  res.send(result);
})




  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.get('/', (req,res) =>{
    res.send('lota online shop is runnig')
})

app.listen(port, (req,res)=>{
    console.log('online shop is running ', port);
})