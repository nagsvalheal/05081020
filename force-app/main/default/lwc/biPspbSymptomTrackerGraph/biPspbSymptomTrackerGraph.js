//This LWC is Used for display allergy values and symptom values based on month wise  - biPspbSymptomTrackerGraph
// To import Libraries
import { LightningElement, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

// To import Apex Classes
import GET_ENROLLE from '@salesforce/apex/BI_PSP_ChallengeEnrolleCtrl.getEnrolle';
import FETCH_SYMPTOM_EROLLE from '@salesforce/apex/BI_PSP_SymptomTrackerGraphCtrl.getSymptomTrackerDetails';
import GET_LATEST_SYMPTOM_RECORD from '@salesforce/apex/BI_PSPB_SymptomPrimaryPageCtrl.getLatestSymptomRecord';
// To import Custom labels and static resources
import * as label from 'c/biPspbLabelAndResourceSymptom';

export default class BiPspbSymptomTrackerGraph extends LightningElement {
	//Proper naming conventions with camel case for all the variable will be followed in the future releases
	// variable declaration
	receivedValue;
	dateWithAllery = [];
	highlight = false;
	showDiv = false;
	remainingItems = [];
	pdfName;
	firstDate;
	lastDate;
	symptomIdGet
	checkValue = false;
	showLine;
	currentDisplayIndex = 0;
	dateWithAlleryTwo = [];
	dateWithAlleryThree = [];
	dateWithAlleryFour = [];
	leftLess;
	rightLess;
	showChart = false;
	updateValue = false;
	understand = false;
	latestRecord;
	throwErrorMessage = false;
	showLoading = true;
	//Variable declaration
	urlq;
	enrolleId;
	montss;
	yellowEllipse = label.YELLOW_ELLIPSE;
	rightImg = label.RIGHT_ICON;
	darkRedEllipse = label.DARK_RED_ELLIPSE;
	blueEllipse = label.BLUE_ELLIPSE;
	verticalLine = label.VERTICAL_LINE;
	greenEllipse = label.GREEN_ELLIPSE;
	violetEllipse = label.VIOLET_ELLIPSE;
	redEllipse = label.RED_ELLIPSE;
	darkYellowEllipse = label.DARK_YELLOW_ELLIPSE;
	bubbles = '';
	userId = label.Id;
	errorMessage;
	showError;
	CURRENT_INDEX = 0;
	showPopup;
	placeholder = label.MONTH;
	symptomDeclaration = label.SYMPTOM_DECLARATION;
	comeTommorow = label.COME_TO_COMPLETE;
	symptomTrackerLabel =label.SYMPTOM_TRACKER_LABEL;
	noSymptomThisMonth = label.BI_PSP_NoSymptomThisMonth;
	pastEntries = label.PAST_ENTRIES;
	updateSymptoms = label.UPDATE_SYMPTOM;
	downloadLabel = label.DOWNLOAD_LABEL;
	itchinessLabel = label.ITCHINESS_VALUES;
	rednessLabel = label.REDNESS_VALUE;
	temperatureLabel = label.TEMPERATURE_VALUES;
	pustulesLabel = label.PUSTULES_VALUE;
	painLabel = label.PAIN_VALUES;
	fatigueLabel = label.FATIGUE_VALUES;
	moodLabel = label.MOOD_IMG;
	confirmSubmission = label.CONFIRM_SUBMISSION;
	aboveInformationCorrect = label.UNDERSTAND_PROVIDED_INFO;
	iUnderstand = label.I_UNDERSTAND;
	sureDownloadSymptom = label.SURE_DOWNLOAD_SYMPTOM;
	yesLabel = label.BI_PSP_OptionValueYes;
	noLabel = label.BI_PSP_OptionValueNo;

	selectedMonthValue;
	picklistOptions = [
		{ label: label.JANUARY, value: label.JANUARY },
		{ label: label.FEBRUARY, value: label.FEBRUARY },
		{ label: label.MARCH, value: label.MARCH },
		{ label: label.APRIL, value: label.APRIL },
		{ label: label.MAY, value: label.MAY },
		{ label: label.JUNE, value: label.JUNE },
		{ label: label.JULY, value: label.JULY },
		{ label: label.AUGUST, value: label.AUGUST },
		{ label: label.SEPTEMBER, value: label.SEPTEMBER },
		{ label: label.OCTOBER, value: label.OCTOBER },
		{ label: label.NOVEMBER, value: label.NOVEMBER },
		{ label: label.DECEMBER, value: label.DECEMBER }
	];
	// Handles the response from the getLatestSymptomRecord Apex method. 
	@wire(GET_LATEST_SYMPTOM_RECORD, { careProgramEnrolleeId: '$enrolleId' })
	wiredLatestRecord({ error, data }) {
		if (data && data !== null) {
			try {
				this.latestRecord = data[0];
				this.errorMessage = ''; // Clear any previous error
			} catch (ex) {
				this.showToast(label.ERROR_MESSAGES, ex.message, label.ERROR_VARIANT);
				// Handle the error accordingly, such as displaying an error message to the user
				this.errorMessage = label.UNEXPECTED_ERROR;
				this.latestRecord = null;
			}
		} else if (error) {
			this.showToast(label.ERROR_MESSAGES, error.body.message, label.ERROR_VARIANT);
			this.latestRecord = null;
			this.errorMessage = label.LATEST_RECORD;
		}
	}
	// Determines the current URL and sets a navigation URL based on certain PATH components.
	get picklistLabels() {
		return this.picklistOptions.map(option => option.label);

	} handlePageRefresh(event) {
		let globalThis = window;
		globalThis.sessionStorage?.clear();
		event.returnValue = "";
	}
	connectedCallback() {
		let globalThis = window;
		globalThis.addEventListener("beforeunload", this.handlePageRefresh);

		// 		// this.isLoading = true;
		// 	const queryParams = new URLSearchParams(window.location.search);
		// // Get the value of the 'valuess' parameter
		// this.receivedValue = queryParams.get('value');

		this.receivedValue = globalThis?.sessionStorage.getItem('someDynamicValue')


		if (this.receivedValue) {
			this.showDiv = true;

		}



		// Check if the value is received

		// You can use the value here as needed

		const CURRENT_URL = globalThis.location?.href;
		// Create a URL object
		const URL_OBJECT = new URL(CURRENT_URL);
		// Get the PATH
		const PATH = URL_OBJECT.pathname;
		// Split the PATH using '/' as a separator
		const PATH_COMPONENTS = PATH.split(label.SLASH);
		// Find the component you need (in this case, 'Branded')
		const DESIRED_COMPONENT = PATH_COMPONENTS.find(component =>
			[label.BRANDED_URL.toLowerCase(), label.UNASSIGNED_URL.toLowerCase()].includes(component.toLowerCase())
		);
		if (DESIRED_COMPONENT.toLowerCase() === label.BRANDED_URL.toLowerCase()) {
			this.urlq = label.BRANDED_URL_NAVIGATION;
		}
		else {
			this.urlq = label.UNASSIGNED_URL_NAVIGATION;
		}
		let primarypopup = globalThis?.sessionStorage.getItem(label.PRIMARY_PAGES);
		if (primarypopup) {
			this.openundersatand()
		}
		try {
			GET_ENROLLE({ userId: this.userId })
				// Null data is checked and AuraHandledException is thrown from the Apex
				.then(result => {

					if (result[0].patientEnrolle !== null) {

						this.enrolleId = result[0].patientEnrolle.Id;
						let urlParams = new URLSearchParams(globalThis.location?.href.split(label.QUESTION_MARK)[1]);
						let eroll = urlParams.get(label.EROLLS);
						let firstdate1 = urlParams.get(label.FIRST_DATE);
						let lastdate1 = urlParams.get(label.LAST_DATE);
						this.firstDate = firstdate1;
						this.lastDate = lastdate1;
						let month = urlParams.get(label.MONTHS);
						this.selectedMonthValue = month;
						if (eroll !== null && firstdate1 !== null && lastdate1 !== null) {
							const SELECT_ELEMENT = this.template.querySelector('.selectWidth');//This is the querySelector which uses html class 


							SELECT_ELEMENT.value = month;
							this.getsymptomdatewithallergy(eroll, firstdate1, lastdate1);
						}
					} else if (result[0].error !== null) {
						this.showError = true;
						this.errorMessage = result[0].error;
					}
				})
				.catch(error => {
					// Handle any errors occurring during the promise chain
					this.showToast(label.ERROR_MESSAGES, error.message, label.ERROR_VARIANT);
				});
		} catch (error) {
			// Handle any synchronous errors outside the promise chain
			this.showToast(label.ERROR_MESSAGES, error.message, label.ERROR_VARIANT);
		}
	}
	//Returns the formatted date string.	
	parsedDat(dateToFormat) {
		const PARSED_DATE = new Date(dateToFormat);
		const OPTIONS = { month: 'short' };

		// Get the short month name
		const month = PARSED_DATE.toLocaleDateString('en-US', OPTIONS).split(' ')[0];

		// Get the numeric day
		const day = PARSED_DATE.getDate();

		// Return formatted date as "Jun 6"
		return `${month} ${day}`;
	}
	//Captures the current state of the component and generates a PDF report
	captureComponent() {
		let globalThis = window;
		if (this.selectedMonthValue !== null && this.dateWithAllery !== null) {
			let currenturl = globalThis.location.href?.split(label.SLASH_LATTER)[0];
			globalThis.open(currenturl + label.SYMPTOM_TRACKER_PDF + this.enrolleId + label.FIRST_DATE_GRAPH + this.firstDate + label.LAST_DATE_GRAPH + this.lastDate);
		}
	}
	handleclose() {
		this.showDiv = false;
	}
	//To Updates the selectedMonthValue property with the value of the selected category.
	handleCategoryChange(event) {
		this.showChart = false;
		this.checkValue = false;
		this.currentDisplayIndex = 0;
		this.dateWithAllery = [];
		this.dateWithAlleryTwo = [];
		this.dateWithAlleryThree = [];
		this.dateWithAlleryFour = [];
		this.remainingItems = [];
		this.rightLess = false;
		this.leftLess = false;
		this.selectedMonthValue = event.target.value;

		this.pdfName = label.SYMPTOM_TRACKERS + this.selectedMonthValue + label.PDF;

		const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
		const monthIndex = months.findIndex(month => month === this.selectedMonthValue);

		const day = 1;

		const selectedDate = new Date(new Date().getFullYear(), monthIndex, day);

		// const SELECTED_DATE = new Date(this.selectedMonthValue + ZERO_ONE);

		const SELECTED_MONTH_INDEX = selectedDate.getMonth();

		const SELECTED_YEAR = selectedDate.getFullYear();
		const CURRENT_DATE = new Date();
		const CURRENT_YEAR = CURRENT_DATE.getFullYear();

		if (SELECTED_YEAR < CURRENT_YEAR || (SELECTED_YEAR === CURRENT_YEAR && SELECTED_MONTH_INDEX <= CURRENT_DATE.getMonth())) {
			// Calculate first date of next month
			this.montss = this.getDatesOfMonth();
			const FIRST_DATE_OF_NEXT_MONTH = new Date(CURRENT_YEAR, SELECTED_MONTH_INDEX + 1, 1);
			FIRST_DATE_OF_NEXT_MONTH.setHours(18, 30, 0, 0); // Set time to 18:30:00.000

			// Calculate last date of previous month
			const LAST_DATE_OF_PREVIOUS_MONTH = new Date(CURRENT_YEAR, SELECTED_MONTH_INDEX, 0);
			LAST_DATE_OF_PREVIOUS_MONTH.setHours(18, 30, 0, 0); // Set time to 18:30:00.000

			// Subtract one day from the first date of next month
			FIRST_DATE_OF_NEXT_MONTH.setDate(FIRST_DATE_OF_NEXT_MONTH.getDate() - 1);

			// Assign values to this.firstDate and this.lastDate
			this.firstDate = LAST_DATE_OF_PREVIOUS_MONTH.toISOString();
			this.lastDate = FIRST_DATE_OF_NEXT_MONTH.toISOString();
			// Call your function with the desired date range
			this.getsymptomdatewithallergy(this.enrolleId, this.firstDate, this.lastDate);
		} else {
			this.montss = this.getDatesOfMonth();

			// Calculate first date of current month
			const FIRST_DATE_OF_CURRENT_MONTH = new Date(CURRENT_YEAR, SELECTED_MONTH_INDEX, + 1, 1);
			FIRST_DATE_OF_CURRENT_MONTH.setHours(18, 30, 0, 0); // Set time to 18:30:00.000

			// Calculate last date of previous month
			const LAST_DATE_OF_PREVIOUS_MONTH = new Date(CURRENT_YEAR, SELECTED_MONTH_INDEX, 0);
			LAST_DATE_OF_PREVIOUS_MONTH.setHours(18, 30, 0, 0); // Set time to 18:30:00.000

			// Subtract one day from the first date of current month
			FIRST_DATE_OF_CURRENT_MONTH.setDate(FIRST_DATE_OF_CURRENT_MONTH.getDate() - 1);

			// Assign values to this.firstDate and this.lastDate
			this.firstDate = LAST_DATE_OF_PREVIOUS_MONTH.toISOString();
			this.lastDate = FIRST_DATE_OF_CURRENT_MONTH.toISOString();

			// Call your function with the desired date range
			this.getsymptomdatewithallergy(this.enrolleId, this.firstDate, this.lastDate);
		}
	}

	openundersatand() {
		// Add your specific logic for opening the mood modal
		this.understand = true;
		this.submitModal = false;
	}
	closeundersatand() {
		// Add your specific logic for closing the mood modal
		this.understand = false;
	}
	formatDate(inputDate) {
		// Regular expression PATTERN for "Month Day" format, e.g., "Aug 27"
		const PATTERN = /^[A-Za-z]{3}\s\d{1,2}$/u;
		// Use test method of the regular expression to check if the format matches
		let checkFormat = PATTERN.test(inputDate);
		if (!checkFormat) {
			// Split the input date string into month and day parts
			let [day, month] = inputDate.split(' ');
			// Return the formatted date string with day first and month second
			return `${month} ${day}`;
		}

		return inputDate;

	}

	//Fetches symptom and allergy data for the specified enrollee and date range using the FETCH_SYMPTOM_EROLLE method.

	getsymptomdatewithallergy(erolles, firstDate, lastDate) {
		// this.isLoading = true;
		FETCH_SYMPTOM_EROLLE({ erolleId: erolles, firstDate: firstDate, lastDate: lastDate })
			.then(result => {
                      console.log(result,'result')
				// this.isLoading = false;
				if (result !== null) {
					result.forEach(item => {
						const EXISTING_DATE = this.dateWithAllery.find(entry => entry.dates === this.parsedDat(item.dates));
						if (EXISTING_DATE) {
							EXISTING_DATE.imageUrls.push(this.getImagesForName(item.name));
						} else {
							this.dateWithAllery.push({
								dates: this.parsedDat(item.dates),
								imageUrls: [this.getImagesForName(item.name)],
								symptom: item.symptom
							});
						}
					});

					if (this.dateWithAllery.length > 7) {
						this.rightLess = true;
						Promise.resolve().then(() => {
							this.changeNextSeven();
						});
					}

					// Sorting the array by dates in ascending order
					this.dateWithAllery.sort((a, b) => new Date(a.dates) - new Date(b.dates));


					this.dateWithAlleryTwo = this.dateWithAllery;
					//this.generatePdf(JSON.stringify(this.dateWithAlleryTwo), null, null);
					this.dateWithAlleryThree = this.dateWithAllery;
					this.dateWithAlleryFour = this.dateWithAllery;
					console.log(this.dateWithAlleryFour,'this.dateWithAlleryFour')



					//

					// Limit to 7 items if needed, but preserve the full list in dateWithAlleryTwo, 3, and 4
					this.dateWithAllery = this.dateWithAllery.slice(0, 7);


					if (this.dateWithAllery.length > 0) {
						// this.isLoading = false;
						this.throwErrorMessage = false;
						this.showLine = true;
						this.showChart = true;
					} else {
						// this.isLoading = false;
						this.showLine = false;
						this.showChart = false;
					}





					// Filtering the dateWithAllery array based on selected dates
					this.dateWithAllery = this.dateWithAllery.filter(item => {
						// Check if the item's date is included in the selectedDates array                        
						let isDateAvailable = false;
						for (let i = 0; i < this.montss.length; i++) {
							if (this.montss[i] === this.formatDate(item.dates)) {
								isDateAvailable = true;
								break;
							}
						}
						return isDateAvailable;
					});
				} else {
					this.showChart = false;
					this.checkValue = false;
					this.throwErrorMessage = true;
				}

			})



			.catch(error => {
				this.label.ERROR_MESSAGES = error;
			});
	}


	// Function to generate an array of dates for the selected month
	getDatesOfMonth() {
		const MONTH_NAMES = [
			label.JANUARY, label.FEBRUARY, label.MARCH, label.APRIL, label.MAY, label.JUNE,
			label.JULY, label.AUGUST, label.SEPTEMBER, label.OCTOBER, label.NOVEMBER, label.DECEMBER
		];
		const SELECTED_MONTH_INDEX = MONTH_NAMES.indexOf(this.selectedMonthValue);
		const NUMBER_OF_DAYS = new Date(new Date().getFullYear(), SELECTED_MONTH_INDEX + 1, 0).getDate();
		const DATES_OF_MONTH = [];
		for (let day = 1; day <= NUMBER_OF_DAYS; day++) {
			DATES_OF_MONTH.push(`${this.selectedMonthValue.substr(0, 3)} ${day}`);
		}
		return DATES_OF_MONTH;
	}
	// Returns an array of formatted dates like "Jan 1", "Jan 2", ...
	get bars() {


		return this.dateWithAllery.map(entry => ({
			height: `${entry.imageUrls.length * 20}px`,
			dates: entry.dates,
			imageUrls: entry.imageUrls
		}));
	}
	// Function to return the appropriate image URL based on the given symptom name
	getImagesForName(name) {
		switch (name) {
			case label.REDNESS_VALUE:
				return label.RED_ELLIPSE;
			case label.ITCHINESS_VALUES:
				return label.DARK_YELLOW_ELLIPSE;
			case label.PAIN_VALUES:
				return label.VIOLET_ELLIPSE;
			case label.PUSTULES_VALUE:
				return label.GREEN_ELLIPSE;
			case label.FATIGUE_VALUES:
				return label.BLUE_ELLIPSE;
			case label.TEMPERATURE_VALUES:
				return label.DARK_RED_ELLIPSE;
			case label.MOOD_IMG:
				return label.YELLOW_ELLIPSE;
			default:
				return label.DARK_RED_ELLIPSE;
		}
	}
	// Function to toggle the CSS class for highlighting background
	highlightbackground() {
		if (this.bubbles === '') {
			this.bubbles = label.HIGHLIGHT_BACK;
		} else {
			this.bubbles = '';
		}
	}

	//Function to highlight the selected bar and update related properties
	showHighlighter(event) {
		let clickedKey = event.target.dataset.item;
		console.log(clickedKey,';clickedKey')
		let bars = this.template.querySelectorAll('.bar');//This is the css property of overflow so this can't be through customlabel
		bars.forEach((bar) => {
			if (bar.dataset.item === clickedKey) {
				bar.style.backgroundColor = '#ECDCA8';//This is the css property of overflow so this can't be through customlabel
				bar.style.borderRadius = '12px';//This is the css property of overflow so this can't be through customlabel
			} else {
				bar.style.backgroundColor = '';
			}
		});
		const EXISTING_DATE = this.dateWithAlleryFour.find(entry => entry.dates === clickedKey);
		console.log(EXISTING_DATE,';clickedKey')
		this.symptomIdGet = EXISTING_DATE.symptom;
		console.log(this.symptomIdGet,'this.symptomIdGet')
		if (this.symptomIdGet) {
			this.checkValue = true;
		}
		else {
			this.checkValue = false;
		}
	}
	// Function to update the displayed data to the next seven days
	changeNextSeven() {

		this.dateWithAlleryTwo = this.dateWithAlleryFour;
		this.currentDisplayIndex += 7;
		this.updateBars();
	}
	// Function to update the displayed data to the previous seven days
	changePreviousSeven() {
		this.dateWithAlleryThree = this.dateWithAlleryFour;
		this.currentDisplayIndex -= 7;
		if (JSON.stringify(this.currentDisplayIndex) === label.ZERO_VALUE) {
			this.leftLess = false;
		}
		this.updateBars1();
	}
	// Function to update the displayed bars based on the current display index
	updateBars1() {
		let endIndex = this.currentDisplayIndex + 7;
		if (endIndex === -(this.currentDisplayIndex)) {
			// this.currentDisplayIndex = 0;
			this.rightLess = true;
		} else {
			this.rightLess = true;
		}
		this.dateWithAlleryThree = this.dateWithAlleryThree.slice(this.currentDisplayIndex, endIndex);
		this.dateWithAllery = this.dateWithAlleryThree;
		if (this.dateWithAllery.length > 0) {
			this.showLine = true;
			this.bars();
		} else {
			this.showLine = false;
		}
		this.dateWithAlleryThree = this.dateWithAlleryFour;
	}
	//Calculates end index for the displayed data and adjusts if it exceeds the length of the data array
	updateBars() {
		let endIndex = this.currentDisplayIndex + 7;
		if (endIndex > this.dateWithAlleryTwo.length) {
			endIndex = this.dateWithAlleryTwo.length;
			this.rightLess = false;
			this.leftLess = true;
		} else {
			this.leftLess = false;
		}
		this.dateWithAlleryTwo = this.dateWithAlleryTwo.slice(this.currentDisplayIndex, endIndex);
		this.dateWithAllery = this.dateWithAlleryTwo;
		if (this.dateWithAllery.length > 0) {
			this.showLine = true;
			this.bars();
		} else {
			this.showLine = false;
		}
		this.dateWithAlleryTwo = this.dateWithAlleryFour;
	}

	updatesymptom() {
		let globalThis = window;
		// window.location.assign('/' + this.urlq + '/s/bi-pspb-symptomtrackerlandingpage?edit=true');
		globalThis.location.assign(this.urlq + label.SYMPTOM_MAIN_PAGE_URL);
		globalThis.localStorage.clear();
		globalThis.sessionStorage.clear();
	}
	doNotLogout() {
		this.showPopup = false;
		document.body.style.overflow = ''; // Reset to default
	}
	openShowPopUp() {
		this.showPopup = true;
		document.body.style.overflow = 'hidden'; //This is the css property of overflow so this can't be through customlabel
	}
	// Function to move the selection in a dropdown menu upwards
	moveSelectionUp() {
		const SELECT_ELEMENT = this.template.querySelector('select');//This is the querySelector which uses html class 
		const CURRENT_INDEX = SELECT_ELEMENT.selectedIndex;
		if (CURRENT_INDEX > 0) {
			SELECT_ELEMENT.selectedIndex = CURRENT_INDEX - 1;
			this.handleSelectionChange();
		}
	}
	// Function to move the selection in a dropdown menu downwards
	moveSelectionDown() {
		const SELECT_ELEMENT = this.template.querySelector('select');//This is the querySelector which uses html class 
		const CURRENT_INDEX = SELECT_ELEMENT.selectedIndex;
		if (CURRENT_INDEX < SELECT_ELEMENT.OPTIONS.length - 1) {
			SELECT_ELEMENT.selectedIndex = CURRENT_INDEX + 1;
			this.handleSelectionChange();
		}
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