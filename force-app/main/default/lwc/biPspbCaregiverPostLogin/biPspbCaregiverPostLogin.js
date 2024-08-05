//This lightning web component is used to select the patient for Caregiver
//to Import the Libraries
import { LightningElement,wire } from "lwc";
// import { getRecord, getFieldValue } from "lightning/uiRecordApi";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
//to Import the Apex Class
import CAREGIVER_ACCOUNTS from "@salesforce/apex/BI_PSPB_PatientDetailsCtrl.getCareEnrolleeCaregiver";
//import USER_CAREGIVER from "@salesforce/apex/BI_PSP_NotificationCtrl.userCaregiverPost";
//import CHECK_CAREGIVER_PATIENT_STATUS from "@salesforce/apex/BI_PSPB_AvatarCtrl.checkCaregiverPatientStatus";
import CURRENT_USER from '@salesforce/apex/BI_PSP_CurrentUser.getEnrolleeRecords';
import UPDATE_SELECTED_PATIENTID from "@salesforce/apex/BI_PSPB_PatientDetailsCtrl.updateSwitchSelectedPatientID";

//To import the Custom Labels
import {label} from 'c/biPspbAvatarResources';

export default class BiPspbCaregiverPostLogin extends LightningElement {
	//Proper naming conventions with camel case for all the variable will be followed in the future releases
	//Declaration of varaiable with @track
	myPatient = label.MY_PATIENT;
	showDetails = false;
	showMessage = false;
	messageHeader = "";
	messageBody = "";
	selectedAccountId = "";
	cargiverId = "";
	Status;
	showSpinner = false;
	caregiverAccounts = [];
	//Declaration of varaiable
	statusMap = new Map();
	status;
	loginAttempt;
	getFieldValue;
	userId = label.ID;
	errorPage = label.ERROR_PAGE;
	user;
	get name() {
		return this.getFieldValue(this.user.data, label.NAME_FIELD);
	}

	//To fetch the data from caregivers patient
	@wire(CAREGIVER_ACCOUNTS, { userId: "$userId", isActive: false })
	wiredCaregiverAccounts({ error, data }) {
		// Null data is checked and AuraHandledException is thrown from the Apex
		try {
		if (data) {
			
				this.caregiverAccounts = data.map((patient) => ({
					Id: patient.BI_PSPB_Patient__c,
					Name: patient.BI_PSPB_Patient__r.Name,
					status: patient.BI_PSPB_Status__c,
					login: patient.BI_PSP_Loginattempt__c,
					caregiverId: patient.BI_PSPB_Caregiver__c,
					initial:
						patient?.BI_PSPB_Patient__r.Name?.split(" ").map((name) => name[0]).length >= 2
							? (
								patient.BI_PSPB_Patient__r.Name.split(" ").map((name) => name[0])[0] +
								patient.BI_PSPB_Patient__r.Name.split(" ").map((name) => name[0])[1]
							).toUpperCase()
							: patient.BI_PSPB_Patient__r.Name.split(" ")
								.map((name) => name[0])[0]
								.toUpperCase(),
					showSelectButton: patient.BI_PSPB_Status__c === label.ACTIVE,
					showBlockMessage: patient.BI_PSPB_Status__c !== label.ACTIVE,
					blockMessageHeader: label.ACCESS_BLOCKED,
					blockMessageBody: label.CAREGIVER_ACCESS
				}));

			
		} else if (error) {
			globalThis.sessionStorage.setItem('errorMessage', error.body.message);
                globalThis.location?.assign(this.baseUrl +  label.BRANDED_URL + this.errorPage );

		}
		} catch (err) {
			globalThis.sessionStorage.setItem('errorMessage', error.body.message);
                globalThis.location?.assign(this.baseUrl +  label.BRANDED_URL + this.errorPage );

			}
	}

	handleViewDetails(event) {
		this.selectedAccountId = event.target.dataset.id;
		this.cargiverId = this.caregiverAccounts[0]?.caregiverId;
		this.showSpinner = true;
		// update the
		UPDATE_SELECTED_PATIENTID({
			userId: this.cargiverId,
			selectedAccountId: this.selectedAccountId,
			check: true

		})
			// Null data is checked and AuraHandledException is thrown from the Apex
			// Use newAvatarSrc
			.then(() => {
				this.caregiverfunc();
			})
			.catch((error) => {
				globalThis.sessionStorage.setItem('errorMessage', error.body.message);
                globalThis.location?.assign(this.baseUrl +  label.BRANDED_URL + this.errorPage );
			});

	}
	caregiverfunc() {
	
   CURRENT_USER()
    .then(result => {
                this.enrolleeRecords = result;
				this.loginAttempt = result[0].BI_PSP_Loginattempt__c;
                this.status = result[0].BI_PSPB_PatientStatus__c;
	         	this.redirectUserBasedOnStatus();
               
            })
            .catch(error => {
                this.error = error;
                this.enrolleeRecords = undefined;
				globalThis.sessionStorage.setItem('errorMessage', error.body.message);
                globalThis.location?.assign(this.baseUrl +  label.BRANDED_URL + this.errorPage );
            });
    }
      
	
	
	redirectUserBasedOnStatus() {
		try{
		if (this.loginAttempt === 0) {
			window.location.assign(label.BRANDED_SITEURL + label.CAREGIVER_AVATAR_SELECTION);
		} else if (this.loginAttempt === 1 && this.status === label.UNASSIGNED) {
			window.location.assign(label.UNASSIGNEDSITE_URL);
		} else if (this.loginAttempt === 1 && this.status === label.ACUTE) {
			window.location.assign(label.UNASSIGNEDSITE_URL + label.ACUTE_DASHBOARD);
		} else {
			window.location.assign(label.BRANDED_SITEURL + label.DASHBOARD);
		}
	}
	 catch (err) {
				globalThis.sessionStorage.setItem('errorMessage', err.body.message);
                globalThis.location?.assign(this.baseUrl +  label.BRANDED_URL + this.errorPage );

			}
	}
	handlePatientStatusError(patientStatusError) {
		this.handleError(patientStatusError.message);
	}
	
	
	
	//This ShowToast Message is used for get error
	showToast(title, message, variant) {
		const event = new ShowToastEvent({
			title: title,
			message: message,
			variant: variant
		});
		this.dispatchEvent(event);
	}
}