//This is Consolidate Component(LWC) this contains Avatar and Qualitative satisfaction questionnaire Completed Questionnaire to achieve mobile responsive.
//To import Libraries
import { LightningElement, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
//To import Apex Class
import GET_ASSESSMENT_COUNT from '@salesforce/apex/BI_PSP_AssessmentCtrl.getAssessmentCountsByCurrentUserName';
//To import Custom labels
import CONSOLE_ERROR_MESSAGE from '@salesforce/label/c.BI_PSP_ConsoleError';
import ERROR_VARIANT from '@salesforce/label/c.BI_PSP_ErrorVariantToast';
import * as labels from 'c/biPspbLabelAndResourceForQuestionnaire'; 
export default class BiPspbQsqCompletedQsFourteenWeeksParent extends LightningElement {
	//Global variables(without @track does not trigger automatic re-renders)
	showTabMenu;
	count;
	storeWapi;
	storePss;
	storeDlqi;
	storeQsq;
	urlq;
	//To get total Complete assessment for current user
	//There's no need to check for null because in Apex, we're throwing an AuraHandledException. Therefore, null data won't be encountered.
	@wire(GET_ASSESSMENT_COUNT)
	wiredAssessmentResponsesqsq({ data, error }) {
		try {
			if (data) {
				this.count = data;
				if (
					this.count[0] !== 0 ||
					this.count[1] !== 0 ||
					this.count[2] !== 0 ||
					this.count[3] !== 0
				) {
					this.showTabMenu = true;
					this.storeWapi = this.count[0];
					this.storePss = this.count[1];
					this.storeDlqi = this.count[2];
					this.storeQsq = this.count[3];
				} else {
					this.showTabMenu = false;
				}
				if (this.count[0] !== 0 ||
					this.count[1] !== 0 ||
					this.count[2] !== 0) {
					this.showTabMenuSummary = true;
				}
				else {
					this.showTabMenuSummary = false;
				}
			} else if (error) {
				this.showToast(CONSOLE_ERROR_MESSAGE, error.body.message, ERROR_VARIANT); // Catching Potential Error from Apex
			}
		} catch (err) {
			this.showToast(CONSOLE_ERROR_MESSAGE, error.message, ERROR_VARIANT); // Catching Potential Error from LWC
		}
	}
	// to in get site url

	renderedCallback() {
		try {
			let currentURL = window.location.href;
			let urlObject = new URL(currentURL); // Get the path
			let path = urlObject.pathname; // Split the path using '/' as a separator
			let pathComponents = path.split('/'); // Find the component you need (in this case, 'Branded')
			let desiredComponent = pathComponents.find((component) =>
				[labels.BRANDED_URL.toLowerCase(), labels.UN_ASSIGNED_URL.toLowerCase()].includes(
					component.toLowerCase()
				)
			);

			if (desiredComponent.toLowerCase() === labels.BRANDED_URL.toLowerCase()) {
				this.urlq = labels.BRANDED_NAVI_URL;
			} else {
				this.urlq = labels.UN_ASSIGNED_URL_NAVI;
			}
		} catch (error) {
			this.showToast(CONSOLE_ERROR_MESSAGE, error.message, ERROR_VARIANT); // Catching Potential Error
		}
	}
	//Navigation methods for tab
	openOutQuestionnaires() {
		window.location.assign(this.urlq + labels.OUT_STANDING_URL);
	}
	openSummary() {
		window.location.assign(this.urlq + labels.SUMMARY_URL);
	}
	openComQuestionnaires() {
		if (this.storeDlqi > 0) {
			window.location.assign(this.urlq + labels.DLQI_COMPLETED_URL);
		} else if (this.storePss > 0) {
			window.location.assign(this.urlq + labels.PSS_COMPLETED_QUESTIONNAIRE_URL);
		} else if (this.storeWapi > 0) {
			window.location.assign(this.urlq + labels.WPAI_COMPLETED_QUESTIONNAIRE);
		}
	}
	openPersonalize() {
		window.location.assign(this.urlq + labels.LETSPERSONLIZE_URL);
	}
	// showToast used for all the error messages caught
	showToast(title, message, variant) {

		let event = new ShowToastEvent({
			title: title,
			message: message,
			variant: variant
		});
		this.dispatchEvent(event);

	}
}