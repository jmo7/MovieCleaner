class MessageList {
	constructor(containerDiv) {
		this.name = 'MessageList';
VSc.l('MessageList.constructor', this);
		this.list = [];
		this.containerDiv = containerDiv;
	}

	addItem(id, initialMsg, successMsg, failureMsg, updater, callBack, interactives, onlyOne) {
VSc.l('MessageList.addItem', this);
		if (typeof onlyOne !== 'undefined') {
VSc.l('\tback in MessageList::addItem - "onlyOne" parameter is present, so clearing this MessageList of previous messages', this, 2);
			this.clear();
VSc.l('back in MessageList::addItem - now actually creating the message with new Messag', this, 2);
		}
else {		// this else clause is just for console.logging. Remove when done
VSc.l('\tcreating the message with new Message()', this);
}
		let tmp = new Message(id, initialMsg, successMsg, failureMsg, updater, callBack, interactives);
VSc.l('\tback in MessageList::addItem - appending the message to the MessageList and to the DOM', this, 2);
		this.list.push(tmp);
		tmp.elmnt.classList.add('MCMessage');
		this.containerDiv.appendChild(tmp.elmnt);
	}



	getItem(id) {
VSc.l('MessageList.getItem', this);
		for (let i = 0; i < this.list.length; i++){
			if (this.list[i].id == id) {
				return this.list[i];
			}
		}
	}



	deleteItem(item) {
VSc.l('MessageList.deleteItem', this);
		if (typeof item == 'string') {
			item = this.getItem(item);
		}

		item.elmnt.parentNode.removeChild(item.elmnt);	// remove the DOM node (item.elmnt)

		for (let i = 0; i < this.list.length; i++){		// now remove the rest of the JS object (item)
			if (this.list[i] == item) {
				this.list.splice(i,1);
			}
		}
	}



	activateItem(item) {
VSc.l('MessageList.activateItem', this);
		if (typeof item == 'string') {
			item = this.getItem(item);
		}
		item.elmnt.classList.add('active');
	}



	deactivateItem(item) {
VSc.l('MessageList.deactivateItem', this);
		if (typeof item == 'string') {
			item = this.getItem(item);
		}
		item.elmnt.classList.remove('active');
	}



	clear() {
VSc.l('MessageList.clear', this);
		for (let i = 0; i < this.list.length; i++){
			this.list[i].elmnt.parentNode.removeChild(this.list[i].elmnt);
		}
		this.list = [];
	}
}