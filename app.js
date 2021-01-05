const express = require("express");
const app = express();
const mongoose = require('mongoose')
require('./models/player')
const playerModel = mongoose.model('Player')
mongoose.connect(`mongodb+srv://GlitchServer:Nth2KM3JYmLkU8SO@otwhitelistdb.cui00.mongodb.net/OTRBXDB?retryWrites=true&w=majority`, {useNewUrlParser: true});

app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.text());
app.use(bodyparser.json());
app.use(bodyparser.raw());

app.listen(PORT, () => {
  console.log(`Our app is running on port ${ PORT }`);
});


var db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));

db.once("open", function() {
  console.log("Connection To MongoDB Atlas Successful!");
});

app.get("/", async (request, response) => {
  async function playerDataCheck() {
    const playerData = await playerModel.findOne({ userID: `${request.params.id}` })
    // We use the mongoose findOne method to check if a record exists
   // with the given ID
    if (playerData) {
     // If exists return the data
      return playerData
    } else {
      const newPlayerDataInstance = new playerModel({
        userID: `${request.params.id}`,
        Whitelisted: false,
        Banned: false,
        WhitelistedPlaces: ["0"]
      })
      const newPlayerData = await newPlayerDataInstance.save()
      // If not exists, we save a new record and return that
      return newPlayerData
    }
  }

  response.json(await playerDataCheck());
// Finally we return the response from the async function!
});

app.post("/", async (request, response) => {
  var Places = [];
  console.log(request.body.WhitelistedPlaces)
  for(var i=1;request.body.WhitelistedPlaces.length;i++){Places.push(request.body.WhitelistedPlaces[i])}
  // We use a mongoose method to find A record and update!
  await playerModel.findOneAndUpdate(
    { userID: `${request.params.id}` },
    { $set: { Whitelisted: request.body.Whitelisted,Baned: request.body.Banned,WhitelistedPlaces:Places} }
  );
  response.send("Updated Database.");
  // Just a response.
});