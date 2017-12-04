class Config {
	constructor() {
console.log('%cConfig.constructor', 'font-size: 150%; background-color: orange; color: white');
		this.constants = {
			"muteCategories": ['diety', 'profanity', 'explicit', 'racism', 'additional'],
			"builtInFudgeFactorStart": -0.25,       // in general we just need to shift forward by this much, plus whatever else the user specifies
			"debug": true,
		};


		this.settingsDefault = {
			"muteDietyDefault": true,
			"dietyListDefault": [ 'oh my god', 'my god', 'thank god', 'thank the gods', 'gods', 'god', 'oh my lord', 'oh dear lord', 'my lord', 'dear lord', 'good heavens', 'heavens', 'bloody', 'jesus', 'christ'],

			"muteProfanityDefault": true,
			"profanityListDefault": [ 'damn', 'dammit', 'the hell', 'hell', 'shit', 'mother fucker', 'fucker', 'fuck', 'bad ass', 'ass', 'son of a bitch', 'bitch'],

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

		this.settings = {};
		this.nameArray = [];
		this.storageObj = {};

		this.nameArray = Object.keys(this.settingsDefault).map(function(item) {
			return item.replace(/Default/, '');
		});

		this.readStorage(VSc.WordsToMute.reset, VSc.WordsToMute);
	}



    updateSettings(event) {
console.log('%cConfig.updateSettings', 'font-size: 150%; background-color: orange; color: white');
        this.settings = event.Config.settings;
		if (typeof event.save != 'undefined' && event.save) {
            this.saveStorage(function(){
//console.log('updated settings saved');
            });
        }
		document.dispatchEvent(new CustomEvent('MC_Settings_Updated', {"detail": VSc.Config.settings}));
    }


    sync(bSave) {
console.log('%cConfig.sync', 'font-size: 150%; background-color: orange; color: white');
        let save = (bSave) ? true : false;
        VSc.port.postMessage({"event": {"name":"configSync", "Config": VSc.Config, "save": save }});
    }


	readStorage(callBack, callBackContext) {
console.log('%cConfig.readStorage', 'font-size: 150%; background-color: orange; color: white');
console.trace();
  	  this.readStorage.callBack = callBack;
  	  let storageValues = {};

  	  for (let i = 0; i < this.nameArray.length; i++) {
//console.log('<storageValues[this.nameArray['+i+']]> storageValues['+this.nameArray[i]+'] = this.settingsDefault['+this.nameArray[i] + 'Default\'];');
  		  storageValues[this.nameArray[i]] = this.settingsDefault[this.nameArray[i] + 'Default'];
  	  }
console.log('\tabout to call chrome.storage.sync.get with a callback of Config.chromeStorageSyncGetCallback - %cAsynchronus', 'background-color: red; font-size: 150%; color:white; font-weight:bold');
  	  chrome.storage.sync.get(storageValues,
  		 function chromeStorageSyncGetCallback(items) {
console.log('%cConfig.chromeStorageSyncGetCallback', 'font-size: 150%; background-color: orange; color: white');
  			for (let i = 0; i < this.nameArray.length; i++) {
  //console.log('typeof items['+this.nameArray[i]+'] = ', typeof items[this.nameArray[i]]);
  			  this.settings[this.nameArray[i]] = items[this.nameArray[i]];
  			}
console.log('this.settings = ', this.settings);
			//document.dispatchEvent(new CustomEvent('MC_Settings_Read', {"detail": VSc.Config.settings}));
			document.dispatchEvent(new CustomEvent('MC_Settings_Updated', {"detail": VSc.Config.settings}));

			if (callBackContext) {
				callBack.call(callBackContext);
			} else {
				callBack();
			}
  		  }.bind(this)
  	  );
    };




    saveStorage(callBack, WordsToMutesChanged) {
console.log('%cConfig.saveStorage', 'font-size: 150%; background-color: orange; color: white');
  	  let storageValues = {};

  	  for (let i = 0; i < this.nameArray.length; i++) {
  		  storageValues[this.nameArray[i]] = this.settings[this.nameArray[i]];
  	  }
  	  chrome.storage.sync.set(storageValues,
  		  function saveStorageCallback() {
console.log('%cConfig.saveStorageCallback', 'font-size: 150%; background-color: orange; color: white');
  			  // if the WordsToMute has changed and we're in a state where we've already made our edl file remake the AudioMutes section
  			  if (WordsToMutesChanged) {
				  document.dispatchEvent(new CustomEvent('MC_WordsToMuteChanged'));
  			  }
  			  this.sync();
  			  callBack();
  		  }
  	  );
    };




    resetToDefaults(callBack) {
console.log('%cConfig.resetToDefaults', 'font-size: 150%; background-color: orange; color: white');
  	  for (let i = 0; i < this.nameArray.length; i++) {
  		  this.settings[this.nameArray[i]] = this.settingsDefault[this.nameArray[i] + 'Default'];
  	  }
  	  this.saveStorage(callBack);
    };



}