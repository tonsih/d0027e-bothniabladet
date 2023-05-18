const express = require('express');
require('dotenv').config();
const cors = require('cors');
const { graphqlHTTP } = require('express-graphql');
const { graphqlUploadExpress } = require('graphql-upload');
const schema = require('./schema/schema');
const session = require('express-session');
const port = process.env.PORT || 5000;
const path = require('path');

// Database
const { sequelize: db, models } = require('./configs/db/db');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const app = express();

db.sync({ force: false, alter: true });

app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(
	'/images/requested',
	express.static(path.join(__dirname, 'images', 'requested'))
);

app.use(
	cors({
		origin: 'http://localhost:3000',
		credentials: true,
	})
);

const store = new SequelizeStore({
	db,
});

app.use(
	session({
		name: 'sid',
		secret: process.env.SESSION_SECRET,
		store,
		resave: false,
		saveUninitialized: false,
		cookie: {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
		},
	})
);

store.sync();

app.use(
	'/graphql',
	graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 100 }),
	graphqlHTTP(req => ({
		schema,
		graphiql: process.env.NODE_ENV === 'development',
		context: {
			session: req.session,
			url: req.protocol + '://' + req.get('host'),
			placeholderImg: 'https://placehold.co/500x400?text=No+Image',
		},
	}))
);

app.listen(port, console.log(`Server running on port ${port}`));
