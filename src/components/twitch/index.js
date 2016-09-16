import $ from 'jquery'

export default class Twitch {
	constructor(args) {
		this.can = args.can;
		this.rootEl = args.root;

		this.can.on('question:answered',() => {
			$.get('/twitchenabled', (res) => {
				alert(res);
			});
		})
	}
}