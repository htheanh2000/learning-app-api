const express = require('express');
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const logger = require('morgan')
const app = express();
const port = 3000;

// config import
const {db} = require('./server/config')

// middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(logger('dev'));

// connect db
mongoose.connect(`mongodb+srv://${db.USERNAME}:${db.PASSWORD}@cluster0.0gk1e.mongodb.net/${db.DB}?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(()=> {
    console.log('Database connected');
  })
  .catch((error)=> {
    console.log('Error connecting to database');
  });

// route
require('./server/routes/auth.routes')(app);
require('./server/routes/user.routes')(app);
require('./server/routes/vocabulary.routes')(app);

app.listen(port, ()=> {
  console.log(`App is listening to port: ${port}`);
})
 
