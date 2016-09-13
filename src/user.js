const EventEmitter = require('events');
class CAN extends EventEmitter {}
const can = new CAN();

import './styles/base.css';
import './styles/user.css';

let rootEl = document.getElementById('root');

console.log(!!can);
console.log(!!rootEl);

document.ontouchmove = function(event){
    event.preventDefault();
};