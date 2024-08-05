// This lightning web component is used to display the landing avatar message in the Information Center Landing Page
// To import Libraries
import { LightningElement, wire,api } from 'lwc';
// To import Static Resources
import DEFAULT_IMG from '@salesforce/resourceUrl/BI_PSPB_ProfileAvatar';
//  To import Apex Classes
import GET_LOGGEDIN_USER_ACCOUNT from '@salesforce/apex/BI_PSP_CurrentUser.getEnrolleeRecords';
import PATIENT_STATUS from '@salesforce/apex/BI_PSPB_TreatmentVideoCtrl.patientStatus';
// To import Custom Labels
import { LABELS } from 'c/biPspbLabelForInfoCenter';
import SEARCH_AVATAR_MESSAGE from '@salesforce/label/c.BI_PSPB_ArticleSearchAvatarMessage';

export default class BiPspbInfoLandingAvatar extends LightningElement {
	@api siteUrlq;
	patientStatusRecord = '';
	caregiver = false;
	renderedCount=0;
	userAccounts;
	cardImage = '';
	searchAvatarMessage = SEARCH_AVATAR_MESSAGE;

	
	/*There's no need to check for null because in Apex, we're throwing an AuraHandledException. 
	Therefore, null data won't be encountered.*/
	// To retirieve the staus value of a Patient
	@wire(PATIENT_STATUS)
	wiredPatientStatus({ error, data }) {
		try {
			if (data) {
				this.patientStatusRecord = data;
			} else if (error) {
				this.navigateToErrorPage(error.body.message); // Catching Potential Error from Apex
			}
			
		} catch (err) {
			this.navigateToErrorPage(err.message); // Catching Potential Error from Lwc
		}
	}

	// To set the property of para element if the status is unassigned
	renderedCallback() {
		try {
			if (this.patientStatusRecord === LABELS.UNASSIGNED_STATUS) {
				// Assuming you have a paragraph element with the class para
				let paraElement = this.template.querySelector(".para");
				// Check if the element with the class para exists
				if (paraElement) {
					if (window.innerWidth > 1115) {
						// Set the top property to 10%
						// Double quotes is used to render the CSS value - Unavoidable
						paraElement.style.marginTop = "-27px";
					}
				}
			}
			const event = new CustomEvent('childrendered', {
				detail: { rendered: true }
			});
			if(this.renderedCount===0){
			this.dispatchEvent(event);
			this.renderedCount++;
			}
		} catch (error) {
			this.navigateToErrorPage(error.message); // Catching Potential Error
		}
	}

	/* There's no need to check for null because in Apex, we're throwing an AuraHandledException. 
		Therefore, null data won't be encountered. */
	// To retrieve the logged in user selected avatar
	@wire(GET_LOGGEDIN_USER_ACCOUNT)
	wiredUserDetails({ error, data }) {
		try {
		if (data) {
			this.cardImage = data[0]?.BI_PSP_AvatarUrl__c
			? data[0]?.BI_PSP_AvatarUrl__c
			: DEFAULT_IMG;
		} else if (error) {
			this.navigateToErrorPage(error.body.message); // Catching Potential Error from Apex
		}
		} catch (err) {
		this.navigateToErrorPage(err.message); // Catching Potential Error from Lwc
		}
	}

	// navigateToErrorPage used for all the error messages caught
	navigateToErrorPage(errorMessage) {
		let globalThis = window;
		globalThis.sessionStorage.setItem('errorMessage', errorMessage);
		globalThis.location.assign(this.siteUrlq + LABELS.ERROR_PAGE); 
	}
}