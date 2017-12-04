class Dashboard {
	constructor() {
		this.name = 'Dashboard';
VSc.l('Dashboard.constructor', this);
		this.elmnt = document.createElement('div');
		this.elmnt.id = 'MCD_Dashboard';
		this.elmnt.innerHTML = `
			<h3 class="MCD_Title">
				MovieCleaner Debugger
				<!--span class="MCD_TimingInfo">
					<span class="MCD_Timer"></span>
					<span class="MCD_Duration"></span>
				</span-->
				<button class="MCD_Closer">X</button>
			</h3>
			<div class="MCD_Main">
				<section>
					<h4>Information</h4>
					<div class="MCD_MsgSpace" contenteditable></div>
				</section>
				<section>
					<h4>Settings</h4>
					<div class="MCD_Settings">
						<fieldset class="MCD_SegmentInfo">
							<p>Show Segmentation Information on the Playbar</p>
							<label><input type="checkbox" class="MCD_ShowAudioSegments"> Audio</label>
							<label class="disabled"><input type="checkbox" class="MCD_ShowVideoSegments" disabled> Video — coming soon</label>
						</fieldset>
					</div>
				</section>
			</div>`;

VSc.log( { 'event': { 'name': 'debugMsg', 'value': VSc.Debugger.getDebugData() }});
		this.init();
	}


	init() {
VSc.l('Dashboard.init', this);
		this.msgSpace = this.elmnt.querySelector('.MCD_MsgSpace');

		this.closer = this.elmnt.querySelector('.MCD_Closer');
		this.closer.addEventListener('click', function() {
			this.deactivate();
			VSc.Debugger.DebugInfo.setButtonState(false);
		}.bind(this));


		this.chkbxAudioSegments = this.elmnt.querySelector('.MCD_ShowAudioSegments');
		if (this.chkbxAudioSegments.checked) {
			VSc.Debugger.AudioMuteVisualizer.activate();
		}


		this.chkbxAudioSegments.addEventListener('change', function() {
			if (this.chkbxAudioSegments.checked) {
				VSc.Debugger.AudioMuteVisualizer.activate();
			} else {
				VSc.Debugger.AudioMuteVisualizer.deactivate();
			}
		}.bind(this));


		if (VSc.state == 'beta' ) {
			let labelEl = this.elmnt.querySelector('.MCD_Settings').appendChild(document.createElement('label'));
			this.trialPeriod = labelEl.appendChild(document.createElement('input'));
			this.trialPeriod.type= 'text';
			this.trialPeriod.classList.add('MCD_TrialPeriod');

			document.addEventListener('MC_Settings_Updated', function() {
				this.trialPeriod.value = parseInt(VSc.Config.Settings.items.trialPeriodDays, 10);
			}.bind(this));

			this.trialPeriod.addEventListener('blur', function(){
				if (this.trialPeriod.value != VSc.Config.Settings.items.trialPeriodDays) {
					VSc.Config.Settings.items.trialPeriodDays = parseInt(this.trialPeriod.value, 10);
					VSc.Config.Settings.saveStorage(function blurCallBack() {
VSc.l('\n\nDashboard -- in blurCallBack from VSc.Config.Settings.saveStorage\n\n', this );
						VSc.Config.Settings.sync(true);
					}, false);

				}
			}.bind(this));

			 labelEl.appendChild(document.createTextNode(' Number of days in Trial Period'));
		 }
	}


	activate() {
VSc.l('Dashboard.activate', this);
		this.elmnt.classList.add('active');
	}


	deactivate() {
VSc.l('Dashboard.deactivate', this);
		this.elmnt.classList.remove('active');
	}
}