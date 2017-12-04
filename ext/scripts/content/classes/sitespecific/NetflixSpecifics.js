class NetflixSpecifics {
	constructor() {
		this.name = 'NetflixSpecifics';
//console.log('%cNetflixSpecifics.constructor', 'font-size: 150%; background-color: #aa2222; color:white');
VSc.l('NetflixSpecifics.constructor', this);
		this.ON = 1;
		this.OFF = 2;
		this.tries = 50;

		this.TTSettingsSelectors = ['.player-timed-text-tracks', 'h3[aria-label="Subtitles"] ~ ol.klayer-ns'];
		this.TTLinks = [];
		this.captionFileInfo = {
			"pattern": 'https:\/\/ipv4_1-lagg0.*\.nflxvideo\.net(?!\/range)',
			"returnEventName": "captionsUrlFound"
		}

		VSc.port.onMessage.addListener(this.messageRouter);
	}



	messageRouter(message, sender, callback) {
		if (message.event && message.event.name) {
			switch ( message.event.name ) {
				case 'captionsUrlFound' : VSc.siteSpecifics.captionsUrlFound(message.event); break;
			}
		}
	}



	findCaptionInfo(urlFoundPromise) {
VSc.l('NetflixSpecifics.findCaptionInfo', this);
		this.urlFoundPromise = urlFoundPromise;
		this.findCaptionMenu(this.tries);
	}



	/* --- findCaptionMenu, findCaptionMenuItems, turnOn, and turnOff are to activate Netflix's GUI so that it will request the Closed Caption file -- */

    findCaptionMenu(numTries) {
VSc.l('NetflixSpecifics.findCaptionMenu - Polling', this);
		for (let i = 0; i < this.TTSettingsSelectors.length; i++) {
VSc.l('document.querySelector('+this.TTSettingsSelectors[i]+') where i = ' + i, this, 2);
			let tmp = document.querySelector(this.TTSettingsSelectors[i]);
VSc.l({text: 'tmp = ', obj: tmp}, this, 2);
			if (tmp) {
				this.elmnt = tmp;
				break;
			}
		}
		if (this.elmnt) {
VSc.l('\n\nNetflixSpecifics.findCaptionMenu found its element - so clear interval and call turnOn\n\n', this, 1, 'border: 2px red dashed;');
			clearInterval(this.interval);
			this.turnOn();
		}
		else if (!this.interval) {
			this.interval = window.setInterval(function(){
VSc.l('findCaptionMenu is inside the interval to call itself- numTries = ' + numTries, this);
				this.findCaptionMenu(--numTries);
			}.bind(this), 500)
		}
    }



	// This needs to be separate from the above function as this needs to be called both from turnOn and turnOff (see comments in turnOff)
    findCaptionMenuItems(turnOnOrOff) {
VSc.l('NetflixSpecifics.findCaptionMenuItems', this);
		let tmpLinks = this.elmnt.querySelectorAll('li');
VSc.l('tmpLinks.length = ' + tmpLinks.length,this);
		for (let i = 0; i < tmpLinks.length; i++ ) {
			name = tmpLinks[i].textContent.replace(/\s/g, '').toLowerCase();
			this.TTLinks[name] = tmpLinks[i];
VSc.l('this.TTLinks['+name+']', this);
			if (tmpLinks[i].className.match('player-track-selected')) {
				if (turnOnOrOff == this.ON) {
					this.TTLinks['selectedname'] = name;
				}
			}
		}
    }


    turnOn() {
//console.log('%cNetflixSpecifics.turnOn', 'font-size: 150%; background-color: #aa2222; color:white');
VSc.l('NetflixSpecifics.turnOn', this);
		// start looking for the file we are about to turn on the request for (call this before we click the menu item so we don't miss it)

//console.log('%cthis.captionFileInfo = %O', 'border:  3px blue dotted; font-size: 300%', this.captionFileInfo);
VSc.l({"text":"this.captionFileInfo = %O", "obj": this.captionFileInfo}, this);
		VSc.port.postMessage({"event": { "name": "findFile", "fileInfo": this.captionFileInfo } });
		this.findCaptionMenuItems(this.ON);

		if (this.TTLinks['english[cc]']) {
VSc.l('\n\nclicking the link\n\n', this);
			this.TTLinks['english[cc]'].click();
		}
		// now that we've turned on the captions, go find the file
    }



	// we might get here from the code running that finds the timedTextFile before the code here has had a chance to find all the caption controls
    turnOff() {
//console.log('%cNetflixSpecifics.turnOff', 'font-size: 150%; background-color: #aa2222; color:white');
VSc.l('NetflixSpecifics.turnOff', this);
		var name;
		// the nodes that were found the first time for turnOn are no longer in the document, so we need to find the new menu item nodes (is it rewritten everytime the menu shows?)
		this.findCaptionMenuItems(this.OFF);

		if (this.TTLinks['off']) {
			window.setTimeout(function() {
//console.group('NetflixTTSettings.turnOff');
VSc.l('NetflixSpecifics.turnOff', this);
//console.log('this.TTLinks[\'selectedname\'] = ', this.TTLinks['selectedname']);
VSc.l({"text":"this.TTLinks['selectedname'] = ", "obj": this.TTLinks['selectedname']}, this);
				if (this.TTLinks['selectedname']) {
					name = this.TTLinks['selectedname'];
				}

				if (name && this.TTLinks[name])  {
//console.log('1st branch calling this.TTLinks[name].click where name = ', name);
VSc.l({"text": "1st branch calling this.TTLinks[name].click where name = ", "obj":name }, this);
					this.TTLinks[name].click();
				} else {
//console.log('2nd branch calling this.TTLinks[\'off\'].click()');
VSc.l('2nd branch calling this.TTLinks[\'off\'].click()', this);
				  this.TTLinks['off'].click();
			  }
//console.groupEnd();
			}.bind(this), 1500);
		} else {
			window.setTimeout(this.turnOff.bind(this), 1000);
		}
    }
/* -------------------------  End GUI Manipulation stuff ---------------------------  */


// 	captionsUrlFound(event) {
// //console.log('%cNetflixSpecifics.captionsUrlFound', 'font-size: 150%; background-color: #aa2222; color:white');
// VSc.l('NetflixSpecifics.captionsUrlFound', this);
// 		this.turnOff();
//
// 		VSc.makeAJAXCall('GET', event.value, VSc.EDLFileLoader.captionsFileRetrieved, VSc.EDLFileLoader);
// 	}


	captionsUrlFound(event) {
VSc.l({text:'NetflixSpecifics.captionsUrlFound() event = %O', obj: event}, this);
		this.turnOff();

		var that = this;
VSc.l('about to fetch the url', this, 2);
		fetch(event.url, {credentials: 'include'}).then(function(response){
VSc.l({text:'response from subtitles file fetch = %o', obj:response }, this);
			if (response.ok) {
				return response.text();
			}
			throw new Error('Server responded with error - ', response);
		}.bind(this)).then(function(responseText){
VSc.l({text:'responseText', obj:responseText}, this);
VSc.l({text: 'that = ', obj: that}, this);
			that.urlFoundPromise.resolver(responseText);
		}.bind(this)).catch(function(err){
VSc.l({text:'fetch error', obj:err}, this);
VSc.l({text: 'that = ', obj: that}, this);
			that.urlFoundPromise.rejector('error fetching subtitle file so promise rejects');
		}.bind(this));
	}




	cleanTimedText(nodeList) {
//console.log('%cNetflixSpecifics.cleanTimedText', 'font-size: 150%; background-color: #aa2222; color:white');
VSc.l('NetflixSpecifics.cleanTimedText', this);
		let captionData = [];
		for (let i = 0; i < nodeList.length; i++) {
			let text = nodeList[i].innerHTML.replace(/<br\s?(xmlns="http.*")?\/>/, '<br/>');
			text = text.replace(/<span\s?(xmlns="http.*?")? style="defaultStyle(_1)?">/g, '');
			text = text.replace(/<\/span>/g, '');

			let beginTime = nodeList[i].getAttribute('begin').replace(/t/, '');
			beginTime = Math.trunc(beginTime / 100000);
			beginTime =  Math.round(beginTime / 10) / 10;

			let endTime = nodeList[i].getAttribute('end').replace(/t/, '');
			endTime = Math.trunc(endTime / 100000);	// strip down to thousands of a second
			endTime = Math.round(endTime / 10) / 10; // convert to 100ths of a second with decimal and round and then convert to 10ths

			captionData.push([beginTime, endTime, text]);
		}
//console.log('NetflixSpecifics.cleanTimedText() -- captionData = ', captionData);
		return captionData;
	}


}