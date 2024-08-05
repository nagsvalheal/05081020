import { LightningElement, api, wire } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import GET_ENROLLEE from '@salesforce/apex/BI_PSP_ChallengeEnrolleCtrl.getEnrolle';
import GET_ALLERGY_INTOLERANCE_DATA from '@salesforce/apex/BI_PSPB_SymptomPrimaryPageCtrl.getAllergyIntoleranceData';
import RECORD_INSERT_ALLERGY_INTOLERANCE from '@salesforce/apex/BI_PSP_SymptomTrackerCtrl.recordInsertAllergyIntolerance';
import RECORD_UPDATE_ALLERGY_INTOLERANCE from '@salesforce/apex/BI_PSP_SymptomTrackerCtrl.recordUpdateAllergyIntolerance';
import * as label from 'c/biPspbLabelAndResourceSymptom';

export default class biPspbpustulessymptom extends NavigationMixin(LightningElement) {
    //Proper naming conventions with camel case for all the variable will be followed in the future releases
    // Define a variable to track the number of record insertions
    @api resultId
    //variable declaration
    valueOfTemperature = ''
    buttonText = label.BODY_PARTS_SELECT_ALL;
    clickCount = 0;
    totalElements = 0;
    sliderValue = 0;
    sliderValueTwo = label.ZERO_VALUE;
    isCheckedSelectAll = false;
    humanParts = []
    pustulesValue = label.PUSTULES_VALUE
    itchinessErrors = false;
    lastSymptomId
    localStorageValueItchiness;
    insertCount
    fatiqueErrors = true;
    moodValues = '';
    clickedElement;
    allergyIntoleranceData;
    itchBody;
    intensity;
    carePlanTemplateName;
    isButtonDisabled = false;
    //Variable declaration
    accountId;
    recordInsertCount = 0;
    userId = label.ID;
    pustulesInfo = label.PUSTULES_INFO;
    selectIntensity = label.SELECT_INTENSITY;
    intensityLabel = label.INTENSITY_LABEL;
    confirmAndSave = label.CONFIRM_SAVE;
    intensityValidation = label.INTENSITY_WARNING; 
    selectedLabel = label.SELECTED_LABEL;
    frontHead = label.FRONT_HEAD;
    torsoLabel =label.TORSO_LABEL;
    frontRightArm =label.RIGHT_ARM;
    frontLeftArm = label.LEFT_ARM;
    frontLeftForearm =label.LEFT_FOREARM;
    frontRightForearm = label.RIGHT_FOREARM;
    frontRightHand =label.FRONT_RIGHT_HAND;
    frontLeftHand =label.FRONT_LEFT_HAND;
    frontWaist =label.WAIST_FRONT;
    frontRightThigh =label.FRONT_RIGHT_THIGH;
    frontLeftThigh =label.FRONT_LEFT_THIGH;
    frontRightLeg =label.FRONT_RIGHT_LEG;
    frontLeftLeg =label.FRONT_LEFT_LEG;
    frontRightFoot =label.FRONT_RIGHT_FOOT;
    frontLeftFoot =label.FRONT_LEFT_FOOT;
    backHead = label.BACK_HEAD;
    backLabel =label.BACK;
    backRightArm =label.BACK_RIGHT_ARM;
    backLeftArm = label.BACK_LEFT_ARM;
    backLeftForearm =label.BACK_LEFT_FOREARM;
    backRightForearm = label.BACK_RIGHT_FOREARM;
    backRightHand =label.BACK_RIGHT_HAND;
    backLeftHand =label.BACK_LEFT_HAND;
    backWaist =label.BACK_WAIST;
    backRightThigh =label.BACK_RIGHT_THIGH;
    backLeftThigh =label.BACK_LEFT_THIGH;
    backRightLeg =label.BACK_RIGHT_LEG;
    backLeftLeg =label.BACK_LEFT_LEG;
    backRightFoot =label.BACK_RIGHT_FOOT;
    backLeftFoot =label.BACK_LEFT_FOOT;

    @wire(GET_ALLERGY_INTOLERANCE_DATA, { symptomTrackerId: '$lastSymptomId' })
    handleAllergyIntoleranceData({ error, data }) {
        if (data) {
            this.processAllergyIntoleranceData(data);
        } else if (error) {
            this.showToast(label.ERROR_MESSAGE, error.body.message, label.ERROR_VARIANT);
        }
    }

    connectedCallback() {
        try {
            this.initializeSessionData();
            this.fetchEnrolleeData();
            this.updateThumbLabelPosition(this.sliderValue);
            this.updateElementCount();
        } catch (error) {
            this.showToast(label.ERROR_MESSAGE, error.message, label.ERROR_VARIANT);
        }
    }

    initializeSessionData() {
        const globalThis = window;
        const myBodyParts = globalThis?.sessionStorage.getItem('Pustule');
        this.insertCount = globalThis?.sessionStorage.getItem('countpush');
        const myBodyIntensity = globalThis?.sessionStorage.getItem('myDataintensityPustules');

        if (myBodyParts && myBodyIntensity) {
            this.updateBodyParts(myBodyParts.split(','), myBodyIntensity);
        }

        this.lastSymptomId = globalThis?.localStorage.getItem('symptomlastid');
        this.localStorageValueItchiness = globalThis?.localStorage.getItem('Time', this.resultId);
    }

    fetchEnrolleeData() {
        GET_ENROLLEE({ userId: this.userId })
            .then(result => {
                if (result?.[0]?.patientEnrolle) {
                    this.accountId = result[0].patientEnrolle.Id;
                } else if (result?.[0]?.error) {
                    this.showToast(label.ERROR_MESSAGE, result[0].error, label.ERROR_VARIANT);
                }
            })
            .catch(error => this.showToast(label.ERROR_MESSAGE, error.message, label.ERROR_VARIANT));
    }

    processAllergyIntoleranceData(data) {
        try {
            const pustulesValueValueNormalized = this.pustulesValue.trim().toLowerCase();

            data.forEach(record => {
                this.itchBody = record.BI_PSP_Bodyparts__c;
                this.intensity = record.BI_PSP_Intensity__c;

                let carePlanTemplateName = record?.BI_PSP_Symptoms__r?.HealthCloudGA__CarePlanTemplate__r?.Name || '';
                this.carePlanTemplateName = carePlanTemplateName.trim().toLowerCase();
                if (this.carePlanTemplateName === pustulesValueValueNormalized) {

                    this.sliderValue = this.intensity;
                    this.sliderValueTwo = this.intensity;
                    this.updateBodyParts(this.itchBody.split(';'), this.intensity);
                }
            });
        } catch (err) {
            this.showToast(label.ERROR_MESSAGE, err.message, label.ERROR_VARIANT);
        }
    }

    updateBodyParts(bodyPartsArr, intensity) {
        Promise.resolve().then(() => {
            bodyPartsArr.forEach(i => {
                const element = this.template.querySelector(`[data-name="${i}"]`);
                if (element) {
                    element.style.fill = '#8D89A5';
                }
            });

            this.humanParts = [...bodyPartsArr];
            this.totalElements = bodyPartsArr.length;
            this.sliderValue = intensity;
            this.sliderValueTwo = intensity;
            this.itchinessErrors = this.totalElements <= 0;
            this.isCheckedSelectAll = this.totalElements === 30;
            this.buttonText = this.isCheckedSelectAll ? label.BODY_PARTS_REMOVE : label.BODY_PARTS_SELECT_ALL;
        });
    }

    updateElementCount() {
        const elements = this.template.querySelectorAll('.body-part');
        this.totalElements = elements.length;
        this.humanParts = Array.from(elements).map(ele => ele.getAttribute('data-name'));

        elements.forEach(element => {
            if (element.style.fill === label.BLACK_VALUE && this.buttonText === label.BODY_PARTS_SELECT_ALL) {
                element.style.fill = '';
            } else if (this.buttonText === label.BODY_PARTS_REMOVE && element.style.fill === label.BLACK_VALUE) {
                element.style.fill = label.BLACK_VALUE;
            }
        });

        this.isButtonDisabled = this.totalElements < 1 || this.sliderValue <= 0;
    }

    changeColor(event) {
        const targetElements = this.template.querySelectorAll('.body-part');
        const isChecked = event.target.checked;

        if (isChecked) {
            this.selectAllBodyParts(targetElements);
        } else {
            this.deselectAllBodyParts(targetElements);
        }
    }

    selectAllBodyParts(targetElements) {
        this.humanParts = [];
        this.isCheckedSelectAll = true;
        this.totalElements = 30;
        this.itchinessErrors = false;
        this.isButtonDisabled = this.sliderValue === 0;
        this.buttonText = label.BODY_PARTS_REMOVE;

        targetElements.forEach(element => {
            element.style.fill = '#8D89A5';
            this.humanParts.push(element.getAttribute('data-name'));
        });
    }

    deselectAllBodyParts(targetElements) {
        this.totalElements = 0;
        this.isCheckedSelectAll = false;
        this.isButtonDisabled = true;
        this.buttonText = label.BODY_PARTS_SELECT_ALL;

        targetElements.forEach(element => {
            element.style.fill = '';
            this.humanParts = this.humanParts.filter(item => item !== element.getAttribute('data-name'));
        });
    }

    handleclick(event) {
        this.clickedElement = event.currentTarget;
        const selectedValue = this.clickedElement.getAttribute('data-name');
        const currentColor = this.clickedElement.style.fill;

        if (currentColor === 'rgb(141, 137, 165)') {
            this.clickedElement.style.fill = '';
            this.humanParts = this.humanParts.filter(item => item !== selectedValue);
            this.totalElements--;
        } else {
            this.clickedElement.style.fill = '#8D89A5';
            this.humanParts.push(selectedValue);
            this.totalElements++;
        }

        this.updateButtonState();
    }

    updateButtonState() {
        this.isCheckedSelectAll = this.totalElements === 30;
        this.buttonText = this.isCheckedSelectAll ? label.BODY_PARTS_REMOVE : label.BODY_PARTS_SELECT_ALL;
        this.itchinessErrors = this.totalElements <= 0;
        this.isButtonDisabled = this.sliderValue === 0 || this.totalElements === 0;
    }

    handleAccept() {
        this.isButtonDisabled = this.template.querySelectorAll('.body-part[style*="fill: rgb(141, 137, 165)"]').length === 0;
    }

    handleEmojiClick(event) {
        this.sliderValue = event.target.value;
        this.sliderValueTwo = (label.ZERO_VALUE + this.sliderValue).slice(-2);
        this.updateThumbLabelPosition(this.sliderValue);
    }

    handleClickForAccept() {
        const globalThis = window;

        const commonPayload = {
            sliderValue: parseFloat(this.sliderValue) || 0,
            careProgramId: this.accountId,
            floatValueOfTemperature: parseFloat(this.valueOfTemperature) || 0,
            symptomName: this.pustulesValue || '',
            valuesOfMood: this.moodValues || '',
            bodyParts: this.humanParts
        };

        const insertPayload = { ...commonPayload, symptomId: this.localStorageValueItchiness || this.lastSymptomId };
        const updatePayload = { ...commonPayload, symptomId: this.lastSymptomId || this.localStorageValueItchiness };

        if (this.humanParts.length > 0 && parseInt(this.sliderValue, 10) > 0) {
            let recordOperation;

            if (this.insertCount === '1' || this.carePlanTemplateName === 'pustules') {

                recordOperation = RECORD_UPDATE_ALLERGY_INTOLERANCE({
                    itchinessallrecordupdate: updatePayload,
                    bodyParts: this.humanParts
                });
            } else {

                recordOperation = RECORD_INSERT_ALLERGY_INTOLERANCE({
                    itchinessallrecordinsert: insertPayload,
                    bodyParts: this.humanParts
                });
            }

            // Execute the record operation
            recordOperation
                .then(result => {
                    if (result) {
                        globalThis?.sessionStorage.setItem('Pustule', JSON.stringify(this.humanParts));
                        globalThis?.sessionStorage.setItem('myDataintensityPustules', this.sliderValue);
                        globalThis?.sessionStorage.setItem('syptombtn', 'false');
                        if (typeof window !== 'undefined') {
                            const updateEvent = new CustomEvent('updatechildprop', { detail: false });
                            this.dispatchEvent(updateEvent);
                        }

                        if (this.insertCount !== '1') {
                            if (typeof window !== 'undefined') {
                                const addTaskEvent = new CustomEvent('addtask', { detail: label.PUSTULES_VALUE });
                                this.dispatchEvent(addTaskEvent);
                            }
                            this.recordInsertCount++;
                            globalThis?.sessionStorage.setItem('countpush', this.recordInsertCount.toString());
                        }
                    }
                })
                .catch(error => {
                    this.showToast(label.ERROR_MESSAGE, error.message, label.ERROR_VARIANT);
                    	let global = window;
    global.location?.assign(this.urlq + ERROR_PAGE);
    global.sessionStorage.setItem('errorMessage', errorMessage);
                });
        } else {
            this.itchinessErrors = true;
        }
    }


    handleSuccess() {
        this.showToast(label.SUCCESS_MESSAGE, label.SUCCESS_DESCRIPTION, label.SUCCESS_VARIANT);
        const globalThis = window;
        globalThis.sessionStorage.removeItem('Pustule');
        globalThis.localStorage.removeItem('symptomlastid');

    }



    updateThumbLabelPosition(value) {
        const thumbLabel = this.template.querySelector('.slds-slider__label');
        if (thumbLabel) {
            thumbLabel.textContent = value;
        }
    }
    showToast(title, message, variant) {
        if (typeof window !== 'undefined') {
            const event = new ShowToastEvent({
                title: title,
                message: message,
                variant: variant
            });
            this.dispatchEvent(event);
        }
    }
}