//This Lightning Web Component retrieves and displays notification messages for patients from various sources within a Salesforce community.
// To import Libraries
import { LightningElement} from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
// To import Apex Classes
import ENROLLE from '@salesforce/apex/BI_PSP_ChallengeEnrolleCtrl.getEnrolle';
import REMINDER_EVENTS from '@salesforce/apex/BI_PSPB_DashboardNotification.getEvents';
import MARK_TASK_READ from '@salesforce/apex/BI_PSPB_NotificationStatusUpdationCtrl.markTaskRead';
import {resources} from 'c/biPspbNotificationReminderResources';
// To import Custom Labels
import BRANDED_URL from '@salesforce/label/c.BI_PSPB_SiteLabel';
import UNASSIGNED_URL from '@salesforce/label/c.BI_PSPB_UnAssignedLabel';
export default class BiPspbDashboardNotification extends NavigationMixin(LightningElement)
{
	// Variable declaration
	accountName;
	check = true;
	userId = resources.ID;
	tasks = [];
	contactIds;
	cpeId;
	chatterFeedId;
	chatterType;
	categoryType;
	notification=resources.NOTIFICATION;
	viewAllBtn=resources.VIEW_ALL;
	startBtn=resources.START_NEW_BUTTON;
	viewbtn=resources.VIEW_BUTTON;
	emptyNotification=resources.EMPTY_NOTIFICATION;
	close=resources.CLOSE;
	treatmentDate=resources.TREATMENT_DATE;
	enterDate=resources.ENTER_YOUR_DATE;
	dateOfTreatment=resources.DATE_TREATMENT;
	submitButton=resources.SUBMIT;
	cancelButton=resources.CANCEL_BUTTON;
	showModal = false;
	alarm = resources.ALARM_IMAGE;
	New = resources.NEW_IMG;
	comunityImg = resources.COMMUNITY_IMAGE;
	valueSelect;
	// Constructor to initialize variables
	constructor() {
		super();
		this.statusMap = new Map();
	}
	// Image URLs
	treatmentUrl = resources.NEW_CONTENT_IMAGE;
	injectionUrl = resources.INJECTION_IMAGE;
	challengeUrl = resources.CHALLENGES_IMAGE;
	questionaireUrl = resources.QUESTIONNAIRE_ONLY_IMAGE;
	symtomUrl = resources.SYMPTOMS_IMAGE;
	newContentUrl = resources.NEW_CONTENT_IMAGE;
	qsqUrl = resources.QUESTIONNAIRE_IMAGE;
	timeElapsedMap = {}; 
	// To return icons relatedd to the task
	get taskIcons() {
		return this.tasks.map(task => (
			{
				taskId: task.Id,
				iconUrl: this.getTaskIcon(task)
			}));
	}
	// Method to calculate time elapsed for tasks
	get timeElapsedForTasks() {
		if (Object.keys(this.timeElapsedMap).length === 0) {
			this.calculateTimeElapsed();
		}
		return this.tasks.map(task => (
			{
				...task,
				timeElapsed: this.timeElapsedMap[task.Id] || 'Not calculated yet'
			}));
	}
	fetchReminderEvents() {
        REMINDER_EVENTS({ cpeId: this.cpeId })
            .then(data => {
                if (data) {
                        this.tasks = data.map(task => ({
                            Id: task.Id,
                            Subject: task.Subject,
                            CreatedDate: task.CreatedDate,
                            BI_PSP_Category__c: task.BI_PSP_Category__c,
                            BI_PSP_ChatterType__c: task.BI_PSP_ChatterType__c,
                            BI_PSP_ChatterFeedId__c: task.BI_PSP_ChatterFeedId__c,
                            BI_PSP_Notification_Type__c: task.BI_PSP_Notification_Type__c,
							showTreatmentVideo:task.BI_PSP_Category__c === resources.TREATMENT_VIDEO,
                            showActionButton: task.BI_PSP_Notification_Type__c === resources.ACTION && task.BI_PSP_Category__c === resources.MY_QUESTIONNAIRES,
                            showSymptom: task.BI_PSP_Notification_Type__c === resources.GENERAL && task.BI_PSP_Category__c === resources.SYMPTOM,
                            showDateOfTreatment: task.BI_PSP_Notification_Type__c === resources.ACTION && task.BI_PSP_Category__c === resources.DATE_OF_TREATMENT_LABEL,
                            showTreatmentOneThree: task.BI_PSP_Notification_Type__c === resources.GENERAL && task.BI_PSP_Category__c === resources.TREATMENT,
                            showPrescription: task.BI_PSP_Notification_Type__c === resources.ACTION && task.BI_PSP_Category__c === resources.PRESCRIPTION_LABEL,
                            showGeneralMessage: task.BI_PSP_Notification_Type__c === resources.GENERAL && task.BI_PSP_Category__c === resources.COMMUNITY,
                            showWpai: (task.BI_PSP_Category__c === resources.WPAI_QUESTIONNAIRES) && task.BI_PSP_Notification_Type__c === resources.ACTION,
                            showQsq: (task.BI_PSP_Category__c === resources.QSQ_QUESTIONNAIRES) && task.BI_PSP_Notification_Type__c === resources.ACTION,
                            showPss: (task.BI_PSP_Category__c === resources.PSS_QUESTIONNAIRES) && task.BI_PSP_Notification_Type__c === resources.ACTION,
                            showDlqi: (task.BI_PSP_Category__c === resources.DLQI_QUESTIONNAIRES) && task.BI_PSP_Notification_Type__c === resources.ACTION,
                            showChallenges: (task.BI_PSP_Category__c === resources.CHALLENGES),
                            iconUrl: this.getTaskIcon(task)
                        }));
                        // Sort the tasks by CreatedDate in descending order
                        this.tasks.sort((a, b) => new Date(b.CreatedDate) - new Date(a.CreatedDate));
                        // Retain the top 3 tasks (or adjust the number as needed)
                        this.tasks = this.tasks.slice(0, 3);
                }
            })
            .catch(() => {
				let globalThis=window;
				globalThis.location.href = resources.ERROR_PAGE;
				globalThis.sessionStorage.setItem('errorMessage', resources.ERROR_FOR_NOTIFICATION);
            });
	}
	// Fetch user's enrollment information
	connectedCallback() {
		try {
			ENROLLE({ userId: this.userId })
				.then(result => {
					if (result !== null) {
						if (result[0].patientEnrolle !== null) {
							this.cpeId = result[0].patientEnrolle.Id;
							this.fetchReminderEvents();						
						}
						else {
							let globalThis=window;
							globalThis.location.href = resources.ERROR_PAGE;
							globalThis.sessionStorage.setItem('errorMessage', resources.ENROLLEE_NOT_FOUND);
						}
					}
				})
				.catch(() => {
					let globalThis=window;
					globalThis.location.href = resources.ERROR_PAGE;
					globalThis.sessionStorage.setItem('errorMessage', resources.FETCHING_ENROLLEE_ERROR);
				});
			const globalThis = window;
			const CURRENT_URL = globalThis.location.href;
			// Create a URL object
			const URL_OBJECT = new URL(CURRENT_URL);
			// Get the path1
			const PATH = URL_OBJECT.pathname;
			// Split the path1 using '/' as a separator
			const PATH_COMPONENTS = PATH.split('/');
			// Find the component you need (in this case, 'Branded')
			const DESIRED_COMPONENT = PATH_COMPONENTS.find(component =>
				[BRANDED_URL.toLowerCase(), UNASSIGNED_URL.toLowerCase()].includes(component.toLowerCase())
			);
			if (DESIRED_COMPONENT.toLowerCase() === BRANDED_URL.toLowerCase()) {
				this.urlq = resources.BRANDED_URL;
			}
			else {
				this.urlq = resources.UNASSIGNED_SITE_URL;
			}
			if (this.tasks.length <= 0) {
				this.tasks = false;
				this.check = false;
			}
		} catch (error) {
			let globalThis=window;
			globalThis.location.href = resources.ERROR_PAGE;
			globalThis.sessionStorage.setItem('errorMessage', resources.URL_TYPE_ERROR);
		}
	}
	getTaskIcon(task) {
		switch (task.BI_PSP_Category__c) {
			case resources.CHALLENGES:
				return this.challengeUrl;
			case resources.SYMPTOM:
				return this.symtomUrl;
			case resources.INJECTION:
				return this.injectionUrl;
			case resources.MY_QUESTIONNAIRES:
				return this.questionaireUrl;
			case resources.NEW_CONTENT_UPDATES:
				return this.newContentUrl;
			case resources.PRESCRIPTION_LABEL:
			case resources.TREATMENT:
			case resources.DATE_TREATMENT:
				return this.treatmentUrl;
			case resources.COMMUNITY:
				return this.comunityImg;
			case resources.QSQ_QUESTIONNAIRES:
				return this.qsqUrl;
			case resources.DLQI_QUESTIONNAIRES:
				return this.qsqUrl;
			case resources.PSS_QUESTIONNAIRES:
				return this.qsqUrl;
			case resources.WPAI_QUESTIONNAIRES:
				return this.qsqUrl;
			default:
				return null;
		}
	}
	//Onclick function for Questionnaires reords
	clickQuestionQsq() {
		let globalThis = window;
		globalThis.location?.assign(this.urlq + resources.QSQ_QUESTIONNAIRE_URL);
	}
	clickQuestionPss() {
		let globalThis = window;
		globalThis.location?.assign(this.urlq + resources.PSS_QUESTIONNAIRE_URL);
	}
	clickQuestionWpai() {
		let globalThis = window;
		globalThis.location?.assign(this.urlq + resources.WPAI_QUESTIONNAIRE_URL);
	}
	clickQuestionDlqi() {
		let globalThis = window;
		globalThis.location?.assign(this.urlq + resources.DLQI_QUESTIONNAIRE_URL);
	}
	handleNavigateChallenges(){
			let globalThis = window;
			globalThis.location?.assign(this.urlq + resources.CHALLENGESURL);
	}
	// Method to calculate time elapsed for each task
	calculateTimeElapsed() {
		if (this.tasks.length > 0) {
			this.tasks.forEach(task => {
				const CREATED_DATE = new Date(task.CreatedDate);
				const CURRENT_TIME = new Date();
				const TIME_DIFFERENCE = CURRENT_TIME.getTime() - CREATED_DATE.getTime();
				const HOURS_ELAPSED = Math.floor(TIME_DIFFERENCE / (1000 * 60 * 60));
				const MINUTES_ELAPSED = Math.floor((TIME_DIFFERENCE % (1000 * 60 * 60)) / (1000 * 60));
				if (HOURS_ELAPSED >= 24) {
					const DAYS_ELAPSED = Math.floor(HOURS_ELAPSED / 24);
					const REMAINING_HOURS = HOURS_ELAPSED % 24;
					this.timeElapsedMap[task.Id] = `${DAYS_ELAPSED} days ${REMAINING_HOURS} hrs ${MINUTES_ELAPSED} mins ago`;
				}
				else {
					this.timeElapsedMap[task.Id] = `${HOURS_ELAPSED} hrs ${MINUTES_ELAPSED} mins ago`;
				}
			});
		}
	}
	// Method to handle actionn response
	handleActionResponse() {
		let globalThis = window;
		globalThis.location.assign(this.urlq + resources.MESSAGE_CENTER_URL);
	}
	// Method to navigate to the message center
	handleNavigateAll() {
		let globalThis = window;
		globalThis.location.assign(this.urlq + resources.MESSAGE_CENTER_URL);
	}
	handleNavigateLetPers() {
		let globalThis = window;
		globalThis.location.assign(this.urlq + resources.PERSONALIZE_QUESTIONNAIRE_URL);
	}
	handleNavigateSymptom(){
		let globalThis = window;
		globalThis.location?.assign(this.urlq + resources.SYMPTOM_TRACKER_MAIN);
	}
	// Method to navigate to specific pages based on task category
	handleNavigate(event) {
			const TASK_ID = event.currentTarget.dataset.id;
			const SELECTED_TASK = this.tasks.find(task => task.Id === TASK_ID);
			if (!SELECTED_TASK) {
				this.redirectToUrl(resources.MESSAGE_CENTER_URL);
				return;
			}
			this.chatterFeedId = SELECTED_TASK.BI_PSP_ChatterFeedId__c;
			MARK_TASK_READ({ taskId: SELECTED_TASK.Id })
				.then(() => {
					this.valueSelect = SELECTED_TASK;
				})
				.catch(() => {
					let globalThis=window;
					globalThis.location.href = resources.ERROR_PAGE;
					globalThis.sessionStorage.setItem('errorMessage', resources.UPDATE_NOTIFICATION_ERROR);
				});	
			const categoryActions = {
				[resources.SYMPTOM_URL]: resources.SYMPTOM_URL,
				[resources.CHALLENGES]: resources.CHALLENGESURL,
				[resources.MY_QUESTIONNAIRES]: resources.OUTSTANDING_QUESTIONNAIRE_URL,
				[resources.NEW_CONTENT]: resources.INFO_CENTER_URL,
				[resources.COMMUNITY]: this.handleCommunityNavigate.bind(this)
			};	
			const action = categoryActions[SELECTED_TASK.BI_PSP_Category__c];
		
			if (typeof action === 'string') {
				this.redirectToUrl(action);
			} else if (typeof action === 'function') {
				action(SELECTED_TASK);
			}
	}	
	redirectToUrl(path) {
		let globalThis = window;
		globalThis.location.assign(this.urlq + path);
	}	
	handleCommunityNavigate(task) {
		const chatterActions = {
			[resources.FOLLOW]: () => this.navtofollow(),
			[resources.CREATE_POST]: () => this.navtopost(),
			[resources.COMMENT]: () => this.navtocomments(),
			[resources.REACTION]: () => this.navtoreaction()
		};	
		const action = chatterActions[task.BI_PSP_ChatterType__c];	
		if (typeof action === 'function') {
			action();
		} else {
			this.redirectToUrl(resources.MESSAGE_CENTER_URL);
		}
	}	
	handleNavigateAction(){
		let globalThis = window;
		globalThis.location.assign(this.urlq + resources.ACTION_URL);
	}
	//Community Button Navigations 
	navtofollow() 
	{
		let globalThis = window;
		globalThis.location?.assign( this.urlq + resources.CHATTER_FOLLOWER);
	}
	navtopost() 
	{
		let globalThis = window;
		globalThis.localStorage?.setItem('selectedItemIdforCreatepost', this.chatterFeedId);
		globalThis.location?.assign(this.urlq + resources.ALL_POST_URL);
	}
	navtocomments() 
	{
		let globalThis = window;
		globalThis.localStorage?.setItem('selectedItemIdforComment', this.chatterFeedId);
		globalThis.location?.assign(this.urlq + resources.CHATTER_MY_POST);
	}
	navtoreaction() 
	{
		let globalThis = window;
		globalThis.localStorage?.setItem('selectedItemId', this.chatterFeedId);
		globalThis.location?.assign(this.urlq + resources.CHATTER_MY_POST);
	}
}