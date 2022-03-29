const express = require('express');
const routes = require('./controllers/');
const sequelize = require('./config/connection');
const path = require('path');
const exphbs = require('express-handlebars');
const helpers = require('./util/helpers');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const hbs = exphbs.create({ helpers });
// create session (cookies)
const sess = {
	secret: 'Super secret secret',
	cookie: {},
	resave: false,
	saveUninitialized: true,
	store: new SequelizeStore({
		db: sequelize
	})
}

// initialize the server to listen and display
const app = express();
const PORT = process.env.PORT || 3001;

// set handlebars.js as enginge for creating and modifying HTML
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(session(sess));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// turn on routes
app.use(routes);

sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => console.log(`Now listening on port ${PORT}`));
});