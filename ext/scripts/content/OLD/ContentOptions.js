class ContentOptions {
	constructor() {
		this.elmnt = document.createElement('div');
		this.id = 'MCOptionsDlg';
	}

    activate() {
		this.classList.add('active');
    }

    deactivate() {
		this.classList.remove('active');
    }
}