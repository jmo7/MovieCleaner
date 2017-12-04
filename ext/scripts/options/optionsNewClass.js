class Options {
	constructor() {
		this.terms = ['diety', 'profanity', 'explicit', 'racism', 'additional'];


	//     this.dietyCategoryControls: undefined;
	//     this.dietyCheckbox: undefined;
	//
	//     this.profanityCategoryControls: {};
	//     this.profanityCheckbox: undefined;
	//
	//     this.explicitCategoryControls: {};
	//     this.explicitCheckbox: undefined;
	//
	//     this.racismCategoryControls: {},
	//     this.racismCheckbox: undefined,
	//
	//     this.additionalCategoryControls: {},
	//     this.editListButtons: undefined,
	//
	//     this.feedbacks: undefined,
	//
	//     this.fudgeFactorStartRange: undefined,
	//     this.fudgeFactorDurationRange: undefined,
	//     this.showlogoCheckbox: undefined,
	// //    disableFromIconCheckBox: undefined,
	//     this.debuggingCheckbox: undefined,
	//     this.status: undefined,
	//     this.saveBtn: undefined,
	//     this.resetBtn: undefined,
	//     this.cancelBtn: undefined,
	//     this.fileRetrievalMethodsUsed: [],
	//     this.VSbRef: undefined,
	//     this.currentInputEl: undefined,
	//     this.previousInputEl: undefined,
	//     this.currentCatControlObject: undefined,
	//     this.WordsToMutesChanged: undefined,

	this.init();
	}


	init() {
//        var catControlEl, catCntrlObj;
//console.log('init()');
//console.log('options::init() -- chrome.extension.getBackgroundPage() = ', chrome.extension.getBackgroundPage());
//
console.log('options init');
        this.VSbRef = chrome.extension.getBackgroundPage().VSb;
 //       this.terms = this.VSbRef.Config.Settings.constants.muteCategories;
        this.feedbacks = document.querySelectorAll('.muteWordListControlFeedback');

//console.log('this.terms.length = ', this.terms.length, ' - this.terms = ', this.terms);
//         for (let i = 0; i < this.terms.length; i++){
//             let catControlEl = document.querySelector('#' + this.terms[i] );
//             let catCntrlObj = {
//                 "checkbox": catControlEl.querySelector('input[type=checkbox]'),
//                 "showListBtn": catControlEl.querySelector('button'),
//                 "muteWordListControl":  catControlEl.querySelector('.muteWordListControl'),
//                 "muteWordList": catControlEl.querySelector('.muteWordListControl .muteWordList'),
//                 "muteWordListControlFeedback": catControlEl.querySelector('.muteWordListControl .muteWordListControlFeedback'),
//                 "addBtn": catControlEl.querySelector('.muteWordListControl button:nth-of-type(1)'),
//                 "removeBtn": catControlEl.querySelector('.muteWordListControl button:nth-of-type(2)'),
//                 "upBtn": catControlEl.querySelector('.muteWordListControl button:nth-of-type(3)'),
//                 "downBtn": catControlEl.querySelector('.muteWordListControl button:nth-of-type(4)')
//             };
// //console.log( 'for <this.terms['+i+']> ' + this.terms + ' - catCntrlObj = ', catCntrlObj);
//             catCntrlObj.checkbox.addEventListener('change', this.formControlChanged);
//             catCntrlObj.showListBtn.addEventListener('click', this.showList);
//             catCntrlObj.addBtn.addEventListener('click', this.addListWord);
//             catCntrlObj.removeBtn.addEventListener('click', this.removeListWord);
//             catCntrlObj.upBtn.addEventListener('click', this.moveListWordUp);
//             catCntrlObj.downBtn.addEventListener('click', this.moveListWordDown);
//
//             vsOptions[this.terms[i] + "CategoryControls"] = catCntrlObj;
//         }

       for (let i = 0; i < this.terms.length; i++){
		   this[this.terms[i] + "CategoryControls"] = new CategoryControl(this.terms[i]);
console.log('this['+(this.terms[i] + 'CategoryControls')+'] = ', this[this.terms[i] + "CategoryControls"]);
	   }


        this.fudgeFactorStartRange = document.querySelector('#fudgeFactorStart');
        this.fudgeFactorDurationRange = document.querySelector('#fudgeFactorDuration');
        this.showlogoCheckbox = document.querySelector('#showlogo');
        this.showlogoCheckbox.addEventListener('change', this.formControlChanged);

        this.logoSize = document.querySelector('#logoSize');
        this.logoSize.addEventListener('change', this.formControlChanged);

        this.logoPositionRadioBtns = document.querySelectorAll('[name=logoposition]');
        for (let i = 0; i < this.logoPositionRadioBtns.length; i++){
            this.logoPositionRadioBtns[i].addEventListener('click', function(event) {
                this.logoPosition = event.target.id;CategoryControl
                this.formControlChanged();
            });
        }

        this.debuggingCheckbox = document.querySelector('#debugging');
        // this.disableFromIconCheckBox = document.querySelector('#disableFromIcon');
        // this.disableFromIconCheckBox.addEventListener('change', this.formControlChanged);

        this.status = document.querySelector('#status');

        this.saveBtn = document.querySelector('#saveBtn');
        this.saveBtn.addEventListener('click', function(){
//console.log('click --  saveOptions');
            this.saveOptions();
        });

        this.cancelBtn = document.querySelector('#cancelBtn');
        this.cancelBtn.addEventListener('click', this.cancel);

        this.resetBtn = document.querySelector('#resetBtn');
        this.resetBtn.addEventListener('click', this.resetOptions);

		this.readOptions();
	}




//     showList:  function(event) {
//         this.toggleCatergyControls(vsOptions[event.target.dataset.grouptype + "CategoryControls"]);
//     },
//
//
//
//
//     addListWord: function(event) {
//         this.currentCatControlObject = vsOptions[event.target.parentNode.parentNode.id + "CategoryControls"];
//         let newInputEl = this.createSingleInput();
//         if (this.currentInputEl && this.currentInputEl.parentNode === this.currentCatControlObject.muteWordList) {
//             if (this.currentInputEl.nextSibling) {
//                 this.currentCatControlObject.muteWordList.insertBefore(newInputEl, this.currentInputEl.nextSibling);
//                 this.currentCatControlObject.downBtn.removeAttribute('disabled');
//             } else {
//                 this.currentCatControlObject.muteWordList.appendChild(newInputEl);
//             }
//         } else {
//             this.currentCatControlObject.muteWordList.appendChild(newInputEl);
//         }
//
//         this.setNewCurrentInputEl(newInputEl);
//         this.currentInputEl.focus();
//
//         // in case we previously didn't have any items and the removeBtn was disabled, reenable it
//         this.currentCatControlObject.removeBtn.removeAttribute('disabled');
//
//         if (this.currentCatControlObject.muteWordList.children.length > 1) {
//             // if there was previously only 1 item in the list (and therefore the upBtn was disabled) and we have now just added a second
//             // reenable it (we check for greater than 1 in case we had o and by adding the new one we only have one we don't wan to reenable)
//             this.currentCatControlObject.upBtn.removeAttribute('disabled');
//         }
//     },
//
//
//
//
//     removeListWord: function (event) {
//         if (this.currentInputEl) {
//             if (this.currentInputEl.nextSibling) {
//                 this.setNewCurrentInputEl(this.currentInputEl.nextSibling, true);
//             } else if (this.currentInputEl.previousSibling) {
//                 this.setNewCurrentInputEl(this.currentInputEl.previousSibling, true);
//             } else {    // this is the only node there is
//                 this.deleteInputEl(this.currentInputEl);
//                 this.currentInputEl = undefined;
//             }
//
//             this.currentCatControlObject = vsOptions[event.target.parentNode.parentNode.id + "CategoryControls"];
//
//             // if we've just removed the last item from the list, disable the remove button
//             if (this.currentCatControlObject.muteWordList.children.length <= 0) {
//                  this.currentCatControlObject.removeBtn.setAttribute('disabled', 'disabled');
//             }
//
//             // if we deleted the first item in the list, and the second item has now been selected and
//             // moved up into the first spot, disable the upBtn
//             if (!this.currentInputEl.previousSibling) {
//                 this.currentCatControlObject.upBtn.setAttribute('disabled', 'disabled');
//             }
//
//             // if the we deleted the second to last item in the list, and the last item has now been
//             // selected, disable the downBtn
//             if (!this.currentInputEl.nextSibling) {
//                 this.currentCatControlObject.downBtn.setAttribute('disabled', 'disabled');
//             }
//
//         } else {
//             event.target.parentNode.querySelector('.muteWordListControlFeedback').innerText = 'Please select a word first before pushing the remove button';
//         }
//     },
//
//
//
//
//     moveListWordUp: function(event) {
//         this.clearFeedbacks();
//         if (this.currentInputEl) {
//             if (this.currentInputEl.previousSibling) {
//                 this.currentInputEl.parentNode.insertBefore(this.currentInputEl, this.currentInputEl.previousSibling);
// //console.log('this.currentInputEl = ', this.currentInputEl);
// //console.log('this.currentInputEl.previousSibling = ', this.currentInputEl.previousSibling);
//                 this.currentCatControlObject = vsOptions[event.target.parentNode.parentNode.id + "CategoryControls"];
//                 if (!this.currentInputEl.previousSibling) {
//                     this.currentCatControlObject.upBtn.setAttribute('disabled', 'disabled');
//                     this.currentCatControlObject.downBtn.removeAttribute('disabled');
//                 }
//                 if (this.currentInputEl.nextSibling) {
//                     this.currentCatControlObject.downBtn.removeAttribute('disabled');
//                 }
//             } else {  /*  do nothing  */  }
//         }
//     },
//
//
//
//
//     moveListWordDown: function(event) {
//         this.clearFeedbacks();
//         if (this.currentInputEl && this.currentInputEl.nextSibling) {
//             if (this.currentInputEl.nextSibling.nextSibling) {
//                 this.currentInputEl.parentNode.insertBefore(this.currentInputEl, this.currentInputEl.nextSibling.nextSibling);
//                 if (this.currentInputEl.previousSibling) {
//                     this.currentCatControlObject.upBtn.removeAttribute('disabled');
//                 }
//             } else {
//                 // the next item is the last in the list so while there is a .nextSibling there is not a .nextSibling.nextSibling
//                 // so we have to instead grab the next node and move it before this node
//                 this.currentInputEl.parentNode.insertBefore(this.currentInputEl.nextSibling, this.currentInputEl);
//                 this.currentCatControlObject = vsOptions[event.target.parentNode.parentNode.id + "CategoryControls"];
//                 this.currentCatControlObject.downBtn.setAttribute('disabled', 'disabled');
//                 this.currentCatControlObject.upBtn.removeAttribute('disabled');
//             }
//         }
//     },
//
//
//
//
//     inputSelected: function(event) {
//         this.setNewCurrentInputEl(event.target);
//
//         let newCatControlObject = vsOptions[event.target.parentNode.parentNode.parentNode.id + "CategoryControls"];
//         if (this.currentCatControlObject && this.currentCatControlObject != newCatControlObject) {
//             this.currentCatControlObject.upBtn.setAttribute('disabled', 'disabled');
//             this.currentCatControlObject.downBtn.setAttribute('disabled', 'disabled');
//         }
//         this.currentCatControlObject = newCatControlObject;
//
//         if (this.currentInputEl.previousSibling) {
//             this.currentCatControlObject.upBtn.removeAttribute('disabled');
//         } else {
//             this.currentCatControlObject.upBtn.setAttribute('disabled', 'disabled');
//         }
//         if (this.currentInputEl.nextSibling) {
//             this.currentCatControlObject.downBtn.removeAttribute('disabled');
//         } else {
//             this.currentCatControlObject.downBtn.setAttribute('disabled', 'disabled');
//         }
//     },
//
//
//
//
//     setNewCurrentInputEl: function(inputEl, deletePrevious) {
//         if (this.currentInputEl) {
//             this.previousInputEl = this.currentInputEl;
//             if (this.previousInputEl.value === '' || deletePrevious) {
//                     this.deleteInputEl(this.previousInputEl);
//             } else {
//                 this.previousInputEl.classList.remove('selected');
//             }
//         }
//         this.currentInputEl = inputEl;
//         inputEl.classList.add('selected');
//         this.clearFeedbacks();
//     },
//
//
//
//
//     deleteInputEl:function(inputEl) {
//          inputEl.parentNode.removeChild(inputEl);
//     },




    formControlChanged() {
        this.updateStatusMessage('');
    }




    clearFeedbacks() {
        for (let i = 0; i < this.feedbacks.length; i++) {
            this.feedbacks[i].innerHTML = '';
        }
    }




//     toggleCatergyControls: function(categoryControl) {
// //console.log('toggleCatergyControls()\n\t\tcategoryControl.muteWordListControl.classList.contains(\'inactive\') = ', categoryControl.muteWordListControl.classList.contains('inactive'));
//         if (categoryControl.muteWordListControl.classList.contains('inactive')) {
// //console.log('in the if');
//             categoryControl.muteWordListControl.classList.remove('inactive');
//             categoryControl.showListBtn.innerText = 'Hide List';
//
//             if (categoryControl.muteWordList.children.length > 0) {
//                 categoryControl.removeBtn.removeAttribute('disabled', '');
//             }
//             // if (categoryControl.muteWordList.children.length > 1) {
//             //     categoryControl.upBtn.removeAttribute('disabled', '');
//             //     categoryControl.downBtn.removeAttribute('disabled', '');
//             // }
//         } else {
// //console.log('in the else');
//             categoryControl.muteWordListControl.classList.add('inactive');
//             categoryControl.showListBtn.innerText = 'Show List';
//         }
//     },




    // createInputList(listName) {
    //     for (let i = 0; i < this.VSbRef.Config.Settings.items[listName + 'List'].length; i++ ){
    //         vsOptions[listName + 'CategoryControls'].muteWordList.appendChild( this.createSingleInput(this.VSbRef.Config.Settings.items[listName + 'List'][i]) );
    //     }
    // }
	//
	//
	//
	//
    // createSingleInput(mutePhrase) {
    //     mutePhrase = mutePhrase || '';
    //     let inputEl = document.createElement('input');
    //     inputEl.type = 'text';
    //     inputEl.value = mutePhrase;
    //     inputEl.addEventListener('click', this.inputSelected);
	//
    //     return inputEl;
    // }




    readOptions() {
//console.log('readOptions -- vsOptions = ', vsOptions, '\nthis.VSbRef.Config = ', this.VSbRef.Config);
  /*      this.VSbRef.Config.readStorage( function(){
            this.dietyCategoryControls.checkbox.checked = this.VSbRef.Config.Settings.items.muteDiety;
            this.createInputList('diety');

            this.profanityCategoryControls.checkbox.checked = this.VSbRef.Config.Settings.items.muteProfanity;
            this.createInputList('profanity');

            this.explicitCategoryControls.checkbox.checked = this.VSbRef.Config.Settings.items.muteExplicit;
            this.createInputList('explicit');

            this.racismCategoryControls.checkbox.checked = this.VSbRef.Config.Settings.items.muteRacism;
            this.createInputList('racism');

            this.additionalCategoryControls.checkbox.checked = this.VSbRef.Config.Settings.items.muteAdditional;
            this.createInputList('additional');

            this.fudgeFactorStartRange.value = this.VSbRef.Config.Settings.items.fudgeFactorStart;
            this.fudgeFactorDurationRange.value = this.VSbRef.Config.Settings.items.fudgeFactorDuration;
            this.fileRetrievalMethodsUsed = this.VSbRef.Config.Settings.items.fileRetrievalMethods;
//            this.disableFromIconCheckBox.checked = this.VSbRef.Config.Settings.items.disableVSFromIcon;

            this.showlogoCheckbox.checked = this.VSbRef.Config.Settings.items.showLogo;
            this.logoSize.value = this.VSbRef.Config.Settings.items.logoSize;
            for (let i = 0; i < this.logoPositionRadioBtns.length; i++){
                if (this.logoPositionRadioBtns[i].id == this.VSbRef.Config.Settings.items.logoPosition) {
                    this.logoPositionRadioBtns[i].checked = true;
                }
            }
            this.logoPosition = this.VSbRef.Config.Settings.items.logoPosition;

            this.debuggingCheckbox.checked = this.VSbRef.Config.Settings.items.debugging;
// console.log('vsOptions = ', vsOptions);
// console.log('vsOptions was just read from this.VSbRef.Config.Settings.items:', this.VSbRef.Config.Settings.items);
        });
	*/}




    getCurrentList(listName) {
        let tempList = [];
        let inputs = document.querySelectorAll('#'+listName+' .muteWordListControl div input');
        for (let i = 0; i < inputs.length; i++ ) {
            if (inputs[i].value !== '') {
                tempList.push(inputs[i].value);
            }
        }
        return tempList;
    }




    saveHelper_WordsToMute(listName) {
//console.log('\n\nsaveHelper_WordsToMute()');

        if (this.VSbRef.Config.Settings.items['mute' + listName.charAt(0).toUpperCase() + listName.slice(1)] != vsOptions[listName + 'CategoryControls'].checkbox.checked) {
            this.WordsToMutesChanged = true;
        }
        this.VSbRef.Config.Settings.items['mute' + listName.charAt(0).toUpperCase() + listName.slice(1)] = vsOptions[listName + 'CategoryControls'].checkbox.checked;
        tempMutes = this.getCurrentList(listName);
//console.log('tempMutes = ', tempMutes);

        if (this.VSbRef.Config.Settings.items[listName + 'List'].join('|') != tempMutes.join('|'))  {
            this.WordsToMutesChanged = true;
//console.log('%cWordsToMutes changed', 'background-color: green; font-weight: bold', ' so this.WordsToMutesChanged = ', this.WordsToMutesChanged);
        } else {
//console.log('%cno WordsToMutes changed', 'background-color: pink; font-weight: bold', ' so this.WordsToMutesChanged = ', this.WordsToMutesChanged);
        }
        this.VSbRef.Config.Settings.items[listName + 'List'] = tempMutes;
//console.log("this.VSbRef.Config.Settings.items["+listName + 'List'+"]");
    }




	saveOptions() {
        var tempMutes;
//console.log('\n\nsaveOptions()');
        this.WordsToMutesChanged = false;
//console.log('this.saveHelper_WordsToMute()');
        this.saveHelper_WordsToMute('diety');
        this.saveHelper_WordsToMute('profanity');
        this.saveHelper_WordsToMute('explicit');
        this.saveHelper_WordsToMute('racism');
        this.saveHelper_WordsToMute('additional');

        this.VSbRef.Config.Settings.items.fudgeFactorStart = parseFloat(this.fudgeFactorStartRange.value);
        this.VSbRef.Config.Settings.items.fudgeFactorDuration = parseFloat(this.fudgeFactorDurationRange.value);
        this.VSbRef.Config.Settings.items.fileRetrievalMethods = this.fileRetrievalMethodsUsed;

        this.VSbRef.Config.Settings.items.showLogo = this.showlogoCheckbox.checked;
        this.VSbRef.Config.Settings.items.logoSize = this.logoSize.value;
        this.VSbRef.Config.Settings.items.logoPosition = this.logoPosition;
        this.VSbRef.Config.Settings.items.debugging = this.debuggingCheckbox.checked;
//console.log('this.VSbRef.Config.Settings.items = ', this.VSbRef.Config.Settings.items);
        this.VSbRef.Config.saveStorage(function() {
             window.close();
        }, this.WordsToMutesChanged);
	}




    resetOptions() {
        for (let i = 0; i < this.terms.length; i++ ){
            vsOptions[this.terms[i] + 'CategoryControls'].muteWordList.innerHTML = '';
        }

        this.VSbRef.Config.resetToDefaults(function() {
            this.readOptions(function() {
                this.updateStatusMessage('Options reset to default values');
            });
        });
	}




    cancel() {
        window.close();
    }




    updateStatusMessage(msg) {
//console.log('updateStatusMessage()');
		this.status.textContent = msg;
    }

}


document.addEventListener('DOMContentLoaded', function() {
	vsOptions = new Options();
});


class CategoryControl {
	constructor(id) {
		this.elmnt = document.querySelector('#' + id );

		this.checkbox = this.elmnt.querySelector('input[type=checkbox]');
		this.checkbox.addEventListener('change', this.formControlChanged);

		this.showListBtn = this.elmnt.querySelector('button');
		this.showListBtn.addEventListener('click', this.showList);

		this.muteWordListControl = this.elmnt.querySelector('.muteWordListControl');

		this.muteWordList = this.elmnt.querySelector('.muteWordListControl .muteWordList');

		this.muteWordListControlFeedback = this.elmnt.querySelector('.muteWordListControl .muteWordListControlFeedback');

		this.addBtn = this.elmnt.querySelector('.muteWordListControl button:nth-of-type(1)');
		this.addBtn.addEventListener('click', this.addListWord);

		this.removeBtn = this.elmnt.querySelector('.muteWordListControl button:nth-of-type(2)');
		this.removeBtn.addEventListener('click', this.removeListWord);

		this.upBtn = this.elmnt.querySelector('.muteWordListControl button:nth-of-type(3)');
		this.upBtn.addEventListener('click', this.moveListWordUp);

		this.downBtn = this.elmnt.querySelector('.muteWordListControl button:nth-of-type(4)');
		this.downBtn.addEventListener('click', this.moveListWordDown);
	}


	toggle() {
 //console.log('toggleCatergyControls()\n\t\tthis.muteWordListControl.classList.contains(\'inactive\') = ', this.muteWordListControl.classList.contains('inactive'));
 	   if (this.muteWordListControl.classList.contains('inactive')) {
 //console.log('in the if');
 		   this.muteWordListControl.classList.remove('inactive');
 		   this.showListBtn.innerText = 'Hide List';

 		   if (this.muteWordList.children.length > 0) {
 			   this.removeBtn.removeAttribute('disabled', '');
 		   }
 	   } else {
 //console.log('in the else');
 		   this.muteWordListControl.classList.add('inactive');
 		   this.showListBtn.innerText = 'Show List';
 	   }
    }


	showList(event) {
		vsOptions[event.target.dataset.grouptype + "CategoryControls"].toggle();
    }




    addListWord(event) {
 	   this.currentCatControlObject = vsOptions[event.target.parentNode.parentNode.id + "CategoryControls"];
 	   let newInputEl = this.createSingleInput();
 	   if (this.currentInputEl && this.currentInputEl.parentNode === this.currentCatControlObject.muteWordList) {
 		   if (this.currentInputEl.nextSibling) {
 			   this.currentCatControlObject.muteWordList.insertBefore(newInputEl, this.currentInputEl.nextSibling);
 			   this.currentCatControlObject.downBtn.removeAttribute('disabled');
 		   } else {
 			   this.currentCatControlObject.muteWordList.appendChild(newInputEl);
 		   }
 	   } else {
 		   this.currentCatControlObject.muteWordList.appendChild(newInputEl);
 	   }

 	   this.setNewCurrentInputEl(newInputEl);
 	   this.currentInputEl.focus();

 	   // in case we previously didn't have any items and the removeBtn was disabled, reenable it
 	   this.currentCatControlObject.removeBtn.removeAttribute('disabled');

 	   if (this.currentCatControlObject.muteWordList.children.length > 1) {
 		   // if there was previously only 1 item in the list (and therefore the upBtn was disabled) and we have now just added a second
 		   // reenable it (we check for greater than 1 in case we had o and by adding the new one we only have one we don't wan to reenable)
 		   this.currentCatControlObject.upBtn.removeAttribute('disabled');
 	   }
    }




    removeListWord(event) {
 	   if (this.currentInputEl) {
 		   if (this.currentInputEl.nextSibling) {
 			   this.setNewCurrentInputEl(this.currentInputEl.nextSibling, true);
 		   } else if (this.currentInputEl.previousSibling) {
 			   this.setNewCurrentInputEl(this.currentInputEl.previousSibling, true);
 		   } else {    // this is the only node there is
 			   this.deleteInputEl(this.currentInputEl);
 			   this.currentInputEl = undefined;
 		   }

 		   this.currentCatControlObject = vsOptions[event.target.parentNode.parentNode.id + "CategoryControls"];

 		   // if we've just removed the last item from the list, disable the remove button
 		   if (this.currentCatControlObject.muteWordList.children.length <= 0) {
 				this.currentCatControlObject.removeBtn.setAttribute('disabled', 'disabled');
 		   }

 		   // if we deleted the first item in the list, and the second item has now been selected and
 		   // moved up into the first spot, disable the upBtn
 		   if (!this.currentInputEl.previousSibling) {
 			   this.currentCatControlObject.upBtn.setAttribute('disabled', 'disabled');
 		   }

 		   // if the we deleted the second to last item in the list, and the last item has now been
 		   // selected, disable the downBtn
 		   if (!this.currentInputEl.nextSibling) {
 			   this.currentCatControlObject.downBtn.setAttribute('disabled', 'disabled');
 		   }

 	   } else {
 		   event.target.parentNode.querySelector('.muteWordListControlFeedback').innerText = 'Please select a word first before pushing the remove button';
 	   }
    }




    moveListWordUp(event) {
 	   this.clearFeedbacks();
 	   if (this.currentInputEl) {
 		   if (this.currentInputEl.previousSibling) {
 			   this.currentInputEl.parentNode.insertBefore(this.currentInputEl, this.currentInputEl.previousSibling);
 //console.log('this.currentInputEl = ', this.currentInputEl);
 //console.log('this.currentInputEl.previousSibling = ', this.currentInputEl.previousSibling);
 			   this.currentCatControlObject = vsOptions[event.target.parentNode.parentNode.id + "CategoryControls"];
 			   if (!this.currentInputEl.previousSibling) {
 				   this.currentCatControlObject.upBtn.setAttribute('disabled', 'disabled');
 				   this.currentCatControlObject.downBtn.removeAttribute('disabled');
 			   }
 			   if (this.currentInputEl.nextSibling) {
 				   this.currentCatControlObject.downBtn.removeAttribute('disabled');
 			   }
 		   } else {  /*  do nothing  */  }
 	   }
    }




    moveListWordDown(event) {
 	   this.clearFeedbacks();
 	   if (this.currentInputEl && this.currentInputEl.nextSibling) {
 		   if (this.currentInputEl.nextSibling.nextSibling) {
 			   this.currentInputEl.parentNode.insertBefore(this.currentInputEl, this.currentInputEl.nextSibling.nextSibling);
 			   if (this.currentInputEl.previousSibling) {
 				   this.currentCatControlObject.upBtn.removeAttribute('disabled');
 			   }
 		   } else {
 			   // the next item is the last in the list so while there is a .nextSibling there is not a .nextSibling.nextSibling
 			   // so we have to instead grab the next node and move it before this node
 			   this.currentInputEl.parentNode.insertBefore(this.currentInputEl.nextSibling, this.currentInputEl);
 			   this.currentCatControlObject = vsOptions[event.target.parentNode.parentNode.id + "CategoryControls"];
 			   this.currentCatControlObject.downBtn.setAttribute('disabled', 'disabled');
 			   this.currentCatControlObject.upBtn.removeAttribute('disabled');
 		   }
 	   }
    }



	createInputList(listName) {
        for (let i = 0; i < this.VSbRef.Config.Settings.items[listName + 'List'].length; i++ ){
            vsOptions[listName + 'CategoryControls'].muteWordList.appendChild( this.createSingleInput(this.VSbRef.Config.Settings.items[listName + 'List'][i]) );
        }
    }




    createSingleInput(mutePhrase) {
        mutePhrase = mutePhrase || '';
        let inputEl = document.createElement('input');
        inputEl.type = 'text';
        inputEl.value = mutePhrase;
        inputEl.addEventListener('click', this.inputSelected);

        return inputEl;
    }




    inputSelected(event) {
 	   this.setNewCurrentInputEl(event.target);

 	   let newCatControlObject = vsOptions[event.target.parentNode.parentNode.parentNode.id + "CategoryControls"];
 	   if (this.currentCatControlObject && this.currentCatControlObject != newCatControlObject) {
 		   this.currentCatControlObject.upBtn.setAttribute('disabled', 'disabled');
 		   this.currentCatControlObject.downBtn.setAttribute('disabled', 'disabled');
 	   }
 	   this.currentCatControlObject = newCatControlObject;

 	   if (this.currentInputEl.previousSibling) {
 		   this.currentCatControlObject.upBtn.removeAttribute('disabled');
 	   } else {
 		   this.currentCatControlObject.upBtn.setAttribute('disabled', 'disabled');
 	   }
 	   if (this.currentInputEl.nextSibling) {
 		   this.currentCatControlObject.downBtn.removeAttribute('disabled');
 	   } else {
 		   this.currentCatControlObject.downBtn.setAttribute('disabled', 'disabled');
 	   }
    }




    setNewCurrentInputEl(inputEl, deletePrevious) {
 	   if (this.currentInputEl) {
 		   this.previousInputEl = this.currentInputEl;
 		   if (this.previousInputEl.value === '' || deletePrevious) {
 				   this.deleteInputEl(this.previousInputEl);
 		   } else {
 			   this.previousInputEl.classList.remove('selected');
 		   }
 	   }
 	   this.currentInputEl = inputEl;
 	   inputEl.classList.add('selected');
 	   this.clearFeedbacks();
    }




    deleteInputEl(inputEl) {
 		inputEl.parentNode.removeChild(inputEl);
    }

}