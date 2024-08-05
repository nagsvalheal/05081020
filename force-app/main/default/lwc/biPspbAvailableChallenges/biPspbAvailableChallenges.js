//This lightning web component helps the user to see the available challenges and gives the ability to make them as active challenge
//To import Libraries
import { LightningElement, wire, api } from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { resources } from "c/biPspLabelAndResourceChallenges";

//To import Apex Classes
import INDIVIDUALSCHALLENGES from "@salesforce/apex/BI_PSP_IndividualChallengesCtrl.getIndividualChallenges";
import COUNT_ASSESMENT from "@salesforce/apex/BI_PSP_AssessmentCtrl.getAssessmentCountsByCurrentUserName";
import UPDATE_REACTION from '@salesforce/apex/BI_PSPB_ArticleLikeCtrl.updateReaction';
//To import Custom labels

import IC_LANDING_PAGE from "@salesforce/label/c.BI_PSP_GppArticle";
import WHY_BEING_ACTIVE from "@salesforce/label/c.BI_PSP_ActiveArticle";
import BR_DITE_URL from "@salesforce/label/c.BI_PSPB_BrandedSiteNaviUrl";
import BRANDED_URL from "@salesforce/label/c.BI_PSPB_SiteLabel";
import UN_ASSIGNED_URL from "@salesforce/label/c.BI_PSPB_UnAssignedLabel";
import UN_ASSIGNED_URL_NAVI from "@salesforce/label/c.BI_PSPB_UnAssignedNaviUrl";
import BR_WAPI_QUESTIONNAIRE from "@salesforce/label/c.BI_PSPB_WapiQuestionnaire";
import PSS_QUESTIONNAIRE from "@salesforce/label/c.BI_PSPB_PsoriasisQuesUrl";
import DLQI_QUESTIONNAIRE from "@salesforce/label/c.BI_PSPB_DlqiQuestionnaireUrl";
import CHALLENGE_LEVEL_THREE from "@salesforce/label/c.BI_PSP_ChallengeLevelThree";
import TRACK_YOUR_GPP_LABLE from "@salesforce/label/c.BI_PSP_TrackYourGppLabel";
import BRDLQI_COMPLETED_URL from "@salesforce/label/c.BI_PSPB_DlqiCompletedUrl";
import BRWAPI_COMPLETED_URL from "@salesforce/label/c.BI_PSPB_WapiCompletedQuestionnaire";
import BRPSS_COMPLETED_URL from "@salesforce/label/c.BI_PSPB_PsoriasisCompletedQuesUrl";
import VIEW_LABEL from "@salesforce/label/c.BI_PSPB_View";

export default class BiPspbAvailableChallenges extends LightningElement {
	//Proper naming conventions with camel case for all the variable will be followed in the future releases
	// Expose properties to parent components
	@api challengeid;
	@api challengeidtoupdate;
	levelOne = resources.CHALLENGE_LEVEL_ONE;
	levelTwo = resources.CHALLENGE_LEVEL_TWO;
	challengeBookworm = resources.CH_BOOK_WORM;
	siteUrlBranded = BR_DITE_URL;
	gppArticle = IC_LANDING_PAGE;
	beingActive = WHY_BEING_ACTIVE;
	errorMsg = resources.ERROR_MESSAGES;
	errorVariant = resources.ERROR_VARIANT;

	beingActiveLink = resources.BEING_ACTIVE;
	trackYourAns = resources.TRACK_YOUR_ANSWER;
	linkArticle = resources.LINKARTICLE;
	gppWrkLifeLink = resources.GPPWORKLIFELINK;
	gppSymptomsLink = resources.GPPSYMPTOMSLINK;
	gppQualityLifeLink = resources.GPPQUALITYLIFELINK;
	questionnairelink = resources.QuestonnaireValue;
	acceptChallengeButton = resources.ACCEPTCHALLENGEBUTTON;
	// Declare properties to store challenge details
	title;
	level;
	description;
	rewardPoints;
	image;
	linktoArticle;
	whyBeingActive;
	urlq;
	otherChallenges;
	quesChallenges;
	trackYourGppDivWpai;
	trackYourGppDivPss;
	trackYourGppDivDlqi;
	titlear;

	// Wire method to retrieve individual challenge details
	@wire(INDIVIDUALSCHALLENGES, { challengeId: "$challengeid" })
	wiredAccount({ error, data }) {
		let globalThis = window;
		if (data) {
			try {
				this.processChallengeData(data[0]);
			} catch (err) {
				globalThis.sessionStorage.setItem("errorMessage", err.body.message);
				globalThis.location?.assign(
					this.baseUrl + this.siteUrlBranded + this.displayErrorPage
				);
			}
		} else if (error) {
			globalThis.sessionStorage.setItem("errorMessage", error.body.message);
			globalThis.location?.assign(
				this.baseUrl + this.siteUrlBranded + this.displayErrorPage
			);
		}
	}

	processChallengeData(data) {
		this.setTitleAndLevel(data);
		this.setChallengeVisibility();
		this.setDescription(data);
		this.setRewardPoints(data);
		this.setImage(data);
	}

	setTitleAndLevel(data) {
		this.title = data.Name;
		this.level = data.BI_PSP_Challenge_Level__c;
	}

	setChallengeVisibility() {
		const isBookworm = this.title.includes(this.challengeBookworm);
		const isGpp = this.title.includes(TRACK_YOUR_GPP_LABLE);

		this.resetVisibility();

		if (isBookworm) {
			this.setBookwormVisibility();
		} else if (isGpp) {
			this.setGppVisibility();
		} else {
			this.otherChallenges = true;
		}
	}

	setBookwormVisibility() {
		if (this.level === this.levelOne) {
			this.linktoArticle = true;
			this.otherChallenges = true;
		} else if (this.level === this.levelTwo) {
			this.whyBeingActive = true;
			this.otherChallenges = true;
		}
	}

	setGppVisibility() {
		this.quesChallenges = true;
		if (this.level === this.levelOne) {
			this.trackYourGppDivWpai = true;
		} else if (this.level === this.levelTwo) {
			this.trackYourGppDivPss = true;
		} else if (this.level === CHALLENGE_LEVEL_THREE) {
			this.trackYourGppDivDlqi = true;
		}
	}

	resetVisibility() {
		this.whyBeingActive = false;
		this.linktoArticle = false;
		this.otherChallenges = false;
		this.quesChallenges = false;
		this.trackYourGppDivWpai = false;
		this.trackYourGppDivPss = false;
		this.trackYourGppDivDlqi = false;
	}

	setDescription(data) {
		if (data.HealthCloudGA__Description__c) {
			this.description = data.HealthCloudGA__Description__c.replace(
				/<[^>]*>/gu,
				""
			);
		}
	}

	setRewardPoints(data) {
		if (data.BI_PSP_Challenge_Reward_Points__c) {
			this.rewardPoints = data.BI_PSP_Challenge_Reward_Points__c;
		}
	}

	setImage(data) {
		if (data.BI_PSP_Challenge_Image__c) {
			const desiredWidth = "135px";
			const desiredHeight = "70px";
			const imgTagRegex = /<img\s+[^>]*src="([^"]+)"[^>]*>/giu;

			this.image = data.BI_PSP_Challenge_Image__c.replace(
				imgTagRegex,
				(match, src) =>
					`<img src="${src}" alt="${resources.ALTVALUE}" width="${desiredWidth}" height="${desiredHeight}">`
			);
		}
	}
	@wire(COUNT_ASSESMENT)
	wiredAssessmentResponsesqsq({ data }) {
		let globalThis = window;
		try {
			if (data) {
				this.count = data;
				[this.stwai, this.stpss, this.stdlq, this.stqsq] = this.count;
			}
		} catch (err) {
			globalThis.sessionStorage.setItem("errorMessage", err.body.message);
			globalThis.location?.assign(
				this.baseUrl + this.siteUrlBranded + this.displayErrorPage
			);
		}
	}
	renderedCallback() {
		let globalThis = window;
		try {
			const currentURL = window.location.href;
			const urlObject = new URL(currentURL);
			const path = urlObject.pathname;
			const pathComponents = path.split("/");
			const desiredComponent = pathComponents.find((component) =>
				[BRANDED_URL, UN_ASSIGNED_URL].includes(component)
			);

			if (desiredComponent === BRANDED_URL) {
				this.urlq = BR_DITE_URL;
			} else {
				this.urlq = UN_ASSIGNED_URL_NAVI;
			}
		} catch (error) {
			globalThis.sessionStorage.setItem("errorMessage", error.body.message);
			globalThis.location?.assign(
				this.baseUrl + this.siteUrlBranded + this.displayErrorPage
			); // Catching Potential Error
		}
	}
	// Method to handle accepting a challenge
	afterAccept() {
		const messageEvent = new CustomEvent("acceptchallenge", {
			detail: {
				challengeid: this.challengeid,
				challengeidtoupdate: this.challengeidtoupdate
			}
		});
		this.dispatchEvent(messageEvent);
	}

	// Method to open articles
	openArticles() {
		let globalThis = window;
		UPDATE_REACTION({
			articleName: this.gppArticle,
			reaction: VIEW_LABEL
		})
			.then(() => {
				this.titlear = VIEW_LABEL + ": " + this.gppArticle;
				window.location.assign(this.urlq + this.gppArticle);
			})
			.catch((error) => {
				globalThis.sessionStorage.setItem("errorMessage", error.body.message); // Catching Potential Error from Apex
				globalThis.location?.assign(
					this.baseUrl + this.siteUrlBranded + this.displayErrorPage
				);
			});
	}
	openArticlesActive() {
		let globalThis = window;
		UPDATE_REACTION({
			articleName: this.beingActive,
			reaction: VIEW_LABEL
		})
			.then(() => {
				this.titlear = VIEW_LABEL + ": " + this.beingActive;
				window.location.assign(this.urlq + this.beingActive);
			})
			.catch((error) => {
				globalThis.sessionStorage.setItem("errorMessage", error.body.message); // Catching Potential Error from Apex
				globalThis.location?.assign(
					this.baseUrl + this.siteUrlBranded + this.displayErrorPage
				);
			});
	}
	TrackYourGppNavigationWPAI() {
		if (this.stwai > 0) {
			window.location.assign(this.urlq + BRWAPI_COMPLETED_URL);
		} else {
			window.location.assign(this.urlq + BR_WAPI_QUESTIONNAIRE);
		}
	}
	TrackYourGppNavigationPSS() {
		if (this.stpss > 0) {
			window.location.assign(this.urlq + BRPSS_COMPLETED_URL);
		} else {
			window.location.assign(this.urlq + PSS_QUESTIONNAIRE);
		}
	}
	TrackYourGppNavigationDLQI() {
		if (this.stdlq > 0) {
			window.location.assign(this.urlq + BRDLQI_COMPLETED_URL);
		} else {
			window.location.assign(this.urlq + DLQI_QUESTIONNAIRE);
		}
	}
	// showToast used for all the error messages caught
	showToast(title, message, variant) {
		const event = new ShowToastEvent({
			title: title,
			message: message,
			variant: variant
		});
		if (typeof window !== "undefined") {
			this.dispatchEvent(event);
		}
	}
}