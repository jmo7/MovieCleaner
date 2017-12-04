class ScreenMuter {
	constructor() {
		this.name = 'ScreenMuter';
VSc.l('ScreenMuter.constructor', this);
		this.elmnt = document.createElement('div');
		this.elmnt.classList.add('MCScreenMuter');
	}

	activate() {
VSc.l('ScreenMuter.activate', this);
		this.elmnt.classList.add('active');
	}

	deactivate() {
VSc.l('ScreenMuter.deactivate', this);
		this.elmnt.classList.remove('active');
	}
}
