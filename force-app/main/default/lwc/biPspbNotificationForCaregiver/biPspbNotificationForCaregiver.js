// This is consolidated component for unassigned notification setting page.
// To import Libraries
import { LightningElement } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import {resources} from 'c/biPspbResourceProfileManager';
export default class BiPspbNotificationForCaregiver extends LightningElement {
	//Proper naming conventions with camel case for all the variables will be followed in the future releases
	// Declaration of Global variables
	unAssignedUrl = resources.UNASSIGNED_SITE_URL;
	caregiverProfile = resources.CAREGIVER_PROFILE;
	patientInfo = resources.PATIENT_INFO;
	selectAvatar = resources.SELECT_AVATAR;
	patientNotification = resources.NOTIFICATION;
	notificationSetting=resources.NOTIFICATION_SETTING;
	myProfile=resources.MY_PROFILE;
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



	// navigate unassigned site  home page 
	openHome() {
		window.location.assign(this.baseUrl + this.unAssignedUrl);
	}
	// navigate unassigned site caregiverprofile page 
	openCarMyProfile() {
		window.location.assign(this.baseUrl + this.unAssignedUrl + this.caregiverProfile);
	}
	// navigate unassigned site caregiverpatient page 
	openCarMyCaregiver() {
		window.location.assign(this.baseUrl + this.unAssignedUrl + this.patientInfo);
	}
	// navigate unassigned site caregiverselectavatar page
	openCarSelectAvatar() {
		window.location.assign(this.baseUrl + this.unAssignedUrl + this.selectAvatar);
	}
	// navigate unassigned site caregivernotification page
	openCarNotSettings() {
		window.location.assign(this.baseUrl + this.unAssignedUrl + this.patientNotification);
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