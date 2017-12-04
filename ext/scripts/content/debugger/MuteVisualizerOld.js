class MuteVisualizer {
	constructor(type, mutes, duration) {
		this.type = type;
		this.elmnt = document.createElement('div');
		this.elmnt.id = 'MCD_' + type + 'MuteVisualizer';
		this.mutes = mutes;
		this.visuals = [];
		this.duration = duration;
		// wait until we have VSc.Filter.audio.runtimeSegments.list and/or VSc.Filter.video.runtimeSegments.list.... OR NOT?
		document.addEventListener('MC_Filter_Ready', function() {
			this.playBarIsInsertable()
		}.bind(this));

		this.populate();
	}


	playBarIsInsertable: function() {
	console.log('%cMuteVisualizer.playBarIsInsertable', 'background-color: purple; color: yellow');
		if (VSc.VideoController && VSc.VideoController.video && VSc.VideoController.video.duration) {
	console.log('%cMuteVisualizer.playBarIsInsertable - ready, clearing interval', '; background-color: purple; color: yellow');
			window.clearInterval(this.playBarIsInsertable_PollingInterval);
			this.findPlayBar(function(playBar){
			//	window.setTimeout(function() {
	console.log('%cAdding new MuteVisualizer', 'font-size: 30px; background-color:gold');
					playBar.appendChild((VSc.Debugger.AudioMuteVisualizer = new MuteVisualizer('audio', VSc.Filter.audio.mutes, VSc.VideoController.video.duration)).elmnt);
	console.log('%cAdding new MuteVisualizer', 'font-size: 30px; background-color:gold');
					playBar.appendChild((VSc.Debugger.VideoMuteVisualizer = new MuteVisualizer('video', VSc.Filter.video.mutes, VSc.VideoController.video.duration)).elmnt);
			//	}, 2000);
			});
		} else if (!this.playBarIsInsertable_PollingInterval) {
	  console.log('playBarIsInsertablee - we dont have VSc.VideoController.video.duration - there is no polling interval so set one up');
			this.playBarIsInsertable_PollingInterval = setInterval(function() {
	  console.log('setInterval -- calling this.playBarIsInsertable');
				this.playBarIsInsertable();
			}.bind(this), 500);
		}
	},



	findPlayBar: function (callback) {
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
	},




// 	reset() {
// console.log('\n\nSegmentTracker.reset -- this = ', this);
// 		this.findPlayBar( function(){
// 			this.elmnt.innerHTML = '';
// 		});
// 	}



	activate() {
		this.elmnt.classList.add('active');
	}



	deactivate() {
		this.elmnt.classList.remove('active');
	}



	populate() {
		this.elmnt.innerHTML = '';

		for (let i = 0; i < this.mutes.length; i++) {
		 	let startPercent = (this.mutes[i].start / this.duration ) * 100;
			let stopPercent = (this.mutes[i].stop / this.duration ) * 100;
			let temp = stopPercent - startPercent;
			let width = (temp < 0.5 ) ? '1px' : parseFloat(temp).toFixed(3) + '%';
			let marker = this.elmnt.appendChild(document.createElement('div'));
			marker.className = 'MCD_' + this.type + 'MuteMarker';
			marker.id = 'MC_' + i + '_Marker';
			marker.style.left =  'calc('+parseFloat(startPercent).toFixed(2) + '% - 2px)';
			marker.style.width = width;
		}

		if (this.mutes.length === 0) {
			this.elmnt.innerHTML = 'There are no ' + this.type + ' mutes';
		}
	}

}
