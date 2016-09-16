require("babel-register");

const http = require('http');
const fs = require('fs');

const express = require('express');

var config   = require('./config');

const app = express();

/* hot reload for webpack */
if(process.env.npm_lifecycle_event === 'dev')
{

	console.log('WHR');
  	const webpack = require('webpack');
	const webpackConfig = require('./../webpack/common.config.js');
	const compiler = webpack(webpackConfig);

	app.use(require('webpack-dev-middleware')(compiler, {
		noInfo: false, publicPath: webpackConfig.output.publicPath,
	}));

	app.use(require('webpack-hot-middleware')(compiler, {
		log: console.log, path: '/__webpack_hmr', heartbeat: 1 * 1000,
	}));
};

app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));


/* serve static */
app.use(express.static(__dirname + '/client'));

app.get(/^\/$/, (req, res) => {
  	res.sendFile(__dirname + '/client/user.html');
});

app.get(/^\/admin$/, (req, res) => {
	res.sendFile(__dirname + '/client/admin.html');
});

/* queries */
app.get(/^\/question$/, (req, res) => {
	res.send(config.question || '?');
});

app.get(/^\/answer$/, (req, res) => {
	console.log(req.query);
	res.send('answerReceived');
});

app.get(/^\/twitchenabled$/, (req, res) => {
	res.send(config.showtwitch);
});


app.get('*', (req, res) => {
	res.redirect('/');
});

const server = new http.Server(app);
const PORT = process.env.PORT || 3000;

server.listen(PORT);