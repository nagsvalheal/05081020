/**
* @description  Used to
	create task when a video is uploaded and calling the method to
	send sms and email.
* History
* Version	Author			Date		Detail		Description
* 1.0		Niyas		24-07-2024		Created		Refactored Version
*/
public with sharing class BI_PSPB_QsqQuestionnaireService {
    /**
	* @description  Used to create task when a video is uploaded and calling the
	* method to send sms and email.
	*/
    public static void processQsqQuestionnaires() {
        try {
            List<Task> newTaskList = new List<Task>();
            List<Id> enrolleeSendIds = new List<Id>();

            Set<Id> enrolleeIds = BI_PSPB_EnrolleeFetcher.fetchEnrolleeIds();

            if (!enrolleeIds.isEmpty()) {
                Integer qsqCount = BI_PSPB_QuestionsDaysCountFetcher.fetchQsqCount();
                List<Id> enrolleeRecIds = BI_PSPB_QsqEnrolleeProcessor.processEnrollees(enrolleeIds, qsqCount);

                if (!enrolleeRecIds.isEmpty()) {
                    enrolleeSendIds = BI_PSPB_AssessmentFetcher.fetchDueAssessments(enrolleeRecIds, BI_PSPB_NotificatinRmdConstantsCtrl.qsqQuestionName);
                    BI_PSPB_TaskParameters params = new BI_PSPB_TaskParameters(
						System.Label.BI_PSPB_ActionWpaiNotification,
						BI_PSPB_NotificatinRmdConstantsCtrl.actionTypeAction,
						BI_PSPB_NotificatinRmdConstantsCtrl.qsq,
						'',
						BI_PSPB_NotificatinRmdConstantsCtrl.actionTypeNotificatonTypeAction
					);
                    
						newTaskList = BI_PSPB_TaskCreationCtrl.createTasks(
							enrolleeSendIds,
							params
						);
                    
                    BI_PSPB_HandleUtitlites.insertAndHandleErrors(
						newTaskList,
						BI_PSPB_QsqQuestionnaireService.class.toString(),
						false
					);
                    BI_PSPB_WpaiNotificationSender.sendNotifications(enrolleeSendIds, BI_PSPB_NotificatinRmdConstantsCtrl.qsq);
                }
            } else {
                BI_PSP_LogMessagesUtility.logError(
					BI_PSPB_NotificatinRmdConstantsCtrl.errorMsgRecordNotFound,
					BI_PSPB_QsqQuestionnaireService.class.toString(),
					false,
					BI_PSPB_NotificatinRmdConstantsCtrl.severityError
				);
            }
        } catch (Exception ex) {
            BI_PSP_LogMessagesUtility.exceptionLogMessage(
				BI_PSPB_NotificatinRmdConstantsCtrl.recordNotFound,
				BI_PSPB_QsqQuestionnaireService.class.toString(),
				ex
			);
        }
    }
}