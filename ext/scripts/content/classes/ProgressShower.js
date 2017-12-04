class ProgressShower {
	constructor(message) {
		this.name = 'ProgressShower';
VSc.l('ProgressShower.constructor', this);
		this.message = message;
		this.elmnt = document.createElement('progress');
		this.elmnt.max = 90;
		this.elmnt.value = 0;
		this.type = 'ProgressShower';
		this.interval = setInterval(this.update.bind(this), 500, this);
	}



	update() {
VSc.l('ProgressShower.update', this);
		if (this.elmnt.value < this.elmnt.max) {
			this.elmnt.value++;
		} else {
			this.failure();
		}
	}



	setResult(result) {
VSc.l('ProgressShower.setResult', this);
		if (result) {
			this.success();
		} else {
			this.failure();
		}
	}



	success() {
		clearInterval(this.interval);
		this.message.part2.innerHTML = this.message.successMsg;
VSc.l({text:'ProgressShower::success - calling the message.callBack', obj: this.message.callBack.name}, this);
		this.message.callBack(true);
	}



	failure() {
		clearInterval(this.interval);
		this.message.part2.innerHTML =this.message.failureMsg;
VSc.l({text:'ProgressShower::failure - calling the message.callBack', obj: this.message.callBack.name}, this);
		this.message.callBack(true);
	}
}