//This Lwc display the completed questionnaires Dlqi,Wapi,pss summarize
//To import Libraries
import { LightningElement, wire, track } from 'lwc';
import { loadScript } from 'lightning/platformResourceLoader';
import chartjs from '@salesforce/resourceUrl/BI_PSP_ChartJs';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
//To get current user id
import Id from '@salesforce/user/Id';
//To import syatic resources
import RED_CIRCLE from '@salesforce/resourceUrl/BI_PSP_RedCircle';
import YELLOW_CIRCLE from '@salesforce/resourceUrl/BI_PSP_YellowCircle';
import ORANGE_CIRCLE from '@salesforce/resourceUrl/BI_PSP_OrangeCircle';
import GREEN_CIRCLE from '@salesforce/resourceUrl/BI_PSP_GreenCircle';
import GREY_CIRCLE from '@salesforce/resourceUrl/BI_PSP_GreyCircle';
import CORRECT from '@salesforce/resourceUrl/BI_PSP_Correct';
import WRONG from '@salesforce/resourceUrl/BI_PSP_Wrong';
import NOT_APPLICABLE from '@salesforce/resourceUrl/BI_PSP_NotApplicable';
import NA from '@salesforce/resourceUrl/BI_PSP_NA';
import LINE_GREY from '@salesforce/resourceUrl/BI_PSP_LineGrey';
import LINE_YELLOW from '@salesforce/resourceUrl/BI_PSP_LineYellow';
import LINE_BROWN from '@salesforce/resourceUrl/BI_PSP_LineBrown';
//To import apex classess
import GET_ENROLLE from '@salesforce/apex/BI_PSP_CurrentUser.getEnrolleeRecords';
import GET_ASSESSMENT_DETAILS from '@salesforce/apex/BI_PSP_QuestionnaireGraphCtrl.getQuestionnaireDetails';
import GET_LAST_QUESTION from '@salesforce/apex/BI_PSP_QuestionnaireGraphCtrl.getQuestionnaireLast';
import GET_ASSESSMENT_COUNT from '@salesforce/apex/BI_PSP_AssessmentCtrl.getAssessmentCountsByCurrentUserName';
//To import custo labels
import BRANDED_URL from '@salesforce/label/c.BI_PSPB_SiteLabel';
import WPAI_STAR_TEXT from '@salesforce/label/c.BI_PSP_SummaryWpai';
import THIRD_DLQI_TEXT from '@salesforce/label/c.BI_PSP_DlqiThirdShortText';
import UN_ASSIGNED_URL from '@salesforce/label/c.BI_PSPB_UnAssignedLabel';
import PSS_COMPLETED_URL from '@salesforce/label/c.BI_PSPB_PsoriasisCompletedQuesUrl';
import WAPI_COMPLETED_URL from '@salesforce/label/c.BI_PSPB_WapiCompletedQuestionnaire';
import DLQI_COMPLETED_URL from '@salesforce/label/c.BI_PSPB_DlqiCompletedUrl';
import QUALITATIVE_COMPLETED_FOURTEEN_WEEKS from '@salesforce/label/c.BI_PSPB_QualitativeFourteenwksCompletedUrl';
import QUALITATIVE_COMPLETED_TWO_MONTHS from '@salesforce/label/c.BI_PSPB_QualitativeTwoMonthsCompletedUrl';
import SUMMARY_URL from '@salesforce/label/c.BI_PSPB_SummaryUrl';
import LETS_PERSONALIZE_URL from '@salesforce/label/c.BI_PSPB_LetsPersonalizeUrl';
import DLQI_BOTTOM_TXT from '@salesforce/label/c.BI_PSP_DlqiFirstBottomMsg';
import DLQI_BOTTOM_TXT_ONE from '@salesforce/label/c.BI_PSP_DlqiSecBottomMsg';
import DLQI_BOTTOM_TXT_TWO from '@salesforce/label/c.BI_PSP_PssBottomSecndMsg';
import DLQI_BOTTOM_TXT_THREE from '@salesforce/label/c.BI_PSP_DlqiThreeBottomMsg';
import PSS_BOTTOM_TXT from '@salesforce/label/c.BI_PSP_PssBottomMsg';
import WAPI_BOTTOM_TXT from '@salesforce/label/c.BI_PSP_WpaiBottomTxt';
import OUTSTANDING_QUESTIONNAIRE_URL from '@salesforce/label/c.BI_PSPB_OutstndngPageUrl';
import DLQI_SHORT_TXT from '@salesforce/label/c.BI_PSP_DlqiCategory';
import VERY_SERVERE_SHORT_TXT from '@salesforce/label/c.BI_PSP_VerySevere';
import SERVERE_SHORT_TXT from '@salesforce/label/c.BI_PSP_RbSevere';
import MODERATE_SHORT_TXT from '@salesforce/label/c.BI_PSP_RbModerate';
import MILD_SHORT_TXT from '@salesforce/label/c.BI_PSP_RbMild';
import NONE_SHORT_TXT from '@salesforce/label/c.BI_PSP_RbNone';
import VERY_MUCH_SHORT_TXT from '@salesforce/label/c.BI_PSP_RbVeryMuch';
import A_LOT_MUCH_SHORT_TXT from '@salesforce/label/c.BI_PSP_RbAlot';
import A_LITTLE_MUCH_SHORT_TXT from '@salesforce/label/c.BI_PSP_RbAlittle';
import NOT_AT_ALL_SHORT_TXT from '@salesforce/label/c.BI_PSP_RbNotAtAll';
import NOT_RELEVENT_ALL_SHORT_TXT from '@salesforce/label/c.BI_PSP_RbNotRelevant';
import SOFT_DELETE_ALL_SHORT_TXT from '@salesforce/label/c.BI_PSP_SoftDelete';
import NO_SHORT_TXT from '@salesforce/label/c.BI_PSP_OptionValueNo';
import SKIN_CONDITION_SHORT_TXT from '@salesforce/label/c.BI_PSP_SkinCondition';
import SKIN_QUESTION_SHORT_TXT from '@salesforce/label/c.BI_PSP_SkinQuestion';
import SHORT_QUESTION_SHORT_TXT from '@salesforce/label/c.BI_PSPB_ShortQuestion';
import SHORT_QUESTION_TWO_SHORT_TXT from '@salesforce/label/c.BI_PSPB_ShortQuestionTwo';
import SHORT_QUESTION_THREE_SHORT_TXT from '@salesforce/label/c.BI_PSPB_ShortQuestionThree';
import SHORT_QUESTION_FOUR_SHORT_TXT from '@salesforce/label/c.BI_PSPB_ShortQuestionFour';
import SHORT_QUESTION_FIVE_SHORT_TXT from '@salesforce/label/c.BI_PSPB_ShortQuestionFive';
import SHORT_QUESTION_SIX_SHORT_TXT from '@salesforce/label/c.BI_PSPB_ShortQuestionSix';
import SHORT_QUESTION_SEVEN_SHORT_TXT from '@salesforce/label/c.BI_PSPB_ShortQuestionSeven';
import SHORT_QUESTION_EIGHT_SHORT_TXT from '@salesforce/label/c.BI_PSPB_ShortQuestionEight';
import SHORT_QUESTION_NINE_SHORT_TXT from '@salesforce/label/c.BI_PSPB_ShortQuestionNine';
import SHORT_QUESTION_TEN_SHORT_TXT from '@salesforce/label/c.BI_PSPB_ShortQuestionTen';
import SHORT_QUESTION_ELEVEN_SHORT_TXT from '@salesforce/label/c.BI_PSPB_ShortQuestionEleven';
import SHORT_QUESTION_TWELVE_SHORT_TXT from '@salesforce/label/c.BI_PSPB_ShortQuestionTwelve';
import SHORT_QUESTION_THIRTEEN_SHORT_TXT from '@salesforce/label/c.BI_PSPB_ShortQuestionThirteen';
import SHORT_QUESTION_FOURTEEN_SHORT_TXT from '@salesforce/label/c.BI_PSPB_ShortQuestionFourteen';
import SHORT_QUESTION_FIFTEEN_SHORT_TXT from '@salesforce/label/c.BI_PSPB_ShortQuestionFifteen';
import SHORT_NOT_APPLICABLE_SHORT_TXT from '@salesforce/label/c.BI_PSPB_NotApplicableTxt';
import PAIN_SHORT_TXT from '@salesforce/label/c.BI_PSP_Pain';
import REDNESS_SHORT_TXT from '@salesforce/label/c.BI_PSP_Redness';
import ITCHING_SHORT_TXT from '@salesforce/label/c.BI_PSPB_Itching';
import BURNING_SHORT_TXT from '@salesforce/label/c.BI_PSPB_Burning';
import WPAI_CATEGORY_SHORT_TXT from '@salesforce/label/c.BI_PSP_WapiCategory';
import LINE_SHORT_TXT from '@salesforce/label/c.BI_PSPB_LineTxt';
import ERROR_VARIANT from '@salesforce/label/c.BI_PSP_ErrorVariantToast';
import ERROR_MESSAGE from '@salesforce/label/c.BI_PSP_ConsoleError';
import BRANDED_URL_NAVI from '@salesforce/label/c.BI_PSPB_BrandedSiteNaviUrl';
import PSS_SHORT_TXT from '@salesforce/label/c.BI_PSP_PssCategory';
import JANUARY from '@salesforce/label/c.BI_PSP_January';
import FEBRUARY from '@salesforce/label/c.BI_PSP_February';
import MARCH from '@salesforce/label/c.BI_PSP_March';
import APRIL from '@salesforce/label/c.BI_PSP_April';
import MAY from '@salesforce/label/c.BI_PSP_May';
import JUNE from '@salesforce/label/c.BI_PSP_June';
import JULY from '@salesforce/label/c.BI_PSP_July';
import AUGUST from '@salesforce/label/c.BI_PSP_August';
import SEPTEMBER from '@salesforce/label/c.BI_PSP_September';
import OCTOBER from '@salesforce/label/c.BI_PSP_October';
import NOVEMEBER from '@salesforce/label/c.BI_PSP_November';
import DECEMBER from '@salesforce/label/c.BI_PSP_December';
import ONE_MONTH_TXT from '@salesforce/label/c.BI_PSP_OneMonthTxt';
import HIGHLIGHT_BACK_TXT from '@salesforce/label/c.BI_PSP_HighLightBack';
import LAST_THREE_MONTHS from '@salesforce/label/c.BI_PSPB_LastThreeMonths';
import LAST_SIX_MONTHS from '@salesforce/label/c.BI_PSPB_LastSixMonths';
import LAST_TWELVE_MONTHS from '@salesforce/label/c.BI_PSPB_LastTwelveMonths';
import SELECT_MONTH from '@salesforce/label/c.BI_PSP_Month';
import SELECT_QUESTION from '@salesforce/label/c.BI_PSPB_SelectQuestion';
import RANGE_OF_MONTHS from '@salesforce/label/c.BI_PSPB_RangeOfMonthsTxt';
import EXPIRED from '@salesforce/label/c.BI_PSP_Expired';
import COMPLETED_LABEL from '@salesforce/label/c.BI_PSP_Completed';
import UN_ASSIGNED_URL_NAVI from '@salesforce/label/c.BI_PSPB_UnAssignedNaviUrl';
import OUT_STANDING from '@salesforce/label/c.BI_PSP_OutstndngPageTxt';
import SUMMARY from '@salesforce/label/c.BI_PSPB_Summary';
import COMPLETED_TXT from '@salesforce/label/c.BI_PSP_CompletedQuestionnaireTxt';
import LET_PERSONALIZE from '@salesforce/label/c.BI_PSPB_LetsPersonal';
import SELECT_QUESTIONNAIRE from '@salesforce/label/c.BI_PSPB_SelectQuestionnaireTxt';
import QUESTIONNAIRE from '@salesforce/label/c.BI_PSPB_Questionnaires';
import Range_OF_MONTHS from '@salesforce/label/c.BI_PSPB_RangeOfMonthsTxt';
import DURATION_TXT from '@salesforce/label/c.BI_PSPB_DurationTxt';
import SELECT_MONTH_TXT from '@salesforce/label/c.BI_PSPB_month';
import MONTH_TXT from '@salesforce/label/c.BI_PSPB_months';
import DOWNLOAD_TXT from '@salesforce/label/c.BI_PSP_Download';
import TIME_PERIOD from '@salesforce/label/c.BI_PSPB_TimePeriodTxt';
import VERY_MUCH from '@salesforce/label/c.BI_PSP_RbVeryMuch';
import ALOT_TXT from '@salesforce/label/c.BI_PSP_RbAlot';
import A_LITTLE_TXT from '@salesforce/label/c.BI_PSP_RbAlittle';
import NOT_AT_ALL_TXT from '@salesforce/label/c.BI_PSP_RbNotAtAll';
import NOT_RELEVANT_TXT from '@salesforce/label/c.BI_PSP_RbNotRelevant';
import OVER_TIME_SKIN from '@salesforce/label/c.BI_PSP_OverTimeSkinIssueTxt';
import PREVENT_SKIN from '@salesforce/label/c.BI_PSPB_PreventSkinTxt';
import NOT_APPLICABLE_TXT from '@salesforce/label/c.BI_PSPB_NotApplicableTxt';
import DLQI_TXT from '@salesforce/label/c.BI_PSP_DlqiThirdShortText';
import PSORIASIS_SYMPTOMS_TXT from '@salesforce/label/c.BI_PSPB_PsoriasisSymptoms';
import BREAK_DOWN_TXT from '@salesforce/label/c.BI_PSPB_BreakdownTxt';
import HOUR_TXT from '@salesforce/label/c.BI_PSPB_SummaryHrsTxt';
import PRODUCTIVITY_TXT from '@salesforce/label/c.BI_PSPB_AffectProductivityTxt';
import EFFECT_GPP_TXT from '@salesforce/label/c.BI_PSPB_EffectGppTxt';
import DOWNLOAD_MESSAGE from '@salesforce/label/c.BI_PSPB_DownloadMessage';
import ENTRY_TXT from '@salesforce/label/c.BI_PSPB_QuestionnaireEntryTxt';
import CANCEL_BTN from '@salesforce/label/c.BI_PSP_CancelButton';
export default class BiPspbQuestionnarieSumChart extends LightningElement {
	assessmentResponse;
	@track dlqiFirstQuestion = [];
	@track dlqiSecondQuestion = [];
	@track dlqiFifthQuestion = [];
	@track pss = [];
	@track dlqiThirdQuestion = [];
	@track dlqiFourthQuestion = [];
	pssShow;
	dlqiShowValue;
	dlqiShowValueTwo;
	dlqiShowValueThree;
	dlqiShowValueFour;
	dlqiShowValueFive;
	wpaiShow;
	cancelBtn=CANCEL_BTN;
	entryTxt=ENTRY_TXT;
	downloadMessage=DOWNLOAD_MESSAGE
	hrTxt=HOUR_TXT
	effectGppTxt=EFFECT_GPP_TXT
	breakDownTxt=BREAK_DOWN_TXT
	dlqiShortTxt=DLQI_TXT
	timePeriod=TIME_PERIOD;
	downloadTxt=DOWNLOAD_TXT;
	monthTxt=MONTH_TXT;
	productivtyTxt=PRODUCTIVITY_TXT
	psoriasisTxt=PSORIASIS_SYMPTOMS_TXT
	veryMuchTxt=VERY_MUCH
	alotTxt=ALOT_TXT
	notApplicabeTxt=NOT_APPLICABLE_TXT
	notAtAllTxt=NOT_AT_ALL_TXT
	aLittleTxt=A_LITTLE_TXT;
	skinIssue=OVER_TIME_SKIN;
	preventSkin=PREVENT_SKIN;
	notReleventTxt=NOT_RELEVANT_TXT;
	selectMonth=SELECT_MONTH_TXT
	durationTxt=DURATION_TXT
	rangeTxt=Range_OF_MONTHS
	questionnaire=QUESTIONNAIRE
	selectQuestionnaire=SELECT_QUESTIONNAIRE
	letPersonalizeTxt=LET_PERSONALIZE
	outStandingLabel=OUT_STANDING
	@track wpaiFirst = [];
	wpaiSecond = [];
	@track wpaiThird = [];
	@track selectedCategory;
	@track transformedData = [];
	showPopup;
	calculatedMonths;
	onPrint = false;
	chartInitialized = false;
	wpaiFirstshow;
	gotData = true;
	showDlqiBottom;
	showPssBottom;
	showWapiBottom;
	completedTxt=COMPLETED_TXT;
	summaryTxt=SUMMARY;
	wpaiStartText = WPAI_STAR_TEXT;
	defaultOptionValue = this.BI_PSP_DLQI_ShortDescription;
	thirdDlqiText = THIRD_DLQI_TEXT;
	dlqiBottom = DLQI_BOTTOM_TXT;
	dlqiBottomTwo = DLQI_BOTTOM_TXT_ONE;
	dlqiBottomThree = DLQI_BOTTOM_TXT_TWO;
	dlqiBottomFour = DLQI_BOTTOM_TXT_THREE;
	pssBottomTxt = PSS_BOTTOM_TXT;
	wpaiBottomTxt = WAPI_BOTTOM_TXT;
	outStandingUrl = OUTSTANDING_QUESTIONNAIRE_URL;
	siteUrlBranded = BRANDED_URL;
	lineGrey = LINE_GREY;
	lineYellow = LINE_YELLOW;
	lineBrown = LINE_BROWN;
	redCircle = RED_CIRCLE;
	yellowCircle = YELLOW_CIRCLE;
	orangeCircle = ORANGE_CIRCLE;
	greenCircle = GREEN_CIRCLE;
	greyCircle = GREY_CIRCLE;
	correctTxt = CORRECT;
	wrongTxt = WRONG;
	notApplicableTxt = NOT_APPLICABLE;
	naTxtImg = NA;
	pssShortDescription = PSS_SHORT_TXT;
	dlqiShortDescription = DLQI_SHORT_TXT;
	veryServereDescription = VERY_SERVERE_SHORT_TXT;
	servereDescription = SERVERE_SHORT_TXT;
	moderateDescription = MODERATE_SHORT_TXT;
	mildDescription = MILD_SHORT_TXT;
	noneDescription = NONE_SHORT_TXT;
	veryMuchDescription = VERY_MUCH_SHORT_TXT;
	aLotDescription = A_LOT_MUCH_SHORT_TXT;
	aLittleDescription = A_LITTLE_MUCH_SHORT_TXT;
	notAtAllDescription = NOT_AT_ALL_SHORT_TXT;
	notRelevantDescription = NOT_RELEVENT_ALL_SHORT_TXT;
	softDeleteDescription = SOFT_DELETE_ALL_SHORT_TXT;
	noShortDescription = NO_SHORT_TXT;
	skinConditionDescription = SKIN_CONDITION_SHORT_TXT;
	skinQuestionDescription = SKIN_QUESTION_SHORT_TXT;
	shortQuestionOneDescription = SHORT_QUESTION_SHORT_TXT;
	shortQuestionTwoDescription = SHORT_QUESTION_TWO_SHORT_TXT;
	shortQuestionThreeDescription = SHORT_QUESTION_THREE_SHORT_TXT;
	shortQuestionFourDescription = SHORT_QUESTION_FOUR_SHORT_TXT;
	shortQuestionFiveDescription = SHORT_QUESTION_FIVE_SHORT_TXT;
	shortQuestionSixDescription = SHORT_QUESTION_SIX_SHORT_TXT;
	shortQuestionSevenDescription = SHORT_QUESTION_SEVEN_SHORT_TXT;
	shortQuestionEightDescription = SHORT_QUESTION_EIGHT_SHORT_TXT;
	shortQuestionNineDescription = SHORT_QUESTION_NINE_SHORT_TXT;
	shortQuestionTenDescription = SHORT_QUESTION_TEN_SHORT_TXT;
	shortQuestionEleventhDescription = SHORT_QUESTION_ELEVEN_SHORT_TXT;
	shortQuestionTwelethDescription = SHORT_QUESTION_TWELVE_SHORT_TXT;
	shortQuestionThirteenDescription = SHORT_QUESTION_THIRTEEN_SHORT_TXT;
	shortQuestionFourteenDescription = SHORT_QUESTION_FOURTEEN_SHORT_TXT;
	shortQuestionFifteenDescription = SHORT_QUESTION_FIFTEEN_SHORT_TXT;
	notApplicableDescription = SHORT_NOT_APPLICABLE_SHORT_TXT;
	painDescription = PAIN_SHORT_TXT;
	rednessDescription = REDNESS_SHORT_TXT;
	itchingDescription = ITCHING_SHORT_TXT;
	burningDescription = BURNING_SHORT_TXT;
	wpaiDescription = WPAI_CATEGORY_SHORT_TXT;
	lineDescription = LINE_SHORT_TXT;
	oneMonthLabel = ONE_MONTH_TXT;
	lastThreeMonthLabel = LAST_THREE_MONTHS;
	lastSixMonthLabel = LAST_SIX_MONTHS;
	lastTweleveMonthLabel = LAST_TWELVE_MONTHS;
	assessmentData;
	userId = Id;
	showChart;
	chartDatachartData;
	monthsToDisplay;
	bubbles = '';
	selectedMonthValue = '';
	showMonthSelector;
	selectedSingleMonth;
	storeWpai;
	storePss;
	storeDlqi;
	storeQsq;
	urlq;
	formattedDate;
	endDate;
	previousMonths = [];
	currentPageUrl;
	urlSegments;
	baseUrl;
	showTabMenu;
	count;
	wpaiThirdshow;
	storeAssessmentvalue;
	placeholder = SELECT_QUESTION;
	picklistOptions = [];
	placeholderdate = RANGE_OF_MONTHS;
	chartInstance = null;

	picklistOptionsdate = [
		{ label: this.oneMonthLabel, value: this.oneMonthLabel },
		{ label: this.lastThreeMonthLabel, value: this.lastThreeMonthLabel },
		{ label: this.lastSixMonthLabel, value: this.lastSixMonthLabel },
		{ label: this.lastTweleveMonthLabel, value: this.lastTweleveMonthLabel }
	];
	placeholderMonth = SELECT_MONTH;
	picklistOptionsMonth = [
		{ label: JANUARY, value: JANUARY },
		{ label: FEBRUARY, value: FEBRUARY },
		{ label: MARCH, value: MARCH },
		{ label: APRIL, value: APRIL },
		{ label: MAY, value: MAY },
		{ label: JUNE, value: JUNE },
		{ label: JULY, value: JULY },
		{ label: AUGUST, value: AUGUST },
		{ label: SEPTEMBER, value: SEPTEMBER },
		{ label: OCTOBER, value: OCTOBER },
		{ label: NOVEMEBER, value: NOVEMEBER },
		{ label: DECEMBER, value: DECEMBER }
	];

	//This method is used to get the AssessmentResponses of the questionnaire
	@wire(GET_ASSESSMENT_COUNT)
	wiredAssessmentResponsesqsq({ data, error }) {

		if (data && data !== null) {
			try {
				this.count = data;
				if (this.count[0] !== 0 || this.count[1] !== 0 || this.count[2] !== 0 || this.count[3] !== 0) {
					this.showTabMenu = true;
					this.storeWpai = this.count[0];
					this.storePss = this.count[1];
					this.storeDlqi = this.count[2];
					this.storeQsq = this.count[3];
				}
				else {
					this.showTabMenu = false;
				}
			} catch (err) {

				this.showToast(ERROR_MESSAGE, err.message, ERROR_VARIANT);
			}
		}
		else if (error) {
			this.showToast(ERROR_MESSAGE, error.message, ERROR_VARIANT);
			this.showTabMenu = false;
		}
	}

	// Getter to extract unique months from transformedData
	get months() {
		let uniqueMonths = new Set();
		this.transformedData.forEach(item => {
			item.months.forEach(monthItem => {
				uniqueMonths.add(monthItem.Month);
			});
		});

		// Convert the set to an array and sort the months
		let sortedMonths = Array.from(uniqueMonths).sort((a, b) => {
			let dateA = new Date(a);
			let dateB = new Date(b);
			return dateA - dateB;
		});
		return sortedMonths;
	}
	get wpaiChanges() {
		if (this.selectedCategory === this.wpaiDescription || this.selectedCategory === this.wpaiStartText) {
			return 'bubblecenterWapi';
		}
		return 'bubblecenter';
	}
	get dlqiChanges() {
		if (this.selectedCategory === this.dlqiShortDescription) {
			return 'bubblecenterDlqi';
		}
		return 'bubblecenter';
	}

	// Used to get the care program enrollee and decide the rendering part of the graph modules
	connectedCallback() {
		let globalThis = window;
		let CurrentPage = globalThis.location?.href;
		try {
			this.currentPageUrl = CurrentPage;
			this.urlSegments = this.currentPageUrl.split('/');
			this.baseUrl = `${this.urlSegments[0]}//${this.urlSegments[2]}`;
			GET_ENROLLE()
				.then(result => {
					if (result[0].id !== null) {
						this.enrolleId = result[0].Id;
						this.getlastElevenMonths();
					} else if (result[0].error !== null) {
						this.showToast(ERROR_MESSAGE, ERROR_MESSAGE, ERROR_VARIANT);
					}
				})

				.catch(error => {
					this.showToast(ERROR_MESSAGE, error.message, ERROR_VARIANT);
				})

			let currentURL = globalThis.location.href;
			let urlObject = new URL(currentURL);
			let path = urlObject.pathname;
			let pathComponents = path.split('/');
			let desiredComponent = pathComponents.find((component) =>
				[BRANDED_URL.toLowerCase(), UN_ASSIGNED_URL.toLowerCase()].includes(
					component.toLowerCase()
				)
			);

			if (desiredComponent.toLowerCase() === BRANDED_URL.toLowerCase()) {
				this.urlq = BRANDED_URL_NAVI;
			} else {
				this.urlq = UN_ASSIGNED_URL_NAVI;
			}
		}
		catch (error) {
			this.showToast(ERROR_MESSAGE, error.message, ERROR_VARIANT);
		}
	}

	// Used to get the particular questionnaire for the chosen month
	GET_LAST_QUESTION(months) {
		GET_LAST_QUESTION({ erolleId: this.enrolleId, selectedMonths: months })
			.then(results => {
				this.storeAssessmentvalue = results;
				let uniqueOptions = [];
				let modifiedOptions = [];
				let defaultOptionValue = this.defaultOptionValue;
				results.forEach(item => {
					let itemName = item.Name;
					// Check if itemName matches "Work & Activity Impairment (WPAI)" and replace it
					if (itemName === this.wpaiDescription) {
						itemName = this.wpaiStartText;
					}

					// Check if an object with the same label already exists in uniqueOptions
					let existingIndex = uniqueOptions.findIndex(option => option.label === itemName);

					// If no object with the same label exists, add the current item to uniqueOptions
					if (existingIndex === -1) {
						let newOption = {
							label: itemName,
							value: itemName,
							selected: false
						};
						uniqueOptions.push(newOption);
						modifiedOptions.push(newOption);
					} else {
						// If an object with the same label exists, update the selected property
						uniqueOptions[existingIndex].selected = uniqueOptions[existingIndex].selected || (itemName === defaultOptionValue);
					}
				});


				this.picklistOptions = uniqueOptions;


				this.picklistOptions.forEach(option => {
					if (option.value === this.defaultOptionValue) {
						option.selected = true;
					}
				});

				this.picklistOptions.sort((a, b) => {
					let labelA = a.label.toLowerCase();

					let labelB = b.label.toLowerCase();

					if (labelA < labelB) {
						return -1;
					}
					if (labelA > labelB) {
						return 1;
					}
					return 0;
				});

				if (this.picklistOptions.length > 0) {
					this.picklistOptions.forEach(option => {
						if (option.label === this.wpaiStartText) {
							option.value = this.wpaiDescription;
						}
					});
					this.selectedCategory = this.picklistOptions[0].value;

					if (this.selectedCategory) {
						if (this.selectedCategory === this.dlqiShortDescription) {
							this.showDlqiBottom = true;
							this.showPssBottom = false;
							this.showWapiBottom = false;
						} else if (this.selectedCategory === this.pssShortDescription) {
							this.showDlqiBottom = false;
							this.showPssBottom = true;
							this.showWapiBottom = false;
						} else if (this.selectedCategory === this.wpaiDescription) {
							this.showDlqiBottom = false;
							this.showPssBottom = false;
							this.showWapiBottom = true;
						}
					}
					this.selectedMonthValue = this.oneMonthLabel;
					this.handleDefaultMonth();
				}
			})
			.catch(error => {
				this.showToast(ERROR_MESSAGE, error.message, ERROR_VARIANT);
			})
	}


	// To display completed questionnarie
	getlastElevenMonths() {
		// Get current date
		let currentDate = new Date();

		// Get current month and year
		let currentMonth = currentDate.getMonth();
		let currentYear = currentDate.getFullYear();

		// Array to hold month names
		let monthNames = [JANUARY, FEBRUARY, MARCH, APRIL, MAY, JUNE, JULY, AUGUST, SEPTEMBER, OCTOBER, NOVEMEBER, DECEMBER];

		// Array to hold current and previous 11 months


		// Add current month
		this.previousMonths.push(`${monthNames[currentMonth]} ${currentYear}`);

		// Calculate and store previous 11 months
		for (let i = 1; i <= 10; i++) {
			// Calculate the index of the previous month
			let prevMonthIndex = (currentMonth - i + 12) % 12;

			// Get the name of the previous month
			let prevMonthName = monthNames[prevMonthIndex];

			// Calculate the year for the previous month
			let prevYear = currentYear - (i <= currentMonth ? 0 : 1);

			// Construct the name including the year
			let prevMonthFullName = `${prevMonthName} ${prevYear}`;

			// Push the name to the array
			this.previousMonths.push(prevMonthFullName);
		}

		this.GET_LAST_QUESTION(JSON.stringify(this.previousMonths));
		// Log the array with the names of the previous 11 months including the year

	}

	//Used for higlighting the background
	highlightbackground() {
		if (this.bubbles === null) {
			this.bubbles = HIGHLIGHT_BACK_TXT; //This is a css proterty
		} else {
			this.bubbles = '';
		}
	}
	//This is used for rendering the popup screen for download confirmation
	captureComponent() {
		if (this.enrolleId !== null && this.selectedCategory !== null && JSON.stringify(this.calculatedMonths) !== null && this.assessmentResponse !== null) {
			this.showPopup = true;
		} else {
			this.showPopup = false;
		}
		this.onPrint = true;
		if (this.selectedCategory === this.wpaiDescription) {
			this.selectedCategory = this.wpaiStartText;
		}

	}
	//This method is used for calculatring the number of months for the charts
	handleCalculateMonths(numberOfMonths) {
		let currentDate = new Date();
		let currentYear = currentDate.getFullYear();
		let startMonth, endMonth;


		if (numberOfMonths === 1) {
			// If only one month is needed, both start and end months are the current month
			startMonth = currentDate.getMonth() + 1; // Adding 1 since getMonth() returns 0-indexed month
			endMonth = startMonth;
		} else if (numberOfMonths > 1 && numberOfMonths <= 11) {
			// If more than one month is needed but less than or equal to 11 months
			startMonth = currentDate.getMonth() - numberOfMonths + 1;
			if (startMonth <= 0) {
				startMonth += 12; // Adjusting if start month goes below 1 (JANUARY)
			}
			endMonth = currentDate.getMonth() + 1; // Adding 1 since getMonth() returns 0-indexed month
		} else {
			// If more than 11 months are needed, take the entire previous year
			startMonth = 1; // JANUARY of the current year
			endMonth = currentDate.getMonth() + 1; // Adding 1 since getMonth() returns 0-indexed month
		}

		this.calculatedMonths = this.getMonthsInRange(startMonth, endMonth, currentYear);
		this.getQuestionnaireAssesmentResponse(this.enrolleId, this.selectedCategory, JSON.stringify(this.calculatedMonths));
		this.transformedData = [];
		this.dlqiFirstQuestion = [];
		this.dlqiSecondQuestion = [];
		this.dlqiFifthQuestion = [];
		this.pss = [];
		this.dlqiThirdQuestion = [];
		this.dlqiFourthQuestion = [];
		this.wpaiSecond = [];
		this.wpaiFirst = [];
		this.wpaiThird = [];

	}
	//This is used for calculating the month range dynamically
	getMonthsInRange(start, end, year) {
		let months = [];
		if (start <= end) {
			for (let i = start; i <= end; i++) {
				months.push(`${this.currentMonthName(i)} ${year}`);
			}
		} else {
			for (let i = start; i <= 12; i++) {
				months.push(`${this.currentMonthName(i)} ${year - 1}`);
			}
			for (let i = 1; i <= end; i++) {
				months.push(`${this.currentMonthName(i)} ${year}`);
			}
		}
		return months;
	}
	//This is used to get the current month
	currentMonthName(monthIndex) {
		let monthNames = [JANUARY, FEBRUARY, MARCH, APRIL, MAY, JUNE,
			JULY, AUGUST, SEPTEMBER, OCTOBER, NOVEMEBER, DECEMBER];
		return monthNames[monthIndex - 1];
	}
	//Used for formatting the date to our desired format
	formatDate(dateString) {
		let date = new Date(dateString);
		let month = date.toLocaleString('default', { month: 'long' });
		let year = date.getFullYear();
		return `${month} ${year}`;
	}
	//Used for handling, after changing the month values
	handleSingleMonthChange(event) {
		this.selectedSingleMonth = event.target.value;
		this.calculatedMonths = this.formatDate(this.selectedSingleMonth);

		this.getQuestionnaireAssesmentResponse(this.enrolleId, this.selectedCategory, JSON.stringify(this.selectedSingleMonth));
		this.transformedData = [];
		this.dlqiFirstQuestion = [];
		this.dlqiSecondQuestion = [];
		this.dlqiFifthQuestion = [];
		this.pss = [];
		this.dlqiThirdQuestion = [];
		this.dlqiFourthQuestion = [];
		this.wpaiSecond = [];
		this.wpaiFirst = [];
		this.wpaiThird = [];
	}
	//Used for handling, after changing the category values
	handleCategoryChange(event) {
		this.selectedCategory = event.target.value;

		if (this.storeAssessmentvalue.length > 0 && this.selectedCategory !== null && this.selectedMonthValue === this.oneMonthLabel) {
			let uniqueOptions = [];
			this.storeAssessmentvalue.forEach(item => {
				if (item.Name === this.selectedCategory) {
					uniqueOptions.push({
						label: item.BI_PSP_DateForCQ__c,
						value: item.BI_PSP_DateForCQ__c,
						selected: false
					});
				}
			});
			this.previousMonths = uniqueOptions;
			if (this.previousMonths.length > 0) {
				this.previousMonths[0].selected = true;
				this.calculatedMonths = this.formatDate(this.previousMonths[0].value);
				this.getQuestionnaireAssesmentResponse(this.enrolleId, this.selectedCategory, JSON.stringify(this.previousMonths[0].value));
			}
		}
		else {
			this.getQuestionnaireAssesmentResponse(this.enrolleId, this.selectedCategory, JSON.stringify(this.calculatedMonths));
		}
		if (this.selectedCategory) {
			if (this.selectedCategory === this.dlqiShortDescription) {
				this.showDlqiBottom = true;
				this.showPssBottom = false;
				this.showWapiBottom = false;
			} else if (this.selectedCategory === this.pssShortDescription) {
				this.showDlqiBottom = false;
				this.showPssBottom = true;
				this.showWapiBottom = false;
			}
			else if (this.selectedCategory === this.wpaiDescription) {
				this.showDlqiBottom = false;
				this.showPssBottom = false;
				this.showWapiBottom = true;
			}
		}
		this.transformedData = [];
		this.dlqiFirstQuestion = [];
		this.dlqiSecondQuestion = [];
		this.dlqiFifthQuestion = [];
		this.pss = [];
		this.dlqiThirdQuestion = [];
		this.dlqiFourthQuestion = [];
		this.wpaiSecond = [];
		this.wpaiFirst = [];
		this.wpaiThird = [];
	}
	//Used for handling, after changing the number month values
	handleMonthChange(event) {
		this.selectedMonthValue = event.target.value;
		if (this.selectedMonthValue === this.oneMonthLabel) {
			this.handleDefaultMonth();
		} else {
			this.showMonthSelector = false;
			this.endDate = parseInt(this.selectedMonthValue.match(/\d+/u)[0], 10);
			if (this.endDate) {
				this.handleCalculateMonths(this.endDate);
			}
		}

	}
	//This is used for handling the default month value for the selected category
	handleDefaultMonth() {
		this.showMonthSelector = true;
		if (this.storeAssessmentvalue.length > 0 && this.selectedCategory !== null && this.selectedMonthValue === this.oneMonthLabel) {
			let uniqueOptions = [];
			this.storeAssessmentvalue.forEach(item => {
				if (item.Name === this.selectedCategory) {
					uniqueOptions.push({
						label: item.BI_PSP_DateForCQ__c,
						value: item.BI_PSP_DateForCQ__c,
						selected: false
					});
				}

			});
			this.previousMonths = [];
			this.previousMonths = uniqueOptions;
			if (this.previousMonths.length > 0) {
				this.previousMonths[0].selected = true;
				this.calculatedMonths = this.formatDate(this.previousMonths[0].value);
				this.transformedData = [];
				this.dlqiFirstQuestion = [];
				this.dlqiSecondQuestion = [];
				this.dlqiFifthQuestion = [];
				this.pss = [];
				this.dlqiThirdQuestion = [];
				this.dlqiFourthQuestion = [];
				this.wpaiSecond = [];
				this.wpaiFirst = [];
				this.wpaiThird = [];
				this.getQuestionnaireAssesmentResponse(this.enrolleId, this.selectedCategory, JSON.stringify(this.previousMonths[0].value));
			}
		}
	}
	getQuestionnaireAssesmentResponse(enrolles, categoryvalues, rangeofMonths) {
		if (!(enrolles && categoryvalues && rangeofMonths)) {
			return; // Exit early if any required parameter is missing
		}
		GET_ASSESSMENT_DETAILS({ erolleId: enrolles, questionnaireCategory: categoryvalues, selectedMonths: rangeofMonths })
			.then(result => {
				if (result !== null) {
					this.assessmentResponse = result;
					this.showChart = true;
					this.gotData = true;
					this.transformedData = []; // Clear transformedData before populating

					for (let monthKey in this.assessmentResponse) {
						if (Object.hasOwnProperty.call(this.assessmentResponse, monthKey)) {
							let month = this.assessmentResponse[monthKey];

							for (let i = 0; i < month.length; i++) {
								let question = month[i];
								let existingQuestion = this.transformedData.find(item => item.Question === question.AssessmentQuestion.BI_PSP_shortQuestionText__c);

								if (!existingQuestion) {
									existingQuestion = {
										Question: question.AssessmentQuestion.BI_PSP_shortQuestionText__c,
										months: []
									};
									this.transformedData.push(existingQuestion);
								}

								let monthValue = {
									Month: monthKey,
									...this.getResponseValue(question, categoryvalues)
								};

								existingQuestion.months.push(monthValue);
							}
						}
					}

					this.updateTransformedData(categoryvalues);

					if (this.wpaiShow === true && this.wpaiSecond !== null) {
						this.lineChart();
					}
					if (this.wpaiThirdshow === true && this.wpaiThird !== null) {
						this.lineChart1();
					}
				} else {
					this.showChart = false;
					this.gotData = false;
					this.assessmentResponse = null;
				}
			})
			.catch(error => {
				this.showChart = false;
				this.showToast(ERROR_MESSAGE, error.message, ERROR_VARIANT);
			});

	}

	getResponseValue(question, categoryvalues) {
		switch (categoryvalues) {
			case this.pssShortDescription:
				return this.getPSSResponseValue(question);
			case this.dlqiShortDescription:
				return this.getDLQIResponseValue(question);
			case this.wpaiDescription:
				return this.getWPAIResponseValue(question);
			default:
				return {
					Value: question.ResponseText,
					borderColor: ''
				};
		}
	}

	getPSSResponseValue(question) {
		switch (question.ResponseText) {
			case this.veryServereDescription:
				return {
					Value: this.redCircle,
					borderColor: ''
				};
			case this.servereDescription:
				return {
					Value: this.orangeCircle,
					borderColor: ''
				};
			case this.moderateDescription:
				return {
					Value: this.yellowCircle,
					borderColor: ''
				};
			case this.mildDescription:
				return {
					Value: this.greenCircle,
					borderColor: ''
				};
			case this.noneDescription:
				return {
					Value: this.greyCircle,
					borderColor: ''
				};
			default:
				return {
					Value: this.naTxtImg,
					borderColor: ''
				};
		}
	}

	// Helper method to get DLQI response value and border color
	getDLQIResponseValue(question) {
		const { AssessmentQuestion, ResponseText } = question;
		const questionText = AssessmentQuestion.BI_PSP_shortQuestionText__c;

		switch (questionText) {
			case this.skinConditionDescription:
			case this.skinQuestionDescription:
			case this.shortQuestionOneDescription:
			case this.shortQuestionTwoDescription:
			case this.shortQuestionThreeDescription:
			case this.shortQuestionFourDescription:
			case this.shortQuestionSevenDescription:
			case this.shortQuestionEightDescription:
			case this.shortQuestionNineDescription:
				return {
					Value: this.handleDLQIResponseValue(ResponseText, [this.veryMuchDescription, this.aLotDescription, this.aLittleDescription, this.notAtAllDescription, this.notRelevantDescription], [this.redCircle, this.orangeCircle, this.yellowCircle, this.greenCircle, this.greyCircle]),
					borderColor: ''
				};
			case this.thirdDlqiText:
				return {
					Value: ResponseText === this.noShortDescription ? this.wrongTxt
						: ResponseText === this.notRelevantDescription ? this.notApplicableTxt
							: this.naTxtImg,
					borderColor: ''
				};
			case this.shortQuestionSixDescription:
				return {
					Value: ResponseText === this.aLotDescription ? this.orangeCircle
						: ResponseText === this.aLittleDescription ? this.yellowCircle
							: ResponseText === this.notAtAllDescription ? this.greenCircle
								: ResponseText === this.notApplicableDescription ? this.naTxtImg
									: this.naTxtImg,
					borderColor: ''
				};
			default:
				return {
					Value: this.naTxtImg,
					borderColor: ''
				};
		}
	}

	// Helper method to handle DLQI response value based on response text
	handleDLQIResponseValue(responseText, validResponses, values) {
		const index = validResponses.indexOf(responseText);
		return index !== -1 ? values[index] : this.naTxtImg;
	}

	getWPAIResponseValue(question) {
		switch (question.AssessmentQuestion.BI_PSP_shortQuestionText__c) {
			case this.shortQuestionTenDescription:
				return {
					Value: question.ResponseText === this.softDeleteDescription ? this.correctTxt
						: question.ResponseText === this.noShortDescription ? this.wrongTxt
							: this.naTxtImg,
					borderColor: question.ResponseText === this.softDeleteDescription ? '#403A60'
						: question.ResponseText === this.noShortDescription ? '#403A60'
							: ''
				};
			case this.shortQuestionThirteenDescription:
			case this.shortQuestionTwelethDescription:
				return {
					Value: question.ResponseText !== null ? question.ResponseText : 0,
					borderColor: '#403A60'
				};
			case this.shortQuestionEleventhDescription:
				return {
					Value: question.ResponseText !== null ? question.ResponseText : 0,
					borderColor: '#ECDCA8'
				};
			case this.shortQuestionFourteenDescription:
			case this.shortQuestionFifteenDescription:
				return {
					Value: question.ResponseText !== null ? question.ResponseText : 0,
					borderColor: '#926B45'
				};
			default:
				return {
					Value: this.naTxtImg,
					borderColor: ''
				};
		}
	}
	//Updating processed data by categoryvalues to show as graph
	updateTransformedData(categoryvalues) {
		if (this.transformedData.length === 0) {
			return;
		}

		if (categoryvalues === this.dlqiShortDescription) {
			this.updateDLQIQuestions();
		} else if (categoryvalues === this.pssShortDescription) {
			this.updatePSSQuestions();
		} else if (categoryvalues === this.wpaiDescription) {
			this.updateWPAIQuestions();
		}
	}

	updateDLQIQuestions() {
		this.addToDLQIQuestions(this.skinConditionDescription, this.dlqiFirstQuestion);
		this.addToDLQIQuestions(this.skinQuestionDescription, this.dlqiFirstQuestion);
		this.addToDLQIQuestions(this.shortQuestionOneDescription, this.dlqiSecondQuestion);
		this.addToDLQIQuestions(this.shortQuestionTwoDescription, this.dlqiSecondQuestion);
		this.addToDLQIQuestions(this.shortQuestionThreeDescription, this.dlqiSecondQuestion);
		this.addToDLQIQuestions(this.shortQuestionFourDescription, this.dlqiSecondQuestion);
		this.addToDLQIQuestions(this.thirdDlqiText, this.dlqiThirdQuestion);

		if (this.dlqiThirdQuestion.length > 0 && this.dlqiThirdQuestion[0].value !== this.softDeleteDescription) {
			this.addToDLQIQuestions(this.shortQuestionSixDescription, this.dlqiFourthQuestion);
		}

		this.addToDLQIQuestions(this.shortQuestionSevenDescription, this.dlqiFifthQuestion);
		this.addToDLQIQuestions(this.shortQuestionEightDescription, this.dlqiFifthQuestion);
		this.addToDLQIQuestions(this.shortQuestionNineDescription, this.dlqiFifthQuestion);

		this.dlqiFirstQuestion = this.updateQuestionVisibilityDlqi(this.dlqiFirstQuestion, 'dlqiShowValue');
		this.dlqiSecondQuestion = this.updateQuestionVisibilityDlqi(this.dlqiSecondQuestion, 'dlqiShowValueTwo');
		this.dlqiThirdQuestion = this.updateQuestionVisibilityDlqi(this.dlqiThirdQuestion, 'dlqiShowValueThree');
		this.dlqiFourthQuestion = this.updateQuestionVisibilityDlqi(this.dlqiFourthQuestion, 'dlqiShowValueFour');
		this.dlqiFifthQuestion = this.updateQuestionVisibilityDlqi(this.dlqiFifthQuestion, 'dlqiShowValueFive');
	}

	updatePSSQuestions() {
		this.addToArrayIfFound(this.painDescription, this.pss);
		this.addToArrayIfFound(this.rednessDescription, this.pss);
		this.addToArrayIfFound(this.itchingDescription, this.pss);
		this.addToArrayIfFound(this.burningDescription, this.pss);

		this.pss = this.updateQuestionVisibilityPss(this.pss, 'pssShow');
	}

	updateWPAIQuestions() {
		this.addToArrayIfFound(this.shortQuestionTenDescription, this.wpaiFirst);
		this.addToArrayIfFound(this.shortQuestionEleventhDescription, this.wpaiSecond);
		this.addToArrayIfFound(this.shortQuestionFifteenDescription, this.wpaiSecond);
		this.addToArrayIfFound(this.shortQuestionThirteenDescription, this.wpaiSecond);
		this.addToArrayIfFound(this.shortQuestionTwelethDescription, this.wpaiThird);
		this.addToArrayIfFound(this.shortQuestionFourteenDescription, this.wpaiThird);

		this.wpaiFirst = this.updateQuestionVisibilityWpai(this.wpaiFirst, 'wpaiFirstshow');
		this.wpaiSecond = this.updateQuestionVisibilityWpai(this.wpaiSecond, 'wpaiShow');
		this.wpaiThird = this.updateQuestionVisibilityWpai(this.wpaiThird, 'wpaiThirdshow');
	}

	addToDLQIQuestions(questionDescription, targetArray) {
		let desiredQuestion = this.transformedData.find(question =>
			question.Question === questionDescription
		);
		if (desiredQuestion) {
			targetArray.push(desiredQuestion);
		}
	}

	addToArrayIfFound(questionDescription, targetArray) {
		let desiredQuestion = this.transformedData.find(question =>
			question.Question === questionDescription
		);
		if (desiredQuestion) {
			targetArray.push(desiredQuestion);
		}
	}
	updateQuestionVisibilityDlqi(questionArray, visibilityFlag) {
		let questionArrayDlqi = questionArray.filter(item => item !== null);
		if (questionArrayDlqi.length > 0) {
			this[visibilityFlag] = true;
			this.pssShow = false;
			this.wpaiShow = false;
			this.wpaiFirstshow = false;
			this.wpaiThirdshow = false;
		}
		return questionArrayDlqi;
	}
	updateQuestionVisibilityWpai(questionArray, visibilityFlag) {
		let questionArrayWapi = questionArray.filter(item => item !== null);
		if (questionArrayWapi.length > 0) {
			this[visibilityFlag] = true;
			this.pssShow = false;
			this.dlqiShowValue = false;
			this.dlqiShowValueTwo = false;
			this.dlqiShowValueFive = false;
			this.dlqiShowValueThree = false;
			this.dlqiShowValueFour = false;
		}
		return questionArrayWapi;
	}
	updateQuestionVisibilityPss(questionArray, visibilityFlag) {
		let questionArrayPss = questionArray.filter(item => item !== null);
		if (questionArrayPss.length > 0) {
			this[visibilityFlag] = true;
			this.pssShow = true;
			this.dlqiShowValue = false;
			this.dlqiShowValueTwo = false;
			this.dlqiShowValueFive = false;
			this.dlqiShowValueThree = false;
			this.dlqiShowValueFour = false;
			this.wpaiShow = false;
			this.wpaiFirstshow = false;
			this.wpaiThirdshow = false;
		}
		return questionArrayPss;
	}

	// Consolidated method to load and render line charts
	lineChart() {
		loadScript(this, chartjs)
			.then(() => {
				this.renderLineChart('.line-chart', this.wpaiSecond);
			})
			.catch(error => {
				this.showToast(ERROR_MESSAGE, error.message, ERROR_VARIANT);
			});
	}

	lineChart1() {
		loadScript(this, chartjs)
			.then(() => {
				this.renderLineChart('.line-chart1', this.wpaiThird);
			})
			.catch(error => {
				this.showToast(ERROR_MESSAGE, error.message, ERROR_VARIANT);
			});
	}
	// Consolidated method to render line charts
	renderLineChart(canvasSelector, dataToRender) {
		let canvas = this.template.querySelector(canvasSelector);
		let ctx = canvas.getContext('2d');

		let allMonths = [...new Set([].concat(...dataToRender.map(question => question.months.map(month => month.Month))))];
		allMonths.sort((a, b) => new Date(a) - new Date(b));

		let datasets = dataToRender.map(question => ({
			/*label: question.Question,*/
			data: [null, ...allMonths.map(month => {
				let foundMonth = question.months.find(qMonth => qMonth.Month === month);
				return foundMonth ? foundMonth.Value : 0;
			}), null],
			borderColor: question.months[0].borderColor,
			fill: false
		}));

		let data = {
			labels: ['', ...allMonths, ''],
			datasets: datasets
		};

		let options = {
			legend: {
				display: false
			},
			scales: {
				yAxes: [
					{
						ticks: {
							stepSize: canvasSelector === '.line-chart' ? 20 : 2,  // Adjust step size based on canvas selector
							min: 0,
							max: canvasSelector === '.line-chart' ? 200 : 10,  // Adjust max value based on canvas selector
						},
					},
				],
			},
		};

		let globalThis = window;
		this.chartInstance = new globalThis.Chart(ctx, {
			type: 'line',
			data: data,
			options: options
		});

		// Clear the respective data array after rendering
		if (canvasSelector === '.line-chart') {
			this.wpaiSecond = [];
		} else if (canvasSelector === '.line-chart1') {
			this.wpaiThird = [];
		}
	}
	//Navigation
	openOutQuestionnaires() {
		window.location.assign(this.urlq + this.outStandingUrl);
	}
	openSummary() {
		window.location.assign(this.urlq + SUMMARY_URL);
	}
	// navigation for all Completed Questionnaire by checking conditions
	openComQuestionnaires() {
		if (this.storeDlqi > 0) {
			window.location.assign(this.urlq + DLQI_COMPLETED_URL);
		} else if (this.storePss > 0) {
			window.location.assign(this.urlq + PSS_COMPLETED_URL);
		} else if (this.storeWpai > 0) {
			window.location.assign(this.urlq + WAPI_COMPLETED_URL);
		} else if (this.storeQsq > 0) {
			if (this.targetDate14 !== null) {
				if (this.status === COMPLETED_LABEL || this.status === EXPIRED) {
					window.location.assign(
						this.urlq + QUALITATIVE_COMPLETED_FOURTEEN_WEEKS
					);
				} else {
					window.location.assign(this.urlq + QUALITATIVE_COMPLETED_TWO_MONTHS);
				}
			} else {
				window.location.assign(this.urlq + QUALITATIVE_COMPLETED_TWO_MONTHS);
			}
		}
	}
	openPersonalize() {
		window.location.assign(this.urlq + LETS_PERSONALIZE_URL);
	}
	cancelDownload() {
		this.showPopup = false;
		this.onPrint = false;
	}

	// renderedCallback() {
	// 	loadScript(this, jsPDF)
	// 		.then(() => {
	// 			console.log('success pdf');
	// 		})
	// 		.catch(error => {
	// 			console.log(error);
	// 		});
	// 	loadScript(this, html2canvas)
	// 		.then(() => {
	// 			console.log('success html');
	// 		})
	// 		.catch(error => {
	// 			console.log(error);
	// 		});
	// }
	yesDownload() {
		window.print();
		this.cancelDownload()
		this.onPrint = false;
		//const content = this.template.querySelector('.custom-box22');

		// document.body.appendChild(content);

		// window.html2canvas(content).then(canvas => {

		// 	const imgData = canvas.toDataURL('image/png');

		// 	const pdf = new window.jsPDF('p', 'mm', 'a4');

		// 	const pdfWidth = pdf.internal.pageSize.getWidth();

		// 	const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

		// 	pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

		// 	pdf.save('download.pdf');

		// }).catch(error => {
		// 	console.log('i am here');
		// 	console.log(error);
		// });
	}



	// showToast used for all the error messages caught
	showToast(title, message, variant) {
		if (typeof window !== 'undefined') {
			let event = new ShowToastEvent({
				title: title,
				message: message,
				variant: variant
			});
			this.dispatchEvent(event);
		}
	}
}