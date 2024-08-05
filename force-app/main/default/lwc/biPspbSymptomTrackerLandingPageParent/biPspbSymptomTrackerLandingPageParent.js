// This LWC is used new entry page create  - biPspbsymtomtrackerlandingpageCmp
// To import Libraries
import {LightningElement,wire} from 'lwc';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
// To import Custom labels and static resources
import * as label from 'c/biPspbLabelAndResourceSymptom';
// To import Apex Classes
import USER_ENROLLEE_ID from "@salesforce/apex/BI_PSP_CurrentUser.getEnrolleeRecords";
import FETCH_SYMPTOM_ENROLLEE from '@salesforce/apex/BI_PSP_SymptomTrackerGraphCtrl.getSymptomTrackerDetails';
import GET_LATEST_SYMPTOM from '@salesforce/apex/BI_PSPB_SymptomPrimaryPageCtrl.getLatestSymptomRecord';
export default class BiPspbSymptomTrackerLandingPageParent extends LightningElement {
    //variable declaration
    graphDatas = '';
    isLoading = true;
    edits;
    userId = label.ID;
    enrolleeId;
    showSymptom = false;
    @wire(GET_LATEST_SYMPTOM)
    wiredLatestRecord({error,data}) {
        try {
            if (data && data !== null) {
                this.graphDatas = data[0];
            } else if (error) {
                this.showToast(label.ERROR_MESSAGE, error.body.message, label.ERROR_VARIANT_TOAST);
            }
        } catch (err) {
            this.showToast(label.ERROR_MESSAGE, err.body.message, label.ERROR_VARIANT_TOAST);
        }
    }
    // Determine component type based on URL path
    connectedCallback() {
        let globalThis = window;
        const currentURL = globalThis.location?.href;
        const urlObject = new URL(currentURL); // Get the path
        const path = urlObject.pathname; // Split the path using '/' as a separator
        const pathComponents = path.split(label.SLASH); // Find the component you need (in this case, 'Branded')
        const desiredComponent = pathComponents.find(component => [label.BRANDED_URL.toLowerCase(), label.UNASSIGNED_URL.toLowerCase()].includes(component.toLowerCase()));
        if (desiredComponent.toLowerCase() === label.BRANDED_URL.toLowerCase()) {
            this.brandedOrUnassigned = label.BRANDED_URL_NAVIGATION;
        } else {
            this.brandedOrUnassigned = label.UNASSIGNED_URL_NAVIGATION;
        }
        this.loadEnrolleeData();
    }
    // Fetch enrollee data and handle response
    loadEnrolleeData() {
        USER_ENROLLEE_ID()
            .then(data => {
                if (data && data.length > 0) {
                    this.enrolleeId = data[0].Id;
                    this.getSymptom();
                } else {
                    this.showError = true;
                    this.ERROR_MESSAGE = label.ENROLLEE_ERROR;
                }
            })
            .catch(error => {
                // Handle any errors occurring during the promise chain
                this.showToast(label.ERROR_MESSAGE, error.message, label.ERROR_VARIANT_TOAST);
            });
    }
    //This function is responsible for fetching symptom data for the current month.
    getSymptom() {
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonthIndex = currentDate.getMonth();
        const currentMonthName = [
            label.JANUARY, label.FEBRUARY, label.MARCH, label.APRIL, label.MAY, label.JUNE,
            label.JULY, label.AUGUST, label.SEPTEMBER, label.OCTOBER, label.NOVEMBER, label.DECEMBER
        ][currentMonthIndex];
        const selectedMonthIndex = currentMonthIndex; // Calculate first date (last date of previous month)
        const firstDate = new Date(currentYear, selectedMonthIndex, 0, 18, 30, 0);
        let lastDate = new Date(currentYear, selectedMonthIndex + 1, 1, 18, 30, 0); // Adjust for next year if necessary
        if (selectedMonthIndex === 11) {
            lastDate.setFullYear(currentYear + 1);
        }
        this.firstdate = firstDate.toISOString();
        this.lastDate = lastDate.toISOString();
        // this.getSymptomDateWithAllergy(this.enrolleeId, firstDate.toISOString(), lastDate.toISOString(), currentMonthName);
        this.getSymptomDateWithAllergy({
            enrollees: this.enrolleeId,
            firstDate: firstDate.toISOString(),
            lastDate: lastDate.toISOString(),
            currentMonthName: currentMonthName
        });
    }
    //This function is responsible for fetching symptom data for a specific enrollee within a given date range.
    getSymptomDateWithAllergy({enrollees,firstDate,lastDate,currentMonthName}) {
        let globalThis = window;
        FETCH_SYMPTOM_ENROLLEE({erolleId: enrollees,firstDate: firstDate,lastDate: lastDate})
            .then(result => {
                if (result == '') {
                    let urlParams = new URLSearchParams(globalThis.location.href.split(label.QUESTION_MARK)[1]);
                    this.EDITS = urlParams.get(label.EDITS);
                   
                } else {
                    this.showSymptom = true;
                    this.isLoading = false;
                }
                 if (!this.EDITS) {
                        globalThis.location.assign(this.brandedOrUnassigned + label.SYMPTOM_GRAPH_URL + this.enrolleeId + label.FIRST_DATE_GRAPH + this.firstdate + label.LAST_DATE_GRAPH + this.lastDate + label.MONTH_DATE + currentMonthName);
                    } else {
                        this.showSymptom = true;
                        this.isLoading = false;
                    }
            })
            .catch(error => {
                this.showToast(label.ERROR_MESSAGE, error.message, label.ERROR_VARIANT_TOAST);
            });
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