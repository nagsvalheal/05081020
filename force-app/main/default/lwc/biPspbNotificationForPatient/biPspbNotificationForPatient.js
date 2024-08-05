// This is consolidate component for unassigned patient notification
// To import Libraries
import { LightningElement } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import {resources} from 'c/biPspbResourceProfileManager';
export default class BiPspbNotificationForPatient extends LightningElement {
	//Proper naming conventions with camel case for all the variables will be followed in the future releases
	// Declaration of Global variables
	unassignedUrl = resources.UNASSIGNED_SITE_URL;
	myProfile = resources.MY_PROFILE;
	myCaregiver = resources.MY_CAREGIVER;
	selectAvatar = resources.SELECT_AVATAR;
	patientNotification = resources.NOTIFICATION;
	notificationSetting=resources.NOTIFICATION_SETTING;
	patientInfo=resources.PATIENT_INFO;
	baseUrl;
	currentPageUrl;
	urlSegments;

	connectedCallback() {
		try {
			const globalThis = window;
			this.currentPageUrl = globalThis.location.href;
			this.urlSegments = this.currentPageUrl.split('/');
			this.baseUrl = `${this.urlSegments[0]}//${this.urlSegments[2]}`;
		}
		catch (error) {
			let globalThis=window;
			this.error=resources.RECORD_NOT_FOUND;
        globalThis.location.href = resources.ERROR_PAGE;        
        globalThis.sessionStorage.setItem('errorMessage', this.error);
		}
	}

	// navigate unassigned site home page
	openHome() {
		window.location.assign(this.baseUrl + this.unassignedUrl);
	}
	// navigate unassigned site patientprofile page
	openPatMyProfile() {
		window.location.assign(this.baseUrl + this.unassignedUrl + this.myProfile);
	}
	// navigate unassigned site patientcaregiver page
	openPatMyCaregiver() {
		window.location.assign(this.baseUrl + this.unassignedUrl + this.myCaregiver);
	}
	openPatSelectAvatar() {
		// navigate unassigned site patientselectavatar page
		window.location.assign(this.baseUrl + this.unassignedUrl + this.selectAvatar);
	}
	// navigate unassigned site patientnotificationt page
	openPatNotSettings() {
		window.location.assign(this.baseUrl + this.unassignedUrl + this.patientNotification);
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