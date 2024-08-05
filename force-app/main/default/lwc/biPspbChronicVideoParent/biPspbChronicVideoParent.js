// This lightning web component is used for display the chronic treatment video and chronic avatar message
// To import Libraries
import { LightningElement } from 'lwc';
// To import Custom Labels
import BRANDED_URL from '@salesforce/label/c.BI_PSPB_SiteLabel';
import UNASSIGNED_URL from '@salesforce/label/c.BI_PSPB_UnAssignedLabel';
import LANDING_PAGE from '@salesforce/label/c.BI_PSPB_InfoCenterLandingUrl';
import BRANDED_SITE_URL from '@salesforce/label/c.BI_PSPB_BrandedSiteNaviUrl';
import UNASSIGNED_SITE_URL from '@salesforce/label/c.BI_PSPB_UnAssignedNaviUrl';
import CHRONIC_PAGE from '@salesforce/label/c.BI_PSPB_ChronicVideoUrl';
import ERROR_PAGE from '@salesforce/label/c.BI_PSP_DisplayErrorPage';

export default class BiPspbChronicVideoParent extends LightningElement {
	currentPageUrl;
	urlSegments;
	baseUrl;
	siteUrlq;

	// To navigate to information center landing page
	openAcute() {
		window.location.assign(this.siteUrlq + LANDING_PAGE);
	}

	// To navigate to information center chronic video page
	openChronic() {
		window.location.assign(BRANDED_SITE_URL + CHRONIC_PAGE);
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
				this.siteUrlq = BRANDED_SITE_URL;
			} else {
				this.siteUrlq = UNASSIGNED_SITE_URL;
			}
			this.currentPageUrl = globalThis.location.href;
			this.urlSegments = this.currentPageUrl.split('/');
			this.baseUrl = `${this.urlSegments[0]}//${this.urlSegments[2]}`;
			let windowWidth = globalThis.innerWidth;
			let displayvideotab = this.template.querySelector(
				'.grid-containerTabs'
			);

			if (windowWidth <= 1000) {
				if (displayvideotab) {
					displayvideotab.style.display = 'none';
				}
			}
		} catch (error) {
			this.navigateToErrorPage(error.message); // Catching Potential Error
		}
	}


	// navigateToErrorPage used for all the error messages caught
	navigateToErrorPage(errorMessage) {
		let globalThis = window;
		globalThis.sessionStorage.setItem('errorMessage', errorMessage);
		globalThis.location.assign(this.siteUrlq + ERROR_PAGE);	
	}
}