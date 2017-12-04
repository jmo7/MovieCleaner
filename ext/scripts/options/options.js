vsOptions = {

    dietyCategoryControls: undefined,
    dietyCheckbox: undefined,

    profanityCategoryControls: {},
    profanityCheckbox: undefined,

    explicitCategoryControls: {},
    explicitCheckbox: undefined,

    racismCategoryControls: {},
    racismCheckbox: undefined,

    additionalCategoryControls: {},
    editListButtons: undefined,

    feedbacks: undefined,

    fudgeFactorStartRange: undefined,
    fudgeFactorDurationRange: undefined,
    showlogoCheckbox: undefined,
//    disableFromIconCheckBox: undefined,
    debuggingCheckbox: undefined,
    status: undefined,
    saveBtn: undefined,
    resetBtn: undefined,
    cancelBtn: undefined,
    fileRetrievalMethodsUsed: [],
    VSbRef: undefined,
    currentInputEl: undefined,
    previousInputEl: undefined,
    currentCatControlObject: undefined,
    WordsToMuteHasChanged: undefined,



	messageRouter: function(message, sender, callback){
console.log('%cvsOptions.messageRouter', 'font-size: 150%; background-color: lightblue;');
		if ( message.event && message.event.name) {
			switch ( message.event.name ) {
				// case 'configSet': VSc.Content.configSet(message.event); break;
				// case 'configUpdated': VSc.Content.configSet(message.event); break;
				// case 'premadeEDLFound' : VSc.Content.premadeEDLFound(); break;
				case 'SettingsSync' : vsOptions.readOptions(); break;
			}
		}
	},



	init: function() {
console.log('%cvsOptions.init', 'background-color: lightblue; font-size:120%');
//        var catControlEl, catCntrlObj;
//console.log('init()');
console.log('options::init() -- chrome.extension.getBackgroundPage() = ', chrome.extension.getBackgroundPage());
//
        vsOptions.VSbRef = chrome.extension.getBackgroundPage().VSb;

console.log('chrome.runtime = ', chrome.runtime);
		chrome.runtime.onConnect.addListener(function(port) {
console.log('Options heard chrome.runtime.onConnect');
			vsOptions.VSbRef.port.onMessage.addListener(function(request, sender, sendResponse){
				vsOptions.messageRouter(request, sender, sendResponse);
			});
		});
		vsOptions.Settings = new Settings(vsOptions.VSbRef);
console.log('vsOptions.Settings = ', vsOptions.Settings);
 //       vsOptions.Settings.constants.muteCategories = vsOptions.Settings.constants.muteCategories;
 		vsOptions.Settings.constants.muteCategories = ['diety', 'profanity', 'explicit', 'racism', 'additional']
        vsOptions.feedbacks = document.querySelectorAll('.muteWordListControlFeedback');

//console.log('vsOptions.Settings.constants.muteCategories.length = ', vsOptions.Settings.constants.muteCategories.length, ' - vsOptions.Settings.constants.muteCategories = ', vsOptions.Settings.constants.muteCategories);
        for (let i = 0; i < vsOptions.Settings.constants.muteCategories.length; i++){
            let catControlEl = document.querySelector('#' + vsOptions.Settings.constants.muteCategories[i] );
            let catCntrlObj = {
                "checkbox": catControlEl.querySelector('input[type=checkbox]'),
                "showListBtn": catControlEl.querySelector('button'),
                "muteWordListControl":  catControlEl.querySelector('.muteWordListControl'),
                "muteWordList": catControlEl.querySelector('.muteWordListControl .muteWordList'),
                "muteWordListControlFeedback": catControlEl.querySelector('.muteWordListControl .muteWordListControlFeedback'),
                "addBtn": catControlEl.querySelector('.muteWordListControl button:nth-of-type(1)'),
                "removeBtn": catControlEl.querySelector('.muteWordListControl button:nth-of-type(2)'),
                "upBtn": catControlEl.querySelector('.muteWordListControl button:nth-of-type(3)'),
                "downBtn": catControlEl.querySelector('.muteWordListControl button:nth-of-type(4)')
            };
//console.log( 'for <vsOptions.Settings.constants.muteCategories['+i+']> ' + vsOptions.Settings.constants.muteCategories + ' - catCntrlObj = ', catCntrlObj);
            catCntrlObj.checkbox.addEventListener('change', vsOptions.formControlChanged);
            catCntrlObj.showListBtn.addEventListener('click', vsOptions.showList);
            catCntrlObj.addBtn.addEventListener('click', vsOptions.addListWord);
            catCntrlObj.removeBtn.addEventListener('click', vsOptions.removeListWord);
            catCntrlObj.upBtn.addEventListener('click', vsOptions.moveListWordUp);
            catCntrlObj.downBtn.addEventListener('click', vsOptions.moveListWordDown);

            vsOptions[vsOptions.Settings.constants.muteCategories[i] + "CategoryControls"] = catCntrlObj;
        }

        vsOptions.fudgeFactorStartRange = document.querySelector('#fudgeFactorStart');
        vsOptions.fudgeFactorDurationRange = document.querySelector('#fudgeFactorDuration');
        vsOptions.showlogoCheckbox = document.querySelector('#showlogo');
        vsOptions.showlogoCheckbox.addEventListener('change', vsOptions.formControlChanged);

        vsOptions.logoSize = document.querySelector('#logoSize');
        vsOptions.logoSize.addEventListener('change', vsOptions.formControlChanged);

        vsOptions.logoPositionRadioBtns = document.querySelectorAll('[name=logoposition]');
        for (let i = 0; i < vsOptions.logoPositionRadioBtns.length; i++){
            vsOptions.logoPositionRadioBtns[i].addEventListener('click', function(event) {
                vsOptions.logoPosition = event.target.id;
                vsOptions.formControlChanged();
            });
        }

        vsOptions.debuggingCheckbox = document.querySelector('#debugging');
        // vsOptions.disableFromIconCheckBox = document.querySelector('#disableFromIcon');
        // vsOptions.disableFromIconCheckBox.addEventListener('change', vsOptions.formControlChanged);

        vsOptions.status = document.querySelector('#status');

        vsOptions.saveBtn = document.querySelector('#saveBtn');
        vsOptions.saveBtn.addEventListener('click', function(){
//console.log('click --  saveOptions');
            vsOptions.saveOptions();
        });

        vsOptions.cancelBtn = document.querySelector('#cancelBtn');
        vsOptions.cancelBtn.addEventListener('click', vsOptions.cancel);

        vsOptions.resetBtn = document.querySelector('#resetBtn');
        vsOptions.resetBtn.addEventListener('click', vsOptions.resetOptions);

		vsOptions.readOptions();
	},




    showList:  function(event) {
console.log('%cvsOptions.showList', 'background-color: lightblue; font-size:120%');
        vsOptions.toggleCatergyControls(vsOptions[event.target.dataset.grouptype + "CategoryControls"]);
    },




    addListWord: function(event) {
console.log('%cvsOptions.addListWord', 'background-color: lightblue; font-size:120%');
        vsOptions.currentCatControlObject = vsOptions[event.target.parentNode.parentNode.id + "CategoryControls"];
        let newInputEl = vsOptions.createSingleInput();
        if (vsOptions.currentInputEl && vsOptions.currentInputEl.parentNode === vsOptions.currentCatControlObject.muteWordList) {
            if (vsOptions.currentInputEl.nextSibling) {
                vsOptions.currentCatControlObject.muteWordList.insertBefore(newInputEl, vsOptions.currentInputEl.nextSibling);
                vsOptions.currentCatControlObject.downBtn.removeAttribute('disabled');
            } else {
                vsOptions.currentCatControlObject.muteWordList.appendChild(newInputEl);
            }
        } else {
            vsOptions.currentCatControlObject.muteWordList.appendChild(newInputEl);
        }

        vsOptions.setNewCurrentInputEl(newInputEl);
        vsOptions.currentInputEl.focus();

        // in case we previously didn't have any items and the removeBtn was disabled, reenable it
        vsOptions.currentCatControlObject.removeBtn.removeAttribute('disabled');

        if (vsOptions.currentCatControlObject.muteWordList.children.length > 1) {
            // if there was previously only 1 item in the list (and therefore the upBtn was disabled) and we have now just added a second
            // reenable it (we check for greater than 1 in case we had o and by adding the new one we only have one we don't wan to reenable)
            vsOptions.currentCatControlObject.upBtn.removeAttribute('disabled');
        }
    },




    removeListWord: function (event) {
console.log('%cvsOptions.removeListWord', 'background-color: lightblue; font-size:120%');
        if (vsOptions.currentInputEl) {
            if (vsOptions.currentInputEl.nextSibling) {
                vsOptions.setNewCurrentInputEl(vsOptions.currentInputEl.nextSibling, true);
            } else if (vsOptions.currentInputEl.previousSibling) {
                vsOptions.setNewCurrentInputEl(vsOptions.currentInputEl.previousSibling, true);
            } else {    // this is the only node there is
                vsOptions.deleteInputEl(vsOptions.currentInputEl);
                vsOptions.currentInputEl = undefined;
            }

            vsOptions.currentCatControlObject = vsOptions[event.target.parentNode.parentNode.id + "CategoryControls"];

            // if we've just removed the last item from the list, disable the remove button
            if (vsOptions.currentCatControlObject.muteWordList.children.length <= 0) {
                 vsOptions.currentCatControlObject.removeBtn.setAttribute('disabled', 'disabled');
            }

            // if we deleted the first item in the list, and the second item has now been selected and
            // moved up into the first spot, disable the upBtn
            if (!vsOptions.currentInputEl.previousSibling) {
                vsOptions.currentCatControlObject.upBtn.setAttribute('disabled', 'disabled');
            }

            // if the we deleted the second to last item in the list, and the last item has now been
            // selected, disable the downBtn
            if (!vsOptions.currentInputEl.nextSibling) {
                vsOptions.currentCatControlObject.downBtn.setAttribute('disabled', 'disabled');
            }

        } else {
            event.target.parentNode.querySelector('.muteWordListControlFeedback').innerText = 'Please select a word first before pushing the remove button';
        }
    },




    moveListWordUp: function(event) {
console.log('%cvsOptions.moveListWordUp', 'background-color: lightblue; font-size:120%');
        vsOptions.clearFeedbacks();
        if (vsOptions.currentInputEl) {
            if (vsOptions.currentInputEl.previousSibling) {
                vsOptions.currentInputEl.parentNode.insertBefore(vsOptions.currentInputEl, vsOptions.currentInputEl.previousSibling);
//console.log('vsOptions.currentInputEl = ', vsOptions.currentInputEl);
//console.log('vsOptions.currentInputEl.previousSibling = ', vsOptions.currentInputEl.previousSibling);
                vsOptions.currentCatControlObject = vsOptions[event.target.parentNode.parentNode.id + "CategoryControls"];
                if (!vsOptions.currentInputEl.previousSibling) {
                    vsOptions.currentCatControlObject.upBtn.setAttribute('disabled', 'disabled');
                    vsOptions.currentCatControlObject.downBtn.removeAttribute('disabled');
                }
                if (vsOptions.currentInputEl.nextSibling) {
                    vsOptions.currentCatControlObject.downBtn.removeAttribute('disabled');
                }
            } else {  /*  do nothing  */  }
        }
    },




    moveListWordDown: function(event) {
console.log('%cvsOptions.moveListWordDown', 'background-color: lightblue; font-size:120%');
        vsOptions.clearFeedbacks();
        if (vsOptions.currentInputEl && vsOptions.currentInputEl.nextSibling) {
            if (vsOptions.currentInputEl.nextSibling.nextSibling) {
                vsOptions.currentInputEl.parentNode.insertBefore(vsOptions.currentInputEl, vsOptions.currentInputEl.nextSibling.nextSibling);
                if (vsOptions.currentInputEl.previousSibling) {
                    vsOptions.currentCatControlObject.upBtn.removeAttribute('disabled');
                }
            } else {
                // the next item is the last in the list so while there is a .nextSibling there is not a .nextSibling.nextSibling
                // so we have to instead grab the next node and move it before this node
                vsOptions.currentInputEl.parentNode.insertBefore(vsOptions.currentInputEl.nextSibling, vsOptions.currentInputEl);
                vsOptions.currentCatControlObject = vsOptions[event.target.parentNode.parentNode.id + "CategoryControls"];
                vsOptions.currentCatControlObject.downBtn.setAttribute('disabled', 'disabled');
                vsOptions.currentCatControlObject.upBtn.removeAttribute('disabled');
            }
        }
    },




    inputSelected: function(event) {
console.log('%cvsOptions.inputSelected', 'background-color: lightblue; font-size:120%');
        vsOptions.setNewCurrentInputEl(event.target);

        let newCatControlObject = vsOptions[event.target.parentNode.parentNode.parentNode.id + "CategoryControls"];
        if (vsOptions.currentCatControlObject && vsOptions.currentCatControlObject != newCatControlObject) {
            vsOptions.currentCatControlObject.upBtn.setAttribute('disabled', 'disabled');
            vsOptions.currentCatControlObject.downBtn.setAttribute('disabled', 'disabled');
        }
        vsOptions.currentCatControlObject = newCatControlObject;

        if (vsOptions.currentInputEl.previousSibling) {
            vsOptions.currentCatControlObject.upBtn.removeAttribute('disabled');
        } else {
            vsOptions.currentCatControlObject.upBtn.setAttribute('disabled', 'disabled');
        }
        if (vsOptions.currentInputEl.nextSibling) {
            vsOptions.currentCatControlObject.downBtn.removeAttribute('disabled');
        } else {
            vsOptions.currentCatControlObject.downBtn.setAttribute('disabled', 'disabled');
        }
    },




    setNewCurrentInputEl: function(inputEl, deletePrevious) {
console.log('%cvsOptions.setNewCurrentInputEl', 'background-color: lightblue; font-size:120%');
        if (vsOptions.currentInputEl) {
            vsOptions.previousInputEl = vsOptions.currentInputEl;
            if (vsOptions.previousInputEl.value === '' || deletePrevious) {
                    vsOptions.deleteInputEl(vsOptions.previousInputEl);
            } else {
                vsOptions.previousInputEl.classList.remove('selected');
            }
        }
        vsOptions.currentInputEl = inputEl;
        inputEl.classList.add('selected');
        vsOptions.clearFeedbacks();
    },




    deleteInputEl:function(inputEl) {
console.log('%cvsOptions.deleteInputEl', 'background-color: lightblue; font-size:120%');
         inputEl.parentNode.removeChild(inputEl);
    },




    formControlChanged: function() {
console.log('%cvsOptions.formControlChanged', 'background-color: lightblue; font-size:120%');
        vsOptions.updateStatusMessage('');
    },




    clearFeedbacks: function() {
console.log('%cvsOptions.clearFeedbacks', 'background-color: lightblue; font-size:120%');
        for (let i = 0; i < vsOptions.feedbacks.length; i++) {
            vsOptions.feedbacks[i].innerHTML = '';
        }
    },




    toggleCatergyControls: function(categoryControl) {
console.log('%cvsOptions.toggleCatergyControls', 'background-color: lightblue; font-size:120%');
//console.log('toggleCatergyControls()\n\t\tcategoryControl.muteWordListControl.classList.contains(\'inactive\') = ', categoryControl.muteWordListControl.classList.contains('inactive'));
        if (categoryControl.muteWordListControl.classList.contains('inactive')) {
//console.log('in the if');
            categoryControl.muteWordListControl.classList.remove('inactive');
            categoryControl.showListBtn.innerText = 'Hide List';

            if (categoryControl.muteWordList.children.length > 0) {
                categoryControl.removeBtn.removeAttribute('disabled', '');
            }
            // if (categoryControl.muteWordList.children.length > 1) {
            //     categoryControl.upBtn.removeAttribute('disabled', '');
            //     categoryControl.downBtn.removeAttribute('disabled', '');
            // }
        } else {
//console.log('in the else');
            categoryControl.muteWordListControl.classList.add('inactive');
            categoryControl.showListBtn.innerText = 'Show List';
        }
    },




    createInputList: function(listName) {
console.log('%cvsOptions.createInputList', 'background-color: lightblue; font-size:120%');
        for (let i = 0; i < vsOptions.Settings.items[listName + 'List'].length; i++ ){
            vsOptions[listName + 'CategoryControls'].muteWordList.appendChild( vsOptions.createSingleInput(vsOptions.Settings.items[listName + 'List'][i]) );
        }
    },




    createSingleInput: function(mutePhrase) {
console.log('%cvsOptions.createSingleInput', 'background-color: lightblue; font-size:120%');
        mutePhrase = mutePhrase || '';
        let inputEl = document.createElement('input');
        inputEl.type = 'text';
        inputEl.value = mutePhrase;
        inputEl.addEventListener('click', vsOptions.inputSelected);

        return inputEl;
    },

// 	readStorage(callBack, callBackContext) {
// console.log('%cConfig.readStorage', 'font-size: 150%; background-color: orange; color: white');
// 	console.trace();
// 	  this.readStorage.callBack = callBack;
// 	  let storageValues = {};
//
// 	  for (let i = 0; i < this.Settings.nameArray.length; i++) {
// 	//console.log('<storageValues[this.Settings.nameArray['+i+']]> storageValues['+this.Settings.nameArray[i]+'] = this.settingsDefault['+this.Settings.nameArray[i] + 'Default\'];');
// 		  storageValues[this.Settings.nameArray[i]] = this.settingsDefault[this.Settings.nameArray[i] + 'Default'];
// 	  }
// 	console.log('\tabout to call chrome.storage.sync.get with a callback of Config.chromeStorageSyncGetCallback - %cAsynchronus', 'background-color: red; font-size: 150%; color:white; font-weight:bold');
// 	  chrome.storage.sync.get(storageValues,
// 		 function chromeStorageSyncGetCallback(items) {
// 	console.log('%cConfig.chromeStorageSyncGetCallback', 'font-size: 150%; background-color: orange; color: white');
// 			for (let i = 0; i < this.Settings.nameArray.length; i++) {
// 	//console.log('typeof items['+this.Settings.nameArray[i]+'] = ', typeof items[this.Settings.nameArray[i]]);
// 			  this.settings[this.Settings.nameArray[i]] = items[this.Settings.nameArray[i]];
// 			}
// 	console.log('this.settings = ', this.settings);
// 			//document.dispatchEvent(new CustomEvent('MC_Settings_Read', {"detail": VSc.Config.Settings.items}));
// 			document.dispatchEvent(new CustomEvent('MC_Settings_Updated', {"detail": VSc.Config.Settings.items}));
//
// 			if (callBackContext) {
// 				callBack.call(callBackContext);
// 			} else {
// 				callBack();
// 			}
// 		  }.bind(this)
// 	  );
//   },


    readOptions: function() {
console.log('%cvsOptions.readOptions', 'background-color: lightblue; font-size:120%;');
console.log('vsOptions = ', vsOptions, '\nvsOptions.Settings = ', vsOptions.Settings);

		var readerPromise = new Promise(function(resolve, reject){
			this.resolver = resolve;
			this.rejector = reject;
		}.bind(this));
		readerPromise.resolver = this.resolver;
		readerPromise.rejector = this.rejector;


        vsOptions.Settings.readStorage(readerPromise);
 		readerPromise.then(function readOptionsCallback(){
	console.log('%cvsOptions.readOptionsCallback', 'background-color: lightblue; font-size:120%');
			vsOptions.dietyCategoryControls.checkbox.checked = vsOptions.Settings.items.muteDiety;
			vsOptions.createInputList('diety');

			vsOptions.profanityCategoryControls.checkbox.checked = vsOptions.Settings.items.muteProfanity;
			vsOptions.createInputList('profanity');

			vsOptions.explicitCategoryControls.checkbox.checked = vsOptions.Settings.items.muteExplicit;
			vsOptions.createInputList('explicit');

			vsOptions.racismCategoryControls.checkbox.checked = vsOptions.Settings.items.muteRacism;
			vsOptions.createInputList('racism');

			vsOptions.additionalCategoryControls.checkbox.checked = vsOptions.Settings.items.muteAdditional;
			vsOptions.createInputList('additional');

			vsOptions.fudgeFactorStartRange.value = vsOptions.Settings.items.fudgeFactorStart;
			vsOptions.fudgeFactorDurationRange.value = vsOptions.Settings.items.fudgeFactorDuration;
			vsOptions.fileRetrievalMethodsUsed = vsOptions.Settings.items.fileRetrievalMethods;
		//            vsOptions.disableFromIconCheckBox.checked = vsOptions.Settings.items.disableVSFromIcon;

			vsOptions.showlogoCheckbox.checked = vsOptions.Settings.items.showLogo;
			vsOptions.logoSize.value = vsOptions.Settings.items.logoSize;
			for (let i = 0; i < vsOptions.logoPositionRadioBtns.length; i++){
				if (vsOptions.logoPositionRadioBtns[i].id == vsOptions.Settings.items.logoPosition) {
					vsOptions.logoPositionRadioBtns[i].checked = true;
				}
			}
			vsOptions.logoPosition = vsOptions.Settings.items.logoPosition;

			vsOptions.debuggingCheckbox.checked = vsOptions.Settings.items.debugging;
		// console.log('vsOptions = ', vsOptions);
		// console.log('vsOptions was just read from vsOptions.Settings.items:', vsOptions.Settings.items);
		});

	},




    getCurrentList: function(listName) {
console.log('%cvsOptions.getCurrentList', 'background-color: lightblue; font-size:120%');
        let tempList = [];
        let inputs = document.querySelectorAll('#'+listName+' .muteWordListControl div input');
        for (let i = 0; i < inputs.length; i++ ) {
            if (inputs[i].value !== '') {
                tempList.push(inputs[i].value);
            }
        }
        return tempList;
    },




    saveHelper_WordsToMute: function(listName) {
console.log('%cvsOptions.saveHelper_WordsToMute', 'background-color: lightblue; font-size:120%');
//console.log('\n\nsaveHelper_WordsToMute()');

        if (vsOptions.Settings.items['mute' + listName.charAt(0).toUpperCase() + listName.slice(1)] != vsOptions[listName + 'CategoryControls'].checkbox.checked) {
            vsOptions.WordsToMuteHasChanged = true;
        }
        vsOptions.Settings.items['mute' + listName.charAt(0).toUpperCase() + listName.slice(1)] = vsOptions[listName + 'CategoryControls'].checkbox.checked;
        tempMutes = vsOptions.getCurrentList(listName);
//console.log('tempMutes = ', tempMutes);

        if (vsOptions.Settings.items[listName + 'List'].join('|') != tempMutes.join('|'))  {
            vsOptions.WordsToMuteHasChanged = true;
//console.log('%cWordsToMutes changed', 'background-color: green; font-weight: bold', ' so vsOptions.WordsToMuteHasChanged = ', vsOptions.WordsToMuteHasChanged);
        } else {
//console.log('%cno WordsToMutes changed', 'background-color: pink; font-weight: bold', ' so vsOptions.WordsToMuteHasChanged = ', vsOptions.WordsToMuteHasChanged);
        }
        vsOptions.Settings.items[listName + 'List'] = tempMutes;
//console.log("vsOptions.Settings.items["+listName + 'List'+"]");
    },




	saveOptions: function() {
console.log('%cvsOptions.saveOptions', 'background-color: lightblue; font-size:120%');
        var tempMutes;
//console.log('\n\nsaveOptions()');
        vsOptions.WordsToMuteHasChanged = false;
//console.log('vsOptions.saveHelper_WordsToMute()');
        vsOptions.saveHelper_WordsToMute('diety');
        vsOptions.saveHelper_WordsToMute('profanity');
        vsOptions.saveHelper_WordsToMute('explicit');
        vsOptions.saveHelper_WordsToMute('racism');
        vsOptions.saveHelper_WordsToMute('additional');

        vsOptions.Settings.items.fudgeFactorStart = parseFloat(vsOptions.fudgeFactorStartRange.value);
        vsOptions.Settings.items.fudgeFactorDuration = parseFloat(vsOptions.fudgeFactorDurationRange.value);
        vsOptions.Settings.items.fileRetrievalMethods = vsOptions.fileRetrievalMethodsUsed;

        vsOptions.Settings.items.showLogo = vsOptions.showlogoCheckbox.checked;
        vsOptions.Settings.items.logoSize = vsOptions.logoSize.value;
        vsOptions.Settings.items.logoPosition = vsOptions.logoPosition;
        vsOptions.Settings.items.debugging = vsOptions.debuggingCheckbox.checked;
//console.log('vsOptions.Settings.items = ', vsOptions.Settings.items);

		var writerPromise = new Promise(function(resolve, reject){
			this.resolver = resolve;
			this.rejector = reject;
		}.bind(this));

		writerPromise.resolver = this.resolver;
		writerPromise.rejector = this.rejector;
		writerPromise.then(function(){
			window.close();
		});


 //        vsOptions.Settings.saveStorage(function() {
 // //            window.close();
 //        }, vsOptions.WordsToMuteHasChanged);
 console.log('vsOptions.WordsToMuteHasChanged = ', vsOptions.WordsToMuteHasChanged)
		 vsOptions.Settings.saveStorage(writerPromise, vsOptions.WordsToMuteHasChanged);

	},




    resetOptions: function() {
console.log('%cvsOptions.resetOptions', 'background-color: lightblue; font-size:120%');
        for (let i = 0; i < vsOptions.Settings.constants.muteCategories.length; i++ ){
            vsOptions[vsOptions.Settings.constants.muteCategories[i] + 'CategoryControls'].muteWordList.innerHTML = '';
        }

        vsOptions.Settings.resetToDefaults(function() {
            vsOptions.readOptions(function() {
                vsOptions.updateStatusMessage('Options reset to default values');
            });
        });
	},




    cancel: function() {
console.log('%cvsOptions.cancel', 'background-color: lightblue; font-size:120%');
        window.close();
    },




    updateStatusMessage: function(msg) {
console.log('%cvsOptions.updateStatusMessage', 'background-color: lightblue; font-size:120%');
//console.log('updateStatusMessage()');
		vsOptions.status.textContent = msg;
    }

};


document.addEventListener('DOMContentLoaded', vsOptions.init);