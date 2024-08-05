//This Lightning web component purpose is Avatar Prompt message for all the navigation pages
//To import the Libraries
import { LightningElement, wire, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
//To import the Apex class
import LOGGED_USER from '@salesforce/apex/BI_PSP_CurrentUser.getCurrentUser';
import USER_CAREGIVER from '@salesforce/apex/BI_PSP_CurrentUser.getEnrolleeRecords';
//To Import The Static Resources
import DEFAULT_AVATAR_JPEG_URL from '@salesforce/resourceUrl/BI_PSPB_DefaultAvatarNavigation';
//To Import the Custom Labels
// import ERROR_VARIANT from '@salesforce/label/c.BI_PSP_ErrorVariantToast';
import { label } from "c/biPspbAvatarResources";



export default class BiPspbAvatarNavigation extends LightningElement {
	// Declaration of variables with @track
	dermo = false;
	contentDot = true;
	content = false;
	summary = false;
	twoContent = false;
	challangeContent = false;
	mobileName;
	twoMobileName;
	navigationContentDot;
	navigationContent = 'navigationcontent5'; //css class
	selected;
	selectedName = '';
	selectedNameOne;
	selectedNameSecond;
	selectedNameThird;
	contentTwo = true;
	contentThree = true;
	selectedNameQues;
	selectedNameThree;
	selectedNameTwo;
	selectedNameFour;
	selectedNameAvatar = false;
	selectedNameFive;
	SelectedNameFiveChild;
	avatarImgClass = 'avatar-container'
	reloaded;
	caregiver = false;
	main = true;
	showAllCmps = true;
	xpValue;
	errorMedical;
	errorReport;
	patientavatar = false;
	closeValue = 'close'; //css class
	closeValueSum = 'closesum'; //css class
	challangeContents = false;
	selectedOption = {
		src: DEFAULT_AVATAR_JPEG_URL,
		name: '',
	};
	mobileValue;
	selectedValue;
	contentDotOne = false;
	twoContentMobile = false;
	challangeContentMobile = false;
	subMobile;
	twoContentMobileOne = false;
	// Declaration of variables 
	userContacts;
	name;
	rendered = false;
	avtList;
	selectedAvatarSrc;
	seperateChallenge;
	userAccounts;
	challengeNameOne;
	challengeNameTwo;
	@api
	get receivedXpValue() {
		return this.xpValue;
	}
	set receivedXpValue(value) {
		this.xpValue = value;
		if (this.xpValue === label.XP_VALUE) {
			this.challangeContent = false;
		}
	}

	@api
	get receivedError() {
		return this.errorMedical;
	}
	set receivedError(value) {
		this.errorMedical = value;
		if (this.errorMedical === true) {
			this.handleClose();
			//Strings are hardcoded for css responsiveness
			this.selectedNameOne = label.SUPPORT_VALUE_ONE;
			this.selectedNameSecond = label.SUPPORT_VALUE_TWO;
			this.mobileName = label.MEDICAL_MOB_ONE;
			this.mobileValue = label.MEDICAL_MOB_TWO;
		}
		else {
			this.selectedNameOne = label.SUPPORT_VALUE_THREE;
			this.selectedNameSecond = label.SUPPORT_VALUE_FOUR;
			this.mobileName = label.MEDICAL_MOB_ONE;
			this.mobileValue = label.MEDICAL_MOB_THREE;
		}
	}

	@api
	get receivedErrorReport() {
		return this.errorReport;
	}
	set receivedErrorReport(value) {
		this.errorReport = value;
		if (this.errorReport === true) {
			this.handleClose();
			//Strings are hardcoded for css responsiveness
			this.selectedNameOne = label.REPORT_VALUE_ONE;
			this.selectedNameSecond = label.REPORT_VALUE_TWO;
			this.mobileName = label.REPORT_MOB_ONE;
			this.mobileValue = label.REPORT_MOB_TWO;
		}
		else {
			this.selectedNameOne = label.REPORT_VALUE_ONE;
			this.selectedNameSecond = label.REPORT_VALUE_TWO;
			this.mobileName = label.REPORT_MOB_ONE;
			this.mobileValue = label.REPORT_MOB_THREE;
		}
	}
	@api
	get receivedcategory() {
		return this.receivedCategory;
	}
	set receivedcategory(value) {
		let globalThis = window;

		const CURRENT_TAB_NAME = globalThis.location?.pathname.split('/').pop();
		this.receivedCategory = value;

		this.summary = true;
		this.dermo = true;
		this.main = false;

		if (value === label.DLQI_HEADING) {
			this.content = false;
			this.contentDot = false;
		}

		if (value === label.DLQI_HEADING) {

			this.content = false;
			this.contentDotOne = true;
			this.contentDot = false;
			if (CURRENT_TAB_NAME === label.SUMMARY_URL && value === label.DLQI_HEADING) {
				this.content = false;
				this.twoContentMobileOne = false;
				this.navigationContentDot = 'navigationcontentdot';
				//Strings are hardcoded for css responsiveness
				this.selectedNameSix = label.QUES_VALUE_ONE;
				this.mobileName = label.QUES_MOB_ONE;
				this.mobileValue = label.QUES_MOB_TWO;
				this.selectedNameFive = label.QUES_VALUE_TWO;
				this.SelectedNameFiveChild = label.QUES_VALUE_THREE;

				this.selectedNameFour = label.QUES_VALUE_FOUR;
				this.selectedNameTwo = label.QUES_VALUE_FOUR;

			}

		}
		else if (value === label.WAPI_HEADING) {

			this.content = false;
			this.contentDotOne = true;
			this.contentDot = false;
			if (CURRENT_TAB_NAME === label.SUMMARY_URL) {
				this.content = false;
				this.twoContentMobileOne = false;
				this.navigationContentDot = 'navigationcontentdot1sub1';
				this.selectedNameSix = label.QUES_VALUE_FIVE;
				this.mobileName = label.QUES_MOB_THREE;
				this.mobileValue = label.QUES_MOB_FOUR;

				this.selectedNameFive = label.QUES_VALUE_SIX;
				this.SelectedNameFiveChild = label.QUES_VALUE_SEVEN;
				this.selectedNameFour = label.QUES_VALUE_FOUR;
				this.selectedNameTwo = label.QUES_VALUE_FOUR;
			}
		}
		else if (value === label.PSS_HEADING) {
			this.content = false;
			this.contentDotOne = true;
			this.contentDot = false;
			if (CURRENT_TAB_NAME === label.SUMMARY_URL) {
				this.content = false;
				this.twoContentMobileOne = false;
				this.navigationContentDot = 'navigationcontentdot1sub2';
				this.mobileName = label.PSORIASIS_MOB_ONE;
				this.mobileValue = label.PSORIASIS_MOB_TWO;
				this.selectedNameSix =label. QUES_VALUE_EIGHT;
				this.selectedNameFive = label.QUES_VALUE_NINE;
				this.SelectedNameFiveChild = label.QUES_VALUE_TEN;
				this.selectedNameFour = label.QUES_VALUE_FOUR;
				this.selectedNameTwo = label.QUES_VALUE_FOUR;
			}
		}

	}

	//To trigger Close icon in Avatar navigation
	handleClose() {
		let globalThis = window;
		const CURRENT_TAB_NAME = globalThis.location?.pathname.split('/').pop();
		if (this.contentDot === false && this.contentDotOne === false) {
			this.contentDot = true;

			this.mobileName = this.subMobile;
			if (CURRENT_TAB_NAME === label.SUMMARY_URL) {
				this.navigationContent = 'navigationcontent5sub';
				this.contentDotOne = true;
				this.contentDot = false;
				this.mobileName = this.subMobile;
			}
			if (CURRENT_TAB_NAME === label.OUTSTANDING_QUESTIONNAIRE_URL) {
				this.twoContentMobile = false;

			}
			if (CURRENT_TAB_NAME === label.PATIENT_FIRST_AVATAR) {
				this.twoContentMobile = false;
			}
			if (CURRENT_TAB_NAME === label.SUMMARY_URL) {
				this.twoContentMobileOne = false;
			}
			if (CURRENT_TAB_NAME === label.CHALLENGES_URL) {
				this.challangeContentMobile = false;

			}
		}

	}

	//To trigger three Dots in Avatar Navigation
	mobileclick() {
		const CURRENT_TAB_NAME = window.location.pathname.split('/').pop();
		this.subMobile = this.mobileName;
		this.mobileName = this.mobileValue;
		this.closeValue = 'close1';
		this.contentDot = false;
		this.contentDotOne = false;
		if (CURRENT_TAB_NAME === label.SUMMARY_URL) {
			this.navigationContent = 'navigationcontent5sub';

			this.mobileName = this.selectedNameFive;
		}
		if (CURRENT_TAB_NAME === label.OUTSTANDING_QUESTIONNAIRE_URL) {
			this.twoContentMobile = true;
			this.twoMobileName = this.selectedNameTwo;
		}
		if (CURRENT_TAB_NAME === label.PATIENT_FIRST_AVATAR) {
			this.twoContentMobile = true;
			this.twoMobileName = this.selectedNameTwo;
		}
		if (CURRENT_TAB_NAME === label.CAREGIVER_FIRST_AVATAR) {
			this.twoContentMobile = true;
			this.twoMobileName = this.selectedNameTwo;
		}
		if (CURRENT_TAB_NAME === label.SUMMARY_URL) {
			this.twoContentMobileOne = true;
			this.twoMobileName = this.selectedNameFour;
		}
		if (CURRENT_TAB_NAME === label.CHALLENGES_URL) {
			this.challangeContentMobile = true;
			this.twoMobileName = this.selectedNameThree;
			if (this.xpValue === label.XP_VALUE) {
				this.challangeContentMobile = false;
			}
		}

	}
	connectedCallback() {
		let globalThis = window;
		if (typeof globalThis !== 'undefined' && globalThis.localStorage) {
			this.reloaded = globalThis?.localStorage.getItem('reload');
		} else {
			this.reloaded = null; // Or some default value
		}
	}
	renderedCallback() {
		if (this.receivedCategory === label.DLQI_HEADING) {
			this.content = false;
			this.contentDot = false;
		}

	}
	@wire(LOGGED_USER)
	wiredLoggedUser({ error, data }) {
		let globalThis = window;
		try {

			//nullcheck is handled in apex
			if (data) {

				this.loggedUserData = data;
				if (this.loggedUserData && this.loggedUserData?.BI_PSPB_Caregiver__c === true) {
					this.loggedPatient = false;
				}
				if (this.loggedUserData && this.loggedUserData?.BI_PSPB_Caregiver__c === false) {
					this.loggedPatient = true;

				}
			} else if (error) {
				globalThis.sessionStorage.setItem('errorMessage', error.body.message);
				globalThis.location?.assign(this.baseUrl + label.BRANDED_SITE_URL + this.errorPage);
			}
		} catch (err) {
			globalThis.sessionStorage.setItem('errorMessage', error.body.message);
			globalThis.location?.assign(this.baseUrl + label.BRANDED_SITE_URL + this.errorPage);
		}
	}
	//To fetch the Caregiver details
	@wire(USER_CAREGIVER)
	wiredavtList({ error, data }) {
		try {
			if (data) {


				this.handleData(data);

			} else if (error) {
				this.showToast('Error', error.body.message, 'error'); // Catching Potential Error from LWC
			}
		} catch (err) {
			let globalThis = window;
			globalThis.sessionStorage.setItem('errorMessage', error.body.message);
			globalThis.location?.assign(this.baseUrl + label.BRANDED_SITE_URL + this.errorPage);
		}
	}

	handleData(data) {

		this.name = data[0]?.Name;
		this.selectedAvatarSrc = data[0]?.BI_PSP_AvatarUrl__c ? data[0]?.BI_PSP_AvatarUrl__c : DEFAULT_AVATAR_JPEG_URL;
		if (!data[0]?.BI_PSP_AvatarUrl__c) {
			this.selectedAvatarSrc = DEFAULT_AVATAR_JPEG_URL;
			this.avatarImgClass = 'defaultclassimg';
		}
		this.content = data.length > 0;
		this.contentDot = data.length > 0;
		if (this.loggedPatient === false) {
			this.handlePathname(window.location.pathname);
			this.handleCurrentTabName(window.location.pathname.split('/').pop());
		} else {
			this.setWelcomeMessages();
		}
	}

	handlePathname(pathname) {
		if ((pathname === label.BRANDED_SITE_URL || pathname === '') && this.caregiver === true) {
			this.patientavatar = false;
			this.selectedAvatarSrc = DEFAULT_AVATAR_JPEG_URL;
			this.avatarImgClass = 'defaultclassimg';
			this.mobileName = label.SELECT_MOB_ONE;
			this.mobileValue = label.SELECT_MOB_TWO;
			this.selectedNameOne = label.SELECT_PATIENT_VALUE;
			this.selectedNameSecond = label.SELECT_PATIENT_ONE;

		}
	}
	handleCurrentTabName(CURRENT_TAB_NAME) {
		switch (CURRENT_TAB_NAME) {
			case label.COMPLETED_QUESTIONNAIRES:

				this.selectedNameOne = label.QUES_VALUE_ELEVEN;
				break;
			case label.LETSPERSONALIZE_PAGE_ONE:
			case label.LETSPERSONALIZE_PAGE_TWO:
				this.setLetsPersonalizeMessages();
				break;
			case label.PRESCRIPTION_URL:
				this.setPrescriptionMessages();
				break;
			case label.PRESCRIPTION_STATUS_URL:
				this.setPrescriptionStatusMessages();
				break;
			case label.SYMPTOMTRACKER_GRAPH:
				this.setSymptomTrackerGraphMessages();
				break;
			case label.PATIENT_PROFILE_SITE:
			case label.CAREGIVER_PROFILE_SITE:
				this.setProfileSiteMessages();
				break;
			case label.CAREGIVER_PATIENT:
				this.setCaregiverPatientMessages();
				break;
			case label.CAREGIVER_SELECT_AVATAR:
				this.setCaregiverSelectAvatarMessages();
				break;
			case label.CAREGIVER_NOTIFICATION:
				this.setCaregiverNotificationMessages();
				break;
			case label.PATIENT_FIRST_AVATAR:
				this.setPatientFirstAvatarMessages();
				break;
			case label.CHALLENGES_URL:
				this.handleChallengesUrlMessages();
				break;
			case label.TROPHY_CASE_URL:
				this.handleTrophyCaseUrlMessages();
				break;
			case label.OUTSTANDING_QUESTIONNAIRE_URL:
				this.setOutstandingQuestionnaireMessages();
				break;
			default:
				break;
		}
	}

	setLetsPersonalizeMessages() {
		this.mobileName = label.LETS_PERSONAL_MOB_ONE;
		this.mobileValue = label.PERSONALIZE_MSG_ONE;
		this.selectedNameOne = label.PERSONALIZE_MSG_ONE;
	}

	setPrescriptionMessages() {
		this.mobileName = label.PRESCRIPTION_MOB_ONE;
		this.mobileValue = label.PRESCRIPTION_MOB_TWO;
		this.selectedNameOne = label.PRESCRIPTION_MSG_ONE;
		this.selectedNameSecond = label.PRESCRIPTION_MSG_TWO;
	}

	setPrescriptionStatusMessages() {
		this.mobileName = label.PRESCRIPTION_MOB_THREE;
		this.mobileValue = label.PRESCRIPTION_MOB_FOUR;
		this.selectedNameOne = label.PRESCRIPTION_MSG_THREE;

	}

	setSymptomTrackerGraphMessages() {
		this.mobileName = label.SYMPTOM_MOB_ONE;
		this.mobileValue = label.SYMPTOM_VALUE_VALUE;
		this.selectedNameOne = label.SYMPTOM_VALUE_VALUE;
	}

	setProfileSiteMessages() {
		this.mobileName = `Hi ${this.name}, you're doing great! 
We appreciate you sharing, it will`;
		this.mobileValue = `Hi ${this.name}, you're doing great! We appreciate you sharing, 
it will help us provide you with a better experience if we know more 
about you. Complete your personal information now!`;
		this.selectedNameOne = `Hi ${this.name}, you're doing great!`;
		this.selectedNameSecond = label.PATIENT_VALUE_ONE;
		this.selectedNameThird = label.PATIENT_VALUE_TWO;
	}

	setCaregiverPatientMessages() {
		this.mobileName = `Hi ${this.name}, you're doing great! 
We appreciate you sharing, it will`;
		this.mobileValue = `Hi ${this.name}, you're doing great! We appreciate you sharing, 
it will help us provide you with a better experience if we know more about you. 
Complete your personal information now!`;
		this.selectedNameOne = `Hi ${this.name}, you're doing great!`;
		this.selectedNameSecond = label.PATIENT_VALUE_ONE;
		this.selectedNameThird = label.PATIENT_VALUE_TWO;
	}

	setCaregiverSelectAvatarMessages() {
		this.mobileName = label.CARE_AVATAR_MOB_ONE;
		this.mobileValue = label.CARE_AVATAR_MOB_TWO;
		this.selectedNameOne = label.CHOOSE_AVATAR_ONE;
		this.selectedNameSecond = label.CHOOSE_AVATAR_TWO;
	}

	setCaregiverNotificationMessages() {
		this.mobileName = label.CARE_NOTIFY_MOB_ONE;
		this.mobileValue = label.CARE_NOTIFY_MOB_TWO;
		this.selectedNameOne = label.CARE_NOTIFY_ONE;
		this.selectedNameSecond = label.CARE_NOTIFY_TWO;
	}

	setPatientFirstAvatarMessages() {
		this.twoContent = true;
		this.mobileName = label.PATIENT_AVATAR_MOB_ONE;
		this.mobileValue = label.PATIENT_AVATAR_MOB_TWO;
		this.selectedNameOne = label.PATIENT_AVATAR_ONE;
		this.selectedNameSecond = label.PATIENT_AVATAR_TWO;
		this.selectedNameTwo = label.PATIENT_AVATAR_THREE;
	}

	setOutstandingQuestionnaireMessages() {
		this.twoContent = true;
		this.mobileName = label.OUTSTATNDING_MOB_ONE;
		this.mobileValue = label.OUTSTATNDING_MOB_TWO;
		this.selectedNameOne = label.OUSTANDING_VALUE_ONE;
		this.selectedNameSecond = label.OUSTANDING_VALUE_TWO;
		this.selectedNameThird = label.OUSTANDING_VALUE_FIVE;
		this.selectedNameTwo = label.OUSTANDING_VALUE_SEVEN;
	}

	handleChallengesUrlMessages() {
		const WINDOW_WIDTH = window.innerWidth;
		this.challangeContents = WINDOW_WIDTH < 601;
		if (this.challangeContents === true) {
			this.setChallengesForMobile();
		} else {
			this.setChallengesForDesktop();
		}
	}

	setChallengesForMobile() {
		this.seperateChallenge = false;
		this.main = true;
		this.mobileName = label.CHALLENGE_MOB_ONE;
		this.mobileValue = label.CHALLENGE_MOB_TWO;
		this.selectedNameOne = label.CHALLENGE_VALUE_ONE;
		this.selectedNameSecond = label.CHALLENGE_VALUE_TWO;
		this.selectedNameThree = label.CHALLENGE_VALUE_THREE;
	}

	setChallengesForDesktop() {
		this.seperateChallenge = true;
		this.main = false;
		this.challangeContent = true;
		this.mobileName = label.CHALLENGE_MOB_ONE;
		this.mobileValue = label.CHALLENGE_MOB_TWO;
		this.challengeNameOne = label.CHALLENGE_VALUE_ONE;
		this.challengeNameTwo = label.CHALLENGE_VALUE_TWO;
		this.selectedNameThree = label.CHALLENGE_VALUE_THREE;
	}

	handleTrophyCaseUrlMessages() {
		const WINDOW_WIDTH = window.innerWidth;
		this.challangeContents = WINDOW_WIDTH < 601;
		if (this.challangeContents === true) {
			this.setTrophyCaseForMobile();
		} else {
			this.setTrophyCaseForDesktop();
		}
	}

	setTrophyCaseForMobile() {
		this.seperateChallenge = false;
		this.main = true;
		this.mobileName = label.TROPY_MOB_ONE;
		this.mobileValue = label.TROPY_MOB_TWO;
		this.selectedNameOne = label.TROPY_VALUE_ONE;
		this.selectedNameSecond = label.TROPY_VALUE_TWO;
	}

	setTrophyCaseForDesktop() {
		this.seperateChallenge = true;
		this.main = false;
		this.mobileName = label.TROPY_MOB_ONE;
		this.mobileValue = label.TROPY_MOB_TWO;
		this.challengeNameOne = label.TROPY_VALUE_ONE;
		this.challengeNameTwo = label.TROPY_VALUE_TWO;
	}


	setWelcomeMessages() {
		const CURRENT_TAB_NAME = window.location.pathname.split('/').pop();
		const pathname = window.location.pathname;

		if ((pathname === label.BRANDED_SITE_URL || pathname === '') && this.userAccounts[0].BI_PSPB_User_Type__c === 'Patient' && !this.caregiver) {
			this.setPatientWelcomeMessages();
		}

		this.handleTabSpecificMessagesPart1(CURRENT_TAB_NAME);
		this.handleTabSpecificMessagesPart2(CURRENT_TAB_NAME);
		this.handleTabSpecificMessagesPart3(CURRENT_TAB_NAME);
		this.handleTabSpecificMessagesPart4(CURRENT_TAB_NAME);
		this.handleTabSpecificMessagesPart5(CURRENT_TAB_NAME);
	}
	handleTabSpecificMessagesPart1(CURRENT_TAB_NAME) {
		switch (CURRENT_TAB_NAME) {
			case label.LETSPERSONALIZE_PAGE_ONE:
			case label.LETSPERSONALIZE_PAGE_TWO:
				this.selectedNameOne = label.LETS_PERSONAL_VALUE;
				break;
			case label.PATIENT_PROFILE_SITE:
				this.setPatientProfileSiteMessages();
				break;
			case label.SYMPTOMTRACKER_GRAPH:
				this.setSymptomTrackerGraphMessagesPatient();
				break;
			case label.PATIENT_CAREGIVER:
				this.setPatientCaregiverMessages();
				break;
			case label.PATIENT_SELECT_AVATAR:
				this.setPatientSelectAvatarMessages();
				break;
			default:
				break;
		}
	}
	handleTabSpecificMessagesPart2(CURRENT_TAB_NAME) {
		switch (CURRENT_TAB_NAME) {
			case label.PATIENT_NOTIFICATION_SITE:
				this.setPatientNotificationSiteMessages();
				break;
			case label.CHALLENGES_URL:
				this.setChallengesUrlMessages();
				break;
			case label.PRESCRIPTION_URL:
				this.setPrescriptionUrlMessages();
				break;
			case label.PRESCRIPTION_STATUS_URL:
				this.setPrescriptionStatusUrlMessages();
				break;
			case label.TROPHY_CASE_URL:
				this.setTrophyCaseUrlMessages();
				break;
			default:
				break;
		}
	}
	handleTabSpecificMessagesPart3(CURRENT_TAB_NAME) {
		switch (CURRENT_TAB_NAME) {
			case label.OUTSTANDING_QUESTIONNAIRE_URL:
				this.setOutstandingQuestionnaireUrlMessages();
				break;
			case label.COMPLETED_QUESTIONNAIRES:
				this.setCompletedQuestionnairesMessages();
				break;
			case label.LETSPERSONALIZE_URL:
				this.setLetsPersonalizeUrlMessages();
				break;
			case label.DLQI_QUESTIONNAIRE_URL:
				this.setDlqiQuestionnaireUrlMessages();
				break;
			case label.PSORIASIS_QUEST_URL:
				this.setPsoriasisQuestUrlMessages();
				break;
			default:
				break;
		}
	}
	handleTabSpecificMessagesPart4(CURRENT_TAB_NAME) {
		switch (CURRENT_TAB_NAME) {
			case label.WAPI_QUESTIONNAIRE:
				this.setWapiQuestionnaireMessages();
				break;
			case label.QUALITATIVE_TWO_MONTHS:
				this.setQualitativeTwoMonthsMessages();
				break;
			case label.MESSAGECENTER_URL:
				this.setMessageCenterUrlMessages();
				break;
			case label.ACTION_URL:
				this.setActionUrlMessages();
				break;
			case label.HISTORY_URL:
				this.setHistoryUrlMessages();
				break;
			default:
				break;
		}
	}
	handleTabSpecificMessagesPart5(CURRENT_TAB_NAME) {
		switch (CURRENT_TAB_NAME) {
			case label.SUPPORT_PAGE:
				this.setSupportPageMessages();
				break;
			case label.MEDICAL_ENQUIRY_PAGE:
				this.setMedicalEnquiryPageMessages();
				break;
			case label.REPORT_EVENT_PAGE:
				this.setReportEventPageMessages();
				break;
			case label.PLATFORM_PAGE:
				this.setPlatformPageMessages();
				break;
			case label.REMINDER_URL:
				this.setReminderUrlMessages();
				break;
			case label.SYMPTOMTRACKER_URL:
				this.setSymptomTrackerUrlMessages();
				break;
			case label.SYMPTOM_TRACKER_MAIN:
				this.setSymptomTrackerMainMessages();
				break;
			case label.WAPI_COMPLETED_QUESTIONNAIRE:
				this.setWapiCompletedQuestionnaireMessages();
				break;
			case label.PSORIASIS_COMPLETED_QUEST_URL:
				this.setPsoriasisCompletedQuestUrlMessages();
				break;
			case label.DLQI_COMPLETED_URL:
				this.setDlqiCompletedUrlMessages();
				break;
			case label.TWO_MONTHS_COMPLETED_URL:
				this.setTwoMonthsCompletedUrlMessages();
				break;
			case label.FOURTEEN_WEEKS_COMPLETED_URL:
				this.setFourteenWeeksCompletedUrlMessages();
				break;
			default:
				break;
		}
	}

	setPatientWelcomeMessages() {
		this.patientavatar = true;
		this.mobileName = label.PATIENT_MOB_ONE;
		this.mobileValue = label.PATIENT_MOB_TWO;
		this.selectedNameOne = label.PATIENT_AVATAR_ONE;
		this.selectedNameSecond = label.PATIENT_AVATAR_TWO;
		this.selectedNameAvatar = label.PATIENT_AVATAR_THREE;
	}

	setPatientProfileSiteMessages() {
		this.mobileName = `Hi ${this.name}, you're doing great!
We appreciate you sharing, it will...`;
		this.mobileValue = `Hi ${this.name}, you're doing great!
We appreciate you sharing, it will help 
us provide you with a better experience 
if we know more about you.
Complete your personal information now!`;
		this.selectedNameOne = `Hi ${this.name}, you're doing great!`;
		this.selectedNameSecond = label.PATIENT_VALUE_ONE;
		this.selectedNameThird = label.PATIENT_VALUE_TWO;
	}

	setSymptomTrackerGraphMessagesPatient() {
		this.mobileName = label.SYMPTOM_MOB_VALUE;
		this.mobileValue = label.SYMPTOM_VALUE_VALUE;

		this.selectedNameOne = label.SYMPTOM_VALUE_VALUE;
		this.contentThree = false;
		this.contentTwo = false;
	}

	setPatientCaregiverMessages() {
		this.mobileName = label.PATIENTCARE_VALUE_ONE;
		this.mobileValue = label.PATIENTCARE_VALUE_TWO;
		this.selectedNameOne = label.CAREGIVER_VALUE_ONE;
		this.selectedNameSecond = label.CAREGIVER_VALUE_TWO;
	}

	setPatientSelectAvatarMessages() {
		this.mobileName = label.CARE_AVATAR_MOB_ONE;
		this.mobileValue = label.CARE_AVATAR_MOB_TWO;
		this.selectedNameOne = label.CHOOSE_AVATAR_ONE;
		this.selectedNameSecond = label.CHOOSE_AVATAR_TWO;
	}

	setPatientNotificationSiteMessages() {
		this.mobileName = label.CARE_NOTIFY_MOB_ONE;
		this.mobileValue = label.CARE_NOTIFY_MOB_TWO;
		this.selectedNameOne = label.CARE_NOTIFY_ONE;
		this.selectedNameSecond = label.CARE_NOTIFY_TWO;
	}

	setChallengesUrlMessages() {
		const WINDOW_WIDTH = window.innerWidth;
		this.challangeContents = WINDOW_WIDTH < 601;
		if (this.challangeContents) {
			this.seperateChallenge = false;
			this.main = true;
			this.mobileValue = label.CHALLENGE_MOB_TWO;
			this.mobileName = label.CHALLENGE_MOB_ONE;
			this.selectedNameOne = label.CHALLENGE_VALUE_ONE;
			this.selectedNameSecond = label.CHALLENGE_VALUE_TWO;
			this.selectedNameThree = label.CHALLENGE_VALUE_THREE;
		} else {
			this.seperateChallenge = true;
			this.main = false;
			this.challangeContent = true;
			this.mobileName = label.CHALLENGE_MOB_TWO;
			this.mobileValue = label.CHALLENGE_MOB_TWO;
			this.challengeNameOne = label.CHALLENGE_VALUE_ONE;
			this.challengeNameTwo = label.CHALLENGE_VALUE_TWO;
			this.selectedNameThree = label.CHALLENGE_VALUE_THREE;
		}
	}

	setPrescriptionUrlMessages() {
		this.mobileName = label.PRESCRIPTION_MOB_ONE;
		this.mobileValue = label.PRESCRIPTION_MOB_TWO;
		this.selectedNameOne = label.PRESCRIPTION_MSG_ONE;
		this.selectedNameSecond = label.PRESCRIPTION_MSG_TWO;
	}

	setPrescriptionStatusUrlMessages() {
		this.mobileName = label.PRESCRIPTION_MOB_THREE;
		this.mobileValue = label.PRESCRIPTION_MOB_FOUR;
		this.selectedNameOne = label.PRESCRIPTION_MSG_THREE;
	}

	setTrophyCaseUrlMessages() {
		const WINDOW_WIDTH = window.innerWidth;
		this.challangeContents = WINDOW_WIDTH < 601;
		if (this.challangeContents) {
			this.seperateChallenge = false;
			this.main = true;
			this.mobileName = label.TROPY_MOB_ONE;
			this.mobileValue = label.TROPY_MOB_TWO;
			this.selectedNameOne = label.TROPY_VALUE_ONE;
			this.selectedNameSecond = label.TROPY_VALUE_TWO;
		} else {
			this.seperateChallenge = true;
			this.main = false;
			this.challangeContent = true;
			this.mobileName = label.TROPY_MOB_ONE;
			this.mobileValue = label.TROPY_MOB_TWO;
			this.challengeNameOne = label.TROPY_VALUE_ONE;
			this.challengeNameTwo = label.TROPY_VALUE_TWO;

		}
	}

	setOutstandingQuestionnaireUrlMessages() {
		this.mobileName = label.OUTSTATNDING_MOB_ONE;
		this.mobileValue = label.OUTSTATNDING_MOB_TWO;
		this.selectedNameOne = label.OUSTANDING_VALUE_ONE;
		this.selectedNameSecond = label.OUSTANDING_VALUE_TWO;
		this.selectedNameThird = label.OUSTANDING_VALUE_SIX;
		this.selectedNameTwo = label.OUSTANDING_VALUE_THREE;
		this.selectedNameQues = label.OUSTANDING_VALUE_FOUR;

	}

	setCompletedQuestionnairesMessages() {
		this.mobileName = label.DLQE_MOB_MSG;
		this.mobileValue = label.DLQE_VALUE_THREE;
		this.selectedNameOne = label.QUESTIONAIRE_VALUE_ONE;
	}

	setLetsPersonalizeUrlMessages() {
		this.mobileName = label.PERSNALIZE_VALUE_TWO;
		this.mobileValue = label.PERSONALIZE_MSG_ONE;
		this.selectedNameOne = label.PERSONALIZE_MSG_ONE;

	}

	setDlqiQuestionnaireUrlMessages() {
		this.mobileName = label.DLQE_MOB_ONE;
		this.mobileValue = label.DLQE_MOB_TWO;
		this.selectedNameOne = label.DLQE_VALUE_ONE;
		this.selectedNameSecond = label.DLQE_VALUE_TWO;
	}

	setPsoriasisQuestUrlMessages() {
		this.mobileName = label.PERSONALIZE_MOB;
		this.mobileValue = label.PSORIASIS_VALUE_ONE;
		this.selectedNameOne = label.PSORIASIS_VALUE_ONE;

	}

	setWapiQuestionnaireMessages() {
		this.mobileName = label.WAPI_MOB_TWO;
		this.mobileValue = label.WAPI_MOB_THREE;
		this.selectedNameOne = label.WAPI_VALUE_ONE;
		this.selectedNameSecond = label.WAPI_VALUE_TWO;
		this.selectedNameThird = label.WAPI_VALUE_THREE;
	}

	setQualitativeTwoMonthsMessages() {
		this.mobileName = label.TWO_MONTHS_MOB_ONE;
		this.mobileValue = label.TWO_MONTHS_MOB_THREE;
		this.selectedNameOne = label.TWO_MONTHS_ONE;
		this.selectedNameSecond = label.TWO_MONTHS_TWO;
	}

	setMessageCenterUrlMessages() {
		this.mobileName = label.MESSAGE_CENTER_MOB_VALUE;
		this.mobileValue = label.MSG_CENTER_ONE;
		this.selectedNameOne = label.MSG_CENTER_ONE;

	}

	setActionUrlMessages() {
		this.mobileName = label.ACTION_MOB_ONE;
		this.mobileValue =label. ACTION_MOB_TWO;
		this.selectedNameOne = label.ACTION_MESSAGE_ONE;
		this.selectedNameSecond = label.ACTION_MESSAGE_TWO;
		this.selectedNameThird = label.ACTION_MESSAGE_THREE;
	}

	setHistoryUrlMessages() {
		this.mobileName = label.HISTORY_MOB_TWO;
		this.mobileValue = label.HISTORY_MOB_THREE;
		this.selectedNameOne = label.HISTORY_MESSAGE_ONE;
		this.selectedNameSecond = label.HISTORY_MESSAGE_TWO;
	}

	setSupportPageMessages() {
		this.mobileName = label.SUPPORT_MOB_ONE;
		this.mobileValue = label.SUPPORT_MOB_TWO;
		this.selectedNameOne = label.SOPPORT_PAGE_ONE;
		this.selectedNameSecond = label.SOPPORT_PAGE_TWO;
	}
	setMedicalEnquiryPageMessages() {
		this.mobileName = label.MEDICAL_MOB_ONE;
		this.mobileValue = label.MEDICAL_MOB_TWO;
		this.selectedNameOne = label.SUPPORT_VALUE_THREE;
		this.selectedNameSecond = label.SUPPORT_VALUE_FOUR;
	}

	setReportEventPageMessages() {
		this.mobileName = label.REPORT_MOB_ONE;
		this.mobileValue = label.REPORT_MOB_THREE;
		this.selectedNameOne = label.REPORT_VALUE_ONE;
		this.selectedNameSecond = label.REPORT_VALUE_TWO;
	}

	setPlatformPageMessages() {
		this.mobileName = label.PLATFORM_MOB_VALUE;
		this.mobileValue = label.PLATFORM_VALUE_ONE;
		this.selectedNameOne = label.PLATFORM_VALUE_ONE;

	}

	setReminderUrlMessages() {
		this.mobileName = label.REMINDER_MOB_ONE;
		this.mobileValue = label.REMINDER_MOB_TWO;
		this.selectedNameOne = label.REMINDER_VALUE_ONE;
		this.selectedNameSecond = label.REMINDER_VALUE_TWO;
		this.selectedNameThird = label.REMINDER_VALUE_THREE;
	}

	setSymptomTrackerUrlMessages() {
		this.mobileName = label.SYMPTOM_MOB_THREE;
		this.mobileValue = label.SYMPTOM_VALUE_TWO;
		this.selectedNameOne =label.SYMPTOM_VALUE_TWO;
	}

	setSymptomTrackerMainMessages() {
		this.mobileName = label.SYMPTOM_MAIN_ONE;
		this.mobileValue = label.SYMPTOM_VALUE_TWO;
		this.selectedNameOne = label.SYMPTOM_VALUE_TWO;
	}

	setWapiCompletedQuestionnaireMessages() {
		this.mobileName = label.WAPI_MOB_ONE;
		this.mobileValue = label.WAPI_VALUE_FOUR;
		this.selectedNameOne = label.WAPI_VALUE_FOUR;
	}

	setPsoriasisCompletedQuestUrlMessages() {
		this.mobileName = label.PSORIASIS_MOB_THREE;
		this.mobileValue = label.PSORIASIS_VALUE_TWO;
		this.selectedNameOne = label.PSORIASIS_VALUE_TWO;

	}

	setDlqiCompletedUrlMessages() {
		this.mobileName = label.DLQE_MOB_MSG;
		this.mobileValue = label.DLQE_VALUE_THREE;
		this.selectedNameOne = label.DLQE_VALUE_THREE;

	}

	setTwoMonthsCompletedUrlMessages() {
		this.mobileName = label.TWO_MONTHS_MOB_TWO;
		this.mobileValue = label.TWO_MONTHS_THREE;
		this.selectedNameOne = label.TWO_MONTHS_THREE;

	}

	setFourteenWeeksCompletedUrlMessages() {
		this.mobileName = label.TWO_MONTHS_MOB_TWO;
		this.mobileValue = label.TWO_MONTHS_THREE;
		this.selectedNameOne = label.TWO_MONTHS_THREE;

	}


	showToast(title, message, variant) {
		const EVENT = new ShowToastEvent({
			title: title,
			message: message,
			variant: variant
		});
		if (typeof window !== 'undefined') {
			this.dispatchEvent(EVENT);
		}
	}
}