const serverless = require('serverless-http');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const recursive = require('recursive-readdir-sync');

const app = express();
app.use(require('./src/Middleware'));
app.use(helmet());
app.disable('x-powered-by');
app.use(
    cors({
      origin: [/\.dwp\.co\.uk$/],
      credentials: true,
    }),
);
app.use(express.urlencoded({limit: '2mb', extended: true}));
app.use(express.json({limit: '2mb'}));

const files = recursive('./src/Controller');
for (let index = 0; index < files.length; index++) {
  const file = files[index];
  const f = file
      .replace(/\\/g, '/')
      .split('src/Controller')
      .pop()
      .replace('.js', '')
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .replace('[', ':')
      .replace(']', '')
      .toLowerCase();

  try {
    app.use(`${f}`, require(`./${file}`));
  } catch (error) {
    console.error(error);
  }
}

// eslint-disable-next-line no-unused-vars
app.use((req, res, next) => {
  return res.status(404).json({
    error: 'Not Found',
  });
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (!err.status || err.status === 500) console.error(err);
  return res.status(err.status || 500).json({
    message: err.message || 'system error',
  });
});

module.exports.handler = serverless(app);
