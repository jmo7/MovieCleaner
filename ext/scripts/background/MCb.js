var VSb = {
	"site": {
		"name": "incorrect",
		"url": "blank"
	},
	"postMessageQue": [],
	"fileFinderInfo": {
		"matchPattern": 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
	},


	// the following will be replaced by a reference to the real port once that is obtained, this is to prevent errors in calls to port.postmessage if the user is changing options without having loaded a content page yet
	"port": {
		"postMessage": function(message) {
			VSb.postMessageQue.push(message);
		}
	},



	/*
	newListener: function(details) {
console.log('newListener -- details.url = ', details.url, '\nVSb.fileFinderInfo.matchPattern = ', VSb.fileFinderInfo.matchPattern);

		if (details.url.match(VSb.fileFinderInfo.matchPattern)) {
console.log('%cit\'s a match -- details.url = %O', 'background-color: lime', details.url)

			VSb.fileFinderInfo.matchPattern = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
console.log('%cresetting VSb.fileFinderInfo.matchPattern - now it\'s ' + VSb.fileFinderInfo.matchPattern, 'border: 3px purple solid; border-top: none; border-left: none;');

console.log('Calling VSb.port.postMessage({ \'event\': { \'name\': ' + VSb.fileFinderInfo.returnEventName + ', \'url\': ' + details.url + '}});');
			VSb.port.postMessage({ 'event': { 'name': VSb.fileFinderInfo.returnEventName, 'url': details.url }});

		} else {
			console.log('not a match');
		}

	},


	add_FileLoad_listener: function(event) {
console.group('\n\n\n%cVSb.add_FileLoad_listener', 'font-size: 400%; background-color: gold');
		this.fileFinderInfo = {
			"matchPattern": new RegExp(event.fileInfo.pattern),
			"returnEventName": event.fileInfo.returnEventName
		};

	},
*/



	add_FileLoad_listener: function(event) {
console.group('\n\n\n%cVSb.add_FileLoad_listener', 'background-color: gold');
console.log('about to call chrome.webRequest.onCompleted.addListener( VSb.fileLoad_Listener, {urls: ["<all_urls>"]}, ["responseHeaders"] );');
console.groupEnd();
console.log('event = ', event);
		this.fileFinderInfo = {
			"match": new RegExp(event.fileInfo.pattern),
			"returnEventName": event.fileInfo.returnEventName
		};

console.log('VSb.fileFinderInfo = ', VSb.fileFinderInfo, '\n\n* * * * * * * * * * * * * * * * * * * * * * * * * * * * \n\n');
		chrome.webRequest.onCompleted.addListener( VSb.fileLoad_Listener, {urls: ["<all_urls>"]}, ["responseHeaders"] );
		//chrome.webRequest.onBeforeRequest.addListener( VSb.fileLoad_Listener, {urls: ["<all_urls>"]}, ["requestBody"] );

		VSb.port.onDisconnect.addListener(function() {
console.log('%cinside the VSb.port.onDisconnect.addListener - about to call webRequest.onCompleted.removeListener', 'background-color: gold; font-size: 200%;');
			chrome.webRequest.onCompleted.removeListener(VSb.fileLoad_Listener);
			//chrome.webRequest.onBeforeRequest.removeListener(VSb.fileLoad_Listener);
		});
//console.log('VSb.netflix::addFindTimedTextListener - timedTextListener added!');
	},



	fileLoad_Listener: function(details) {
//console.log('\n\n%cfileLoad_Listener', 'background-color:purple; color:white', '\t\tdetails.url.match('+VSb.fileFinderInfo.match+') = ', details.url.match(VSb.fileFinderInfo.match));
		if (details.url.match(VSb.fileFinderInfo.match)) {
console.log('%cdetails.url = %O', 'background-color: lime', details.url)
console.log('%cremoving listener', 'border: 3px purple solid; border-top: none; border-left: none;');
			chrome.webRequest.onCompleted.removeListener(VSb.fileLoad_Listener);
			//chrome.webRequest.onBeforeRequest.removeListener(VSb.fileLoad_Listener);
console.log('Calling VSb.port.postMessage({ \'event\': { \'name\': ' + VSb.fileFinderInfo.returnEventName + ', \'url\': ' + details.url + '}});');
			VSb.port.postMessage({ 'event': { 'name': VSb.fileFinderInfo.returnEventName, 'url': details.url }});
		}
	},



	init: function() {
console.log('%cVSb.init', 'font-size: 500%; text-shadow: 3px 3px 6px rgba(0,0,0,.5)');

// console.log('VSb.init is adding listener for chrome.webRequest.onCompleted')
// 		chrome.webRequest.onCompleted.addListener( VSb.newListener,  {urls: ["<all_urls>"]}, ["responseHeaders"] );




		chrome.runtime.onConnect.addListener(function(port){
			if (port.sender.url.indexOf('netflix') != -1) {
				VSb.site.name = 'netflix';
			} else if (port.sender.url.indexOf('amazon') != -1) {
				VSb.site.name = 'amazon';
			} else if (port.sender.url.indexOf('hulu') != -1) {
				VSb.site.name = 'hulu';
			} else if (port.sender.url.indexOf('vudu') != -1) {
				VSb.site.name = 'vudu';
			} else if (port.sender.url.indexOf('youtube') != -1) {
				VSb.site.name = 'youtube';
			} else {
				VSb.site.name = 'incorrect';
			}
			VSb.site.url = port.sender.url;
//console.log('VSb.site.url = ', VSb.site.url, '\n\nVSb.site.name = ', VSb.site.name);

			port.onDisconnect.addListener(function() {
//console.log('%ccontent disconnected', 'background-color: yellow; border:3px green dotted; font-size: 300%');
				port = undefined;
				VSb.port = {
					"postMessage": function(message) {
						VSb.postMessageQue.push(message);
					}
				};
			});

			VSb.port = port;

			if (VSb.postMessageQue.length > 0) {
				VSb.postMessageQue.forEach(function(message) {
					VSb.port.postMessage(message);
				});
				VSb.postMessageQue = [];
			}
		});
	}//()

};


VSb.init();