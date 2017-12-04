class Filter {
	constructor(EDLData, wordlist, settings) {
		this.name = "Filter";
VSc.l('Filter.constructor', this);
VSc.l({text: 'wordlist = ', obj: wordlist}, this, 2);
		this.smallestTimeIncrement = 0.000001;
		this.creation_date = new Date();
		this.filename = "";
		this.url = "";
		this.EDLData = EDLData;
		this.wordlist = wordlist;
		this.settings = settings;

		this.audio = {
			"mutes": [],
			"filtering": false
		};
		this.video = {
			"mutes": [],
			"filtering": false
		}

		this.finished = new Promise(function(resolve, reject){
			this.resolver = resolve;
			this.rejector = reject;
		}.bind(this));
		this.finished.resolver = this.resolver;
		this.finished.rejector = this.rejector;


		this.makeFilterFromEDL();
	}



    reset() {
VSc.l('Filter.reset', this);
//        VSb.Filter.data = {};
    }



	makeFilterFromEDL() {
VSc.l('Filter.makeFilterFromEDL', this);
VSc.l({text: 'this.EDLData = ', obj: this.EDLData}, this, 2);
		for (let i = 0; i < this.EDLData.length; i++ ) {
			this.processEDLItem(this.EDLData[i][2], this.EDLData[i][0], this.EDLData[i][1]);
		}

		document.dispatchEvent(new CustomEvent('MC_Filter_Ready'));
		this.finished.resolver();
	}



	processEDLItem(edlText, startTime, stopTime) {
		let terminfo = this.matchTerm(edlText);
		if (terminfo.type != 'none') {
			this.audio.mutes.push( new AudioMute(startTime + this.settings.constants.builtInFudgeFactorStart + this.settings.items.fudgeFactorStart, stopTime + this.settings.constants.builtInFudgeFactorStart + this.settings.items.fudgeFactorStart +  this.settings.items.fudgeFactorDuration, terminfo.type, terminfo.text) );
		}
	}



	matchTerm(text) {
VSc.l('Filter.matchTerm', this);
		let type = 'none';
		for (let i = 0; i < this.wordlist.length; i++) {
			if (text.match(this.wordlist[i].pattern) !== null) {
				text = text.replace(this.wordlist[i].pattern, this.wordlist[i].phrase.substring(0, 1) + '...' );
VSc.l({text: 'matchTerm -- Foul word caught and replaced', obj: text}, this, 2);
				type = this.wordlist[i].type;
			}
		}
		return {'type': type, 'text': text};
	}

}



class AudioMute {
	constructor (start, stop, type, text) {
		this.name = 'AudioMute';
VSc.l('AudioMute.constructor', this);
VSc.l('start: '+ start + ', stop: ' + stop + ', type: ' + type + ', text: ' + text, this, 2);
		this.start = start;
		this.stop = stop;
		this.type = type;
		this.text = text;
	}
}


class VisualMute {
	constructor(start, stop, coordinates) {
		this.name = 'VisualMute';
VSc.l('VisualMute.constructor', this);
		this.start = start;
		this.stop = stop;
		this.coordinates = coordinates;
	}
}
