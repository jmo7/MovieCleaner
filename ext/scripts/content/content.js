console.log('%ccontent.js loaded', 'background-color:yellow; font-size:200%; font-weight:bold;');
VSc.Content = {

	constructStuff: function() {
console.log('\n\n\n\n\n\n%cContent.init', 'font-size: 450%; background-color: lightblue;');


		// window.addEventListener('beforeunload', function(){
		// console.log('%cContent -- beforeunload', 'font-size: 150%; background-color: lightblue;');
		// 	VSc.pageUnloading = true;
		// 	VSc.port.postMessage({"event": { "name": "contentPageUnloading"}});
		// });


		VSc.port.onMessage.addListener(VSc.Content.messageRouter);

		// document.addEventListener('MC_Filter_Ready', function(event) {
		// 	VSc.ControlDialog.filterReady();
		// });

		// document.addEventListener('MC_License_Retrieved', function() {
		// //console.log('VSb.Authorizer heard MC_Content_Page_Ready - calling this.sendLicenseInfo()');
		// 	this.determineStart();
		// }.bind(this));
		//
		// document.addEventListener('MC_WordsToMuteChanged', function(event) {
		// 	VSc.WordsToMute.reset();
		// //			VSc.Filter.makeFilterFromTimedTextFile();
		// 	VSc.Filter.makeFilterFromEDL();
		// });

		// document.addEventListener('MC_EDL_Ready', function(event) {
		//
		// });


// 		document.addEventListener('MC_Video_Ended', VSc.Content.reset);
//
// 		VSc.Container.appendChild((VSc.ScreenShade = new ScreenShade).elmnt);
// console.log('\t%cContent.init - return from ScreenShade instantiation', 'border-bottom: 2px lightblue solid;', '\n\n\n');
//
// 		VSc.Container.appendChild((VSc.ScreenMuter = new ScreenMuter).elmnt);
// console.log('\t%cContent.init - return from ScreenMuter instantiation', 'border-bottom: 2px lightblue solid;', '\n\n\n');
//
// 		VSc.Container.appendChild((VSc.LogoShower = new LogoShower).elmnt);
// console.log('\t%cContent.init - return from LogoShower instantiation', 'border-bottom: 2px lightblue solid;', '\n\n\n');
//
// 		VSc.Container.appendChild((VSc.ControlDialog = new ControlDialog).elmnt);
// console.log('\t%cContent.init - return from ControlDialog instantiation', 'border-bottom: 2px lightblue solid;', '\n\n\n');

		window.addEventListener('beforeunload', function(){
		console.log('%cContent -- beforeunload', 'font-size: 150%; background-color: lightblue;');
			VSc.pageUnloading = true;
			VSc.port.postMessage({"event": { "name": "contentPageUnloading"}});
		});


		// VSc.port.onMessage.addListener(VSc.Content.messageRouter);

		// document.addEventListener('MC_Filter_Ready', function(event) {
		// 	VSc.ControlDialog.filterReady();
		// });

		document.addEventListener('MC_License_Retrieved', function() {
		//console.log('VSb.Authorizer heard MC_Content_Page_Ready - calling this.sendLicenseInfo()');
			this.determineStart();
		}.bind(this));

		document.addEventListener('MC_WordsToMuteChanged', function(event) {
			VSc.WordsToMute.reset();
		//			VSc.Filter.makeFilterFromTimedTextFile();
			VSc.Filter.makeFilterFromEDL();
		});

		// document.addEventListener('MC_EDL_Ready', function(event) {
		//
		// });


		//document.addEventListener('MC_Video_Ended', VSc.Content.reset);
		document.addEventListener('MC_Video_Ended', function(){console.log('content heard MC_Video_Ended event so calling Content.reset'); VSc.Content.reset});

		VSc.Container.appendChild((VSc.ScreenShade = new ScreenShade).elmnt);
		console.log('\t%cContent.init - return from ScreenShade instantiation', 'border-bottom: 2px lightblue solid;', '\n\n\n');

		VSc.Container.appendChild((VSc.ScreenMuter = new ScreenMuter).elmnt);
		console.log('\t%cContent.init - return from ScreenMuter instantiation', 'border-bottom: 2px lightblue solid;', '\n\n\n');

		VSc.Container.appendChild((VSc.LogoShower = new LogoShower).elmnt);
		console.log('\t%cContent.init - return from LogoShower instantiation', 'border-bottom: 2px lightblue solid;', '\n\n\n');

		VSc.Container.appendChild((VSc.ControlDialog = new ControlDialog).elmnt);
		console.log('\t%cContent.init - return from ControlDialog instantiation', 'border-bottom: 2px lightblue solid;', '\n\n\n');



		this.init();
	},



	init: function() {

//		var temp = new MediaSource();
	 	VSc.WordsToMute = new WordsToMute();	// we don't need config read in yet to instantiate this
console.log('\t%cContent.init - return from WordsToMute instantiation', 'border-bottom: 2px lightblue solid;', '\n\n\n');

		VSc.EDLLoader = new EDLLoader();


// 		window.addEventListener('beforeunload', function(){
// 		console.log('%cContent -- beforeunload', 'font-size: 150%; background-color: lightblue;');
// 			VSc.pageUnloading = true;
// 			VSc.port.postMessage({"event": { "name": "contentPageUnloading"}});
// 		});
//
//
// 		// VSc.port.onMessage.addListener(VSc.Content.messageRouter);
//
// 		// document.addEventListener('MC_Filter_Ready', function(event) {
// 		// 	VSc.ControlDialog.filterReady();
// 		// });
//
// 		document.addEventListener('MC_License_Retrieved', function() {
// 		//console.log('VSb.Authorizer heard MC_Content_Page_Ready - calling this.sendLicenseInfo()');
// 			this.determineStart();
// 		}.bind(this));
//
// 		document.addEventListener('MC_WordsToMuteChanged', function(event) {
// 			VSc.WordsToMute.reset();
// 		//			VSc.Filter.makeFilterFromTimedTextFile();
// 			VSc.Filter.makeFilterFromEDL();
// 		});
//
// 		// document.addEventListener('MC_EDL_Ready', function(event) {
// 		//
// 		// });
//
//
// 		document.addEventListener('MC_Video_Ended', VSc.Content.reset);
//
// 		VSc.Container.appendChild((VSc.ScreenShade = new ScreenShade).elmnt);
// console.log('\t%cContent.init - return from ScreenShade instantiation', 'border-bottom: 2px lightblue solid;', '\n\n\n');
//
// 		VSc.Container.appendChild((VSc.ScreenMuter = new ScreenMuter).elmnt);
// console.log('\t%cContent.init - return from ScreenMuter instantiation', 'border-bottom: 2px lightblue solid;', '\n\n\n');
//
// 		VSc.Container.appendChild((VSc.LogoShower = new LogoShower).elmnt);
// console.log('\t%cContent.init - return from LogoShower instantiation', 'border-bottom: 2px lightblue solid;', '\n\n\n');
//
// 		VSc.Container.appendChild((VSc.ControlDialog = new ControlDialog).elmnt);
// console.log('\t%cContent.init - return from ControlDialog instantiation', 'border-bottom: 2px lightblue solid;', '\n\n\n');





		VSc.VideoController = new VideoController();
		VSc.Config = new Config();

console.log('\n\n\n\t%cback in Content.init - EDLLoader and Config both just instantiated. Now set up promise all to track them completing\n\n\n', 'border-bottom: 2px lightblue solid;');
		Promise.all([VSc.EDLLoader.done, VSc.Config.done, VSc.VideoController.done]).then(function(promisesData) {
 console.log('%cEDLLoader, Config, and VideoController are both Done!!', 'font-size: 30px;');
 			var EDLData = promisesData[0];
			VSc.WordsToMute.reset();
			VSc.Filter = new Filter(EDLData, VSc.WordsToMute.list, VSc.Config.Settings);
			VSc.Filter.finished.then(function(){
console.log('%cFilter is Finished!!', 'font-size: 30px;');
					VSc.MediaMuter = new MediaMuter(VSc.VideoController.video, VSc.Filter.audio.mutes, VSc.Filter.video.mutes);
					VSc.AudioMuteVisualizer = new MuteVisualizer('audio', VSc.Filter.audio.mutes, VSc.VideoController.video.duration);
					VSc.VideoMuteVisualizer = new MuteVisualizer('video', VSc.Filter.video.mutes, VSc.VideoController.video.duration);
			});
		}).catch(function(promisesData){
console.log('\n\n\n\t%cback in Content.init - The EDLLoader and Config promise has rejected\n\n\n', 'border-bottom: 2px lightblue solid;', '\n\tpromisesData = ', promisesData);
		});


		VSc.Authorizer = new Authorizer();
console.log('\t%cContent.init - return from Authorizer instantiation', 'border-bottom: 2px lightblue solid;', '\n\n\n');

	},




	reset: function() {
console.log('%cContent.reset', 'font-size: 150%; background-color: lightblue;');
console.trace();
		if (!VSc.pageUnloading) {
			VSc.urlFoundPromise = new Promise (function(resolve, reject){
				VSc.resolver = resolve;
				VSc.rejector = reject;
			}.bind(VSc));
			VSc.urlFoundPromise.resolver = VSc.resolver;
			VSc.urlFoundPromise.rejector = VSc.rejector;
console.log('%cContent.reset is about to call VSc.siteSpecifics.findCaptionInfo', 'background-color: teal; color: white; font-size: 20px;');
			VSc.siteSpecifics.findCaptionInfo(VSc.urlFoundPromise);

			VSc.ControlDialog.reset();


// !! START HERE !! -- !! START HERE !! -- !! START HERE !! -- !! START HERE !! -- !! START HERE !! -- !! START HERE !! -- !! START HERE !!
// console.log('Content.reset calling Content.init ');
			VSc.Content.init();			//<--  do we include this or not??
// !! START HERE !! -- !! START HERE !! -- !! START HERE !! -- !! START HERE !! -- !! START HERE !! -- !! START HERE !! -- !! START HERE !!


//			VSc.Config.Settings.settingsUpdated();
			VSc.port.postMessage( {"event": { "name": "contentPageReset", "url": document.URL} });
		}
	},




	messageRouter: function(message, sender, callback){
// var tmp = ( message.event && message.event.name) ? '(' + message.event.name + ')' : '';
// var tmp2 = (tmp != '' && message.event.value) ? '(' + message.event.value + ')' : '';
// console.log('%cContent.messageRouter', 'font-size: 150%; background-color: lightblue;', tmp + tmp2 + ' = ', message);

		if ( message.event && message.event.name) {
			switch ( message.event.name ) {
				case 'licenseRetrieved': VSc.Content.determineStart(message.event); break;
				case 'xhrWithAuthResponse' : VSc.Authorizer.xhrWithAuthResponse(message.event); break;
			}
		}
	},



	premadeEDLFound: function() {
console.log('%cContent.premadeEDLFound', 'font-size: 150%; background-color: lightblue;');
	},



	premadeEDLNOTFound: function() {	// don't know if we really need to know this in VSc.Content
console.log('%cContent.premadeEDLNOTFound', 'font-size: 150%; background-color: lightblue;');
	},



	dynamicEDLMade: function() {
console.log('%cContent.dynamicEDLMade', 'font-size: 150%; background-color: lightblue;');
	},



	// Determine, based on the license.status, if we should start. Also show a message based on the status in the ControlDialog
	// See Authorizer.js for a list of what the different statuses mean
	determineStart: function() {
console.groupCollapsed('%cContent.determineStart', 'font-size: 150%; background-color: lightblue;');
console.trace();
console.log('\tVSc.Content.determineStart() -- VSc.Authorizer.license = %O', VSc.Authorizer.license, '\n\tcall showLicenseInfo()');
VSc.log( {'event': { 'name': 'debugMsg', 'value': 'VSc.Content.determineStart() -- VSc.Authorizer.license.status = ' + VSc.Authorizer.license.status }});

		VSc.ControlDialog.showLicenseInfo();

		let start = (VSc.Authorizer.license.status == 6 || VSc.Authorizer.license.status == 8) ? false : true;
console.log('  back in VSc.Content.determineStart()- because VSc.Authorizer.license.status=',VSc.Authorizer.license.status, ',start=',start);
console.groupEnd();
		if (start) {
			VSc.ControlDialog.start();
		}
	}

};



VSc.Content.constructStuff();