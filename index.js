const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient } = require("mongodb");
require("dotenv").config();
const ObjectId = require("mongodb").ObjectId;
const port = process.env.PORT || 4000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.sjbgh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
/* const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }); */
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const run = async () => {
  const database = client.db("simpleLogin");
  const userCollections = database.collection("users");
  const userDetailsCollection = database.collection("usersDetails");

  try {
    await client.connect();

    // Signup
    app.post("/users", async (req, res) => {
      const body = req.body;
      const result = await userCollections.insertOne(body);
      res.json(result);
    });

    // signin
    app.get("/users/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email };
      const result = await userCollections.findOne(query);
      res.json(result);
    });
    // update user details info
    app.put("/users", async (req, res) => {
      const body = req.body;
      const filter = { email: body.email };
      const updateDoc = { $set: body };
      const result = await userCollections.updateOne(filter, updateDoc);
      res.json(result);
    });

    // get all users
    app.get("/users", async (req, res) => {
      const data = await userCollections.find({}).toArray();
      res.json(data);
    });

    // delete a users
    app.delete("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await userCollections.deleteOne(query);
      res.json(result);
    });
  } finally {
    // await client.close()
  }
};
run().catch(console.dir);

app.get("/", (req, res) => {
  res.json("Welcome to Server");
});

app.listen(port, () => {
  console.log("Server is running on port ", port);
});
