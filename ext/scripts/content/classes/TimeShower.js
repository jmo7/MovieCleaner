class TimeShower {
	constructor(timeScale, ...timeRefs) {
		this.name = 'TimeShower';
VSc.l('TimeShower.constructor', this);
		this.timeScale = timeScale;
		this.timeRefs = timeRefs;
		this.elmnt = document.createElement('div');
		this.elmnt.classList.add('MCTimeShower');
		this.type = 'TimeShower';
		this.elmnt.innerHTML = this.remainingTimeString();
		this.setUpdater();
	}



	remainingTimeString() {
VSc.l('TimeShower.remainingTimeString', this);
		var timeRefsTotal = 0, secondsString;
		for (let i = 0; i < this.timeRefs.length; i++) {
			timeRefsTotal += this.timeRefs[i];
		}

		this.totalMS = timeRefsTotal - Date.now();

		let timeLeftInDays = this.totalMS / (1000 * 60 * 60 * 24);
		let tmp = Math.trunc(timeLeftInDays);
		let days = (tmp >= 0) ? tmp : 0;

		let timeLeft_HoursPart = (timeLeftInDays - days) * 24;
		tmp = Math.trunc(timeLeft_HoursPart);
		let hours = (tmp >= 0) ? tmp : 0;

		let timeLeft_MinutesPart = (timeLeft_HoursPart - hours) * 60;
		tmp = Math.trunc(timeLeft_MinutesPart);
		let minutes = (tmp >= 0) ? tmp : 0;

		let dayUnit = (days == 1) ? 'day': 'days';
		let hourUnit = (hours == 1) ? 'hour': 'hours';
		let minuteUnit = (minutes == 1) ? 'minute': 'minutes';

		if (this.timeScale < 60000) {
			let timeLeft_SecondsPart = (timeLeft_MinutesPart - minutes) * 60;
			tmp = Math.trunc(timeLeft_SecondsPart);
			tmp = (tmp >= 0) ? tmp : 0;
			secondsString = tmp + ' ' + ((tmp == 1) ? 'second': 'seconds');
		} else {
			secondsString = '';
		}
//console.log('\t' + days + ' ' + dayUnit + ' ' + hours + ' ' + hourUnit + ' ' + minutes + ' ' + minuteUnit + ' ' + secondsString);
		return days + ' ' + dayUnit + ' ' + hours + ' ' + hourUnit + ' ' + minutes + ' ' + minuteUnit + ' ' + secondsString;
	}



	setUpdater() {
VSc.l('TimeShower.setUpdater', this);
		this.timeUpdater = window.setInterval(function() {
VSc.l('TimeShower.timeUpdater (which is an interval) running', this);
			if (this.totalMS > 0) {
				this.elmnt.innerHTML = this.remainingTimeString();
			} else {
				window.clearInterval(this.timeUpdater);
VSc.l('TimeShower.setUpdater  -- clearing interval', this, 2);
			}
		}.bind(this), this.timeScale);  //update in X amount of time (based on the value in timeScale)
//console.log('\n\nthis.timeUpdater = ', this.timeUpdater);
	}

}