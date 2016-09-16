import $ from 'jquery';

const EventEmitter = require('events');
class CAN extends EventEmitter {}
const can = new CAN();

import './styles/base.css';
import './styles/user.css';

import Question from './components/question/index.js'

let rootEl = $('#root');

const question = new Question({can, rootEl});

question.render();


document.ontouchmove = function(event){
    event.preventDefault();
};