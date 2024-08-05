import { LightningElement } from "lwc";
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
//custom label
import {label} from 'c/biPspbAvatarResources';
import {resources} from 'c/biPspbResourceProfileManager';
export default class BiPspbPatientSelectAvatarParent extends LightningElement {

	slashSiteUrl = label.SLASH_URL;
	slashSitePageUrl = label.SLASH_SITE_URL;
	patientMyProfile = label.PATIENT_MY_PROFILE_URL;
	myCaregiver = label.MY_CAREGIVER_URL;
	patientSelectAvatar = label.PATIENT_SELECT_AVATAR_URL;
	patientNotification = label.PATIENT_NOTIFICATION_URL;
	notificationSetting=resources.NOTIFICATION_SETTING;
	selectAvatar=resources.SELECT_AVATAR;
  myCare = resources.MY_CAREGIVER;
	myProfile=resources.MY_PROFILE;

	//connectedCallback is used for assign the url
	connectedCallback() {
		
		try {
			let globalThis = window;
			const currentURL = globalThis.location.href;
			// Create a URL object
			const urlObject = new URL(currentURL); // Get the path
			const path = urlObject.pathname; // Split the path using '/' as a separator
			const pathComponents = path.split("/"); // Find the component you need (in this case, 'Branded')
			const desiredComponent = pathComponents.find((component) =>
				[label.BRANDED_URL.toLowerCase(), label.UNASSIGNED_URL.toLowerCase()].includes(
					component.toLowerCase()
				)
			);

			if (desiredComponent.toLowerCase() === label.BRANDED_URL.toLowerCase()) {
				this.urlq = label.BRANDED_SITEURL;
			} else {
				this.urlq = label.UNASSIGNED_SITE_URL;
			}
		} catch (error) {
			let globalThis=window;
			this.error=resources.RECORD_NOT_FOUND;
        globalThis.location.href = resources.ERROR_PAGE;        
        globalThis.sessionStorage.setItem('errorMessage', this.error);
		}
	}
	openPatMyProfile() {
		window.location.assign(this.urlq + this.patientMyProfile);
	}
	openPatMyCaregiver() {
		window.location.assign( this.urlq + this.myCaregiver);
	}
	openPatSelectAvatar() {
		window.location.assign( this.urlq +  this.patientSelectAvatar);
	}
	openPatNotSettings() {
		window.location.assign(this.urlq +  this.patientNotification);
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