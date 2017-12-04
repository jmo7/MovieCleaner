class ControlDialog {
	constructor() {
		this.name = 'ControlDialog';
VSc.l('ControlDialog.constructor', this);
		document.addEventListener('MC_Filter_Ready', function(event) {
VSc.l('ControlDialog heard MC_Filter_Ready - so calling ControlDialog.filterReady', this);
			VSc.ControlDialog.filterReady();
		}.bind(this));


		this.elmnt = document.createElement('div');
		this.elmnt.id = 'MCDialog';

		this.header = this.elmnt.appendChild(document.createElement('header'));

		this.header.heading = this.header.appendChild(document.createElement('h2'));
		this.header.heading.innerHTML = 'Movie Cleaner';

		this.header.closer = this.header.appendChild(document.createElement('button'));
		this.header.closer.classList.add('MCCloser');
		this.header.closer.innerHTML = '»';
		this.header.closer.title = "Close"
		this.header.closer.addEventListener('click', function() {
			this.deactivate();
			VSc.VideoController.play();
		}.bind(this));

		this.licenseInfoDiv = this.elmnt.appendChild(document.createElement('div'));
		this.licenseInfoDiv.classList.add('MCLicenseInfoDiv');
		this.LicenseMessage = new MessageList(this.licenseInfoDiv);

		this.content = this.elmnt.appendChild(document.createElement('div'));
		this.content.id = 'MCDialogContent';

		this.footer = this.elmnt.appendChild(document.createElement('footer'));

		this.footer.btnHelp = this.footer.appendChild(document.createElement('button'));
		this.footer.btnHelp.id = 'MC_BtnHelp';
		this.footer.btnHelp.innerHTML = 'Help';
		this.footer.btnHelp.title = 'Learn how to use MovieCleaner';
		this.footer.btnHelp.addEventListener('click', function() {
			VSc.port.postMessage({"event": {"name": "openHelp"}});
		}.bind(this));

		this.footer.btnSettings = this.footer.appendChild(document.createElement('button'));
		this.footer.btnSettings.id = 'MC_BtnSettings';
		this.footer.btnSettings.innerHTML = 'settings';
		this.footer.btnSettings.title = 'Change the way MovieCleaner works';
		this.footer.btnSettings.addEventListener('click', function() {
			VSc.port.postMessage({"event": {"name": "openOptions"}});
		}.bind(this));


		this.MessageList = new MessageList(this.content);

		VSc.port.onMessage.addListener(this.messageRouter);
	}



	reset() {
VSc.l('ControlDialog heard MC_Filter_Ready', this);
VSc.log( {'event': { 'name': 'debugMsg', 'value': 'ControlDialog.reset()' }});
		this.MessageList.clear();
		// this.footer.controls.btnOK.setAttribute('disabled', 'disabled');
//		VSc.port.postMessage( {"event": { "name": "resetDialog"}  });       // this will fire the same licensing stuff as init and the flow will be the same from there
	}



	messageRouter(message, sender, callback){
// var tmp = ( message.event && message.event.name) ? '(' + message.event.name + ')' : '';
// var tmp2 = (tmp != '' && message.event.value) ? '(' + message.event.value + ')' : '';
// console.log('%cControlDialog.messageRouter', 'font-size: 150%; background-color: maroon; color:white', tmp + tmp2 + ' = ', message);
		if ( message.event && message.event.name) {
			switch ( message.event.name ) {
				case 'reportError': VSc.ControlDialog.MessageList.addItem('reportError', message.event.value); break;
				case 'extensionIconClicked': VSc.ControlDialog.toggleDialog(message.event); break;
			}
		}
	}



	showLicenseInfo() {
VSc.l('ControlDialog.showLicenseInfo', this);
		var updater, btnBuy, interactives;
		var msgTexts = {
			"licenseStatus0": {
				"message": "MovieCleaner was unable to retrieve necessary license information from Google or from locally stored license information. <strong>It looks like you might be logged into Chrome with a different Google account than the one used to install MovieCleaner.</strong>",
			},
			"licenseStatus1": {
				"message": "MovieCleaner was unable to retrieve necessary license information from Google or from locally stored license information. <strong>It looks like you might be logged into Chrome with a different Google account than the one used to install MovieCleaner.</strong>",
			},
			"licenseStatus2": {
				"message": "MovieCleaner was unable to retrieve necessary license information from Google or from locally stored license information. <strong>It looks like you might be logged into Chrome with a different Google account than the one used to install MovieCleaner.</strong>",
			},
			"licenseStatus3": {
				"message": "MovieCleaner was unable to retrieve necessary license information from Google or from locally stored license information. <strong>It looks like you might be logged into Chrome with a different Google account than the one used to install MovieCleaner.</strong>",
			},
			"licenseStatus4": {
				"message": "MovieCleaner cannot determine if you have purchased a license, are in a Free Trial, or after one. If you see this message, please contact MovieCleaner support at support@movie-cleaner.com and let us know this message appeared.",
			},
			"licenseStatus5": {
				"message": "Time remaining in your Free Trial:",
			},
			"licenseStatus6": {
				"message": "<strong>Your Free Trial has expired.</strong><br/> Please click the Buy Now button to continue enjoying profanity free movies.",
			},
			"licenseStatus7": {
				"message": "",
			},
			"licenseStatus8": {
				"message": "There was an error starting MovieCleaner. Please click your browser\'s refresh button to reload the web page and MovieCleaner."
			}
		}


		if ((VSc.Authorizer.license.status == 5) || (VSc.Authorizer.license.status == 6)) {
			if (VSc.Authorizer.license.status == 5)  {
				updater = new TimeShower(60000, VSc.Authorizer.license.createdTime, VSc.Authorizer.license.trial_period_MS);
			}

			btnBuy = document.createElement('button');
			btnBuy.classList.add('MCDialogBtnBuy');
			btnBuy.innerHTML = 'Buy Now';
			btnBuy.title = 'Buy MovieCleaner';
			btnBuy.addEventListener('click', function() {
				this.gotoWebStore();
			}.bind(this));

			interactives = {"controls": [btnBuy]}

		}

		let msg = msgTexts['licenseStatus'+VSc.Authorizer.license.status].message;
		this.LicenseMessage.addItem('license', msg, undefined, undefined, updater, undefined, interactives, true);
	}



	start() {
VSc.l('ControlDialog.start', this);
		// this.activate();
		this.showFindCC();
	}



	showFindCC() {
VSc.l('ControlDialog.showFindCC', this);
VSc.log( {'event': { 'name': 'debugMsg', 'value': 'ControlDialog.start()' }});
		let btnOK = document.createElement('button');
		btnOK.classList.add('MCBtnOk');
		btnOK.innerHTML = 'OK';
		btnOK.title = 'Play your video with a filter';
		btnOK.setAttribute('disabled', 'disabled');
		btnOK.addEventListener('click', function() {
			this.MessageList.clear();
			this.useFilter();
		}.bind(this));

		let btnCancel = document.createElement('button');
		btnCancel.classList.add('MCBtnCancel');
		btnCancel.innerHTML = 'Cancel';
		btnCancel.title = 'Play your video with NO filter';
		btnCancel.addEventListener('click', function() {
			this.MessageList.clear();
			this.cancel();
		}.bind(this));


		let updater = new ProgressShower();
		this.MessageList.addItem('findingClosedCaptionFile', '<div class="MCRunStep">Finding Closed Caption file</div>', '<div class="MCStepSuccess">Found:  <span class="MCStepInstructions">Press OK to play your video filtered</span>', '<div class="MCStepFailure">File not found. <span class="MCStepInstructions">Please click your browser\'s <strong>REFRESH</strong> button. Or click the Cancel button to exit MovieCleaner</span>', updater, this.wasCCFound.bind(this), {"controls": [btnOK, btnCancel]} );
	}



	wasCCFound(found) {
VSc.l({text: 'ControlDialog.wasCCFound -- found = ', obj: found}, this);
		if (found) {
			let findingCCMessage = this.MessageList.getItem('findingClosedCaptionFile');
VSc.l({"text":"found was true so we got findingCCMessage which is", "obj":findingCCMessage}, this);
			if (findingCCMessage) {
				let btnOK = findingCCMessage.elmnt.querySelector( '.MCMessageControls .MCBtnOk' );
				btnOK.removeAttribute('disabled');
			}
		} else {
VSc.l('NOT found', this);
		}
	}



	// unfortunately as of late summer 2017 some video services report a different currenttime value for their video than is the actual time
	synchronizeCurrentTime() {
VSc.l('synchronizeCurrentTime', VSc.ControlDialog);
		if (window.getComputedStyle(VSc.VideoController.video, null).getPropertyValue('display') != 'none') {
			VSc.MediaMuter.start();
			VSc.VideoController.play();
			VSc.MediaMuter.currentTimeOffSet = -VSc.VideoController.video.currentTime;
VSc.l('VSc.MediaMuter.currentTimeOffSet = ' + VSc.MediaMuter.currentTimeOffSet, VSc.ControlDialog);
			VSc.VideoController.video.removeEventListener('seeked', VSc.ControlDialog.synchronizeCurrentTime, false);
		}
	}




	stalled() {
VSc.l('stalled', VSc.ControlDialog);
	}


	useFilter() {
//VSc.l('ControlDialog.useFilter', this);
VSc.log( {'event': { 'name': 'debugMsg', 'value': 'ControlDialog.proceed()' }});
		this.MessageList.addItem('playingWithFilter', '<div class="MCRunStep">Playing movie with filter</div>');
		VSc.VideoController.video.addEventListener('seeked', VSc.ControlDialog.synchronizeCurrentTime, false);
		VSc.VideoController.video.addEventListener('stalled', VSc.ControlDialog.stalled, false);
		VSc.VideoController.video.currentTime = 0;
		this.deactivate();
		// do not call VSc.VideoController.play(); it will be called using the seek event listener above
	}



	cancel() {
VSc.l('ControlDialog.cancel', this);
VSc.log( {'event': { 'name': 'debugMsg', 'value': 'ControlDialog.cancel()' }});
		this.MessageList.addItem('playingWithFilter', '<div class="MCRunStep">Playing movie with NO filter</div>');
		this.deactivate();
		VSc.VideoController.play();
	}



	toggleDialog() {
VSc.l('ControlDialog.toggleDialog', this);
VSc.log( {'event': { 'name': 'debugMsg', 'value': 'ControlDialog.toggleDialog()' }});
		if(this.elmnt.classList.contains('active')) {
			this.deactivate();
			VSc.VideoController.play();
		} else {
			this.activate();
		}
	}



	activate() {
VSc.l('ControlDialog.activate', this);
VSc.log( {'event': { 'name': 'debugMsg', 'value': 'ControlDialog.activate()' }});
		this.elmnt.classList.add('active');
		// activate/do related things
		VSc.ScreenShade.activate();
VSc.l({text:"\tVSc.VideoController = ", obj:VSc.VideoController}, this);
		VSc.VideoController.video.pause();
		this.stateBeforeSuspend = VSc.VideoController.state;
VSc.l('\tat end of ControlDialog.activate', this);
	}



	deactivate() {
VSc.l('ControlDialog.deactivate', this);
VSc.log( {'event': { 'name': 'debugMsg', 'value': 'ControlDialog.deactivate()' }});
		this.elmnt.classList.remove('active');
		// deactivate/do related things
		VSc.ScreenShade.deactivate();
//		VSc.VideoController.play();
	}



	filterReady() {
VSc.l('ControlDialog.filterReady', this);
		let findingCCMsg = this.MessageList.getItem('findingClosedCaptionFile');
VSc.l({text:"findingCCMsg = ", obj:findingCCMsg}, this);
		if (findingCCMsg) {
			findingCCMsg.updater.setResult(true);
		}
	}



	gotoWebStore() {
VSc.l('ControlDialog.gotoWebStore', this);
		window.location.href = "https://chrome.google.com/webstore/detail/moviecleaner/aoepneddfkpfohcoofmdbanoicipbene";
	}

}