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
    WordsToMutesChanged: undefined,



	init: function() {
//        var catControlEl, catCntrlObj;
//console.log('init()');
//console.log('options::init() -- chrome.extension.getBackgroundPage() = ', chrome.extension.getBackgroundPage());
//
console.log();
        vsOptions.VSbRef = chrome.extension.getBackgroundPage().VSb;
        vsOptions.terms = vsOptions.VSbRef.Config.Settings.constants.muteCategories;
        vsOptions.feedbacks = document.querySelectorAll('.muteWordListControlFeedback');

//console.log('vsOptions.terms.length = ', vsOptions.terms.length, ' - vsOptions.terms = ', vsOptions.terms);
        for (let i = 0; i < vsOptions.terms.length; i++){
            let catControlEl = document.querySelector('#' + vsOptions.terms[i] );
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
//console.log( 'for <vsOptions.terms['+i+']> ' + vsOptions.terms + ' - catCntrlObj = ', catCntrlObj);
            catCntrlObj.checkbox.addEventListener('change', vsOptions.formControlChanged);
            catCntrlObj.showListBtn.addEventListener('click', vsOptions.showList);
            catCntrlObj.addBtn.addEventListener('click', vsOptions.addListWord);
            catCntrlObj.removeBtn.addEventListener('click', vsOptions.removeListWord);
            catCntrlObj.upBtn.addEventListener('click', vsOptions.moveListWordUp);
            catCntrlObj.downBtn.addEventListener('click', vsOptions.moveListWordDown);

            vsOptions[vsOptions.terms[i] + "CategoryControls"] = catCntrlObj;
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
        vsOptions.toggleCatergyControls(vsOptions[event.target.dataset.grouptype + "CategoryControls"]);
    },




    addListWord: function(event) {
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
         inputEl.parentNode.removeChild(inputEl);
    },




    formControlChanged: function() {
        vsOptions.updateStatusMessage('');
    },




    clearFeedbacks: function() {
        for (let i = 0; i < vsOptions.feedbacks.length; i++) {
            vsOptions.feedbacks[i].innerHTML = '';
        }
    },




    toggleCatergyControls: function(categoryControl) {
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
        for (let i = 0; i < vsOptions.VSbRef.Config.settings[listName + 'List'].length; i++ ){
            vsOptions[listName + 'CategoryControls'].muteWordList.appendChild( vsOptions.createSingleInput(vsOptions.VSbRef.Config.settings[listName + 'List'][i]) );
        }
    },




    createSingleInput: function(mutePhrase) {
        mutePhrase = mutePhrase || '';
        let inputEl = document.createElement('input');
        inputEl.type = 'text';
        inputEl.value = mutePhrase;
        inputEl.addEventListener('click', vsOptions.inputSelected);

        return inputEl;
    },




    readOptions: function() {
//console.log('readOptions -- vsOptions = ', vsOptions, '\nvsOptions.VSbRef.Config = ', vsOptions.VSbRef.Config);
        vsOptions.VSbRef.Config.readStorage( function(){
            vsOptions.dietyCategoryControls.checkbox.checked = vsOptions.VSbRef.Config.settings.muteDiety;
            vsOptions.createInputList('diety');

            vsOptions.profanityCategoryControls.checkbox.checked = vsOptions.VSbRef.Config.settings.muteProfanity;
            vsOptions.createInputList('profanity');

            vsOptions.explicitCategoryControls.checkbox.checked = vsOptions.VSbRef.Config.settings.muteExplicit;
            vsOptions.createInputList('explicit');

            vsOptions.racismCategoryControls.checkbox.checked = vsOptions.VSbRef.Config.settings.muteRacism;
            vsOptions.createInputList('racism');

            vsOptions.additionalCategoryControls.checkbox.checked = vsOptions.VSbRef.Config.settings.muteAdditional;
            vsOptions.createInputList('additional');

            vsOptions.fudgeFactorStartRange.value = vsOptions.VSbRef.Config.settings.fudgeFactorStart;
            vsOptions.fudgeFactorDurationRange.value = vsOptions.VSbRef.Config.settings.fudgeFactorDuration;
            vsOptions.fileRetrievalMethodsUsed = vsOptions.VSbRef.Config.settings.fileRetrievalMethods;
//            vsOptions.disableFromIconCheckBox.checked = vsOptions.VSbRef.Config.settings.disableVSFromIcon;

            vsOptions.showlogoCheckbox.checked = vsOptions.VSbRef.Config.settings.showLogo;
            vsOptions.logoSize.value = vsOptions.VSbRef.Config.settings.logoSize;
            for (let i = 0; i < vsOptions.logoPositionRadioBtns.length; i++){
                if (vsOptions.logoPositionRadioBtns[i].id == vsOptions.VSbRef.Config.settings.logoPosition) {
                    vsOptions.logoPositionRadioBtns[i].checked = true;
                }
            }
            vsOptions.logoPosition = vsOptions.VSbRef.Config.settings.logoPosition;

            vsOptions.debuggingCheckbox.checked = vsOptions.VSbRef.Config.settings.debugging;
// console.log('vsOptions = ', vsOptions);
// console.log('vsOptions was just read from vsOptions.VSbRef.Config.settings:', vsOptions.VSbRef.Config.settings);
        });
	},




    getCurrentList: function(listName) {
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
//console.log('\n\nsaveHelper_WordsToMute()');

        if (vsOptions.VSbRef.Config.settings['mute' + listName.charAt(0).toUpperCase() + listName.slice(1)] != vsOptions[listName + 'CategoryControls'].checkbox.checked) {
            vsOptions.WordsToMutesChanged = true;
        }
        vsOptions.VSbRef.Config.settings['mute' + listName.charAt(0).toUpperCase() + listName.slice(1)] = vsOptions[listName + 'CategoryControls'].checkbox.checked;
        tempMutes = vsOptions.getCurrentList(listName);
//console.log('tempMutes = ', tempMutes);

        if (vsOptions.VSbRef.Config.settings[listName + 'List'].join('|') != tempMutes.join('|'))  {
            vsOptions.WordsToMutesChanged = true;
//console.log('%cWordsToMutes changed', 'background-color: green; font-weight: bold', ' so vsOptions.WordsToMutesChanged = ', vsOptions.WordsToMutesChanged);
        } else {
//console.log('%cno WordsToMutes changed', 'background-color: pink; font-weight: bold', ' so vsOptions.WordsToMutesChanged = ', vsOptions.WordsToMutesChanged);
        }
        vsOptions.VSbRef.Config.settings[listName + 'List'] = tempMutes;
//console.log("vsOptions.VSbRef.Config.settings["+listName + 'List'+"]");
    },




	saveOptions: function() {
        var tempMutes;
//console.log('\n\nsaveOptions()');
        vsOptions.WordsToMutesChanged = false;
//console.log('vsOptions.saveHelper_WordsToMute()');
        vsOptions.saveHelper_WordsToMute('diety');
        vsOptions.saveHelper_WordsToMute('profanity');
        vsOptions.saveHelper_WordsToMute('explicit');
        vsOptions.saveHelper_WordsToMute('racism');
        vsOptions.saveHelper_WordsToMute('additional');

        vsOptions.VSbRef.Config.settings.fudgeFactorStart = parseFloat(vsOptions.fudgeFactorStartRange.value);
        vsOptions.VSbRef.Config.settings.fudgeFactorDuration = parseFloat(vsOptions.fudgeFactorDurationRange.value);
        vsOptions.VSbRef.Config.settings.fileRetrievalMethods = vsOptions.fileRetrievalMethodsUsed;

        vsOptions.VSbRef.Config.settings.showLogo = vsOptions.showlogoCheckbox.checked;
        vsOptions.VSbRef.Config.settings.logoSize = vsOptions.logoSize.value;
        vsOptions.VSbRef.Config.settings.logoPosition = vsOptions.logoPosition;
        vsOptions.VSbRef.Config.settings.debugging = vsOptions.debuggingCheckbox.checked;
//console.log('vsOptions.VSbRef.Config.settings = ', vsOptions.VSbRef.Config.settings);
        vsOptions.VSbRef.Config.saveStorage(function() {
             window.close();
        }, vsOptions.WordsToMutesChanged);
	},




    resetOptions: function() {
        for (let i = 0; i < vsOptions.terms.length; i++ ){
            vsOptions[vsOptions.terms[i] + 'CategoryControls'].muteWordList.innerHTML = '';
        }

        vsOptions.VSbRef.Config.resetToDefaults(function() {
            vsOptions.readOptions(function() {
                vsOptions.updateStatusMessage('Options reset to default values');
            });
        });
	},




    cancel: function() {
        window.close();
    },




    updateStatusMessage: function(msg) {
//console.log('updateStatusMessage()');
		vsOptions.status.textContent = msg;
    }

};


document.addEventListener('DOMContentLoaded', vsOptions.init);