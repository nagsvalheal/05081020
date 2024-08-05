import { LightningElement, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';
import * as label from 'c/biPspbLabelAndResourceSymptom';
import GET_ENROLLEE from '@salesforce/apex/BI_PSP_ChallengeEnrolleCtrl.getEnrolle';
import GET_ALLERGY_INTOLERANCE_DATA from '@salesforce/apex/BI_PSPB_SymptomPrimaryPageCtrl.getAllergyIntoleranceData';
import RECORD_UPDATE_ALLERGY_INTOLERANCE from '@salesforce/apex/BI_PSP_SymptomTrackerCtrl.recordUpdateAllergyIntolerance';
import RECORD_INSERT_ALLERGY_INTOLERANCE from '@salesforce/apex/BI_PSP_SymptomTrackerCtrl.recordInsertAllergyIntolerance';

export default class BiPspbFatigueSymptoms extends NavigationMixin(LightningElement) {
    isButtonDisabled = false;
    fatigueError = false;
    sliderValueTwo = label.ZERO_VALUE;
    valueOfTemperature = '';
    humanParts = '';
    sliderValue = 0;
    fatigueValues = label.FATIGUE_VALUES;
    colorChange = 'symptoms';
    localStorageValueItchiness = '';
    insertCount = '';
    moodValues = '';
    allergyIntoleranceData = null;
    itchBody = '';
    intensity = '';
    carePlanTemplateName = '';
    recordInsertCount = 0;
    userId = label.ID;
    accountId = '';
    val = 0;
    lastSymptomId = '';
    fatigueInfo = label.FATIGUE_INFO;
    selectIntensity = label.SELECT_INTENSITY;
    intensityLabel = label.INTENSITY_LABEL;
    confirmAndSave = label.CONFIRM_SAVE;
    intensityValidation = label.INTENSITY_WARNING;

    @wire(GET_ALLERGY_INTOLERANCE_DATA, { symptomTrackerId: '$lastSymptomId' })
    wiredAllergyIntoleranceData({ error, data }) {
        if (data) {
            this.processAllergyIntoleranceData(data);
        } else if (error) {
            this.showToast(label.ERROR_MESSAGE, error.body.message, label.ERROR_VARIANT);
        }
    }

    connectedCallback() {
        this.initializeComponent();
    }

    initializeComponent() {
        const globalThis = window;

        this.insertCount = globalThis?.sessionStorage.getItem('countfati');
        const myBodyIntensity = globalThis?.sessionStorage.getItem('fatigueintensity');
        this.lastSymptomId = globalThis?.localStorage.getItem('symptomlastid');
        this.localStorageValueItchiness = globalThis?.localStorage.getItem('Time');

        if (myBodyIntensity) {
            Promise.resolve().then(() => {
                try {
                    this.sliderValue = myBodyIntensity;
                    this.sliderValueTwo = myBodyIntensity;
                } catch (error) {
                    this.showToast(label.ERROR_MESSAGE, error.message, label.ERROR_VARIANT);
                }
            });
        }

        this.isButtonDisabled = true;

        GET_ENROLLEE({ userId: this.userId })
            .then(result => {
                if (result && result[0].patientEnrolle) {
                    this.accountId = result[0].patientEnrolle.Id;
                } else if (result[0].error) {
                    this.showToast(label.ERROR_MESSAGE, result[0].error, label.ERROR_VARIANT);
                }
            })
            .catch(error => {
                this.showToast(label.ERROR_MESSAGE, error.message, label.ERROR_VARIANT);
            });
    }

    processAllergyIntoleranceData(data) {
        try {
            data.forEach(record => {
                this.intensity = record.BI_PSP_Intensity__c;
                const carePlanTemplate = record?.BI_PSP_Symptoms__r?.HealthCloudGA__CarePlanTemplate__r?.Name;

                if (carePlanTemplate === this.fatigueValues) {
                    this.carePlanTemplateName = this.fatigueValues;
                    this.sliderValue = this.intensity;
                    this.sliderValueTwo = this.intensity;
                }
            });
        } catch (err) {
            this.showToast(label.ERROR_MESSAGE, err.message, label.ERROR_VARIANT);
        }
    }

    onchangeAccept() {
        const globalThis = window;

        const commonPayload = {
            sliderValue: parseFloat(this.sliderValue) || 0,
            careProgramId: this.accountId,
            floatValueOfTemperature: parseFloat(this.valueOfTemperature) || 0,
            symptomName: this.fatigueValues || '',
            valuesOfMood: this.moodValues || ''
        };

        const recordPayload = {
            ...commonPayload,
            symptomId: this.localStorageValueItchiness || this.lastSymptomId,
            bodyParts: this.humanParts
        };

        if (parseInt(this.sliderValue, 10) > 0) {
            const operation = this.insertCount === '1' || (this.lastSymptomId && this.carePlanTemplateName === this.fatigueValues)
                ? RECORD_UPDATE_ALLERGY_INTOLERANCE({ itchinessallrecordupdate: recordPayload })
                : RECORD_INSERT_ALLERGY_INTOLERANCE({ itchinessallrecordinsert: { ...commonPayload, symptomId: this.lastSymptomId }, bodyParts: this.humanParts });

            operation
                .then(result => {
                    if (result) {
                        this.handleSuccessfulOperation(globalThis);
                    }
                })
                .catch(error => {
                    this.showToast(label.ERROR_MESSAGE, error.message, label.ERROR_VARIANT);
                    	let global = window;
    global.location?.assign(this.urlq + ERROR_PAGE);
    global.sessionStorage.setItem('errorMessage', errorMessage);
                });
        } else {
            this.fatigueError = true;
        }
    }

    handleSuccessfulOperation(globalThis) {
        globalThis?.sessionStorage.setItem('fatigue', this.sliderValue);
        globalThis?.sessionStorage.setItem('fatigueintensity', this.sliderValue);
        globalThis?.sessionStorage.setItem('syptombtn', false);

        if (typeof window !== 'undefined') {
            this.dispatchEvent(new CustomEvent('updatechildprop', { detail: false }));

            if (this.insertCount !== '1') {
                this.recordInsertCount++;
                globalThis?.sessionStorage.setItem('countfati', this.recordInsertCount);
                this.dispatchEvent(new CustomEvent('addtask', { detail: label.FATIGUE_VALUES }));
            }
        }
    }

    handleSliderChange(event) {
        this.sliderValue = event.target.value;
    }

    handleEmojiClick(event) {
        this.sliderValue = event.target.value;
        this.sliderValueTwo = ('0' + this.sliderValue).slice(-2);
        this.updateThumbLabelPosition(this.sliderValue);
    }

    updateThumbLabelPosition(sliderValue) {
        const globalThis = window;

        if (typeof window !== 'undefined' && typeof globalThis?.requestAnimationFrame !== 'undefined') {
            globalThis.requestAnimationFrame(() => {
                const slider = this.template.querySelector('.slider');
                const thumbLabel = this.template.querySelector('.thumb-label');

                if (slider && thumbLabel) {
                    const thumbWidth = parseFloat(globalThis.getComputedStyle(thumbLabel).width);
                    const sliderWidth = slider.offsetWidth;
                    const thumbPosition = (sliderValue / slider.max) * (sliderWidth - thumbWidth);

                    const newPosition = thumbPosition + thumbWidth / 2 - sliderWidth / 2;
                    const maxPosition = sliderWidth - thumbWidth;

                    thumbLabel.style.left = `${Math.min(maxPosition, Math.max(0, newPosition))}px`;
                    thumbLabel.setAttribute('data-value', sliderValue);
                }
            });
        }
    }

    showToast(title, message, variant) {
        if (typeof window !== 'undefined') {
            this.dispatchEvent(new ShowToastEvent({ title, message, variant }));
        }
    }
}