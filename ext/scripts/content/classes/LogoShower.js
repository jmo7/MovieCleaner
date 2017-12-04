class LogoShower {
	constructor() {
			this.name = 'LogoShower';
VSc.l('LogoShower.constructor', this);
		this.elmnt = document.createElement('div');
		this.elmnt.classList.add('MCLogoShower');


		document.addEventListener('MC_Settings_Updated', function(){
			if (VSc.Config.Settings.items.showLogo) {
	            this.update(VSc.Config.Settings.items.logoSize, VSc.Config.Settings.items.logoPosition);
	        } else {		// this is in case the logo is currently showing when the user changes the options. Without it the logo stays up and doesn't go away when the mute is over
	            this.deactivate();
	        }
		}.bind(this));

	}


	activate(){
VSc.l('LogoShower.activate', this);
		this.elmnt.classList.add('active');
	}


	deactivate(){
VSc.l('LogoShower.deactivate', this);
		this.elmnt.classList.remove('active');
	}


	update(size = 'small', position = 'topright'){
VSc.l('LogoShower.update', this);
		this.imgURL = '';
		this.elmnt.className = 'MCLogoShower'; // delete anything that might be in the className/classList

		this.elmnt.classList.add(size);
		this.elmnt.classList.add(position);

		switch (size) {
			case 'small':
						this.imgURL = chrome.extension.getURL('icons/MCLogo38.png'); break;
			case 'medium':
						this.imgURL = chrome.extension.getURL('icons/MCLogo64.png'); break;
			case 'large':
						this.imgURL = chrome.extension.getURL('icons/MCLogo128.png'); break;
		}

		this.elmnt.style.backgroundImage = 'url('+this.imgURL+')';
	}
}