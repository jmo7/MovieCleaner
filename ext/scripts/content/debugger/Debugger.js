VSc.Debugger = {
	"que": '',
	"showingConsole": false,


	// "Settings": { style: 'background-color: greenyellow;', state: true },
	// "AmazonSpecifics": { style: 'background-color: yellow;', state: true },
	// "HuluSpecifics": { style: 'background-color: yellow;', state: true },
	// "NetflixSpecifics": { style: 'background-color: yellow;', state: true },
	// "VuduSpecifics": { style: 'background-color: yellow;', state: true },
	// "YoutubeSpecifics": { style: 'background-color: yellow;', state: true },
	// "Authorizer": { style: 'background-color: lime;', state: true },
	// "Captions": { style: 'background-color: green;', state: true },
	// "Config": { style: 'background-color: darkgreen; color: white', state: true },
	// "ContentOptions": { style: 'background-color: gold;', state: true },
	// "ControlDialog": { style: 'background-color: lightblue;', state: true },
	// "EDLLoader": { style: 'background-color: blue;', state: true },
	// "Filter": { style: 'background-color: navy; color: white', state: true },
	// "LogoShower": { style: 'background-color: salmon;', state: true },
	// "MediaMuter": { style: 'background-color: pink;', state: true },
	// "Message": { style: 'background-color: orange;', state: true },
	// "MessageList": { style: 'background-color: teal;', state: true },
	// "WordsToMute": { style: 'background-color: sandybrown;', state: true },
	// "ProgressShower": { style: 'background-color: violet;', state: true },
	// "ScreenMuter": { style: 'background-color: palegreen;', state: true },
	// "ScreenShade": { style: 'background-color: mediumvioletred;', state: true },
	// "TimeShower": { style: 'background-color: mediumslateblue;', state: true },
	// "VideoController": { style: 'background-color: thistle;', state: true },
	// "MuteVisualizer": { style: 'background-color: crimson;', state: true },





	init: function() {
//console.log('%cinit()', 'font-size: 200%; color: gold');
		if (VSc.Container) {
			VSc.Container.appendChild((VSc.Debugger.Dashboard = new Dashboard).elmnt);
		}
		if (VSc.ControlDialog) {
			VSc.ControlDialog.elmnt.appendChild((VSc.Debugger.DebugInfo = new DebugInfo).elmnt);
		}

		VSc.port.onMessage.addListener(VSc.Debugger.messageRouter);

		document.addEventListener('MC_Video_Ended', function() {
			VSc.Debugger.reset();
		}.bind(this));

	},



	reset: function() {
//console.log('VSc.Debugger.reset() -- VSc.Debugger.Dashboard.showSegmentTracker = ' , VSc.Debugger.Dashboard.showSegmentTracker, ' --  VSc.Debugger.segmentTracker = ', VSc.Debugger.segmentTracker);
	},



	messageRouter: function(message, sender, callback){
//VSc.log({'event': { 'name': message.event.name, 'value':(message.event && message.event.value) ? message.event.value : undefined}})
//console.log('contentleveldebugger::messageRouter - message = ', message);
		if ( message.event && message.event.name) {
			 VSc.Debugger.log(message);
		}
	},



	log: function(message) {
// console.log('VSc.Debugger.log(message) -- ', message, '\nVSc.Debugger.Dashboard = ', VSc.Debugger.Dashboard);
		let msg = '<p>';
		if (typeof message.event.name != 'undefined') {
 			msg += (message.event.name == 'debugMsg') ? 'debugMsg ' : 'MCMsg: <em>' + message.event.name + '</em>';
			msg += (typeof message.event.value != 'undefined') ? ' -- ' : '' ;
		}
		msg += (typeof message.event.value != 'undefined') ? message.event.value + '</p>': '</p>';
		VSc.Debugger.que += msg;

		if (VSc.Debugger.Dashboard && VSc.Debugger.Dashboard.msgSpace) {
			VSc.Debugger.Dashboard.msgSpace.innerHTML += VSc.Debugger.que;
			VSc.Debugger.que = '';
		}
	},



	getDebugData: function() {
		var msg;
//console.log('navigator = ', navigator);
		// msg = JSON.stringify(navigator);
		msg =  'appVersion: ' + navigator.appVersion + '<br/>\n';
		msg += 'platform: ' + navigator.platform + '<br/>\n';
		msg += 'vendor: ' + navigator.vendor;
//console.log('msg = ' + msg);
		return msg;
	},



	sendData: function() {
		fetch('https://movie-cleaner.com/apis/sendDebugData', {
			method: 'POST',
			type: 'cors',
			body: document.getElementById('VScMsgSpace').innerHTML,
			headers: new Headers({
				'Content-Type': 'text/plain'
			})
		}).then(function(responseObj) {
//console.log('fetch:post callback --  responseObj = ', responseObj);
		});
	}

};



VSc.Debugger.init();