const express = require('express');
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const logger = require('morgan')
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(logger('dev'));

const port = 3000;

mongoose.connect("mongodb+srv://admin:Theanh123!@cluster0.0gk1e.mongodb.net/la?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(()=> {
    console.log('Database connected');
  })
  .catch((error)=> {
    console.log('Error connecting to database');
  });


app.get('/', (req, res) => {
  res.send('<h1>Express Demo App</h1> <h4>Message: Success again</h4> <p>Version 1.1</p>');
})

app.get('/health-check', (req, res) => {
  res.send({
    message: "SERVER IS RUNNING"
  });
})

const {createUser,getAllUser} = require('./server/controllers/user')
app.post('/user/create-user', createUser);
app.get('/user/get-all-user', getAllUser);

app.listen(port, ()=> {
  console.log(`Demo app is up and listening to port: ${port}`);
})
 
