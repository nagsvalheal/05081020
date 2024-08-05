// This LWC serves as a landing page for a symptom tracker, offering options to create new entries and displaying a happy face image. 
// It dynamically determines the URL based on the current page and navigates users accordingly.
// To import Libraries
import { LightningElement } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
// To import Custom labels and static resources
import * as label from 'c/biPspbLabelAndResourceSymptom';
export default class biPspbSymptomLandingPage extends NavigationMixin(LightningElement) {
	//variable declaration
	emptyGraph = label.EMPTY_GRAPH;
	symptomTracker = label.SYMPTOM_TRACKER_LABEL;
	noSymptomYet = label.NO_SYMPTOM_YET;
	createNewEntry = label.CREATE_NEW_ENTRY ;
	//This method is called when the component is connected to the DOM.
	connectedCallback() {
		let globalThis = window;
		try {
			const currentURL = globalThis.location?.href;
			// Create a URL object
			const urlObject = new URL(currentURL);
			// Get the path
			const path = urlObject.pathname;
			// Split the path using '/' as a separator
			const pathComponents = path.split(label.SLASH);
			// Find the component you need (in this case, 'Branded')
			const desiredComponent = pathComponents.find(component =>
				[label.BRANDED_URL.toLowerCase(), label.UNASSIGNED_URL.toLowerCase()].includes(component.toLowerCase())
			);
			if (desiredComponent.toLowerCase() === label.BRANDED_URL.toLowerCase()) {
				this.brandedOrUnassigned = label.BRANDED_URL_NAVIGATION;
			}
			else {
				this.brandedOrUnassigned = label.UNASSIGNED_URL_NAVIGATION;
			}
		}
		catch (error) {
			this.showToast(label.ERROR_MESSAGE, error.message, label.ERROR_VARIANT);
		}
	}
	openEntryDate() {
		let globalThis = window;
		globalThis.location?.assign(label.SYMPTOM_MAIN_PAGE_URL)
		globalThis.localStorage.clear()
	}
	// showToast used for all the error messages caught
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