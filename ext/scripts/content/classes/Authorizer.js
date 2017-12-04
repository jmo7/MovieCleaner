class Authorizer {
	constructor() {
		this.name = "Authorizer";

VSc.l('Authorizer.constructor', this);
		this.CWS_LICENSE_API_URL = 'https://www.googleapis.com/chromewebstore/v1.1/userlicenses/';

		/*
		Possible end values for license.status and their meanings:
		0 - initial, no further status information (probably won't happen) - Need to check locally stored data
		1 - server responded with something other than a 200 (possibly after a retry) - Need to check locally stored data
		2 - User not recognized/does not have auth token (user not logged into Chrome?) - Need to check locally stored data
		3 - User recognized, but does not have any license (logged in as different user?) - Need to check locally stored data
		4 - User recognized, accessLevel is something other than FREE_TRIAL or FULL (Probably won't happen/doesn't exist) - Need to check locally stored data
		5 - User recognized, accessLevel is FREE_TRIAL and still in trial period
		6 - User recognized, accessLevel is FREE_TRIAL but after trial period
		7 - User recognized, accessLevel is Full license
		8 - Unknown - Need to check locally stored data
		*/
		this.license = {
			"status": 0
		};
		this.trialPeriodDays = 3000;

		this.init();
	}



	init() {
VSc.l('Authorizer.init', this);
		this.getLicenseFromGoogle();
	}




	getLicenseFromGoogle() {
VSc.l('Authorizer.getLicenseFromGoogle', this);
		this.makeXHRWithAuth('GET', this.CWS_LICENSE_API_URL + chrome.runtime.id, true, this.onLicenseFetched);
	}




	onLicenseFetched(error, http_status, response) {
VSc.l('Authorizer.onLicenseFetched', this);

VSc.l({"text":"this = %o", "obj": this}, this, 1, 'font-size:30px; text-shadow: 3px 3px 4px gray;' );
// VSc.log('\n\n\n\nonLicenseFetched\n\terror = ', error, ',\n\thttp_status = ', http_status, '\n\tresponse = ', response);
		// If this.license.status has already been assigned a 1 or a 2
		// it means the following conditions will fail, so handle 1 and 2s below
VSc.l('http_status is ' + http_status + ' and response is ' + response, this );;
		if (http_status === 200 && response) {
//VSc.log('inside the first if');
			this.license = JSON.parse(response);
			this.license.createdTime = parseInt(this.license.createdTime, 10);

			if (isNaN(this.license.createdTime)) {     // this will only happen if MovieCleaner was not installed from the Web Store
				this.license.createdTime = Date.now();
			}

			this.license.trial_period_MS = this.trialPeriodDays * 1000 * 60 * 60 * 24;
			this.license.timeRemaining = {
				'totalMS': this.license.createdTime + this.license.trial_period_MS - Date.now()
			};


			if (!this.license.result) {
				this.license.status = 3;
			}  else if (this.license.result && (this.license.accessLevel !== 'FREE_TRIAL' && this.license.accessLevel !== 'FULL')) {
				this.license.status = 4;      // some other status
			} else if (this.license.result && this.license.accessLevel == 'FREE_TRIAL') {
				this.license.timeRemaining = {
					'totalMS': this.license.createdTime + this.license.trial_period_MS - Date.now()
				};
VSc.log({ 'event': { 'name': 'debugMsg', 'value': 'this.license.timeRemaining.totalMS = '+ this.license.timeRemaining.totalMS}});
				this.license.status = (this.license.timeRemaining.totalMS > 0) ? 5 : 6;

			} else if (this.license.result && this.license.accessLevel == 'FULL') {
				this.license.status = 7;
			} else {
				this.license.status = 8;
			}
VSc.log({ 'event': { 'name': 'debugMsg', 'value': 'this.license.status = ' + this.license.status }});
			if ([0,3,4,8].includes(this.license.status)) {        // 1 and 2 are handled below
VSc.l('license.status('+this.license.status+') was 0, 3, 4, or 8 so calling findLocallyStoredLicense()', this);
				this.findLocallyStoredLicense();
			} else {
				window.localStorage.setItem('MCInfo', '' + ((this.license.result) ? 1 : 0) + this.license.status + this.license.createdTime);
			}
		} else {
VSc.l('license.status('+this.license.status+') was 1 or 2 so calling findLocallyStoredLicense()', this);
VSc.log({ 'event': { 'name': 'debugMsg', 'value': 'this.license.status = ' + this.license.status }});
			this.findLocallyStoredLicense();
		}

VSc.log({ 'event': { 'name': 'debugMsg', 'value': 'After potential calls to findLocallyStoredLicense<br/>&nbsp;&nbsp;&nbsp;&nbsp;this.license.result = ' + this.license.result + '<br/>&nbsp;&nbsp;&nbsp;&nbsp;this.license.accessLevel = ' + this.license.accessLevel }});
	}



	findLocallyStoredLicense(){
VSc.l('Authorizer.findLocallyStoredLicense', this);
		// we didn't get a response from google, let's see if we have any data stored from previous times
		let info = window.localStorage.getItem('MCInfo');
VSc.log({ 'event': { 'name': 'debugMsg', 'value': '(stored) info = ' + JSON.stringify(info) }});
		if (info) {
			this.license = {
				'result': (info.substring(0,1) == '1') ? true : false,
				'status': parseInt(info.substring(1,2), 10),
				'createdTime': parseInt(info.substring(2,info.length), 10)
			};
VSc.log({ 'event': { 'name': 'debugMsg', 'value': 'this.findLocallyStoredLicense -- typeof  this.trialPeriodDays = ' + typeof  this.trialPeriodDays }} );
			this.license.trial_period_MS = this.trialPeriodDays * 1000 * 60 * 60 * 24;
			this.license.timeRemaining = {
				'totalMS': this.license.createdTime + this.license.trial_period_MS - Date.now()
			};
//VSc.log('Because there was stored data we have set this.license = ', this.license);
VSc.log({ 'event': { 'name': 'debugMsg', 'value': 'Because there was stored data we have set this.license = ' +  this.license }});
		} else {
VSc.log({ 'event': { 'name': 'debugMsg', 'value': 'no data stored - so we will set stored data of ) for result, ' + this.license.status + ' for this.license.status and a timestamp of now (approximately '+ Date.now()+')'}});
//VSc.log('no data stored - so we will set stored data of ) for result, ' + this.license.status + ' for this.license.status and a timestamp of now (approximately '+ Date.now()+')');
			// no data stored either
			this.license.result = false;  // this will be referenced from more than just below, so we need to set it
//VSc.log('findLocallyStoredLicense - in the else window.localStorage.setItem(\'MCInfo\', \'' + ((this.license.result) ? 1 : 0) + '' + this.license.status + '' + Date.now() );
			window.localStorage.setItem('MCInfo', '' + ((this.license.result) ? 1 : 0) + this.license.status + Date.now());
//			window.localStorage.setItem('MCInfo', '' + ((this.license.result) ? 1 : 0) + 0 + Date.now());
		}
	}



	// Helper Util for making authenticated XHRs
	makeXHRWithAuth(method, url, interactive, callback) {
VSc.l('Authorizer.xhrWithAuth', this);
		VSc.port.postMessage( {"event": { "name": "makeXHRWithAuth", "method":method, "url":url, "interactive":interactive} });
	}



	xhrWithAuthResponse(event) {
VSc.l('xhrWithAuthResponse', this, 1, 'font-size: 150%; color: red;');
VSc.l({text:'event = ', obj: event}, this, 1, '');

		if (typeof lastError != 'undefined') {
VSc.l('branch 1 - there was a lastError - setting this.license.status = 1 and calling findLocallyStoredLicense()', this, 1, '');
			this.license.status = 1;
			this.findLocallyStoredLicense();
		} else if (event.http_status != 200 ){
VSc.l('branch 2 - setting this.license.status = 2 and calling findLocallyStoredLicense()', this, 1, '');
			this.license.status = 2;
			this.findLocallyStoredLicense();
		} else {
VSc.l('branch 3 - calling onLicenseFetched', this, 1, '');
			this.onLicenseFetched(null, event.http_status, event.response);
		}

VSc.l('\tat end of xhrWithAuthResponse -- this.license = '+ this.license, this, 1, '');
		document.dispatchEvent(new CustomEvent('MC_License_Retrieved'));
VSc.log({"event": {"name":"MC_License_Retrieved", 'license': this.license }});
	}

}