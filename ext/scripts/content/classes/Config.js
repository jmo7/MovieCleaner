class Config {
	constructor(callBack, context) {
		this.name = 'Config';
VSc.l('Config.constructor', this );
		VSc.port.onMessage.addListener(this.messageRouter);

		// This promise is tracked by content.js to see when the whole process is done
		var tmp = {};
		this.done = new Promise(function(resolve, reject){
			tmp.resolver = resolve;
			tmp.rejector = reject;
		}.bind(this));
		this.done.resolver = tmp.resolver;
		this.done.rejector = tmp.rejector;


		this.Settings = new Settings(VSc, this.done);


		// This promise is to see when the storage has been read
		tmp = {};
		var readerPromise = new Promise(function(resolve, reject){
			tmp.resolver = resolve;
			tmp.rejector = reject;
		}.bind(this));
		readerPromise.resolver = tmp.resolver;
		readerPromise.rejector = tmp.rejector;

		readerPromise.then(function(){
VSc.l('Config.Settings.readStorage - readerPromise.then is finished so running \'then\'', this);
			this.done.resolver();
		}.bind(this));

		this.Settings.readStorage(readerPromise);
	}


	messageRouter(message, sender, callback){
// var tmp = ( message.event && message.event.name) ? '(' + message.event.name + ')' : '';
// var tmp2 = (tmp != '' && message.event.value) ? '(' + message.event.value + ')' : '';
// console.log('%cConfig.messageRouter', 'font-size: 150%; background-color: orange; color:white', tmp + tmp2 + ' = ', message);
		if ( message.event && message.event.name) {
			switch ( message.event.name ) {
				case "SettingsSync": VSc.Config.Settings.settingsUpdated(message.event); break;
			}
		}
	}



    settingsUpdated(event) {
console.log('%cConfig.updateSettings', 'font-size: 150%; background-color: orange; color: white');
VSc.l('Config.constructor', this);
//         this.settings = event.Config.settings;
// 		if (typeof event.save != 'undefined' && event.save) {
//             this.saveStorage(function(){
// //console.log('updated settings saved');
//             });
//         }
		this.Settings.readStorage(VSc.WordsToMute.reset, VSc.WordsToMute);
		document.dispatchEvent(new CustomEvent('MC_Settings_Updated', {"detail": VSc.Config.settings}));
    }

}