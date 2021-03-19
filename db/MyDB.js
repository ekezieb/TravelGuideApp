const { MongoClient } = require("mongodb");
const bcrypt = require("bcrypt");

function MyDB() {
  const myDB = {};

  const url = process.env.MONGO_URL || "mongodb://localhost:27017";

  const DB_NAME = "myFiles";

  myDB.signup = async (auth) => {
    let client;

    try {
      client = new MongoClient(url, { useUnifiedTopology: true });
      console.log("Connecting to the db");
      await client.connect();
      console.log("Connected!");
      const db = client.db(DB_NAME);
      const userCol = db.collection("user");
      console.log("Collection ready, insert ", auth);
      const res = await userCol.insertOne(auth);
      console.log("Inserted", res);

      return res;
    } finally {
      console.log("Closing the connection");
      client.close();
    }
  };
  myDB.login = async (auth) => {
    let client;

    try {
      client = new MongoClient(url, { useUnifiedTopology: true });
      console.log("Connecting to the db");
      await client.connect();
      console.log("Connected!");
      const db = client.db(DB_NAME);
      const userCol = db.collection("user");
      console.log("Collection ready, find ", auth);

      const res = await userCol.findOne({
        email: auth.email,
      });

      if (res) {
        // console.log(email);
        const cmp = await bcrypt.compare(auth.password, res.password);
        if (cmp) {
          //console.log(password);
          return true;
        }
      }

      return false;
    } finally {
      console.log("Closing the connection");

      client.close();
    }
  };
  myDB.logout = () => {
    return true;
  };
  myDB.GetPost = async (post) => {
    let client;

    try {
      client = new MongoClient(url, { useUnifiedTopology: true });
      console.log("Connecting to the db");
      await client.connect();
      console.log("Connected!");
      const db = client.db(DB_NAME);
      const postsCol = db.collection("posts");
      console.log("Collection ready, find ", post.country);
      const found = await postsCol
        .find({ country: post.country })
        .sort({ $natural: -1 })
        .toArray();
      return found;
    } finally {
      console.log("Closing the connection");
      client.close();
    }
  };

  myDB.createpost = async (post) => {
    let client;

    try {
      client = new MongoClient(url, { useUnifiedTopology: true });
      console.log("Connecting to the db");
      await client.connect();
      console.log("Connected!");
      const db = client.db(DB_NAME);
      const postsCol = db.collection("posts");

      console.log("Collection ready, insert ", post);
      const insertpost = await postsCol.insertOne(post);
      console.log("Collection ready, find ", post);
      const creatPost = await postsCol
        .find({ country: post.country })
        .toArray();

      console.log("Inserted", insertpost);
      return creatPost;
    } finally {
      console.log("Closing the connection");
      client.close();
    }
  };

  return myDB;
}

module.exports = MyDB();
