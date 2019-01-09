const mongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'perftests';

// Create a new MongoClient
const client = new mongoClient(url);

// Use connect method to connect to the Server
client.connect((err) => {
  assert.equal(null, err);
  console.log("Connected successfully to server");

  const db = client.db(dbName);
  insertUser(db, () => {
    client.close();
  });
});

const insertUser = (db) => {
  // Get the documents collection
  const collection = db.collection('users');
  // Insert generated user
  return collection.insertOne({
    name: ""
  });
}