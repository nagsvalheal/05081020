// Import libraries
import { LightningElement } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';
// Import Apex classes
import GET_ALLERGY_INTOLERANCE_DATA from '@salesforce/apex/BI_PSPB_SymptomPrimaryPageCtrl.getAllergyIntoleranceData';
import RECORD_UPDATE_ALLERGY_INTOLERANCE from '@salesforce/apex/BI_PSP_SymptomTrackerCtrl.recordUpdateAllergyIntolerance';
import RECORD_INSERT_ALLERGY_INTOLERANCE from '@salesforce/apex/BI_PSP_SymptomTrackerCtrl.recordInsertAllergyIntolerance';
import GET_ENROLLEE from '@salesforce/apex/BI_PSP_ChallengeEnrolleCtrl.getEnrolle';
// Import custom labels
import * as label from 'c/biPspbLabelAndResourceSymptom';

export default class BiPspbMoodSymptom extends NavigationMixin(LightningElement) {
    // Properties
    currentMoodError = false;
    boxedIcon = label.BOXED_ICON;
    valueOfTemperature;
    localStorageValueItchiness;
    lastSymptomId;
    emojiName = [];
    sliderValue = 0;
    currentMoodErrorSad = false;
    insertCount;
    itchinessValues = label.MOOD_IMG;
    allergyIntoleranceData;
    carePlanTemplateName;
    humanParts = '';
    wooriedMood = label.WORRIED_MOOD;
    speechLessMood = label.SPEECHLESS_MOOD;
    joyFullMood = label.JOYFULL_MOOD;
    happyMood = label.HAPPY_MOOD;
    sadMood = label.SAD_MOOD;
    recordInsertCount = 0;
    accountId;
    userId = label.ID;
    selectedEmoji = null;
    imgUrlSad = label.WORRIED;
    imgUrlWorried = label.SAD;
    imgUrlSpeechless = label.SPEECHLESS;
    imgUrlJoyfull = label.JOYFULL;
    imgUrlHappy = label.HAPPY;
    isButtonDisabled = false;
    fatiqueErrors = false;
    moodInfo = label.MOOD_INFO;
    confirmAndSave = label.CONFIRM_SAVE;

    
    // Lifecycle hook
    connectedCallback() {
        this.loadInitialData();
    }
    
    loadInitialData() {
        try {
            this.initializeProperties();
            this.fetchEnrolleeData();
            this.loadMoodSymptom();
        } catch (err) {
            this.showToast(label.ERROR_MESSAGE, err.message, label.ERROR_VARIANT);
        }
    }

    initializeProperties() {
        const globalThis = window;
        this.insertCount = globalThis?.sessionStorage.getItem('countmood');
        this.lastSymptomId = globalThis?.localStorage.getItem('symptomlastid');
        this.localStorageValueItchiness = globalThis?.localStorage.getItem('Time');
        this.currentMoodError = true;
    }

    loadMoodSymptom() {
        const globalThis = window;
        const moodSymptom = globalThis?.sessionStorage.getItem('mood');
        
        if (moodSymptom) {
            this.fatiqueErrors = true;
        } else {
            this.moodDataRefreshData(this.lastSymptomId);
            this.fatiqueErrors = false;
        }
        
        this.updateImageUrlsBasedOnMood(moodSymptom);
        this.emojiName = moodSymptom;
    }

  updateImageUrlsBasedOnMood(moodSymptom) {
    switch (moodSymptom) {
        case label.SAD_MOOD:
            this.imgUrlSad = label.REPLACE_WORRIED;
            break;
        case label.HAPPY_MOOD:
            this.imgUrlHappy = label.REPLACE_HAPPY;
            break;
        case label.JOYFULL_MOOD:
            this.imgUrlJoyfull = label.REPLACE_JOYFUL;
            break;
        case label.SPEECHLESS_MOOD:
            this.imgUrlSpeechless = label.REPLACE_SPEECHLESS;
            break;
        case label.WORRIED_MOOD:
            this.imgUrlWorried = label.REPLACE_SAD;
            this.currentMoodErrorSad = true;
            break;
        default:
          
            break;
    }
}


    fetchEnrolleeData() {
        GET_ENROLLEE({ userId: this.userId })
            .then(result => {
                if (result && result[0]) {
                    if (result[0].patientEnrolle) {
                        this.accountId = result[0].patientEnrolle.Id;
                    } else if (result[0].error) {
                        this.showError = true;
                        this.label.ERROR_MESSAGE = result[0].error;
                    }
                }
            })
            .catch(error => this.showToast(label.ERROR_MESSAGE, error.message, label.ERROR_VARIANT));
    }

    moodDataRefreshData(symptomLastId) {
        GET_ALLERGY_INTOLERANCE_DATA({ symptomTrackerId: symptomLastId })
            .then(data => {
                if (data) {
                    Promise.resolve().then(() => {
                        this.processMoodData(data);
                    });
                }
            })
            .catch(error => this.showToast(label.ERROR_MESSAGE, error.body.message, label.ERROR_VARIANT));
    }

    processMoodData(data) {
        data.forEach(record => {
            const moodSymptom = record.BI_PSP_Mood__c;
            this.fatiqueErrors = true;
            const carePlanTemplate = record?.BI_PSP_Symptoms__r?.HealthCloudGA__CarePlanTemplate__r?.Name;
            
            if (carePlanTemplate === this.itchinessValues) {
                this.carePlanTemplateName = this.itchinessValues;
                this.updateImageUrlsBasedOnMood(moodSymptom);
                this.emojiName = moodSymptom;
            }
        });
    }

    handleEmojiClick(event) {
        const emojiName = event.currentTarget.getAttribute('data-name');
        this.fatiqueErrors = !!emojiName;
        this.emojiName = emojiName;
        this.isButtonDisabled = false;
        this.currentMoodError = this.currentMoodErrorSad = false;
        this.resetImageUrls();
        this.updateImageUrlsBasedOnMood(emojiName);
        this.selectedEmoji = emojiName;
    }

    resetImageUrls() {
        this.imgUrlHappy = label.HAPPY;
        this.imgUrlJoyfull = label.JOYFULL;
        this.imgUrlSpeechless = label.SPEECHLESS;
        this.imgUrlWorried = label.SAD;
        this.imgUrlSad = label.WORRIED;
    }

  onchangeAccept() {
    const globalThis = window;
    const itchinessAllRecord = {
        valueOfSlider: parseFloat(this.sliderValue),
        careProgramId: this.accountId,
        sliderValue: parseFloat(this.valueOfTemperature) || 0,
        symptomId: this.localStorageValueItchiness || this.lastSymptomId,
        symptomName: this.itchinessValues || '',
        moodvalues: this.emojiName || '',
    };
    this.partsOfBody = this.humanParts;

    const handleResult = (result) => {
        if (result) {
            this.updateSessionStorage();
            if (!this.lastSymptomId && this.recordInsertCount !== undefined) {
                this.recordInsertCount++;
                globalThis?.sessionStorage.setItem('countmood', this.recordInsertCount);
            }
        }
    };

    const handleError = (error) => {
        this.showToast(label.ERROR_MESSAGE, error.message, label.ERROR_VARIANT);
        	let global = window;
    global.location?.assign(this.urlq + ERROR_PAGE);
    global.sessionStorage.setItem('errorMessage', errorMessage);
    };

    if (this.insertCount === '1') {
        RECORD_UPDATE_ALLERGY_INTOLERANCE({
            itchinessallrecordupdate: itchinessAllRecord,
            bodyParts: this.partsOfBody
        })
        .then(handleResult)
        .catch(handleError);
    } else {
        if (this.lastSymptomId) {
            RECORD_UPDATE_ALLERGY_INTOLERANCE({
                itchinessallrecordupdate: itchinessAllRecord,
                bodyParts: this.humanParts
            })
            .then(handleResult)
            .catch(handleError);
        } else {
            RECORD_INSERT_ALLERGY_INTOLERANCE({
                itchinessallrecordinsert: itchinessAllRecord,
                bodyParts: this.humanParts
            })
            .then(handleResult)
            .catch(handleError);
        }
    }
}


    updateSessionStorage() {
        const globalThis = window;
        globalThis?.sessionStorage.setItem('mood', this.emojiName);
        globalThis?.sessionStorage.setItem('syptombtn', false);
        if (typeof window !== 'undefined') {
            this.dispatchEvent(new CustomEvent('updatechildprop', { detail: false }));
            this.dispatchEvent(new CustomEvent('addtask', { detail: label.MOOD_IMG }));
        }
    }

    showToast(title, message, variant) {
        if (typeof window !== 'undefined') {
            const event = new ShowToastEvent({ title, message, variant });
            this.dispatchEvent(event);
        }
    }
}