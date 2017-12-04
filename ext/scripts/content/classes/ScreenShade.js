class ScreenShade  {
	constructor() {
		this.name = 'ScreenShade';
VSc.l('ScreenShade.constructor', this);

		this.elmnt = document.createElement('div');
		this.elmnt.classList.add('MCScreenShade');
	}

	activate() {
VSc.l('ScreenShade.activate', this);
		this.elmnt.classList.add('active');
	}

	deactivate() {
VSc.l('ScreenShade.deactivate', this);
		this.elmnt.classList.remove('active');
	}
}