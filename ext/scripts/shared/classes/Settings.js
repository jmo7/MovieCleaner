class Settings {
	// VSObj is passed in because this file is used both in the background (where VSObj with be VSb) and in the content scripts where VSObj will be VSc
	constructor(VSObj) {
console.log('%cSettings.constructor', 'background-color: orange; color: white');
		this.VSObj = VSObj;
		this.constants = {
			"muteCategories": ['diety', 'profanity', 'explicit', 'racism', 'additional'],
			"builtInFudgeFactorStart": -0.25,       // in general we just need to shift forward by this much, plus whatever else the user specifies
			"debug": true,
			"state": "dev"
		};


		this.itemsDefault = {
			"muteDietyDefault": true,
			"dietyListDefault": [ 'oh my god', 'my god', 'thank god', 'thank the gods', 'gods', 'god', 'oh my lord', 'oh dear lord', 'my lord', 'dear lord', 'good heavens', 'heavens', 'bloody', 'jesus', 'christ'],

			"muteProfanityDefault": true,
			"profanityListDefault": [ 'damn', 'dammit', 'the hell', 'hell', 'shit', 'mother fucker', 'fucker', 'fuck', 'fucking', 'bad ass', 'ass', 'son of a bitch', 'bitch'],

			"muteExplicitDefault": true,
			"explicitListDefault": ['sexy', 'sex','suck', 'boner', 'penis', 'tits', 'boobs'],

			"muteRacismDefault": true,
			"racismListDefault": ['nigger','niggers', 'niggra', 'niggras', 'gypped', 'gyp'],

			"muteAdditionalDefault": true,
			"additionalListDefault": [],

			"disableVSFromIconDefault": false,
			"fudgeFactorStartDefault": 0,
			"fudgeFactorDurationDefault": 0,


			"fileRetrievalMethodsDefault": [
				{"name":"find_local_BrowserVFS_auto", "active":false},
				{"name":"find_remote_auto", "active":false},
				{"name":"find_local_manual", "active":false},
			],

			"showLogoDefault": true,
			"logoSizeDefault": "small",
			"logoPositionDefault": "topright",
			"debuggingDefault": false,

			"currentLocaleDefault": "en-US",
			"trialPeriodDaysDefault": 120
		};

		this.items = {};
		this.storageObj = {};

		this.nameArray = Object.keys(this.itemsDefault).map(function(item) {
			return item.replace(/Default/, '');
		});
console.log('\n\nthis.nameArray = ', this.nameArray, '\n\n');
	};



	sync(bSave) {
console.log('%cSettings.sync', 'background-color: orange; color: white');
        let save = (bSave) ? true : false;
        this.VSObj.port.postMessage({"event": {"name":"SettingsSync" }});
    };



	settingsUpdated(event) {
console.log('\n\n\n\%cConfig.updateSettings', 'background-color: orange; color: white');
console.trace();
//         this.settings = event.Config.settings;
// 		if (typeof event.save != 'undefined' && event.save) {
//             this.saveStorage(function(){
// //console.log('updated settings saved');
//             });
//         }
		this.readStorage(VSc.WordsToMute.reset, VSc.WordsToMute);
		document.dispatchEvent(new CustomEvent('MC_Settings_Updated', {"detail": VSc.Config.settings}));
    };



// 	readStorage(callBack, callBackContext) {
// console.log('%cSettings.readStorage', 'background-color: orange; color: white');
// console.trace();
// 		var that = this;
//   		this.readStorage.callBack = callBack;
//   	 	let storageKeys = {};
//
// 		for (let i = 0; i < this.nameArray.length; i++) {
// 		//console.log('<storageKeys[this.nameArray['+i+']]> storageKeys['+this.nameArray[i]+'] = this.itemsDefault['+this.nameArray[i] + 'Default\'];');
// 			storageKeys[this.nameArray[i]] = this.itemsDefault[this.nameArray[i] + 'Default'];
// 		}
// console.log('\tabout to call chrome.storage.sync.get with a callback of Settings.chromeStorageSyncGetCallback - %cAsynchronus', 'background-color: red; color:white; font-weight:bold');
// 		chrome.storage.sync.get(storageKeys,
// 			function chromeStorageSyncGetCallback(items) {
// console.log('%cSettings.chromeStorageSyncGetCallback', 'background-color: orange; color: white');
// 				for (let i = 0; i < this.nameArray.length; i++) {
// 				//console.log('typeof items['+this.nameArray[i]+'] = ', typeof items[this.nameArray[i]]);
// 					this.items[this.nameArray[i]] = items[this.nameArray[i]];
// 				}
// console.log('this.items = ', this.items);
// 		//document.dispatchEvent(new CustomEvent('MC_Settings_Read', {"detail": VSc.Settings.settings}));
// 		//document.dispatchEvent(new CustomEvent('MC_Settings_Updated', {"detail": VSc.Config.Settings.items}));
// 				document.dispatchEvent(new CustomEvent('MC_Settings_Updated', {"detail": this.items}));
//
// 				if (callBackContext) {
// 					callBack.call(callBackContext);
// 				} else {
// 					callBack();
// 				}
// 			}.bind(this)
// 		);
//     };



readStorage(readerPromise) {
console.groupCollapsed('%cSettings.readStorage', 'background-color: orange; color: white');
console.trace();
console.groupEnd();
console.log('readerPromise = ', readerPromise);
	let storageKeys = {};
console.log('%cthis.nameArray = %O', 'background-color: orange; color: white', this.nameArray);
	for (let i = 0; i < this.nameArray.length; i++) {
	//console.log('<storageKeys[this.nameArray['+i+']]> storageKeys['+this.nameArray[i]+'] = this.itemsDefault['+this.nameArray[i] + 'Default\'];');
		storageKeys[this.nameArray[i]] = this.itemsDefault[this.nameArray[i] + 'Default'];
	}
console.log('storageKeys = ' , storageKeys);
console.log('\tabout to call chrome.storage.sync.get with a callback of Settings.chromeStorageSyncGetCallback - %cAsynchronus', 'background-color: red; color:white; font-weight:bold');
	chrome.storage.sync.get(storageKeys,
		function chromeStorageSyncGetCallback(items) {
console.log('%cSettings.chromeStorageSyncGetCallback', 'background-color: orange; color: white');
			for (let i = 0; i < this.nameArray.length; i++) {
			//console.log('typeof items['+this.nameArray[i]+'] = ', typeof items[this.nameArray[i]]);
				this.items[this.nameArray[i]] = items[this.nameArray[i]];
			}
console.log('\t%cthis.items = %o', 'background-color: orange; color: white', this.items);
	//document.dispatchEvent(new CustomEvent('MC_Settings_Read', {"detail": VSc.Settings.settings}));
	//document.dispatchEvent(new CustomEvent('MC_Settings_Updated', {"detail": VSc.Config.Settings.items}));
			document.dispatchEvent(new CustomEvent('MC_Settings_Updated', {"detail": this.items}));
console.log('\t%cabout to call readerPromise.resolver()', 'background-color: orange; color: white', '\n\treaderPromise = ', readerPromise);
			readerPromise.resolver(this.items);
		}.bind(this)
	);
};



saveStorage(writerPromise, WordsToMuteHasChanged) {
console.log('%cSettings.saveStorage', 'background-color: orange; color: white');
  let storageKeys = {};

  for (let i = 0; i < this.nameArray.length; i++) {
	  storageKeys[this.nameArray[i]] = this.items[this.nameArray[i]];
  }
  chrome.storage.sync.set(storageKeys,
	  function saveStorageCallback() {
console.log('%cSettings.saveStorageCallback', 'background-color: orange; color: white');
console.log('this = ', this);
		  // if the WordsToMute has changed and we're in a state where we've already made our edl file remake the AudioMutes section
		  if (WordsToMuteHasChanged) {
			  document.dispatchEvent(new CustomEvent('MC_WordsToMuteChanged'));
		  }
		  this.sync();
		  writerPromise.resolver();
	  }.bind(this)
  );
};




//     saveStorage(callBack, WordsToMuteHasChanged) {
// console.log('%cSettings.saveStorage', 'background-color: orange; color: white');
//   	  let storageKeys = {};
//
//   	  for (let i = 0; i < this.nameArray.length; i++) {
//   		  storageKeys[this.nameArray[i]] = this.items[this.nameArray[i]];
//   	  }
//   	  chrome.storage.sync.set(storageKeys,
//   		  function saveStorageCallback() {
// console.log('%cSettings.saveStorageCallback', 'background-color: orange; color: white');
// console.log('this = ', this);
//   			  // if the WordsToMute has changed and we're in a state where we've already made our edl file remake the AudioMutes section
//   			  if (WordsToMuteHasChanged) {
// 				  document.dispatchEvent(new CustomEvent('MC_WordsToMuteChanged'));
//   			  }
//   			  this.sync();
//   			  callBack();
//   		  }.bind(this)
//   	  );
//     };




    resetToDefaults(callBack) {
console.log('%cSettings.resetToDefaults', 'background-color: orange; color: white');
		for (let i = 0; i < this.nameArray.length; i++) {
			this.items[this.nameArray[i]] = this.itemsDefault[this.nameArray[i] + 'Default'];
		}

		var writerPromise = new Promise(function(resolve, reject){
			this.resolver = resolve;
			this.rejector = reject;
		}.bind(this));

		writerPromise.resolver = this.resolver;
		writerPromise.rejector = this.rejector;
		writerPromise.then(function(){
			if (callBack) {
				callBack();
			}
		});

		this.saveStorage(writerPromise, false);	//  <----   Don't know if this is false or true. Have to figure it out
    };

}