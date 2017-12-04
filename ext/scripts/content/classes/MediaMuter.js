class MediaMuter {
	constructor(video, audioMutes, videoMutes) {
		this.name = 'MediaMuter';
VSc.l('MediaMuter.constructor', this );
		this.video = video;
		this.mediaTypes = ['audio', 'video'];
		this.audioMutes = audioMutes;
		this.audioMuting = false;
		this.audioCurrentSegment = -1;
		this.videoMuting = false;
		this.videoMutes = videoMutes
		this.videoCurrentSegment = -1;
		this.mutingAudio = -1;	// -1 is uninitialized, 0 is not muting, 1 is muting
		this.currentTimeOffSet = 0; // This might be changed in ControlDialog when useFilter is set (it will see if there is a differential between the time currrentTime says and 0)

VSc.l({text:'this.video = ', obj: this.video}, this, 2);
VSc.l({text:'this.audioMutes = ', obj: this.audioMutes}, this, 2);
	}




	start(message) {
VSc.l('MediaMuter.start', this );
//console.log('%cwindow.netflix.reactContext.contextData.player.data.config.ui.initParams.renderTimedText = %O', 'background-color: yellow; font-size: 120%', window.netflix.reactContext.contextData.player.data.config.ui.initParams.renderTimedText);
		this.active = true;
		this.video.addEventListener("timeupdate", this.timeUpdateHandler.bind(this));
		VSc.port.postMessage({"event": { "name":"changeIcon", "info":{"text":"On", "color":[28,140,28,255]}}} );
	}



	stop(message) {
VSc.l('MediaMuter.stop', this );
		this.active = false;
		this.unmuteAudioActions();
		this.video.removeEventListener("timeupdate", this.timeUpdateHandler);
		VSc.port.postMessage({"event": { "name":"changeIcon", "info":{"text":"Off", "color":[255,0,0,255]}}} );
	}




	timeUpdateHandler() {
VSc.l('MediaMuter.timeUpdateHandler()', this, 2 );
		this.monitorPlayback(this.video.currentTime);
	}



	monitorPlayback(time) {						// used when the player first starts (or restarts) to find where we are
VSc.l('MediaMuter.monitorPlayback('+time+')', this, 2 );
VSc.l('this.currentTimeOffSet = ' + this.currentTimeOffSet, this, 2 );
	time +=  this.currentTimeOffSet;
VSc.l('now time = ' + time, this, 2 );
		for (let i = 0; i < this.mediaTypes.length; i++) {
VSc.l({text:'VSc.Filter['+this.mediaTypes[i]+'].mutes.length = ', obj: VSc.Filter[this.mediaTypes[i]].mutes.length}, this, 2 );
			for (let j = 0; j < VSc.Filter[this.mediaTypes[i]].mutes.length; j++){
VSc.l({text:'\tis (time) ' + time + ' < ' + VSc.Filter[this.mediaTypes[i]].mutes[j].start + ' (VSc.Filter['+this.mediaTypes[i]+'].mutes['+j+'].start): ', obj: (time < VSc.Filter[this.mediaTypes[i]].mutes[j].start)}, this, 3);
				if (time < VSc.Filter[this.mediaTypes[i]].mutes[j].start) {
VSc.l({text:'\ttime is less then VSc.Filter['+this.mediaTypes[i]+'].mutes['+j+'].start and this['+this.mediaTypes[i]+'Muting] = ', obj: this[this.mediaTypes[i]+'Muting']}, this, 3);
					if (this[this.mediaTypes[i]+'Muting']) {
VSc.l('\tso unmuting', this);
						this[this.mediaTypes[i]+'UnmuteActions']();
					} //else {console.log('this['+this.mediaTypes[i]+'Muting] was already false so no change - break to loop to next segment');}
					break;
				}

				if (VSc.Filter[this.mediaTypes[i]].mutes[j].start < time && time < VSc.Filter[this.mediaTypes[i]].mutes[j].stop) {
VSc.l({text: '\ttime is inbetween (['+j+'].start) ' + VSc.Filter[this.mediaTypes[i]].mutes[j].start + ' and ' + VSc.Filter[this.mediaTypes[i]].mutes[j].stop + ' (['+j+'].stop) and this['+this.mediaTypes[i]+'Muting] = ', obj: this[this.mediaTypes[i]+'Muting'] }, this, 3);
					if (!this[this.mediaTypes[i]+'Muting']) {
VSc.l('\tso muting', this, 2);
						this[this.mediaTypes[i]+'MuteActions']();
					} //else {console.log('this['+this.mediaTypes[i]+'Muting] was already true so no change - break to loop to next segment');}
					break;
				}

				if (time > VSc.Filter[this.mediaTypes[i]].mutes[VSc.Filter[this.mediaTypes[i]].mutes.length - 1].stop) {
VSc.l( {text: '\t(time) ' + time + ' is after last ' + VSc.Filter[this.mediaTypes[i]].mutes[VSc.Filter[this.mediaTypes[i]].mutes.length - 1].stop + ' (item.stop) and this['+this.mediaTypes[i]+'Muting] = ', obj: this[this.mediaTypes[i]+'Muting'] }, this, 3);
					if (this[this.mediaTypes[i]+'Muting']) {
VSc.l('\tso unmuting', this, 2);
						this[this.mediaTypes[i]+'UnmuteActions']();
					} //else {console.log('this['+this.mediaTypes[i]+'Muting] was already false so no change - break to loop to next segment');}
					break;
				}
			}
		}
	}



	audioMuteActions() {
VSc.l('MediaMuter.audioMuteActions', this );
		this.audioMuting = true;
		this.video.muted = true;

		VSc.ScreenMuter.activate();
		if (VSc.Config.Settings.items && VSc.Config.Settings.items.showLogo) {
			VSc.LogoShower.activate();
		}
	}



	audioUnmuteActions() {
VSc.l('MediaMuter.audioUnmuteActions', this );
		this.audioMuting = false;
		this.video.muted = false;

		VSc.ScreenMuter.deactivate();
		if (VSc.Config.Settings.items && VSc.Config.Settings.items.showLogo) {
			VSc.LogoShower.deactivate();
		}
	}



	videoMuteActions() {
VSc.l('MediaMuter.videoMuteActions', this );
		VSc.ScreenMuter.activate();
	}



	vidioUnmuteActions() {
VSc.l('MediaMuter.videoUnmuteActions', this );
		VSc.ScreenMuter.deactivate();
	}


}