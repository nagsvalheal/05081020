// This lightning web component is used for display the chronic patient customized video
// To import Libraries
import { LightningElement, wire,api } from 'lwc';
// To import Apex classes
import GET_RECORDS from '@salesforce/apex/BI_PSPB_TreatmentVideoCtrl.getRecords';
// To import Custom Labels
import FLAREPREVENTIONHEADINGCHRONIC from '@salesforce/label/c.BI_PSPB_FlarePreventionHeadingChronic';
import TRANSCRIPT from '@salesforce/label/c.BI_PSP_Transcript';
import DISCLAIMER from '@salesforce/label/c.BI_PSP_Disclaimer';
import DISCLAIMERMESSAGECHRONIC from '@salesforce/label/c.BI_PSPB_DisclaimerMessageChronic';
import ERROR_PAGE from '@salesforce/label/c.BI_PSP_DisplayErrorPage';

// To get Current UserId
import ID from '@salesforce/user/Id';

export default class BiPspbChronicVideo extends LightningElement {
	@api siteUrlq;
	videoUrl = '';
	isContentVisible = false;
	videoWidth='';
	userId = ID;
	flarePreventionHeadingChronic = FLAREPREVENTIONHEADINGCHRONIC;
	transcript = TRANSCRIPT;
	disclaimer = DISCLAIMER;
	disclaimerMessageChronic = DISCLAIMERMESSAGECHRONIC;
	// To retrieve the video Url
	@wire(GET_RECORDS)
	wiredVideoData({ data, error }) {
		try {
			if (data && data.length!==0) {
				// Assuming the data is an array with at least one record
				this.videoUrl = data[0].BI_PSPB_URL__c;
			}else if(error) {
				this.navigateToErrorPage(error.body.message); 
			}
		} catch (err) {
			this.navigateToErrorPage(err.message); // Catching Potential Error from Lwc
		}
	}

	// Getter method to determine the icon name based on content visibility
	get iconName() {
		return this.isContentVisible ? 'utility:chevronup' : 'utility:chevrondown';
	}

	// Getter method to determine the icon alt text based on content visibility
	get iconAltText() {
		return this.isContentVisible ? 'Collapse Content' : 'Expand Content';
	}

	// Getter method to determine the content class based on content visibility
	get contentClass() {
		return this.isContentVisible ? 'content visible' : 'content';
	}

	// Method to toggle the content visibility
	toggleContent() {
		this.isContentVisible = !this.isContentVisible;
	}

	connectedCallback() {
			const globalThis=window;
			// video width and height hardcoded because the UI is not align with the video player
			if(globalThis.innerWidth<=1200){
				this.videoWidth= '700';
			}
			else{
				this.videoWidth = '905';
			}
	}

	// navigateToErrorPage used for all the error messages caught
	navigateToErrorPage(errorMessage) {
		let globalThis = window;
		globalThis.sessionStorage.setItem('errorMessage', errorMessage);
		globalThis.location.assign(this.siteUrlq + ERROR_PAGE);	
	}
}