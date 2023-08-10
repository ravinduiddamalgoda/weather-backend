const express = require('express')
const app = express();

app.use(express.urlencoded({extended: false}));

//connect to MongoDB
var mongoose = require('mongoose');
mongoose.connect('mongodb://mongodb/test', {useNewUrlParser: true, useUnifiedTopology: true});
var db = mongoose.connection;
db.on("error", (err) => {
  console.log("MongoDB connection error: "+err);
});
db.on("connected", () => {
  console.log("Connected to MongoDB");
});

//Set the Schema
var mySchema = new mongoose.Schema({
  code: String,
  name: String
});

//Create my model
var record = mongoose.model("record", mySchema);

app.get('/test.html', (req, res) => {
  let newRecord = new record({
    code: 'COMP3322B',
    name: 'Modern Technologies on WWW'
  });
  newRecord.save((err, result) => {
    if (err) {
      console.log("MongoDB error: "+err);
      res.sendStatus(500);
    } else {
      console.log("Record added");
      //retrieve all records
      record.findOne((err, result) => {
        if (err) {
          console.log("MongoDB error: "+err);
          res.sendStatus(500);
        } else {
          let message = "<!DOCTYPE><html><head><title>TEST MongoDB</title></head><body><h1>Testing Mongoose connection with Express</h1>";
          message += `<p>Course code : ${result.code}<br>Course title : ${result.name}</p>`;
          message += "</body></html>";
          res.send(message);

        }
      });    
    }
  });

});


app.listen(8000, () => {
  console.log('Example app listening on port 8000!')
});
