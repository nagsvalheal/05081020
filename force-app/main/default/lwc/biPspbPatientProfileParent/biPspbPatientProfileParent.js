import { LightningElement } from "lwc";
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import {resources} from 'c/biPspbResourceProfileManager';
export default class BiPspbPatientProfileParent extends LightningElement {
  notificationSetting=resources.NOTIFICATION_SETTING;
	selectAvatar=resources.SELECT_AVATAR;
  myCaregiver = resources.MY_CAREGIVER;
	myProfile=resources.MY_PROFILE;
  openhome() {
    window.location.assign("/Branded/s/");
    window.location.assign("/" + this.urlq + "/s/bi-psp-lets-personalise");
  }
  openPatMyProfile() {
    window.location.assign("/" + this.urlq + "/s/bi-pspb-patientprofile");
  }
  openPatMyCaregiver() {
    window.location.assign("/" + this.urlq + "/s/bi-pspb-patientcaregiver");
  }

  openPatSelectAvatar() {
    window.location.assign("/" + this.urlq + "/s/bi-pspb-patientselectavatar");
  }
  openPatNotSettings() {
    window.location.assign("/" + this.urlq + "/s/bi-pspb-patientnotification");
  }
  renderedCallback() {
    try {
      const currentURL = window.location.href;
      
      const urlObject = new URL(currentURL); // Get the path
      const path = urlObject.pathname; // Split the path using '/' as a separator
      const pathComponents = path.split("/"); // Find the component you need (in this case, 'Branded')
      const desiredComponent = pathComponents.find((component) =>
        [resources.BRANDED_URL.toLowerCase(), resources.UNASSIGNED_URL.toLowerCase()].includes(
          component.toLowerCase()
        )
      );

      if (desiredComponent.toLowerCase() === resources.BRANDED_URL.toLowerCase()) {
        this.urlq = resources.BRANDED_URL;
      } else {
        this.urlq = resources.UNASSIGNED_URL;
      }
    } catch (error) {
      let globalThis=window;
			this.error=resources.RECORD_NOT_FOUND;
        globalThis.location.href = resources.ERROR_PAGE;        
        globalThis.sessionStorage.setItem('errorMessage', this.error);
  }
  }
  showToast(title, message, variant) {
		const event = new ShowToastEvent({
			title: title,
			message: message,
			variant: variant
		});
		this.dispatchEvent(event);
	}
}