class VideoController {
	constructor() {
		this.name = 'VideoController';
VSc.l('VideoController.constructor', this, 'font-size:20px; text-shadow: 2px 2px 4px orange;');
//		this.callBack = callBack;
		this.video = undefined;
		this.initialPlay = true;
		this.play = undefined;
		this.pause = undefined;
		this.mute = undefined;
		this.unmute = undefined;
		this.stateBeforeSuspend = "none";
		this.state = "none";
		this.isFirstEndingEvent = true;


		this.srcChanged = new MutationObserver(function(mutations) {
	//console.log('\n\n\n%cended event -- srcChanged', 'background-color: salmon');
	console.log('\n\nsrcChanged - mutations = ', mutations, '\n\nmutations[0].type = ',mutations[0].type, '\nmutations[0].attributeName = ', mutations[0].attributeName );
			this.videoEnd({"name": "srcChanged", "details":mutations});
		}.bind(this));


		this.videoNodeRemoved = new MutationObserver(function(mutations) {
	VSc.l('VideoController.videoNodeRemoved which is mutationObserver function', this, 2);
	//console.log('%cvideoNodeRemoved()\m\tmutations.length = '+ mutations.length, 'background-color: red');
			mutations.forEach(function(mutation){
				var i;
	//console.log('muation.removedNodes.length = ', mutation.removedNodes.length);
				for (i = 0; i < mutation.removedNodes.length; i++) {
	//VSc.l({text:'\tmutation.removedNodes['+i+'] = %O', obj: mutation.removedNodes[i]}, this, 3);
	// console.log('(mutation.removedNodes[i] === this.video) = ', (mutation.removedNodes[i] === this.video));
					if (mutation.removedNodes[i] === this.video) {
						// the video has ended and been removed.
						this.videoNodeRemoved.disconnect();

						/* The following line is because if VideoContoller.reset has been called, then a new interval has been put in place,
						even though we are about to remove the node. when the node is removed and a new one put in place, reset will be called again
						and we'll have to pollers going on  */
//console.log('%cVideoController - node has been removed -- this.getVideoNode_PollingInterval = %O', 'font-size: 150%; background-color: pink;', this.getVideoNode_PollingInterval, '\ncalling clearInterval');
						window.clearInterval(this.getVideoNode_PollingInterval);
						this.videoEnd({"name": "videoNodeRemoved", "details": mutation});
					}
				}
			}.bind(this));
		}.bind(this));

		this.done = new Promise(function(resolve, reject){
			this.resolver = resolve;
			this.rejector = reject;
		}.bind(this));
		this.done.resolver = this.resolver;
		this.done.rejector = this.rejector;


//VSc.l('VideoController.constructor calling getVideoNode', this, 2);
		this.getVideoNode();
	}



	reset() {
VSc.l('VideoController.reset', this);
		this.initialPlay = true;
//		this.isFirstEndingEvent = true;
		this.getVideoNode();
	}



	getVideoNode() {
VSc.l('VideoController.getVideoNode - Polling', this, 2);
   		let vidEls = document.querySelectorAll('video');
		let vidEl = undefined;

		for (let i = 0; i < vidEls.length; i++) {
			if (vidEls[i].src && vidEls[i].src.indexOf('blob') == 0) {
				vidEl = vidEls[i];
			}
		}


	  	if (vidEl && vidEl.duration) {
	  		window.clearInterval(this.getVideoNode_PollingInterval);
VSc.l('\tgetVideoNode - we\'ve just cleared the polling interval', this, 2);
VSc.l('\tgetVideoNode resetting this.isFirstEndingEvent', this, 3);
			this.isFirstEndingEvent = true;

	  		this.getVideoNode_PollingInterval = null;
	  		this.video = vidEl;

	  		this.addVideoCode(this.video);
VSc.l('\tgetVideoNode - calling done.resolver()', this);
			this.done.resolver();
	  	} else if (!this.getVideoNode_PollingInterval) {
VSc.l('\tgetVideoNode - we don\'t have vidEl (or perhaps vidEl.duration) - there is no polling interval so set one up', this);
				this.getVideoNode_PollingInterval = setInterval(function() {
VSc.l('\tin the getVideoNode_PollingInterval function -- calling this.getVideoNode', this, 2);
					this.getVideoNode();
				}.bind(this), 500);
	  	}
	}




	addVideoCode(node) {
		var blobURL;
VSc.l('\tVideoController.addVideoCode', this);

		node.addEventListener('loadstart', function(evt) {
VSc.l('VideoController heard video \'loadstart\' event', this, 3);
//			this.isFirstEndingEvent = false;
//		   VSc.port.postMessage({"event": { "name": "videoStatusChanged", "value": "seeked", "origEvt": evt, "timestamp":evt.timeStamp }});
		}.bind(this));


		node.addEventListener('load', function(evt) {
VSc.l('VideoController heard video \'load\' event', this, 3);
 			 this.state = "loading";
		}.bind(this));


		node.addEventListener('loadeddata', function(evt) {
VSc.l('VideoController heard video \'loadeddata\' event', this, 3);
		}.bind(this));


		node.addEventListener('seeked', function(evt) {
VSc.l('VideoController heard video \'seeked\' event', this, 3);
		   VSc.port.postMessage({"event": { "name": "videoStatusChanged", "value": "seeked", "origEvt": evt, "timestamp":evt.timeStamp }});
		}.bind(this));


		node.addEventListener('playing', function(evt) {
VSc.l({text: 'VideoController heard video \'playing\' event\n\tthis.initialPlay = ', obj: this.initialPlay}, this);
 			if (this.initialPlay) {
VSc.l({text: '\tbecause this.initialPlay was %O  its the first time just starting... so we need to set this.initialPlay to false and show the ControlDialog', obj: this.initialPlay}, this);
				this.initialPlay = false;
				// this.video.pause();
VSc.l({text: 'typeof this.style = ', obj: typeof this.style}, this);
if (typeof this.style != 'undefined') {
VSc.l({text: 'this.style.display = ', obj: typeof this.style.display}, this);
}
				if(typeof this.style == 'undefined' || this.style.display != 'none') {
VSc.l('\tcalling VSc.ControlDialog.activate()', this, 1, 'font-size:20px; text-shadow: 2px 2px 4px orange;');
					VSc.ControlDialog.activate();
				}
			} else {
				this.state = "playing";
				VSc.port.postMessage({"event": { "name": "videoStatusChanged", "value": "playing", "origEvt": evt, "timestamp":evt.timeStamp }}, function(response){
                    // do nothing
				});
			}
		}.bind(this));


		// see the comment before the next function
		node.addEventListener('pause', function(evt) {
VSc.l('VideoController heard video \'pause\' event', this, 3);
			this.state = "paused";
VSc.l('(evt.srcElement.currentTime) ' + evt.srcElement.currentTime+ ' != ' + evt.srcElement.duration + ' (evt.srcElement.duration) : '  + (evt.srcElement.currentTime != evt.srcElement.duration), this, 2);
			if (evt.srcElement.currentTime != evt.srcElement.duration) {
VSc.l('\t1 - VSc.port.postMessage videoStatusChanged', this, 2);
				VSc.port.postMessage({"event": { "name": "videoStatusChanged", "value": "pause", "origEvt": evt, "timestamp":evt.timeStamp }});
			} else {
VSc.l('\t2 - call this.videoEnd', this, 2, '');
				this.videoEnd(evt);
			}
		}.bind(this));


		// Different 'ending' events that might be fired. Notice the pause listener above and what happens if
		// the video is paused right at the end (which sometimes prevents an 'end' being fired)
		// Unfortunately these various events don't seem to always fire consistently which is why we are
		// tracking them all
 		this.srcChanged.observe(node, {attributes: true, attributeFilter: ["src"]});

	 	this.videoNodeRemoved.observe(node.parentNode, {childList: true});


		node.addEventListener('end', function(evt) {
VSc.l('VideoController heard \'end\' event -- calling videoEnd', this);
			this.videoEnd(evt);
		}.bind(this));


		node.addEventListener('ended', function(evt) {
VSc.l('VideoController heard \'ended\' event -- calling videoEnd', this);
		   	this.videoEnd(evt);
		}.bind(this));


		// HOW RELIABLE IS THE FOLLOWING? maybe use this instead of the videoNodeRemoved mutationObserver?? (though it might fire twice on netflix)
		// the following will fire when the video has been changed (a new video loaded in)
		node.addEventListener('durationchange', function(evt) {
VSc.l('VideoController heard \'durationchange\' event', this, 3);
  		   	this.videoEnd(evt);
		}.bind(this));





		this.videoEnd = function(evt) {
//console.log('%cVideoController.videoEnd', 'font-size: 150%; background-color: pink;', '\n\tevt = ', evt, '\n\tevt.target = ', evt.target);
VSc.l('\tVideoController.videoEnd', this);
VSc.l({text:'evt = ', obj: evt}, this);
VSc.l({text:'evt.target = ', obj: evt.target}, this);
// if (evt.target) {
// console.log('evt.target.baseURI = ', evt.target.baseURI, '\nevt.target.currentSrc = ', evt.target.currentSrc );
// console.log('this.isFirstEndingEvent = ', this.isFirstEndingEvent);
// }
 //console.log('this.isFirstEndingEvent = ', this.isFirstEndingEvent);
 VSc.l({text:'this.isFirstEndingEvent = ', obj: this.isFirstEndingEvent}, this);
			if (this.isFirstEndingEvent) {
//console.log('%cvideoEnd -- !!', 'font-size:200%; background-color: gold', 'evt = ', evt);
				this.isFirstEndingEvent = false;
				this.state = "ended";
				VSc.port.postMessage({"event": { "name": "videoStatusChanged", "value": "ended", "evt":evt }});
				document.dispatchEvent(new CustomEvent('MC_Video_Ended'));
				if (!VSc.pageUnloading) {
					this.reset();
				}
			}
		};



        this.play = function() {
            this.video.play();
			// maybe change to node.play();	and the following ones to node.X also
        };
        this.pause = function() {
            this.video.pause();
        };
        this.mute = function() {
            this.video.muted = true;
        };
        this.unmute = function() {
            this.video.muted = false;
        };

		// this.videoFound();
		// Test if the video metadata has already loaded. If not add an event listener. Eventually convert this to a Promise?
//console.log('node = ', node);
		if (typeof node.duration) {
			document.dispatchEvent(new CustomEvent('MC_Video_Metadata_Loaded'));
			this.videoFound();
		}
		node.addEventListener('loadedmetadata', function(evt) {
//console.log('%cloadedmetadata!! --  evt = %O', 'font-size:200%; background-color: lime', evt);
			document.dispatchEvent(new CustomEvent('MC_Video_Metadata_Loaded'));
			this.videoFound();
		}.bind(this));
	}




	videoFound() {
//console.log('%cVideoController.videoFound', 'font-size: 150%; background-color: pink;');
VSc.l('VideoController.videoFound', this);
		document.dispatchEvent(new CustomEvent('MC_Video_Found'));
//		VSc.port.postMessage({"event": { "name": "videoFound", "src": this.video.src, "duration": this.video.duration, "video": this.video, "augmentedPageURL": document.URL }});
	}

}
