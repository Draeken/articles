const util = require("util");
const exec = util.promisify(require("child_process").exec);
const mongoClient = require("mongodb").MongoClient;
const assert = require("assert");

// Connection URL
const url = "mongodb://localhost:27017";

// Database Name
const dbName = "perftests";

// Create a new MongoClient
const client = new mongoClient(url, { useNewUrlParser: true });

const log = (...res) => {
  console.log(...res);
  return res.length === 1 ? res[0] : res;
};

const prettyExplain = explain => {
  const exStats = explain.executionStats;
  log(
    `Winning stage: ${explain.queryPlanner.winningPlan.stage}, keys: ${
      exStats.totalKeysExamined
    }, docs: ${exStats.totalDocsExamined}`
  );
  return explain;
};

// Use connect method to connect to the Server
client.connect(err => {
  assert.equal(null, err);
  log("Connected successfully to server");
  const db = client.db(dbName);
  insertUser()
    .then(displayAddForOne(db))
    .catch(err => log(err))
    .then(() => client.close())
    .then(() => process.exit())
});

const insertUser = () => {
  return exec("./mgodatagen -f ./template.json").then(({ stdout, stderr }) => {
    if (stderr) {
      throw stderr;
    }
    log(stdout);
  });
};

const displayAddForOne = db => () => {
  log("Display address for one user");
  const users = db.collection("users");
  return users
    .findOne({}, { projection: { _id: 1 } })
    .then(res => {
      return users.findOne({ _id: res._id }, { projection: { address: 1 }, explain: true });
    })
    .then(log)
    .then(prettyExplain);
};
