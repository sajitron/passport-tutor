const express = require('express'),
      path = require('path'),
      bodyParser = require('body-parser'),
      session = require('express-session'),
      cors = require('cors'),
      mongoose = require('mongoose'),
      errorHandler = require('errorhandler'),
      morgan = require('morgan'),
      app = express();

mongoose.Promise = global.Promise;

const isProduction = process.env.NODE_ENV === 'production';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))

app.use(morgan("dev"));
app.use(cors());

app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: 'passport-tutor', cookie: { maxAge: 60000 }, resave: false, saveUninitialized: false  }));

if(!isProduction) {
  app.use(errorHandler());
}

mongoose.connect('mongodb://localhost/passport-tutor');
mongoose.set('debug', true);

require('./models/User');
require('./config/passport');

if(!isProduction) {
  app.use((err, req, res) => {
    res.status(err.status || 500);

    res.json({
      errors: {
        message: err.message,
        error: err
      }
    })
  });
}

app.use((err, req, res) => {
  res.status(err.status|| 500);

  res.json({
    errors: {
      message: err.message,
      error: {}
    }
  })
});

app.listen(8000, () => console.log('Server running on port 8000'));