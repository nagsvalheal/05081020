import { LightningElement, track, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';
// To import Custom labels and static resources
import * as label from 'c/biPspbLabelAndResourceSymptom';
// To import Apex Classes
import GET_ENROLLEE from '@salesforce/apex/BI_PSP_ChallengeEnrolleCtrl.getEnrolle';
import GET_ALLERGY_INTOLERANCE_DATA from '@salesforce/apex/BI_PSPB_SymptomPrimaryPageCtrl.getAllergyIntoleranceData';
import RECORD_UPDATE_ALLERGY_INTOLERANCE from '@salesforce/apex/BI_PSP_SymptomTrackerCtrl.recordUpdateAllergyIntolerance';
import RECORD_INSERT_ALLERGY_INTOLERANCE from '@salesforce/apex/BI_PSP_SymptomTrackerCtrl.recordInsertAllergyIntolerance';

export default class BiPspTemperaturesymtom extends NavigationMixin(LightningElement) {
    @track boxedIcon = label.BOXED_ICON;
    @track humanParts = '';
    @track slider = 0;
    @track formatedTextVal;
    @track showMessage = false;
    @track temperatureValues = label.TEMPERATURE_VALUES;
    @track localStorageValueItchiness;
    @track insertCount;
    @track sliderValue = 0;
    @track moodValues = '';
    @track submitModal = false;
    @track allergyIntoleranceData;
    @track carePlanTemplateName;
    @track tempValuesFill = true;
    errorMessage;
    recordInsertCount = 0;
    lastSymptomId;
    accountId;
    userId = label.ID;
    valOfTemp = 37.5;

    currentBodyTemperature = label.CURRENT_BODY_TEMPERATURE;
    provideTemperature = label.MORE_ABOUT_TEMPERATURE;
    confirmAndSave = label.CONFIRM_SAVE;
    feverTemperature = label.FEVER_TEMPERATURE;


    @wire(GET_ALLERGY_INTOLERANCE_DATA, { symptomTrackerId: '$lastSymptomId' })
    wiredAllergyIntoleranceData({ error, data }) {
        if (data && data !== null) {
            try {
                data.forEach(record => {
                    let carePlanTempla = record?.BI_PSP_Symptoms__r?.HealthCloudGA__CarePlanTemplate__r?.Name;
                    if (carePlanTempla === label.TEMPERATURE_VALUES) {
                        this.carePlanTemplateName = carePlanTempla;
                    }
                    if (record && record.BI_PSP_Temperature__c) {
                        this.valOfTemp = record.BI_PSP_Temperature__c;
                        if (this.valOfTemp > 41.6) {
                            this.showMessage = true;
                        }
                    }
                });
            } catch (err) {
                this.showToast(label.ERROR_MESSAGE, err.message, label.ERROR_VARIANT);
            }
        } else if (error) {
            this.showToast(label.ERROR_MESSAGE, error.body.message, label.ERROR_VARIANT);
        }
    }

    connectedCallback() {
        let globalThis = window;
        try {
            this.insertCount = globalThis?.sessionStorage.getItem('counttemp');
            this.lastSymptomId = globalThis?.localStorage.getItem('symptomlastid');
            let temprtevalues = globalThis?.sessionStorage.getItem('temprature');
            Promise.resolve().then(() => {
                try {
                    if (temprtevalues) {
                        this.valOfTemp = temprtevalues;
                    }
                    if (this.valOfTemp > 38) {
                        this.showMessage = true;
                    }
                } catch (error) {
                    this.showToast(label.ERROR_MESSAGE, error.message, label.ERROR_VARIANT);
                }
            });
            GET_ENROLLEE({ userId: this.userId })
                .then(result => {
                    if (result !== null) {
                        if (result[0].patientEnrolle !== null) {
                            this.accountId = result[0].patientEnrolle.Id;
                        } else if (result[0].error !== null) {
                            this.showError = true;
                            this.ERROR_MESSAGE = result[0].error;
                        }
                    }
                })
                .catch(error => {
                    this.showToast(label.ERROR_MESSAGE, error.message, label.ERROR_VARIANT);
                });
            this.localStorageValueItchiness = globalThis?.localStorage.getItem('Time', this.resultId);
            this.currntmooderror = true;
        } catch (err) {
            this.showToast(label.ERROR_MESSAGE, err.message, label.ERROR_VARIANT);
        }
    }

    decimalPattern = /^\d+(\.\d{0,2})?$/u;
    onchangeOfTempa(event) {
        let input = event.target;
        if (input.value > 41.6) {
            input.value = 41.6;
        }
        this.valOfTemp = event.target.value;
        if (!this.valOfTemp.match(/^\d+(\.\d{0,2})?$/u)) {
            this.valOfTemp = parseFloat(this.valOfTemp).toFixed(2);
        }
        let valoFValue = parseFloat(this.valOfTemp);
        if (isNaN(valoFValue) || valoFValue < 33.8 || valoFValue > 41.6) {
            this.tempvaluesfill = true;
        } else {
            this.tempvaluesfill = false;
        }
        if (this.valOfTemp > 38) {
            this.showMessage = true;
            this.showButton = true;
        } else {
            this.showMessage = false;
            this.showButton = false;
        }
    }

    onchangeAccept() {
        let record = {
            SliderValue: parseFloat(this.sliderValue),
            CareprogramId: this.accountId,
            ValoF: parseFloat(this.valOfTemp) || 0,
            SymptomId: this.lastSymptomId || this.localStorageValueItchiness,
            Symptomname: this.temperatureValues || '',
            Moodvalues: this.moodValues || '',
        };
        this.bodyparts = this.humanParts;

        try {
            if (this.insertCount === '1' || (this.lastSymptomId && this.carePlanTemplateName === label.TEMPERATURE_VALUES)) {
                this.handleRecordUpdate(RECORD_UPDATE_ALLERGY_INTOLERANCE, record);
            } else {
                this.handleRecordInsert(RECORD_INSERT_ALLERGY_INTOLERANCE, record);
            }
        } catch (err) {
            this.showToast(label.ERROR_MESSAGE, err.message, label.ERROR_VARIANT);
        }
    }

    handleRecordUpdate(apexMethod, record) {
        let globalThis = window;
        try {
            let result =  apexMethod({ itchinessallrecordupdate: record, bodyParts: this.humanParts });
            if (result && result !== null) {
                globalThis?.sessionStorage.setItem('temprature', this.valOfTemp);
                globalThis?.sessionStorage.setItem('syptombtn', false);
                this.dispatchCustomEvent('updatechildprop', false);
            }
        } catch (error) {
            this.showToast(label.ERROR_MESSAGE, error.message, label.ERROR_VARIANT);
        }
    }

    handleRecordInsert(apexMethod, record) {
        let globalThis = window;
        try {
            let result =  apexMethod({ itchinessallrecordinsert: record, bodyParts: this.humanParts });
            if (result && result !== null) {
                this.dispatchCustomEvent('updatechildprop', false);
                this.dispatchCustomEvent('addtask', label.TEMPERATURE_VALUES);
                this.recordInsertCount++;
                globalThis?.sessionStorage.setItem('counttemp', this.recordInsertCount);
                globalThis?.sessionStorage.setItem('syptombtn', false);
                globalThis?.sessionStorage.setItem('temprature', this.valOfTemp);
            }
        } catch (error) {
            this.showToast(label.ERROR_MESSAGE, error.message, label.ERROR_VARIANT);
            	let global = window;
    global.location?.assign(this.urlq + ERROR_PAGE);
    global.sessionStorage.setItem('errorMessage', errorMessage);
        }
    }

    dispatchCustomEvent(eventName, detail) {
        if (typeof window !== 'undefined') {
            const event = new CustomEvent(eventName, { detail });
            this.dispatchEvent(event);
        }
    }

    opensubmitModal() {
        this.submitModal = true;
    }

    closesubmitModal() {
        this.submitModal = false;
    }

    showToast(title, message, variant) {
        if (typeof window !== 'undefined') {
            const event = new ShowToastEvent({ title, message, variant });
            this.dispatchEvent(event);
        }
    }
}