class Message {
	constructor(id, initialMsg, successMsg, failureMsg, updater, callBack, interactives) {
		this.name = 'Message';
VSc.l({text:'Message.constructor - id = %o', obj: id}, this);
VSc.log( {'event': { 'name': 'debugMsg', 'value': 'Message.constructor('+id+')' }});
		this.id = id;
		this.elmnt = document.createElement('div');
		this.elmnt.classList.add('MCMessage');
		this.part1 = this.elmnt.appendChild(document.createElement('div'));
		this.part1.innerHTML = initialMsg;
		this.part2 = this.elmnt.appendChild(document.createElement('div'));

		this.successMsg = successMsg;
		this.failureMsg = failureMsg;
		this.callBack = callBack;

		if (updater) {
			if (updater.type == 'TimeShower') {	// other types of updaters that need to go in part one can go in here (as an or clause)
				this.part1.appendChild(updater.elmnt);
			}
			if (updater.type == 'ProgressShower') {		// other types of updaters that need to go in part two can go in here (as an or clause)
				this.part2.appendChild(updater.elmnt);
			}
			updater.message = this;
			this.updater = updater;
		};



		if (interactives) {
			if (interactives.controls) {
				let tmp = this.elmnt.appendChild(document.createElement('div'));
				tmp.className = 'MCMessageControls';

				this.controls = [];
				interactives.controls.forEach(function(cntrl){
					tmp.appendChild(cntrl);
					this.controls.push(cntrl);
				}.bind(this));
			}
			// other types of interactives (besides interactives.controls) go here
		};
	}
}