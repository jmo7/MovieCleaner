class Captions {
	constructor() {
		this.name = 'Captions';
//console.log('%cCaptions.constructor', 'font-size: 150%; background-color: navy; color:white');
VSc.l('Captions.constructor', this);
		if (VSc.site == 'netflix') {
console.log('\n\n\n\n\n\n\n\n\n\n $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $\n\n\n%cIn Captions - about to call this.netflix = new NetflixCaptions;\n\n\n  $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $ $\n\n\n\n\n\n\n\n\n\n', 'font-size: 400%; background-color: lime; border: 5px orange dotted');
VSc.l('\n\tIn Captions - about to call this.netflix = new NetflixCaptions;\n', this);
			this.netflix = new NetflixCaptions;

		}

		document.addEventListener('beforeunload', this.unloadCaptions);

	}



    reset() {
VSc.l('Captions.reset', this);

    }


    unloadCaptions() {
VSc.l('Captions.unloadCaptions', this);
        VSc.Captions[VSc.site.name].reset();
    }


}
