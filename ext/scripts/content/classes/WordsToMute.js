//console.log('%cscripts/cmutes.js','font-size:400%');
class WordsToMute {
	constructor() {
		this.name = 'WordsToMute';
VSc.l('WordsToMute.constructor', this);
		this.list = [];

// 		this.done = new Promise(function(resolve, reject){
// console.log('%cinside Promise constructor', 'font-size: 50px; background-color: cyan');
// 			this.resolver = resolve;
// 			this.rejector = reject;
// 		}.bind(this));
// 		this.done.resolver = this.resolver;
// 		this.done.rejector = this.rejector;

//		this.reset();
	}



	reset() {
VSc.l('WordsToMute.reset', this);
VSc.l({text:'\tthis = ', obj: this}, this, 2);
    	this.list = [];	// reset the array
VSc.l({text:'\tVSc.Config.Settings.items = ', obj: VSc.Config.Settings.items}, this, 2);
		this.getCategorizedWords(VSc.Config.Settings.items, 'diety');
		this.getCategorizedWords(VSc.Config.Settings.items, 'profanity');
        this.getCategorizedWords(VSc.Config.Settings.items, 'explicit');
		this.getCategorizedWords(VSc.Config.Settings.items, 'racism');
		this.getCategorizedWords(VSc.Config.Settings.items, 'additional');
VSc.l({text:'\tthis.list = ', obj: this.list}, this, 2);
	}



	getCategorizedWords(settingsObject, name) {
VSc.l('WordsToMute.getCategorizedWords', this);
//console.log('getCategorizedWords()\n\tname = '+name+'\n\tsettingsObject[\'mute' +name.charAt(0).toUpperCase() + name.slice(1)+'\'] = ', settingsObject['mute' +name.charAt(0).toUpperCase() + name.slice(1)]);
VSc.l({text: '\tname = ', obj: name}, this, 2);
VSc.l({text: '\tsettingsObject[\'mute' +name.charAt(0).toUpperCase() + name.slice(1)+'\'] = ', obj: settingsObject['mute' +name.charAt(0).toUpperCase() + name.slice(1)]}, this, 2);

		if (settingsObject['mute' +name.charAt(0).toUpperCase() + name.slice(1)] && settingsObject[name+'List'] && settingsObject[name+'List'].length > 0) {
			for (let i = 0; i < settingsObject[name+'List'].length; i++){
				this.list.push({"phrase": settingsObject[name+'List'][i], "pattern": new RegExp('\\b'+settingsObject[name+'List'][i]+'\\b', 'gi'), "type": name});
			}
		}
	}

}