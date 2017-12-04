/* This class is responsible for getting an EDL file (either by finding and loading a premade one or by getting caption data and creating a dynamic edl file)
 and then parsng the file so that the EDL data is ready to go */
class EDLLoader {

	constructor() {
		this.name = 'EDLLoader';
VSc.l('EDLLoader.constructor()', this );

		// This promise is tracked at the content.js level for when the whole process completes
		this.done = new Promise(function(resolve, reject){
			this.reset();
			this.resolver = resolve;
			this.rejector = reject;
		}.bind(this));
		this.done.resolver = this.resolver;
		this.done.rejector = this.rejector;

		// // This gets passed into the SiteSpecific file which will then resolve or reject it
		// this.urlFoundPromise = new Promise (function(resolve, reject){
		// 	this.resolver = resolve;
		// 	this.rejector = reject;
		// }.bind(this));
		// this.urlFoundPromise.resolver = this.resolver;
		// this.urlFoundPromise.rejector = this.rejector;


// 		this.urlFoundPromise.then(function(responseText){
// VSc.l('this.urlFoundPromise.then - calling processCaptionsFile', this );
// 			this.processCaptionsFile(responseText)
// 		}.bind(this)).catch(function(){
// 	VSc.l('this.urlFoundPromise.catch - no file found', this, 1, 'font-size:20px; text-decoration: underline; text-decoration-color: orange:' );
// 			this.done.rejector();
// 		}.bind(this));

		this.urlFoundPromise = VSc.urlFoundPromise;
		this.urlFoundPromise.then(function(responseText){
		VSc.l('VSc.urlFoundPromise.then - calling processCaptionsFile', this );
			this.processCaptionsFile(responseText)
		}.bind(this)).catch(function(){
		VSc.l('this.urlFoundPromise.catch - no file found', this, 1, 'font-size:20px; text-decoration: underline; text-decoration-color: orange:' );
			this.done.rejector();
		}.bind(this));


		this.getEDLs();
	}



	reset() {
VSc.l('EDLLoader.reset()', this );
		this.file = {};
		this.preMadeFile = {};
//		this.dynamic
		this.attempts = 0;
		this.currentOptionIndex = 0;
	}



	getEDLs() {
VSc.l('EDLLoader.getEDLs()', this );
		this.getPreMadeEDL();
		this.makeDynamicEDL();
		// if (makingFilter) {
		// 	this.getLocalFile()
		// }
	}


	getPreMadeEDL() {
VSc.l('EDLLoader.getPreMadeEDL()', this );
//		let url = document.URL; // or should we use the movie's url
		//VSc.makeAJAXCall(url)
		// or
		//VSc.fetch(url)
	}


	makeDynamicEDL() {
VSc.l('EDLLoader.makeDynamicEDL()', this );
//		VSc.siteSpecifics.findCaptionInfo(this.urlFoundPromise);
	}



	processCaptionsFile(responseText) {
VSc.l('EDLLoader.processCaptionsFile()', this );

		let xmlDoc = new DOMParser().parseFromString(responseText, 'text/xml');		// responseXML is not provided
VSc.l({text:'\txmlDoc = ', obj: xmlDoc}, this );
VSc.l('\tabout to call cleanTimedText', this );
		this.dynamicEDLData = VSc.siteSpecifics.cleanTimedText(xmlDoc.documentElement.querySelectorAll('p[begin]'));
//console.log('\tback in processCaptionsFile -- this.dynamicEDLData = ', this.dynamicEDLData );
	//	VSb.Captions.makeFilterFromTimedTextFile();
;
VSc.l({text:'\tback in EDLLoader.processCaptionsFile - recieved dynamicEDLData = ', obj: this.dynamicEDLData}, this );
		this.done.resolver(this.dynamicEDLData);
	}

}