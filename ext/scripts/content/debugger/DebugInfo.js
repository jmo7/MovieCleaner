class DebugInfo {
	constructor() {
		this.name = 'DebugInfo';
VSc.l('DebugInfo.constructor', this);
		this.elmnt = document.createElement('div');
		this.elmnt.id = 'MCD_DebugInfoDiv';
		this.elmnt.innerHTML = '<span>Debugging On</span>';

		this.toggleBtn = this.elmnt.appendChild(document.createElement('button'));
		this.toggleBtn.id = 'MCD_Trigger';
		this.toggleBtn.title = 'Show debugging information and settings';
		this.toggleBtn.addEventListener('click', function(){
			this.setButtonState(!VSc.Debugger.showingConsole);
		}.bind(this));
		this.toggleBtn.innerHTML = 'Show Console';


		document.addEventListener('MC_Settings_Updated', function(event){
VSc.l('DebugInfo.constructor heard MC_Settings_Updated so toggling the DebugInfo divs state', this);
            if (event.detail && event.detail.debugging) {
               this.activate();
            } else {
               this.deactivate();
            }
		}.bind(this));

	}



	activate() {
		this.elmnt.classList.add('active');
VSc.l('DebugInfo.activate', this);
	}



	deactivate() {
		this.elmnt.classList.remove('active');
VSc.l('DebugInfo.deactivate', this);
	}



	setButtonState(state) {
VSc.l('DebugInfo.setButtonState', this);
		if (state) {
			VSc.Debugger.showingConsole = true;
			VSc.Debugger.Dashboard.activate();
			this.toggleBtn.innerHTML = 'Hide Console';
		} else {
			VSc.Debugger.showingConsole = false;
			VSc.Debugger.Dashboard.deactivate();
			this.toggleBtn.innerHTML = 'Show Console';
		}
	}
}