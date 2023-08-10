var express = require("express");
var app = express();
const mongoose = require("mongoose");
const bodyParser= require("body-parser");
const weatherRouter = express.Router();
// var cors = require('cors');
app.use(express.json());
// app.use(cors())
app.use('/weather',weatherRouter);
// app.use(bodyParser.json())

const Schema = mongoose.Schema;
const weatherSchema = new Schema({
  date: String,
  meanT: Number,
  maxT: Number,
  minT: Number,
  humidity: Number,
  rain: Number,
});



const WeatherRecord = mongoose.model('WeatherRecord', weatherSchema);
// const WeatherRecord = mongoose

//Task B



weatherRouter.post('/:year/:month/:day' , async(req, res) => {

  try{
    const { meanT , maxT , minT , humidity , rain } = req.body;
    const { year, month, day } = req.params;
    let isValidDate;
    const date = year+month.toString().padStart(2 , '0')+day.toString().padStart(2 , '0');
    // console.log(req.body.meanT);
    if((1900 < Number(year) && Number(year) < 2500) && (0< Number(month) && Number(month)< 13) &&( 0 < Number(day) &&  Number(day) < 32) ){
      isValidDate = true;
    }else{
      isValidDate = false;
    }
  
    if (!isValidDate) {
      return res.status(400).json({ error: 'not a valid year/month/date' });
    }

    const exitingData = await WeatherRecord.findOne({date:date});
    if(exitingData){
      return res.status(403).send({ "error": "find an existing record. Cannot override!!"});
    }
    const weatherData = new WeatherRecord({
      date: date,
      meanT: Number(meanT),
      maxT: Number(maxT),
      minT: Number(minT),
      humidity: Number(humidity),
      rain: Number(rain),
    });
    await weatherData.save();
    res.status(200).send({"okay" : "record added"});
  }catch(err){
    // console.log(err.message);
    return res.status(500).send({ err: err.message});
    

  }
  

});


weatherRouter.get('/temp/:year/:month' , async (req , res)=> {
  try{
    const { year, month } = req.params;
    let isValidDate;
    const date = year+month.toString().padStart(2 , '0')+"01";
    const dateNext = year+(parseInt(month)+1).toString().padStart(2 , '0')+"01";
    // console.log(type);
    if((1900 < Number(year) && Number(year) < 2500) && (0 < Number(month) && Number(month)< 13)){
      isValidDate = true;
    }else{
      isValidDate = false;
    }
  
    if (!isValidDate) {
      return res.status(400).json({ error: 'not a valid year/month' });
    }
    // var dateInt = parseInt(date);
    // for()
    const data = await WeatherRecord.find({
      date:{
        $gte: date,
        $lt: dateNext
      }
    });
    if(!data){
      return res.status(404).send({"error": "not found"});
    }
    console.log(data.length);
    var tot = 0;
    var cnt = 0; 
    var testPointMin = data[0].minT;
    var testPointMax = data[0].maxT;
    data.map((val)=>{
        tot += val.meanT;
        if(val.minT < testPointMin){
          testPointMin = val.minT;
        }
        if(val.maxT > testPointMax){
          testPointMax = val.maxT;
        }
        // console.log(tot);
        cnt++;
    });
    var avgMeanT = tot/cnt;
    // console.log(avgMeanT);
    let yearVal = data[0].date.slice(0,4);    
    let monthVal = data[0].date.slice(4, 6);
    let dateVal = data[0].date.slice(6, 8);

    const response = {
      "Year": parseInt(yearVal),
      "Month": parseInt(monthVal), 
      "Avg Temp" : parseFloat(avgMeanT.toFixed(2)),
      "Max Temp" : testPointMax,
      "Min Temp" : testPointMin,
    };
    return res.status(200).send(response);
  }catch(err){
    return res.status(501).send({"error": "error"});
  }
});

weatherRouter.get('/humi/:year/:month' , async (req , res)=> {
  try{
    const { year, month } = req.params;
    let isValidDate;
    const date = year+month.toString().padStart(2 , '0')+"01";
    const dateNext = year+(parseInt(month)+1).toString().padStart(2 , '0')+"01";
    // console.log(type);
    if((1900 < Number(year) && Number(year) < 2500) && (0 < Number(month) && Number(month)< 13)){
      isValidDate = true;
    }else{
      isValidDate = false;
    }
  
    if (!isValidDate) {
      return res.status(400).json({ error: 'not a valid year/month' });
    }
    // var dateInt = parseInt(date);
    // for()
    const data = await WeatherRecord.find({
      date:{
        $gte: date,
        $lt: dateNext
      }
    });
    if(!data){
      return res.status(404).send({"error": "not found"});
    }
    // console.log(data.length);
    var tot = 0;
    var cnt = 0; 
    var testPointMin = data[0].humidity;
    var testPointMax = data[0].humidity;
    data.map((val)=>{
        tot += val.humidity;
        if(val.humidity < testPointMin){
          testPointMin = val.humidity;
        }
        if(val.humidity > testPointMax){
          testPointMax = val.humidity;
        }
        // console.log(tot);
        cnt++;
    });
    var avgMeanT = tot/cnt;
    // console.log(avgMeanT);
    // console.log("humi");
    let yearVal = data[0].date.slice(0,4);    
    let monthVal = data[0].date.slice(4, 6);
    let dateVal = data[0].date.slice(6, 8);

    const response = {
      "Year": parseInt(yearVal),
      "Month": parseInt(monthVal), 
      "Avg Humidity" : parseFloat(avgMeanT.toFixed(2)),
      "Max Humidity" : testPointMax,
      "Min Humidity" : testPointMin,
    };
    return res.status(200).send(response);
  }catch(err){
    return res.status(500).send({"error": err.message});
  }
});

weatherRouter.get('/rain/:year/:month' , async (req , res)=> {
  try{
    const { year, month } = req.params;
    let isValidDate;
    const date = year+month.toString().padStart(2 , '0')+"01";
    const dateNext = year+(parseInt(month)+1).toString().padStart(2 , '0')+"01";
    // console.log(type);
    if((1900 < Number(year) && Number(year) < 2500) && (0 < Number(month) && Number(month)< 13)){
      isValidDate = true;
    }else{
      isValidDate = false;
    }
  
    if (!isValidDate) {
      return res.status(400).json({ error: 'not a valid year/month' });
    }
    // var dateInt = parseInt(date);
    // for()
    const data = await WeatherRecord.find({
      date:{
        $gte: date,
        $lt: dateNext
      }
    });
    if(!data){
      return res.status(404).send({"error": "not found"});
    }
    console.log(data.length);
    var tot = 0;
    var cnt = 0; 
    var testPointMax = data[0].rain;
    data.map((val)=>{
        tot += val.rain;

        if(val.rain > testPointMax){
          testPointMax = val.rain;
        }
        // console.log(tot);
        cnt++;
    });
    var avgMeanT = tot/cnt;
    // console.log(avgMeanT);
    // console.log("humi");
    let yearVal = data[0].date.slice(0,4);    
    let monthVal = data[0].date.slice(4, 6);
    let dateVal = data[0].date.slice(6, 8);

    const response = {
      "Year": parseInt(yearVal),
      "Month": parseInt(monthVal), 
      "Avg Rainfall" : parseFloat(avgMeanT.toFixed(2)),
      "Max Daily Rainfall" : testPointMax,
    };
    return res.status(200).send(response);
  }catch(err){
    return res.status(500).send({"error": err.message});
  }
});


weatherRouter.get('/:year/:month/:day' , async (req, res)=> {
  try{
    const { year, month, day } = req.params;
    // month = month.toString().padStart(2 , '0');
    // day = day.toString().padStart(2 , '0');
    const datef = year+month.toString().padStart(2 , '0')+day.toString().padStart(2 , '0');
    console.log(datef);
    let isValidDate;
    if((1900 < Number(year) && Number(year) < 2500) && (0< Number(month) && Number(month)< 13) &&( 0 < Number(day) &&  Number(day) < 32) ){
      isValidDate = true;
    }else{
      isValidDate = false;
    }

    // const isValidDate = (new Date(year, month - 1, day)).toISOString().slice(0, 10) === `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  
    if (!isValidDate) {
      return res.status(400).json({ error: 'not a valid year/month/date' });
    }

    const data = await WeatherRecord.findOne({date: datef});
    console.log(data);
    if(!data){
      return res.status(404).send({"error": "not found"});
    }
    // res.json(data);
    let yearVal = data.date.slice(0,4);    
    let monthVal = data.date.slice(4, 6);
    let dateVal = data.date.slice(6, 8);

    const response = {
      "Year": yearVal,
      "Month": monthVal,
      "Date": dateVal, 
      "Avg Temp" : data.meanT,
      "Max Temp" : data.maxT,
      "Min Temp" : data.minT,
      "Humidity" : data.humidity,
      "Rainfall" : data.rain
    };
    return res.status(200).send(response);
    // return res.status(201).send(data);
  }catch(err){
    return res.status(500).send({ "error": err.message});
  }
   

});

app.all('*', (req, res) => {
  res.status(400).json({ error: `Cannot ${req.method} ${req.originalUrl}` });
});

    



try {
  async function test() {
    await mongoose.connect("mongodb://0.0.0.0:27017/weather", {
      useNewUrlParser: true,
    });
    console.log("Connected DB");
    
  }
  test();
} catch (err) {
  console.log(err);
}
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connected to the MongoDB server');
});

db.on('disconnected', function() {
  console.log('Lost MongoDB connection');
  process.exit(1);
});

process.on('SIGINT', function() {
  db.close(function() {
    console.log('MongoDB connection disconnected through app termination');
    process.exit(0);
  });
});


//Task B 


app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({'error': err.message});
 });
 app.listen(8000, () => {
  console.log('Weather app listening on port 8000!')
 });
