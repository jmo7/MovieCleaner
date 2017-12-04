VSb.Main = {


	init: function() {
console.log('%cVSb.Main.init', 'background-color: gold');
console.trace();
VSb.port.postMessage({ 'event': { 'name': 'debugMsg', 'value': 'VSb.Main.init()' }});

//		VSb.Config.init();

		chrome.permissions.getAll(function(permissions) {
			console.group('permissions')
			for (prop in permissions) {
				console.log(prop + ' : ' + permissions[prop]);
			}
			console.groupEnd();
		})


		chrome.runtime.onConnect.addListener(function(port) {
console.log('Main - chrome.runtime has onConnect-ed and so this handler function has fired');
			VSb.port.onMessage.addListener(function(request, sender, sendResponse){
//console.log('\n\nMain - VSb.port. has onMessage-ed and so this handler function has fired\n\t\trequest = ',request);
				VSb.Main.messageRouter(request, sender, sendResponse);
			});
		});

		chrome.browserAction.onClicked.addListener(VSb.Main.extensionIconClicked);


		VSb.Main.reset();
	},




	reset: function() {
console.log('%cVSb.Main.reset()', 'background-color: gold');
console.trace();
VSb.port.postMessage({ 'event': { 'name': 'debugMsg', 'value': 'VSb.Main.reset()' }});
		VSb.Main.setExtensionButton({'text': ''});
	},



	videoStatusChanged: function(event) {
//		console.log('videoStatusChanged recieved -- event.value = ', event.value);
		if (event.value == 'ended') {
console.log('%cvideoStatusChanged -- event = %o', 'font-size:20px; background-color: lime', event);
			VSb.Main.reset();
		}
	},


	messageRouter: function(message, sender, callback) {
//console.log('messageRouter() - sender = ', sender, ' -- message = ', message);
//console.log('background::messageRouter -- message.event.name = ', message.event.name);
var tmp = ( message.event && message.event.name) ? '(' + message.event.name + ')' : '';
var tmp2 = (tmp != '' && message.event.value) ? '(' + message.event.value + ')' : '';
console.groupCollapsed('%cMain.messageRouter', 'font-size: 150%; background-color: pink;', tmp + tmp2);
console.log('message = ', message);
console.groupEnd();

		if ( message.event && message.event.name) {
			switch (message.event.name) {
				case "findFile": VSb.add_FileLoad_listener(message.event); break;
				case "videoStatusChanged": VSb.Main.videoStatusChanged(message.event); break;
				case "changeIcon": VSb.Main.setExtensionButton(message.event); break
				case "makeXHRWithAuth": VSb.Main.xhrWithAuth(message.event); break;
				case "openHelp": VSb.Main.openHelp(); break;
				case "openOptions": VSb.Main.openOptions(); break;
			}
		}
	},




	// Helper Util for making authenticated XHRs
	//xhrWithAuth(method, url, interactive, callback) {
	xhrWithAuth: function(event) {
console.log('%cMain.xhrWithAuth', 'font-size: 150%; background-color: GreenYellow;', 'event = ',event );
//console.log('xhrWithAuth');
		var retry = true;
		var access_token;
		getToken();



		function getToken() {
//console.log('%cMain.xhrWithAuth.getToken', 'font-size: 150%; background-color: GreenYellow;');
//console.log('Main.xhrWithAuth.getToken -- chrome = ', chrome);
			chrome.identity.getAuthToken({
				interactive: event.interactive
			}, function(token) {
				if (chrome.runtime.lastError) {
					//this.license.status = 1;
					VSb.port.postMessage({ 'event': { 'name': 'xhrWithAuthResponse', 'lastError': chrome.runtime.lastError }});
					console.log('xhrWithAuth.getToken failed - error = ', chrome.runtime.lastError);
					// do nothing and falls back to xhrWithAuth, which fall back to caller of Authorizer.getLicenseFromGoogle
				} else {
					access_token = token;
					requestStart();
				}
			});
		};


		function requestStart() {
	console.log('%cMain.xhrWithAuth.requestStart', 'font-size: 150%; background-color: GreenYellow;');
			var xhr = new XMLHttpRequest();
			xhr.open(event.method, event.url);
			xhr.setRequestHeader('Authorization', 'Bearer ' + access_token);
			xhr.onreadystatechange = function(oEvent) {
				if (xhr.readyState === 4) {
					if (xhr.status === 401 && retry) {
						retry = false;
						chrome.identity.removeCachedAuthToken({
								'token': access_token
							},
							this.xhrWithAuth.getToken);
					} else if (xhr.status === 200) {
//						callback(null, xhr.status, xhr.response);
						VSb.port.postMessage({ 'event': { 'name': 'xhrWithAuthResponse', 'http_status':xhr.status, 'response':xhr.response }});
					} else {
//						this.license.status = 2;
						VSb.port.postMessage({ 'event': { 'name': 'xhrWithAuthResponse', 'http_status':xhr.status, 'response': undefined }});

					}
				} else {
//                    console.log("Not yet to a readyState of 4 -- readyState is " + xhr.statusText);
				}
			};
			try {
				xhr.send();
			} catch (e) {
//                console.log("Error in xhr - " + e);
			}
		};

	},



	extensionIconClicked: function() {
		VSb.port.postMessage({ 'event': { 'name': 'extensionIconClicked', 'value': 'processTimedTextFile' }});
	},



	setExtensionButton: function(event) {
console.log('%cMain.setExtensionButton', 'font-size: 150%; background-color: GreenYellow;', 'event = ', event);
		if (event.info && event.info.img) {
			chrome.browserAction.setIcon({
				path: event.info.img
			});
		}
		if (event.info && typeof event.info.text !== undefined) {
			chrome.browserAction.setBadgeText({"text": event.info.text});
		}
		if (event.info && event.info.color) {
			chrome.browserAction.setBadgeBackgroundColor({ color: event.info.color });
		}
	},




	openHelp: function() {
console.log('VSb.Main.openHelp');
		chrome.tabs.query({active: true, currentWindow: true}, function(tabinfo){
		console.log('callback: tabinfo = ', tabinfo);
	console.log('typeof tabinfo[0].index = ', typeof tabinfo[0].index);

			let props = {
				"index": Math.round(tabinfo[0].index) + 1,
				"active": true,
				"url": 'help.html'
			};
			chrome.tabs.create(props, function creatTabCB(tab){
	console.log('in creatTabCB() - tab = ', tab);
			});
		})
	},



	openOptions: function() {
		chrome.runtime.openOptionsPage();
	},


};



window.onload = function() {
console.log('%cbackground.js onload', 'background-color: red; font-size:200%');
	VSb.Main.init();
};
