require("babel-register");

const request = require('request');
const http = require('http');
const fs = require('fs');

const Datastore = require('nedb');
const answersDb = new Datastore({filename:'answers', autoload:true });


const express = require('express');

const config  = require('./config');

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

app.get(/^\/twitch$/, (req, res) => {
	res.sendFile(__dirname + '/client/twitch.html');
});

/* queries */
app.get(/^\/question$/, (req, res) => {
	res.send(config.question || '?');
});

let newAnswerEmit = function() {};

app.get(/^\/answer$/, (req, res) => {
	// console.log(req.query.text);
	const answerText = req.query.text;
	if(answerText){
		const answer = {id:+(new Date()), text:answerText, sent:false};
		newAnswerEmit(answer);
		answersDb.insert(answer)
		res.send('answerReceived');
	}
});

app.get(/^\/twitchchannel$/, (req, res) => {
	res.send(config.showtwitch && config.twitchchannel);
});

app.get(/^\/serverip$/, (req, res) => {
	res.send(req.headers.host);
});


app.get('*', (req, res) => {
	// if(!helpers.validUrl(req.url)){
		res.redirect('/');
	// }
});

const server = new http.Server(app);
const PORT = process.env.PORT || 3000;

server.listen(PORT);



const io = require('socket.io')(server);
newAnswerEmit = function (newAnswer) {
	io.emit('answers:new', newAnswer);
}
io.on('connection', (socket) => {

	let isadmin = false;

	socket.emit('auth:check');

	socket.on('auth:submit', (pw) => {
		isadmin = config.admin_password == pw;
		if(isadmin){
			socket.emit('auth:success');
		}
	})

	socket.on('answers:all', () => {
		// console.log('answers:all');
		if(isadmin) {
			answersDb.find({}).sort({ id: -1 }).exec((err, allAnswers)=>{
				// console.log(allAnswers);
				socket.emit('answers:all', allAnswers);
			});
		}
	})

	socket.on('answers:send', (answerId) => {
		answersDb.findOne({id: answerId}, (err, answer) => {
			
			const send = () => {
				answersDb.update({id: answerId}, {$set:{sent: true}}, {}, (err, numUpdated) => {
					if(numUpdated === 1){
						socket.emit('answers:sent', answerId);
					}
				})
			}

			if(!config.waittargethost){
				send();
			}
			request(config.targethost+'?message='+encodeURIComponent(answer.text), function (error, response, body) {
			  	if (!error && response.statusCode == 200) {
			  		send();
				}
			});
		})
	})
});