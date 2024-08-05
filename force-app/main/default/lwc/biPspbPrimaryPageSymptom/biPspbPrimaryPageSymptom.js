//This components using user body parts and intencity itchiness values store this lwc
// To import Libraries
import { LightningElement, wire, api } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
// To import Apex Classes
import { refreshApex } from '@salesforce/apex';
import GET_LATEST_SYMPTOM_RECORD from '@salesforce/apex/BI_PSPB_SymptomPrimaryPageCtrl.getLatestSymptomRecord';
import DELETE_SYMPTOM_TRACKER_RECORDS from '@salesforce/apex/BI_PSPB_SymptomPrimaryPageCtrl.deleteSymptomTrackerRecords'
import GET_ALLERGY_INTOLERANCE_DATA from '@salesforce/apex/BI_PSPB_SymptomPrimaryPageCtrl.getAllergyIntoleranceData';
import GET_SYMPTOM_RECORD_DATA from '@salesforce/apex/BI_PSPB_SymptomPrimaryPageCtrl.getSymptomRecordData';
import GET_CASE_IMAGE_URL from '@salesforce/apex/BI_PSPB_SymptomPrimaryPageCtrl.getBase64Image';
import GET_ENROLLEE from '@salesforce/apex/BI_PSP_ChallengeEnrolleCtrl.getEnrolle';
// To import Custom labels and static resources
import * as label from 'c/biPspbLabelAndResourceSymptom';
export default class biPspbPrimaryPageSymptom extends NavigationMixin(LightningElement) {
    //@api variable declaration
    @api symptomrecord;
    @api isedit;
    @api recordId;
    @api showeditbtn;
    //variable declaration
    symptomData;
    moodReaction = ''
    symptomGpp;
    valueSymptom;
    isEditOne;
    symptomidgetid
    imageUrls = [];
    symptomRecordData;
    deleteButton = false;
    lastEdit = false;
    edit = false;
    //Variable declaration
    allergyIntoleranceData;
    latestRecord;
    accountId;
    itchnessImg = label.ITCHINESS;
    rednessImg = label.REDNESS;
    painImg = label.PAIN;
    pustulesImg = label.PUSTULES;
    fatigueImg = label.FATIGUE;
    temperatureImg = label.TEMPERATURE;
    happyImg = label.HAPPY;
    vectorImg = label.VECTOR;
    userId = label.ID;
    calenderImg = label.CALENDER;
    sadImage = label.REPLACE_SAD;
    speechless = label.REPLACE_SPEECHLESS;
    worried = label.REPLACE_WORRIED;
    happy = label.REPLACE_HAPPY;
    joyfull = label.REPLACE_JOYFUL;
    showeditbtnShow;
    currentDate;

    errorAllergyData = label.ERROR_ALLERGY_DATA;
    dateLabel = label.DATE_LABEL;
    gppSymptomLabel = label.GPP_SYMPTOM;
    symptomsLabel = label.SYMPTOMS_LABEL;
    triggersLabel = label.TRIGGER_LABEL;
    noRecordsToDisplay = label.NO_RECORDS_DISPLAY;
    photoLabel = label.PHOTOS_LABEL;
    mistakeModifyOrDelete = label.MISTAKE_MODIFY;
    editLabel = label.EDIT_LABEL;
    deleteLabel =  label.DELETE_LABEL;
    modifySelfSymptom = label.MODIFY_SELF_SYMPTOM;
    finaliseCurrentEntry = label.FINALISE_CURRENT_ENTRY;
    editLastEntry = label.EDIT_LAST_ENTRY;
    sureEditEntry = label.SURE_EDIT_ENTRY;
    sureDeleteEntry = label.SURE_DELETE_ENTRY;
    confirmAndSave = label.CONFIRM_SAVE;
    unableToEdit = label.UNABLE_TO_EDIT;
    onlyLastEntryEdited = label.ONLY_LAST_ENTRY_EDIT;
    okLabel = label.OK_LABEL;
    yesLabel =label.BI_PSP_OptionValueYes;
    noLabel = label.BI_PSP_OptionValueNo;

    // Process retrieved allergy intolerance data, updating UI and properties, particularly for fatigue symptoms detection.
    @wire(GET_ALLERGY_INTOLERANCE_DATA, {
        symptomTrackerId: '$symptomrecord'
    })
    wiredAllergyIntoleranceData({
        error,
        data
    }) {
        if (data && data !== null) {
            this.processAllergyIntoleranceData(data);
        } else if (error) {
            this.showToast(label.ERROR_MESSAGE, error.body.message, label.ERROR_VARIANT);
        }
    }
    @wire(GET_SYMPTOM_RECORD_DATA, {
        symptomTrackerId: '$symptomrecord'
    })
    wiredgetsymptomrecorddata({
        error,
        data
    }) {
        if (data && data !== null) {
            this.processSymptomRecordData(data);
        } else if (error) {
            this.showToast(label.ERROR_MESSAGE, error.body.message, label.ERROR_VARIANT);
        }
    }
    //To fetch the latest symptom recordId
    @wire(GET_LATEST_SYMPTOM_RECORD, {
        careProgramEnrolleeId: '$accountId'
    })
    wiredLatestRecord({
        error,
        data
    }) {
        if (data && data !== null) {
            this.latestRecord = data[0];
            this.errorMessage = ''; // Clear any previous error
        } else if (error) {
            this.latestRecord = null;
            this.showToast(label.ERROR_MESSAGE, error.body.message, label.ERROR_VARIANT);
        }
    }
    // Used to fetch image URL
    @wire(GET_CASE_IMAGE_URL, {
        symptomTrackerId: '$symptomrecord'
    })
    caseImageURL;
    get hasImage() {
        try {
            this.imageUrls = [];
            if (this.caseImageURL && this.caseImageURL.data) {
                this.imageUrls = this.caseImageURL.data.map(obj => {
                    const base64Data = obj.split('data:')[1];
                    return base64Data ? 'data:' + base64Data : '';
                });
            }
        } catch (error) {
            // Handle the error here
            this.showToast(label.ERROR_MESSAGE, error.message, label.ERROR_VARIANT);
        }
        return this.imageUrls.length > 0;
    }
    //It initializes component tasks, including edit button visibility, user data retrieval, URL parsing, setting URLs
    connectedCallback() {
        this.initializeComponent();
    }
    initializeComponent() {
        if (this.showeditbtn === false) {
            this.showeditbtnShow = false;
        } else {
            this.showeditbtnShow = true;
        }
        try {
            GET_ENROLLEE({
                    userId: this.userId
                })
                .then(result => {
                    if (result?.[0]?.patientEnrolle) {
                        this.accountId = result[0].patientEnrolle.Id;
                    } else if (result?.[0]?.error) {
                        this.errorMessage = result[0].error;
                    }
                })
                .catch(error => {
                    // Handle any errors occurring during the promise chain
                    this.showToast(label.ERROR_MESSAGE, error.message, label.ERROR_VARIANT);
                });
            this.setURLParameters();
            this.symptomidgetid = this.symptomrecord;
            this.currentDate = new Date().toISOString().slice(0, 10);
            this.isEditOne = !this.isedit;
        } catch (error) {
            this.showToast(label.ERROR_MESSAGE, error.message, label.ERROR_VARIANT);
        }
    }
    setURLParameters() {
        try {
            let globalThis = window;
            const currentURL = globalThis.location?.href;
            // Create a URL object
            const urlObject = new URL(currentURL);
            // Get the path
            const path = urlObject.pathname;
            // Split the path using '/' as a separator
            const pathComponents = path.split('/');
            // Find the component you need (in this case, 'Branded')
            const desiredComponent = pathComponents.find(component => [label.BRANDED_URL.toLowerCase(), label.UNASSIGNED_URL.toLowerCase()].includes(component.toLowerCase()));
            if (desiredComponent.toLowerCase() === label.BRANDED_URL.toLowerCase()) {
                this.urlq = label.BRANDED_URL_NAVIGATION;
            } else {
                this.urlq = label.UNASSIGNED_URL_NAVIGATION;
            }
        } catch (error) {
            this.showToast(label.ERROR_MESSAGE, error.message, label.ERROR_VARIANT);
        }
    }
    // Manually refresh the wire adapter
    refreshWireAdapter() {
        return refreshApex(this.wiredAllergyIntoleranceData);
    }
    processAllergyIntoleranceData(data) {
        try {
            this.allergyIntoleranceData = data.map(obj =>
                ({
                    ...obj,
                    itchness: obj?.BI_PSP_Symptoms__r?.HealthCloudGA__CarePlanTemplate__r?.Name === label.ITCHINESS_VALUES,
                    redness: obj?.BI_PSP_Symptoms__r?.HealthCloudGA__CarePlanTemplate__r?.Name === label.REDNESS_VALUE,
                    pain: obj?.BI_PSP_Symptoms__r?.HealthCloudGA__CarePlanTemplate__r?.Name === label.PAIN_VALUES,
                    fatigue: obj?.BI_PSP_Symptoms__r?.HealthCloudGA__CarePlanTemplate__r?.Name === label.FATIGUE_VALUES,
                    pustules: obj?.BI_PSP_Symptoms__r?.HealthCloudGA__CarePlanTemplate__r?.Name === label.PUSTULES_VALUE,
                    temperature: obj?.BI_PSP_Symptoms__r?.HealthCloudGA__CarePlanTemplate__r?.Name === label.TEMPERATURE_VALUES,
                    moods: obj?.BI_PSP_Symptoms__r?.HealthCloudGA__CarePlanTemplate__r?.Name === label.MOOD_VALUES,
                    sadImage: obj?.BI_PSP_Mood__c === label.SAD_MOOD,
                    speechless: obj?.BI_PSP_Mood__c === label.SPEECHLESS_MOOD,
                    worried: obj?.BI_PSP_Mood__c === label.WORRIED_MOOD,
                    joyfull: obj?.BI_PSP_Mood__c === label.JOYFULL_MOOD,
                    happy: obj?.BI_PSP_Mood__c === label.HAPPY_MOOD
                }));
        } catch (err) {
            this.showToast(label.ERROR_MESSAGE, err.message, label.ERROR_VARIANT);
        }
    }
    processSymptomRecordData(data) {
        try {
            this.symptomData = data[0].BI_PSP_EditEntrydates__c;
            this.symptomGpp = data[0].BI_PSP_Are_you_currently_experiencing__c;
            this.valueSymptom = this.symptomGpp ? label.YES : label.NO;
            this.symptomRecordData = data[0].BI_PSP_Recent_Activities__c
                ?.split(';')
                .map(item => item.trim())
                .filter(item => item !== '');
        } catch (err) {
            this.showToast(label.ERROR_MESSAGE, err.message, label.ERROR_VARIANT);
        }
    }
    //function asynchronously reads a Blob object as a data URL and returns a Promise resolving with the data URL.
    readAsDataURL(blob) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                const base64String = event.target.result;
                resolve(`data:image/${blob.type.split('/')[1]};base64,${base64String}`);
            };
            reader.onerror = (error) => {
                reject(error);
            };
            reader.readAsDataURL(blob);
        });
    }
    //To delete the entry or modify data
    handleDeleteClick() {
        this.openDeleteModal();
    }
    //This function deletes symptom tracker records and it disables a delete button.
    deleteSymptomTrackerRecord() {
        let globalThis = window;
        DELETE_SYMPTOM_TRACKER_RECORDS({
            symptomTrackerId: this.symptomrecord
        })
        globalThis.location.reload()
            .then(result => {
                if (result) {
                    //Handle success
                    globalThis.location.reload();
                }
            })
            .catch(error => {
                // Handle error
                this.showToast(label.ERROR_MESSAGE, error.message, label.ERROR_VARIANT);
            });
        this.deleteButton = false;
    }
    // Open delete button and prevent scrolling on the body.
    openDeleteModal() {
        // Add your specific logic for opening the mood modal
        this.deleteButton = true;
        document.body.style.overflow = 'hidden';
        this.submitModal = false;
    }
    // Close delete button, restore scrolling, and perform last record deletion.
    closeDeleteModal() {
        // Add your specific logic for closing the mood modal
        this.deleteButton = false;
        document.body.style.overflow = ''; // Reset to default
        this.deleteSymptomTrackerRecord();
    }
    // Close delete button and restore scrolling to default.
    closeDeletePopup() {
        // Add your specific logic for closing the mood modal
        this.deleteButton = false;
        document.body.style.overflow = '';
        // Reset to default   
    }
    //This function opens the mood modal and disables scrolling on the page
    openLastEdit() {
        // Add your specific logic for opening the mood modal      
        this.lastEdit = true;
        document.body.style.overflow = 'hidden';
    }
    // Add your specific logic for closing the mood modal
    closeLastEdit() {
        this.lastEdit = false;
        document.body.style.overflow = ''; // Reset to default
    }
    //Compares the latest record with the current symptom record
    navigateToSymptom() {
        if (this.latestRecord !== this.symptomrecord) {
            this.openLastEdit()
        } else if (this.latestRecord === this.symptomrecord) {
            // Redirect to a new page and set item in localStorage
            this.openEdit();
        }
    }
    // Add your specific logic for opening the mood modal
    openEdit() {
        this.edit = true;
        document.body.style.overflow = 'hidden';
    }
    // Add your specific logic for closing the mood modal
    closeEdit() {
        this.edit = false;
        this.deleteButton = false;
        document.body.style.overflow = ''; // Reset to default
    }
    handleLastEditDate() {
        let globalThis = window;
        if (this.latestRecord !== this.symptomrecord) {
            this.openLastEdit();
            this.lastEdit = false;
            document.body.style.overflow = '';
        } else if (this.latestRecord === this.symptomrecord) {
            // Redirect to a new page and set item in localStorage
            globalThis.location?.assign(label.SYMPTOM_MAIN_PAGE_URL);
            // Store data labeled as 'symptomlastid' in the session storage without altering custom labels.
            globalThis.localStorage.setItem('symptomlastid', this.symptomrecord);
        }
    }
    // showToast used for all the error messages caught
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