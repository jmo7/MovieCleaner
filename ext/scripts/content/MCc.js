console.log('%cMCc.js loaded', 'background-color:yellow; font-size:200%; font-weight:bold;');
var VSc = {
	"site": '',
	"pageUnloading": false,
	"logQue": [],
	"state": "beta",
};


VSc.port = chrome.runtime.connect({name:"moviecleaner"});
console.log("\n\n\nVSc.port = ", VSc.port, "\n\n\n");


VSc.commonStyle = 'padding: 3px;'
VSc.d = {
"Settings": { style: 'background-color: greenyellow;' + VSc.commonStyle, state: 1 },
"AmazonSpecifics": { style: 'background-color: yellow;' + VSc.commonStyle, state: 1 },
"HuluSpecifics": { style: 'background-color: yellow;' + VSc.commonStyle, state: 1 },
"NetflixSpecifics": { style: 'background-color: yellow; font-size: 120%;' + VSc.commonStyle, state: 1 },
"VuduSpecifics": { style: 'background-color: yellow;' + VSc.commonStyle, state: 1 },
"YoutubeSpecifics": { style: 'background-color: yellow;' + VSc.commonStyle, state: 1 },
"Authorizer": { style: 'background-color: lime;' + VSc.commonStyle, state: 1 },
"Config": { style: 'background-color: darkgreen; color: white;' + VSc.commonStyle, state: 1 },
"ControlDialog": { style: 'background-color: lightblue;' + VSc.commonStyle, state: 1 },
"EDLLoader": { style: 'background-color: blue; color: white;' + VSc.commonStyle, state: 1 },
"Filter": { style: 'background-color: navy; color: white;' + VSc.commonStyle, state: 1 },
"MediaMuter": { style: 'background-color: pink;' + VSc.commonStyle, state: 0 },
"AudioMute": { style: 'background-color: salmon; color: white;' + VSc.commonStyle, state: 0 },
"VideoMute": { style: 'background-color: fuschia; color: white;' + VSc.commonStyle, state: 0 },
"LogoShower": { style: 'background-color: salmon;' + VSc.commonStyle, state: 0 },
"Message": { style: 'background-color: orange;' + VSc.commonStyle, state: 0 },
"MessageList": { style: 'background-color: teal; color: white;' + VSc.commonStyle, state: 0 },
"WordsToMute": { style: 'background-color: sandybrown;' + VSc.commonStyle, state: 1 },
"ProgressShower": { style: 'background-color: violet;' + VSc.commonStyle, state: 0 },
"ScreenMuter": { style: 'background-color: palegreen;' + VSc.commonStyle, state: 0 },
"ScreenShade": { style: 'background-color: mediumvioletred; color: white;' + VSc.commonStyle, state: 0 },
"TimeShower": { style: 'background-color: mediumslateblue;' + VSc.commonStyle, state: 0 },
"VideoController": { style: 'background-color: thistle;' + VSc.commonStyle, state: 1 },
"MuteVisualizer": { style: 'background-color: crimson;' + VSc.commonStyle, state: 0 },
"DebugInfo": { style: 'background-color: maroon; color: white;' + VSc.commonStyle, state: 0 },
"Dashboard": { style: 'background-color: magenta; color: white;' + VSc.commonStyle, state: 0 }
}


VSc.l = function(message, that, level = 1, extraCSS = '') {
//console.log('%cVSc.l --- VSc.d['+that.name+'] = %o', 'font-size:40px; background-color: red', VSc.d[that.name]);
	let tmp = VSc.d[that.name];
//console.log('tmp = ', tmp, '\n<level> ' + level + ' <= ' + tmp.state + ' <tmp.state>');
	if (level <= tmp.state) {
		if (typeof message == 'string') {
			console.log('%c' + message, tmp.style + extraCSS);
		} else {
			console.log('%c' + message.text, tmp.style + extraCSS, message.obj);
		};
	}
}


if (document.URL.indexOf('netflix') != -1) {
	VSc.site = 'netflix';
console.log('%cVSc.siteSpecifics - NetflixSpecifics instantiation', 'background-color: #666699; color: white; font-weight:bold;');
	VSc.siteSpecifics = new NetflixSpecifics();
console.log('%cVSc.siteSpecifics - return from NetflixSpecifics instantiation', 'background-color: #666699; color: white; font-weight:bold;');
} else if (document.URL.indexOf('amazon') != -1) {
	VSc.site = 'amazon';
	VSc.siteSpecifics = new AmazonSpecifics();
} else if (document.URL.indexOf('hulu') != -1) {
	VSc.site = 'hulu';
	VSc.siteSpecifics = new HuluSpecifics();
} else if (document.URL.indexOf('vudu') != -1) {
	VSc.site = 'vudu';
	VSc.siteSpecifics = new VuduSpecifics();
} else if (document.URL.indexOf('youtube') != -1) {
	VSc.site = 'youtube';
	VSc.siteSpecifics = new YoutubeSpecifics();
} else {
	VSc.site = 'incorrect';
}
//console.log('%cVSc', 'font-size: 100px; background-color: orange; padding: 10px; line-height: 2em;');

if (!VSc.Container) {
console.log('no VSc.Container');
    VSc.Container = document.createElement('div');
    VSc.Container.classList.add('MCContainer');

	if (document.body) {
		document.body.appendChild(VSc.Container);
	} else {
		document.addEventListener('DOMContentLoaded', function() {
			document.body.appendChild(VSc.Container);
		});
	}
console.log('VSc.Container just added');
};


// This gets passed into the SiteSpecific file which will then resolve or reject it

VSc.urlFoundPromise = new Promise (function(resolve, reject){
	VSc.resolver = resolve;
	VSc.rejector = reject;
}.bind(VSc));
VSc.urlFoundPromise.resolver = VSc.resolver;
VSc.urlFoundPromise.rejector = VSc.rejector;
console.log('%cMCc.js is about to call VSc.siteSpecifics.findCaptionInfo', 'background-color: teal; color: white; font-size: 20px;');
VSc.siteSpecifics.findCaptionInfo(VSc.urlFoundPromise);


VSc.port.postMessage({"event": { "name": "frontEndBeginLoad", "url": window.location.href, "siteName": VSc.site } });


document.addEventListener('beforeunload', function() {
	VSc.port.disconnect();
});




VSc.log = function(message) {
	if (VSc.Debugger) {
		VSc.logQue.forEach(function(item) {
			VSc.Debugger.log(item);
		});
		VSc.logQue = [];
		VSc.Debugger.log(message);
	} else {
		VSc.logQue.push(message);
	}
};











//
// VSc.makeFetch = function(url, callback, context) {
// console.log('%cVSc.makeFetch('+ url + ', callback)', 'background-color: lightyellow; border:2px yellow solid');
// console.log('this = ', this, '\n\n\n');
// 	fetch(url).then(function(response){
// 		if (typeof context !== undefined) {
// 			callback.call(context, response);
// 		} else {
// 			callback(response);
// 		}
// 	}).catch(function(err){
// 		console.log('%cError sending MovieCleaner xhr request', 'background-color:maroon; color:white');
// 	});
// };



// VSc.makeAJAXCall = function(method, url, callback, context) {
// console.log('%cVSc.makeAJAXCall('+ method +', '+ url + ', callback)', 'background-color: lightyellow; border:2px yellow solid');
// console.log('this = ', this, '\n\n\n');
// 	let xhr = new XMLHttpRequest();
// 	xhr.open(method, url, true);
//
// 	xhr.onreadystatechange = function() {
// 		if (xhr.readyState == 4) {
// 			if (xhr.status == 200) {
// console.groupCollapsed('\tmakeAJAXCall');
// console.log('xhr.responseText = ', xhr.responseText, '\nxhr = ', xhr);
// console.groupEnd();
// //console.log('makeAJAXCall -- callback = ', callback);
// //console.log('\tmakeAJAXCall - got xhr.responseText');
// 				if (typeof context !== undefined) {
// 					callback.call(context, xhr);
// 				} else {
// 					callback(xhr);
// 				}
// 			} else {
// 				console.log('%cError sending MovieCleaner xhr request', 'background-color:maroon; color:white');
// 			}
// 		}
// 	};
//
// 	xhr.send(null);
// };