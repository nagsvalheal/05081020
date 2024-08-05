//	This is Consolidate Component(LWC) this contains Avatar and Introduction Questionnaire to achieve mobile responsive.
//To import Libraries
import { LightningElement, wire, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
//To import Apex classes
import GET_ASSESSMENTS_COUNT from '@salesforce/apex/BI_PSP_AssessmentCtrl.getAssessmentCountsByCurrentUserName';
import GET_ASSESSMENTS_BY_CURRENT_USER_NAME from '@salesforce/apex/BI_PSP_CaregiverAndPatientCtrl.getAssessmentsByCurrentUserName';
import GET_PATIENT_ENROLL_DATE from '@salesforce/apex/BI_PSP_QualitativeSatisfactionCtrl.getPatientEnrolleeDateAfterTwoMonthsAndFourteenWeeks';
//To import Custom labels
import BRANDED_URL from '@salesforce/label/c.BI_PSPB_SiteLabel';
import BRANDED_URL_NAVI from '@salesforce/label/c.BI_PSPB_BrandedSiteNaviUrl';
import UN_ASSIGNED_URL_NAVI from '@salesforce/label/c.BI_PSPB_UnAssignedNaviUrl';
import UN_ASSIGNED_URL from '@salesforce/label/c.BI_PSPB_UnAssignedLabel';
import CONSOLE_ERROR_MESSAGE from '@salesforce/label/c.BI_PSP_ConsoleError';
import ERROR_VARIANT from '@salesforce/label/c.BI_PSP_ErrorVariantToast';
import OUT_STANDING_URL from '@salesforce/label/c.BI_PSPB_OutstndngPageUrl';
import SUMMARY_URL from '@salesforce/label/c.BI_PSPB_SummaryUrl';
import DLQI_COMPLETED_URL from '@salesforce/label/c.BI_PSPB_DlqiCompletedUrl';
import PSS_COMPLETED_URL from '@salesforce/label/c.BI_PSPB_PsoriasisCompletedQuesUrl';
import WAPI_COMPLETED_URL from '@salesforce/label/c.BI_PSPB_WapiCompletedQuestionnaire';
import LETS_PERSONALIZE_URL from '@salesforce/label/c.BI_PSPB_LetsPersonalizeUrl';
import QSQ_COMPLETED_FOURTEEN_WEEKS from '@salesforce/label/c.BI_PSPB_QualitativeFourteenwksCompletedUrl';
import QSQ_COMPLETED_TWO_MONTHS from '@salesforce/label/c.BI_PSPB_QualitativeTwoMonthsCompletedUrl';
import QUALITATIVE_LABEL from '@salesforce/label/c.BI_PSP_QualitativeCategory';
import EXPIRED from '@salesforce/label/c.BI_PSP_Expired';
import COMPLETED_LABEL from '@salesforce/label/c.BI_PSP_Completed';
export default class BiPspbOutstandingPageParent extends LightningElement {
	//Global variables( @track does trigger automatic re-renders)
	@track screenWidth;
	//Global variables(without @track does not trigger automatic re-renders)
	showTabMenuSummary = false;
	showTabMenu = false;
	count;
	status;
	assessmentId;
	categoryname = QUALITATIVE_LABEL;
	urlq;

	//To get total completed Questionnaire count for the particular user
	//There's no need to check for null because in Apex, we're throwing an AuraHandledException. Therefore, null data won't be encountered.
	@wire(GET_ASSESSMENTS_COUNT)
	wiredAssessmentResponsesqsq({ data, error }) {
		try {
			if (error) {
				this.showToast(CONSOLE_ERROR_MESSAGE, error.body.message, ERROR_VARIANT); // Catching Potential Error from Apex
			} else if (data) {
				this.count = data;
				//Checking data of index contains 0;
				this.showTabMenu = this.count.some(count => count !== 0);
				//assigning data values to the variables 
				[this.stwai, this.stpss, this.stdlq, this.stqsq] = this.count;
				//Checking 1st 3 index values contains 0;
				this.showTabMenuSummary = this.count.slice(0, 3).some(count => count !== 0);
			}
		} catch (err) {
			this.showToast(CONSOLE_ERROR_MESSAGE, err.message, ERROR_VARIANT); // Catching Potential Error from LWC
		}
	}
	//To get assessment and status by current User
	//There's no need to check for null because in Apex, we're throwing an AuraHandledException. Therefore, null data won't be encountered.
	@wire(GET_ASSESSMENTS_BY_CURRENT_USER_NAME, { categoryname: '$categoryname' })
	wiredAssessments({ error, data }) {
		try {
			if (error) {
				this.showToast(CONSOLE_ERROR_MESSAGE, error.body.message, ERROR_VARIANT); // Catching Potential Error from Apex
			} else if (data) {
				this.assessmentId = data.length > 0 ? data[0].Id : null;
				this.status = data.length > 0 ? data[0].AssessmentStatus : null;
			}
		} catch (err) {
			this.showToast(CONSOLE_ERROR_MESSAGE, err.message, ERROR_VARIANT); // Catching Potential Error from LWC
		}
	}
	//Qualitative Date for topbar navigation
	@wire(GET_PATIENT_ENROLL_DATE)
	wiredResult({ error, data }) {
		try {
			if (error) {
				this.showToast(CONSOLE_ERROR_MESSAGE, error.body.message, ERROR_VARIANT); // Catching Potential Error from Apex
			} else if (data) {
				this.threeMonthsVar = data.threeMonthsVar;
				this.forteenWeeks = data.forteenWeeks;
				this.targetDateTwoMonths = data.targetTwoMonthsDate ?? null;
				this.targetDateFourteenWks = data.targetFourteenWeeksDate ?? null;
			}
		} catch (err) {
			this.showToast(CONSOLE_ERROR_MESSAGE, err.message, ERROR_VARIANT); // Catching Potential Error from LWC
		}
	}

	//To get site url
	renderedCallback() {
		try {
			let currentURL = window.location.href;
			// Create a URL object
			let urlObject = new URL(currentURL);
			// Get the path
			let path = urlObject.pathname;
			// Split the path using '/' as a separator
			let pathComponents = path.split('/');
			// Find the component you need (in this case, 'Branded')
			this.desiredComponent = pathComponents.find((component) =>
				[BRANDED_URL.toLowerCase(), UN_ASSIGNED_URL.toLowerCase()].includes(
					component.toLowerCase()
				)
			);
			if (this.desiredComponent.toLowerCase() === BRANDED_URL.toLowerCase()) {
				this.urlq = BRANDED_URL_NAVI;
			} else {
				this.urlq = UN_ASSIGNED_URL_NAVI;
			}
			let windowWidth = window.innerWidth;

			if (windowWidth <= 1200) {
				this.screenWidth = '12';
			} else {
				this.screenWidth = '4';
			}
		} catch (err) {
			this.showToast(CONSOLE_ERROR_MESSAGE, err.message, ERROR_VARIANT); // Catching Potential Error
		}
	}
	//Navigation methods to navigate to other Questionnaire

	openOutQuestionnaires() {
		window.location.assign(this.urlq + OUT_STANDING_URL);
	}
	openSummary() {
		window.location.assign(this.urlq + SUMMARY_URL);
	}
	//Completed Questionnaire Navigation
	openComQuestionnaires() {
		if (this.stdlq > 0) {
			window.location.assign(this.urlq + DLQI_COMPLETED_URL);
		} else if (this.stpss > 0) {
			window.location.assign(this.urlq + PSS_COMPLETED_URL);
		} else if (this.stwai > 0) {
			window.location.assign(this.urlq + WAPI_COMPLETED_URL);
		} else if (this.stqsq > 0) {
			if (this.targetDateFourteenWks !== null) {
				if (this.status === COMPLETED_LABEL || this.status === EXPIRED) {
					window.location.assign(
						this.urlq + QSQ_COMPLETED_FOURTEEN_WEEKS
					);
				} else {
					window.location.assign(this.urlq + QSQ_COMPLETED_TWO_MONTHS);
				}
			} else {
				window.location.assign(this.urlq + QSQ_COMPLETED_TWO_MONTHS);
			}
		}
	}
	openPersonalize() {
		window.location.assign(this.urlq + LETS_PERSONALIZE_URL);
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