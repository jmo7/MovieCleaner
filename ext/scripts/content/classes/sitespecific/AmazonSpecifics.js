class AmazonSpecifics {
	constructor() {
		this.name = 'AmazonSpecifics';
VSc.l('AmazonSpecifics.constructor', this);
		this.resourceFileInfo = {
			"pattern": 'https:\/\/.*GetPlaybackResources.*SubtitleUrls',
			"returnEventName": "resourceUrlFound"
		};

		VSc.port.onMessage.addListener(this.messageRouter);
	}



	messageRouter(message, sender, callback) {
		if (message.event && message.event.name) {
			switch (message.event.name) {
				case 'resourceUrlFound' : VSc.siteSpecifics.resourceUrlFound(message.event); break;
			}
		}
	}



	findCaptionInfo(donePromise) {
		// for Amazon the way to find the caption info is to first find the PlaybackResources file
VSc.l('AmazonSpecifics.findCaptionInfo', this);
		this.donePromise = donePromise;
VSc.l('about to post to VSb.background "findFile" which will call VSb.add_FileLoad_listener, when that completes it postMessages back to here with "resourceFileFound" which messageRouters to processResourceFile', this);
		VSc.port.postMessage({"event": { "name": "findFile", "fileInfo": this.resourceFileInfo } });
	}



//	This will be called when the resourceUrl has been found and will request the actual resource file
	resourceUrlFound(event) {
VSc.l({text:'AmazonSpecifics.resourceUrlFound() event = %O', obj: event}, this);
		var that = this;
VSc.l('about to fetch the url', this, 2);
		fetch(event.url, {credentials: 'include'}).then(function(response){
VSc.l({text:'AmazonSpecifics.resourceUrlFound() - fetch got a response - ', obj:response}, this);
			if (response.ok) {
VSc.l('response.ok so returning response.json()', this, 2);
				return response.json();
			}
			throw new Error('Server responded with error - ', response);
		}.bind(this)).then(function(json){
			that.processResourceFile(json);
		}.bind(this)).catch(function(err){
VSc.l({text:'fetch error:', obj: err}, this);
		}.bind(this));
	}



	processResourceFile(jsonObj) {
		var that = this;
VSc.l({text:'AmazonSpecifics.processResourceFile() jsonObj = %O', obj:jsonObj}, this);
		let subtitlesFile = undefined;
		for (let i = 0; i < jsonObj.subtitleUrls.length; i++ ) {
			if (jsonObj.subtitleUrls[i].languageCode.toLowerCase() == VSc.Config.Settings.items.currentLocale.toLowerCase()) {
				subtitlesFile = jsonObj.subtitleUrls[i];
				break;
			}
		}

		if (subtitlesFile != undefined) {
VSc.l({text:'AmazonSpecifics.processResourceFile() subtitlesFile = %O', obj:subtitlesFile }, this, 2);
			fetch(subtitlesFile.url, {credentials: 'include'}).then(function(response){
VSc.l({text:'response from subtitles file fetch = %o', obj:response }, this, 2);
				if (response.ok) {
					return response.text();
				}
				throw new Error('Server responded with error - ', response);
			}.bind(this)).then(function(responseText){
VSc.l({text:'responseText', obj:responseText}, this, 2);
				//VSc.EDLFileLoader.captionsFileRetrieved(json);
				that.donePromise.resolver(responseText);
			}.bind(this)).catch(function(err){
VSc.l({text:'fetch error', obj:err}, this, 2);
				that.donePromise.rejector('error fetching subtitle file so promise rejects');
			}.bind(this));
		} else {
VSc.l('No subtitle file matched the current locale', this, 2);
		}

	}



	cleanTimedText(nodeList) {
 VSc.l('AmazonSpecifics.cleanTimedText', this);
 		let captionData = [];
		for (let i = 0; i < nodeList.length; i++) {
			let text = nodeList[i].innerHTML.replace(/<(tt:)?br\s?(xmlns(:tt)?="http.*")?\/>/g, '<br/>');
			text = text.replace(/<(tt:)?span\s?(xmlns(:tt)?="http.*?")? style="defaultStyle(_1)?">/g, '');
			text = text.replace(/<\/span>/g, '');

			let begintimes = nodeList[i].getAttribute('begin').split(':');
			begintimes[0] = parseInt(begintimes[0], 10) * 360;	// convert the hours portion of the string into seconds
			begintimes[1] = parseInt(begintimes[1], 10) * 60;		// convert the minutes portion of the string into seconds
			begintimes[2] = parseFloat(begintimes[2], 10);		// convert the seconds (with decimal point for milliseconds) portion of the string into seconds with decimal for milliseconds
			let beginTime =  Math.floor((begintimes[0] + begintimes[1] + begintimes[2]) * 1000) / 1000;

			let endtimes = nodeList[i].getAttribute('end').split(':');
			endtimes[0] = parseInt(endtimes[0], 10) * 360;	// convert the hours portion of the string into seconds
			endtimes[1] = parseInt(endtimes[1], 10) * 60;		// convert the minutes portion of the string into seconds
			endtimes[2] = parseFloat(endtimes[2], 10);		// convert the seconds (with decimal point for milliseconds) portion of the string into seconds with decimal for milliseconds
			let endTime =  Math.floor((endtimes[0] + endtimes[1] + endtimes[2]) * 1000) / 1000;

			captionData.push([beginTime, endTime, text]);
		}

		return captionData;
	}

}