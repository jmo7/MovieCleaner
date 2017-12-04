class MuteVisualizer {
	constructor(type, mutes, duration) {
		this.name = 'MuteVisualizer';
VSc.l({text: 'MuteVisualizer.constructor\n\tfor type = ', obj: type}, this);
		this.type = type;
		this.elmnt = document.createElement('div');
		this.elmnt.id = 'MCD_' + type + 'MuteVisualizer';
		this.mutes = mutes;
		this.visuals = [];
		this.duration = duration;


		this.findPlayBar(function(playBar){
VSc.l({text: 'MuteVisualizer.findPlayBar.callBack', obj: playBar}, this, 2);
			playBar.appendChild(this.elmnt);
			this.populate();
		}.bind(this));
	}




	findPlayBar(callback) {
VSc.l('MuteVisualizer.findPlayBar', this);
		if (VSc.site == 'netflix') {
			VSc.Debugger.playBar = document.querySelector('.klayer-slider.container');
			if (!VSc.Debugger.playBar) {
				VSc.Debugger.playBar = document.querySelector('.player-scrubber.horizontal');
			}
		} else if (VSc.site == 'amazon') {
			VSc.Debugger.playBar = document.querySelector('.bottomPanel .progressBarContainer');
		}

		if (VSc.Debugger.playBar) {
			if (callback) {
				callback(VSc.Debugger.playBar);
			}
		} else {
			setTimeout(this.findPlayBar.bind(this), 1000, callback);
		}
	}




// 	reset() {
// console.log('\n\nSegmentTracker.reset -- this = ', this);
// 		this.findPlayBar( function(){
// 			this.elmnt.innerHTML = '';
// 		});
// 	}



	activate() {
VSc.l('MuteVisualizer.activate', this);
		this.elmnt.classList.add('active');
	}



	deactivate() {
VSc.l('MuteVisualizer.deactivate', this);
		this.elmnt.classList.remove('active');
	}



	populate() {
VSc.l('MuteVisualizer.populate', this);
		this.elmnt.innerHTML = '';

		for (let i = 0; i < this.mutes.length; i++) {
		 	let startPercent = parseFloat((this.mutes[i].start / this.duration ) * 100).toFixed(2);
			let stopPercent = parseFloat((this.mutes[i].stop / this.duration ) * 100).toFixed(2);
			let temp = stopPercent - startPercent;
			let width = (temp < 0.5 ) ? '1px' : parseFloat(temp).toFixed(3) + '%';
			let marker = this.elmnt.appendChild(document.createElement('div'));
			marker.className = 'MCD_' + this.type + 'MuteMarker';
			marker.id = 'MC_' + this.type + i + '_Marker';
			marker.style.left =  'calc('+startPercent + '% - 2px)';
			marker.style.width = width;
		}

		if (this.mutes.length === 0) {
			this.elmnt.innerHTML = 'There are no ' + this.type + ' mutes';
		}
	}

}
