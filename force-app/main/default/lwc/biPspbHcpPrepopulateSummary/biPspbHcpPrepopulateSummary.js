import { LightningElement, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
// Imports resourceUrl to reference external resources for proper rendering and functionality.
// Importing Apex classes to interact with Salesforce backend for data retrieval.
import LEAD_GET from '@salesforce/apex/BI_PSPB_ThankyouPageUtilites.getExistingLeads';
import HCP_GET from '@salesforce/apex/BI_PSPB_EnrollmentUtilities.getHcpDetails';
// Imports showToastEvent to display notification messages, informing users about component actions or events.
import { resource } from "c/biPspbEnrollmentFormResource";

export default class BiPspbHcpPrepopulateSummary extends LightningElement {
	toActive = resource.TO_ACTIVE;
	enrollThank = resource.ENROLL_THANK;
	addressColan = resource.ADRRESS_COLAN;
	enrollHead = resource.ENROLL_SUMMARY;
	nameColan = resource.NAME_COLAN;
	dobColan = resource.DOB_COLAN;
	emailColan = resource.EMAIL_COLAN;
	phoneColan = resource.PHONE_COLAN;
	prescriptionInfo = resource.PRESCRIPTION_INFO;
	patientinfo = resource.PATIENT_INFO;
	physicianInfo = resource.PHYSICIAN_INFO;
	age = true;
	recordDetails;
	caregiver;
	result;
	recordId;
	count;
	patientEmail;
	mailImg = resource.IMG;
	beyandGpp = resource.BGPP;
	errorPage  = resource.ERROR_PAGE;

	//  get lead record from apex
	//There's no need to check for null because in Apex, we're throwing an AuraHandledException. 
	//Therefore, null data won't be encountered.
	@wire(LEAD_GET, { createLeadId: '$recordId' })
	wiredRecordDetailsLead({ error, data }) {
		try {

			if (data && data.length > 0) {
				this.recordDetails = data;
				this.patientEmail = data[0].Email;

			}
			else if (error) {
				globalThis.sessionStorage.setItem('errorMessage', error.body.message);
                globalThis.location?.assign(this.baseUrl +  resource.BRANDED_URL + this.errorPage );
			}
		}
		catch (err) {
			globalThis.sessionStorage.setItem('errorMessage', error.body.message);
                globalThis.location?.assign(this.baseUrl +  resource.BRANDED_URL + this.errorPage );
		}

	}
	// get hcp record from apex
	//There's no need to check for null because in Apex, we're throwing an AuraHandledException. 
	//Therefore, null data won't be encountered.
	@wire(HCP_GET, { leadId: '$recordId' })
	wiredRecordDetailsHcp({ error, data }) {
		try {
			if (data && data.length > 0) {
				this.caregiver = data;

				this.age = true;

			}
			else if (error) {
				globalThis.sessionStorage.setItem('errorMessage', error.body.message);
                globalThis.location?.assign(this.baseUrl +  resource.BRANDED_URL + this.errorPage );

			}
		}
		catch (err) {
			globalThis.sessionStorage.setItem('errorMessage', error.body.message);
                globalThis.location?.assign(this.baseUrl +  resource.BRANDED_URL + this.errorPage );

		}
	}

	connectedCallback() {
		try {
			let globalThis = window;
			// Retrieve the recordId from localStorage
			this.recordId = globalThis?.localStorage.getItem('recordId');
			this.count = globalThis?.localStorage.getItem('count');
			if (this.count !== 2) {
				globalThis?.localStorage.setItem('count', 2);
			}
		} catch (error) {
			globalThis.sessionStorage.setItem('errorMessage', error.body.message);
                globalThis.location?.assign(this.baseUrl +  resource.BRANDED_URL + this.errorPage );
		}
	}

	
	showToast(title, message, variant) {
		if (typeof window !== resource.UNDIFINED) {
			const event = new ShowToastEvent({
				title: title,
				message: message,
				variant: variant
			});
			this.dispatchEvent(event);
		}
	}

}