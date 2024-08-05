/**
* @description  Used to
	create task when a video is uploaded and calling the method to
	send sms and email.
* History
* Version	Author			Date		Detail		Description
* 1.0		Niyas		24-07-2024		Created		Refactored Version
*/
public with sharing class BI_PSPB_SymptomActionNotificationService {
	/**
	 * @description  Used to create task when a video is uploaded and calling the
	 * method to send sms and email.
	 */
	public static void processSymptomNotifications() {
		try {

			List<SObject> enrolleeIds = BI_PSP_CommonQueryUtility.executeQuery(
				'CareProgramEnrollee',
				'Id',
				null,
				false
			);

			if (!enrolleeIds.isEmpty()) {
				List<BI_PSP_Symptom_Tracker__c> symptomTrackers = BI_PSPB_SymptomTrackerFetcher.fetchSymptomTrackers(
					enrolleeIds
				);
                
				if (!symptomTrackers.isEmpty()) {
					List<Id> symptomTrackerIds = new List<Id>();
					for (BI_PSP_Symptom_Tracker__c tracker : symptomTrackers) {
						symptomTrackerIds.add(
							tracker.BI_PSP_Care_Program_Enrollee__c
						);
					}
					BI_PSPB_TaskParameters params = new BI_PSPB_TaskParameters(
						System.Label.BI_PSPB_SymptomTrackerAction,
						BI_PSPB_NotificatinRmdConstantsCtrl.actionTypeAction,
						BI_PSPB_NotificatinRmdConstantsCtrl.actionTypeSymptomTracker,
						'',
						BI_PSPB_NotificatinRmdConstantsCtrl.actionTypeNotificatonTypeAction
					);
					List<Task> newTaskList = BI_PSPB_TaskCreationCtrl.createTasks(
						symptomTrackerIds,
						params
					);

					BI_PSPB_HandleUtitlites.insertAndHandleErrors(
						newTaskList,
						BI_PSPB_SymptomActionNotificationService.class
							.toString(),
						false
					);
					BI_PSPB_NotificationSender.sendNotifications(
						symptomTrackerIds,
						BI_PSPB_NotificatinRmdConstantsCtrl.actionSymptomTracker,
                        new List<String>{''}
					);
				} else {
					BI_PSP_LogMessagesUtility.logError(
					BI_PSPB_NotificatinRmdConstantsCtrl.errorMsgRecordNotFound,
					BI_PSPB_SymptomActionNotificationService.class.toString(),
					false,
                    BI_PSPB_NotificatinRmdConstantsCtrl.severityError
				);
				}
			} else {
				BI_PSP_LogMessagesUtility.logError(
					BI_PSPB_NotificatinRmdConstantsCtrl.errorMsgRecordNotFound,
					BI_PSPB_SymptomActionNotificationService.class.toString(),
					false,
                    BI_PSPB_NotificatinRmdConstantsCtrl.severityError
				);
			}
		} catch (System.DmlException ex) {
      		BI_PSP_LogMessagesUtility.catchSystemException(
        		BI_PSPB_CommunityConstantCtrl.errorWhileDeleting,
        		BI_PSPB_FeedItemCtrl.class.toString(),
        		ex
      		);
    	}
	}
}