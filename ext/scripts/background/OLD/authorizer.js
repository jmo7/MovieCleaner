VSb.Authorizer = {
	"CWS_LICENSE_API_URL": 'https://www.googleapis.com/chromewebstore/v1.1/userlicenses/',

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
	"license": {
		"status": 0
	},
	"reset": false,
	"trialPeriodDays": 300,


	/*
	This isn't called right at first (because down the road in onLicenseFetched, there are various VSb.Config.settings
	needed that aren't loaded if we just call this inline at the end of the file). So this get's called from
	VSb.Main.reset (as it also needs to be recalled). But we only want to call the addListener the first time so
	there aren't two listeners. This is the purpose of 'VSb.Authorizer.reset'.
	*/
	init: function() {
//console.log('VSb.Authorizer.init()');
VSb.port.postMessage({ 'event': { 'name': 'debugMsg', 'value': 'Authorizer.init'}});
		if (!VSb.Authorizer.reset) {

			document.addEventListener('MC_Content_Page_Ready', function() {
//console.log('VSb.Authorizer heard MC_Content_Page_Ready - calling VSb.Authorizer.sendLicenseInfo()');
				VSb.Authorizer.sendLicenseInfo();
			});

			document.addEventListener('MC_Content_Page_Reset', function() {
//console.log('VSb.Authorizer heard MC_Content_Page_Ready - calling VSb.Authorizer.sendLicenseInfo()');
				VSb.Authorizer.sendLicenseInfo();
			});
			VSb.Authorizer.reset = true;
		}

		VSb.Authorizer.checkLicense();
	},




	checkLicense: function() {
//console.log('VSb.Authorizer.checkLicense()');
		VSb.Authorizer.getLicenseFromGoogle();
	},





	getLicenseFromGoogle: function() {
		VSb.Authorizer.xhrWithAuth('GET', VSb.Authorizer.CWS_LICENSE_API_URL + chrome.runtime.id, true, VSb.Authorizer.onLicenseFetched);
		if (VSb.Authorizer.license.status == 1 || VSb.Authorizer.license.status == 2) {
			VSb.Authorizer.findLocallyStoredLicense();
		}
	},




	sendLicenseInfo: function() {
console.log('%csendLicenseInfo', 'background-color:#444; color: white; padding: 5px');
		if (VSb.Authorizer.license.status <= 2) {
			VSb.Authorizer.findLocallyStoredLicense();
		}
console.log('VSb.Authorizer.sendLicenseInfo --  VSb.Authorizer.license = ', VSb.Authorizer.license);
		VSb.port.postMessage({"event": {"name":"licenseRetrieved", 'license': VSb.Authorizer.license }});
	},




	onLicenseFetched: function(error, http_status, response) {
// console.log('\n\n\n\nonLicenseFetched\n\terror = ', error, ',\n\thttp_status = ', http_status, '\n\tresponse = ', response);
		// If VSb.Authorizer.license.status has already been assigned a 1 or a 2 it means the following
		// conditions will fail, so handle 1 and 2s below
		if (http_status === 200 && response) {
//console.log('inside the first if');
			VSb.Authorizer.license = JSON.parse(response);
			VSb.Authorizer.license.createdTime = parseInt(VSb.Authorizer.license.createdTime, 10);

			if (isNaN(VSb.Authorizer.license.createdTime)) {     // this will only happen if MovieCleaner was not installed from the Web Store
				VSb.Authorizer.license.createdTime = Date.now();
			}

			VSb.Authorizer.license.trial_period_MS = VSb.Authorizer.trialPeriodDays * 1000 * 60 * 60 * 24;
			VSb.Authorizer.license.timeRemaining = {
				'totalMS': VSb.Authorizer.license.createdTime + VSb.Authorizer.license.trial_period_MS - Date.now()
			};

			if (VSb.state == 'beta') {
				VSb.Authorizer.license.result = true;
				VSb.Authorizer.license.accessLevel = "FREE_TRIAL";
			}

			if (!VSb.Authorizer.license.result) {
				VSb.Authorizer.license.status = 3;
			}  else if (VSb.Authorizer.license.result && (VSb.Authorizer.license.accessLevel !== 'FREE_TRIAL' && VSb.Authorizer.license.accessLevel !== 'FULL')) {
				VSb.Authorizer.license.status = 4;      // some other status
			} else if (VSb.Authorizer.license.result && VSb.Authorizer.license.accessLevel == 'FREE_TRIAL') {
				VSb.Authorizer.license.timeRemaining = {
					'totalMS': VSb.Authorizer.license.createdTime + VSb.Authorizer.license.trial_period_MS - Date.now()
				};
VSb.port.postMessage({ 'event': { 'name': 'debugMsg', 'value': 'VSb.Authorizer.license.timeRemaining.totalMS = '+ VSb.Authorizer.license.timeRemaining.totalMS}});
				VSb.Authorizer.license.status = (VSb.Authorizer.license.timeRemaining.totalMS > 0) ? 5 : 6;

			} else if (VSb.Authorizer.license.result && VSb.Authorizer.license.accessLevel == 'FULL') {
				VSb.Authorizer.license.status = 7;
			} else {
				VSb.Authorizer.license.status = 8;
			}
VSb.port.postMessage({ 'event': { 'name': 'debugMsg', 'value': 'VSb.Authorizer.license.status = ' + VSb.Authorizer.license.status }});
			if ([0,3,4,8].includes(VSb.Authorizer.license.status)) {        // 1 and 2 are handled below
				VSb.Authorizer.findLocallyStoredLicense();
			} else {
				window.localStorage.setItem('MCInfo', '' + ((VSb.Authorizer.license.result) ? 1 : 0) + VSb.Authorizer.license.status + VSb.Authorizer.license.createdTime);
			}
		} else {
VSb.port.postMessage({ 'event': { 'name': 'debugMsg', 'value': 'VSb.Authorizer.license.status = ' + VSb.Authorizer.license.status }});
			VSb.Authorizer.findLocallyStoredLicense();
		}

VSb.port.postMessage({ 'event': { 'name': 'debugMsg', 'value': 'After potential calls to findLocallyStoredLicense<br/>&nbsp;&nbsp;&nbsp;&nbsp;VSb.Authorizer.license.result = ' + VSb.Authorizer.license.result + '<br/>&nbsp;&nbsp;&nbsp;&nbsp;VSb.Authorizer.license.accessLevel = ' + VSb.Authorizer.license.accessLevel }});
	},




	findLocallyStoredLicense: function (){
VSb.port.postMessage({ 'event': { 'name': 'debugMsg', 'value': 'VSb.Authorizer.findLocallyStoredLicense()'}});
		// we didn't get a response from google, let's see if we have any data stored from previous times
		let info = window.localStorage.getItem('MCInfo');
VSb.port.postMessage({ 'event': { 'name': 'debugMsg', 'value': '(stored) info = ' + JSON.stringify(info) }});
		if (info) {
			VSb.Authorizer.license = {
				'result': (info.substring(0,1) == '1') ? true : false,
				'status': parseInt(info.substring(1,2), 10),
				'createdTime': parseInt(info.substring(2,info.length), 10)
			};
VSb.port.postMessage({ 'event': { 'name': 'debugMsg', 'value': 'VSb.Authorizer.findLocallyStoredLicense -- typeof  VSb.Authorizer.trialPeriodDays = ' + typeof  VSb.Authorizer.trialPeriodDays }} );
			VSb.Authorizer.license.trial_period_MS = VSb.Authorizer.trialPeriodDays * 1000 * 60 * 60 * 24;
			VSb.Authorizer.license.timeRemaining = {
				'totalMS': VSb.Authorizer.license.createdTime + VSb.Authorizer.license.trial_period_MS - Date.now()
			};
//console.log('Because there was stored data we have set VSb.Authorizer.license = ', VSb.Authorizer.license);
VSb.port.postMessage({ 'event': { 'name': 'debugMsg', 'value': 'Because there was stored data we have set VSb.Authorizer.license = ' +  VSb.Authorizer.license }});
		} else {
VSb.port.postMessage({ 'event': { 'name': 'debugMsg', 'value': 'no data stored - so we will set stored data of ) for result, ' + VSb.Authorizer.license.status + ' for VSb.Authorizer.license.status and a timestamp of now (approximately '+ Date.now()+')'}});
//console.log('no data stored - so we will set stored data of ) for result, ' + VSb.Authorizer.license.status + ' for VSb.Authorizer.license.status and a timestamp of now (approximately '+ Date.now()+')');
			// no data stored either
			VSb.Authorizer.license.result = false;  // this will be referenced from more than just below, so we need to set it
//console.log('findLocallyStoredLicense - in the else window.localStorage.setItem(\'MCInfo\', \'' + ((VSb.Authorizer.license.result) ? 1 : 0) + '' + VSb.Authorizer.license.status + '' + Date.now() );
			window.localStorage.setItem('MCInfo', '' + ((VSb.Authorizer.license.result) ? 1 : 0) + VSb.Authorizer.license.status + Date.now());
//			window.localStorage.setItem('MCInfo', '' + ((VSb.Authorizer.license.result) ? 1 : 0) + 0 + Date.now());
		}
	},




	/*****************************************************************************
	 * Helper method for making authenticated requests
	 *****************************************************************************/

	// Helper Util for making authenticated XHRs
	xhrWithAuth: function(method, url, interactive, callback) {
//console.log('xhrWithAuth');
		var retry = true;
		var access_token;
		getToken();



		function getToken() {
//console.log('getToken');
			chrome.identity.getAuthToken({
				interactive: interactive
			}, function(token) {
				if (chrome.runtime.lastError) {
					VSb.Authorizer.license.status = 1;
					console.log('xhrWithAuth.getToken failed - error = ', chrome.runtime.lastError);
					// do nothing and falls back to xhrWithAuth, which fall back to caller of Authorizer.getLicenseFromGoogle
				} else {
					access_token = token;
					requestStart();
				}
			});
		}


		function requestStart() {
			var xhr = new XMLHttpRequest();
			xhr.open(method, url);
			xhr.setRequestHeader('Authorization', 'Bearer ' + access_token);
			xhr.onreadystatechange = function(oEvent) {
				if (xhr.readyState === 4) {
					if (xhr.status === 401 && retry) {
						retry = false;
						chrome.identity.removeCachedAuthToken({
								'token': access_token
							},
							VSb.Authorizer.xhrWithAuth.getToken);
					} else if (xhr.status === 200) {
						callback(null, xhr.status, xhr.response);
					} else {
						VSb.Authorizer.license.status = 2;
											// do nothing and falls back to xhrWithAuth, which fall back to caller of Authorizer.getLicenseFromGoogle
					}
				} else {
//                    console.log("Not yet to a readyState of 4 -- readyState is " + xhr.statusText);
				}
			};
			try {
				xhr.send();
			} catch (e) {
//                console.log("Error in xhr - " + e);
			}
		}
	}
};
