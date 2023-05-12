const path = require('path');
const express = require('express');
const session = require('express-session');
const exphbs = require('express-handlebars');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const routes = require('./controllers');
const sequelize = require('./config/connection');

const Handlebars = require('handlebars');
const { readFileSync } = require('fs');

const app = express();
const PORT = process.env.PORT || 3001;

const sess = {
  secret: 'Not throwing away my shot',
  cookie: {},
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize,
  }),
  proxy: true,
};

app.use(session(sess));

const hbs = exphbs.create();

// Read the contents of helper.js
const helperCode = readFileSync(
  path.join(__dirname, 'utils', 'helper.js'),
  'utf8'
);

// Register the helper code
eval(helperCode);

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(routes);

sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () =>
    console.log(`Now listening on http://localhost:${PORT}`)
  );
});
