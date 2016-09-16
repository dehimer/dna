import $ from 'jquery';

import './index.css';

export default class Answers {
	constructor (args) {
		this.can = args.can;
		this.rootEl = args.rootEl;

		this.can.on('auth:success', ()=>{
			this.can.emit('server:send', {message:'answers:all'});
		});

		this.can.on('answers:all', (answers=[])=> {
			this.answers = answers;
			this.render();
		})

		this.can.on('answers:sent', answerId => {
			this.sent(answerId);
		});
	}
	send (id) {
		this.can.emit('server:send', {message:'answers:send', data: id});
	}
	sent (id) {
		this.blockEl.find(`.answers__item[data-id="${id}"]`).find('.answers__send').addClass('answers__send--blocked');
	}
	render(){


		const answersMarkup = this.answers.map(answer => {
			const {id, text, sent} = answer;

			return `<tr class="answers__item" data-id="${id}">
				<td>
					<div class="answers__item-text">
						${text}
					</div>
				</td>
				<td>
					<input class="answers__send ${sent?'answers__send--blocked':''}" type="button" value="Отправить"></input>
				</td>
			</tr>`
		}).join('');

		const markup = `
			<table class='answers'>
				<tr>
					<td>
						<table class='answers__list'>
							${answersMarkup}
						</table>
					</td>
				</tr>
			</table>`
		this.rootEl.append(markup);
		console.log(this.answers);

		this.blockEl = this.rootEl.find('.answers');

		this.blockEl.find('.answers__send').bind('click', (e) => {
			
			const buttonEl = $(e.currentTarget);
			
			if(buttonEl.hasClass('answers__send--blocked')){
				return;
			}

			const itemEl = buttonEl.closest('.answers__item');
			const answerId = itemEl.data('id');
			
			this.send(answerId);
		});
	}
}