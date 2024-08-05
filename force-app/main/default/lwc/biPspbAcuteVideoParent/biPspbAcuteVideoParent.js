// This lightning web component is used for display the acute treatment video and acute avatar message
// To import Libraries
import { LightningElement } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
// To import Custom Labels
import BRANDED_URL from '@salesforce/label/c.BI_PSPB_SiteLabel';
import UNASSIGNED_URL from '@salesforce/label/c.BI_PSPB_UnAssignedLabel';
import BRANDED_SITE_URL from '@salesforce/label/c.BI_PSPB_BrandedSiteNaviUrl';
import UNASSIGNED_SITE_URL from '@salesforce/label/c.BI_PSPB_UnAssignedNaviUrl';
import LANDING_PAGE from '@salesforce/label/c.BI_PSPB_InfoCenterLandingUrl';
import ACUTE_VIDEO_PAGE from '@salesforce/label/c.BI_PSPB_AcuteVideoPage';
import ERROR_MESSAGE from '@salesforce/label/c.BI_PSP_ConsoleError';
import ERROR_VARIANT from '@salesforce/label/c.BI_PSP_ErrorVariantToast';

export default class BiPspbAcuteVideoParent extends LightningElement {

	urlq;
	siteUrlq;
	currentPageUrl;
	urlSegments;
	baseUrl;

	// To navigate to information center landing page
	openAcute() {
		window.location.assign(this.siteUrlq + LANDING_PAGE);
	}

	// To navigate to information center acute video page
	openChronic() {
		window.location.assign(this.siteUrlq + ACUTE_VIDEO_PAGE);
	}

	// To render the subheader
	connectedCallback() {
		try {
			const globalThis = window;
			let currentUrl = globalThis.location.href; // Create a URL object
			let urlObject = new URL(currentUrl); // Get the path
			let path = urlObject.pathname; // Split the path using '/' as a separator
			let pathComponents = path.split('/'); // Find the component you need (in this case, 'Branded')
			let desiredComponent = pathComponents.find((component) =>
				[BRANDED_URL.toLowerCase(), UNASSIGNED_URL.toLowerCase()].includes(
					component.toLowerCase()
				)
			);

			if (desiredComponent.toLowerCase() === BRANDED_URL.toLowerCase()) {
				this.urlq = BRANDED_URL;
				this.siteUrlq = BRANDED_SITE_URL;
			} else {
				this.urlq = UNASSIGNED_URL;
				this.siteUrlq = UNASSIGNED_SITE_URL;
			}
			this.currentPageUrl = globalThis.location.href;
			this.urlSegments = this.currentPageUrl.split('/');
			this.baseUrl = `${this.urlSegments[0]}//${this.urlSegments[2]}`;
			
		} catch (error) {
			this.navigateToErrorPage(ERROR_MESSAGE, error.message, ERROR_VARIANT); // Catching Potential Error
		}
	}
	
	// navigateToErrorPage used for all the error messages caught
	navigateToErrorPage(title, message, variant) {
		let event = new ShowToastEvent({
			title: title,
			message: message,
			variant: variant
		});
		if(typeof window !== 'undefined'){
		this.dispatchEvent(event);
		}
	}
}