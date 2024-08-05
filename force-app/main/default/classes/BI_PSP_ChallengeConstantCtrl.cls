public with sharing class BI_PSP_ChallengeConstantCtrl {
    public static BI_SFCOE_LOG_App_Settings__c settings = BI_SFCOE_LOG_App_Settings__c.getValues(
'PSPB'
);
public static string applicationName = settings != null
? settings.BI_SFCOE_LOG_Application__c
: '';
public static String errorMsg = '';
public static String enrolleeNf = System.Label.BI_PSP_EnrolleeCannotFound;
public static String caregiverNf = System.Label.BI_PSP_CaregiverCannotFound;
public static String enrolleeNfNs = System.Label.BI_PSP_EnrolleeNotFound;
public static String challengeActive = System.Label.BI_PSP_ChallengeActive;
public static String challengeAvailable = System.Label.BI_PSP_ChallengeAvailable;
public static String challengeCompleted = System.Label.BI_PSPB_ChallengeCompleted;
public static String challengeLevelOne = System.Label.BI_PSP_ChallengeLevelOne;
public static String challengeLevelTwo = System.Label.BI_PSP_ChallengeLevelTwo;
public static String challengeLevelThree = System.Label.BI_PSP_ChallengeLevelThree;
public static String completeOneSt = System.Label.BI_PSP_CompleteOneSt;
public static String completeFourSt = System.Label.BI_PSP_CompleteFourSt;
public static String currentlyCompleted = System.Label.BI_PSP_CurrentlyCompleted;
public static String assessmentWpai = System.Label.BI_PSP_AssessmentWpai;
public static String assessmentStatusCompleted = System.Label.BI_PSP_Completed;
public static String completeWpai = System.Label.BI_PSP_CompleteWpai;
public static String assessmentPss = System.Label.BI_PSP_AssessmentPss;
public static String completePss = System.Label.BI_PSP_CompletePss;
public static String assessmentDlqi = System.Label.BI_PSP_AssessmentDlqi;
public static String completeDlqi = System.Label.BI_PSP_CompleteDlqi;
public static String challengesErrorMessage = System.Label.BI_PSP_ChallengesErrorMessage;
public static String userIdErrorMessage = System.Label.BI_PSP_UserIdErrorMessage;
public static String careProgramTemplateErrorMessage = System.Label.BI_PSP_CareProgramTemplateErrorMessage;
public static String careProgramEnrolleeErrorMessage = System.Label.BI_PSP_CareProgramEnrolleeErrorMessage;
public static String enrolleeCaregiverErrorMessage = System.Label.BI_PSP_EnrolleeCaregiverErrorMessage;
public static String iamRegularLevelOne = System.Label.BI_PSP_IamRegularLevelOne;
public static String iamRegularLevelTwo = System.Label.BI_PSP_IamRegularLevelTwo;
public static String iamRegularLevelThree = System.Label.BI_PSP_IamRegularLevelThree;
public static String gppExpertLevelOne = System.Label.BI_PSP_GppExpertLevelOne;
public static String gppExpertLevelTwo = System.Label.BI_PSP_GppExpertLevelTwo;
public static String gppExpertLevelThree = System.Label.BI_PSP_GppExpertLevelThree;
public static String loginSuccess = System.Label.BI_PSP_LoginSuccess;
public static String view = System.Label.BI_PSPB_View;
public static final String LOG_SEVERITY_ERROR  = System.Label.BI_PSP_ErrorSeverity;

}