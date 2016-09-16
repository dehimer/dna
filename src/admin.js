import './styles/base.css';
import './styles/admin.css';


let rootEl = document.getElementById('root');

console.log(!!rootEl);

document.ontouchmove = function(event){
    event.preventDefault();
};