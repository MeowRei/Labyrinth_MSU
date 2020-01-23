module.exports = function (app) {
  const express = require('express');
  const morgan = require('morgan');
  const path = require('path');
  const cookieParser = require('cookie-parser');
  const { cookiesCleaner } = require('./auth');
  const session = require('express-session');
  const FileStore = require('session-file-store')(session);

  const fileStoreOptions = {
    path: path.join(__dirname, '..', 'sessions'),
  };

  app.use(morgan('dev'));

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  app.use(express.static(path.join(__dirname, '..', 'public')));

  app.use(cookiesCleaner);
  app.use(cookieParser());
  app.use(
    session({
      store: new FileStore(fileStoreOptions),
      key: 'user_sid',
      secret: 'keyboard party',
      resave: false,
      saveUninitialized: false,
      cookie: {
        expires: 600000,
      },
    }),
  );

  app.use((req, res, next) => {
    res.locals = {
      loggedin: !!req.session.user,
      login: req.session.user || '',
    };
    next();
  });
};