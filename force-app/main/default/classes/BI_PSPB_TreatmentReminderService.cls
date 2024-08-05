/**
* @description  Used to
	create task when a video is uploaded and calling the method to
	send sms and email.
* History
* Version	Author			Date		Detail		Description
* 1.0		Niyas		24-07-2024		Created		Refactored Version
*/
public with sharing class BI_PSPB_TreatmentReminderService {
    	/**
	 * @description  Used to create task when a video is uploaded and calling the
	 * method to send sms and email.
	 */
	public static void processReminders() {
		Date today = Date.today();
		List<BI_PSPB_Treatment_Reminder__c> reminders = getActiveReminders(
			today
		);
		try {
			if (reminders.isEmpty()) {
				BI_PSPB_LogUtilities.logError(
					BI_PSPB_NotificatinRmdConstantsCtrl.errorMsgRecordNotFound,
					BI_PSPB_DlqiQuestionsSched.class.toString()
				);
			} else {
				BI_PSPB_TreatmentReminderDays daysCount = new BI_PSPB_TreatmentReminderDays();
				List<Task> newTaskList = new List<Task>();

				for (BI_PSPB_Treatment_Reminder__c reminder : reminders) {
					Integer daysDifference = reminder.BI_PSPB_Reminder_Date__c.daysBetween(
						reminder.BI_PSPB_Date_of_Treatment__c
					);
					Task newTask = BI_PSPB_TaskService.createTask(
						reminder,
						daysDifference,
						daysCount
					);
					if (newTask != null) {
						newTaskList.add(newTask);
					}
				}

				if (!newTaskList.isEmpty()) {
					BI_PSPB_HandleUtitlites.insertAndHandleErrors(
						newTaskList,
						BI_PSPB_TreatmentReminderService.class.toString(),
						false
					);
				}

				BI_PSPB_NotificationService.sendNotifications(
					reminders,
					daysCount
				);
			}
		} catch (System.DmlException ex) {
			BI_PSPB_LogUtilities.catchSystemException(
				BI_PSPB_NotificatinRmdConstantsCtrl.errorTreatmentReminderService,
				BI_PSPB_TreatmentReminderService.class.toString(),
				ex
			);
		}
	}
	/**
	 * @description  Retrieves treatment reminders based on the given criteria.
	 * @param today The ID of the record related to the treatment reminders.
	 * @return A list of BI_PSPB_Treatment_Reminder__c objects that match the criteria.
	 */
	private static List<BI_PSPB_Treatment_Reminder__c> getActiveReminders(
		Date today
	) {
		// Convert Date to a String in the format yyyy-MM-dd
		String formattedDate = DateTime.newInstance(
				today,
				Time.newInstance(0, 0, 0, 0)
			)
			.format('yyyy-MM-dd');

		// Construct the SOQL query
		String fields = 'BI_PSPB_Care_Program_Enrollee__c, BI_PSPB_Care_Program_Enrollee__r.AccountId, BI_PSPB_Reminder_Date__c, BI_PSPB_Date_of_Treatment__c';
		String conditions =
			'BI_PSPB_Reminder_Date__c = ' +
			formattedDate +
			' ' +
			'AND BI_PSPB_Status__c = \'' +
			BI_PSPB_NotificatinRmdConstantsCtrl.actionTypeActive +
			'\' ' +
			'AND (BI_PSPB_Reminder_Type__c = \'' +
			BI_PSPB_NotificatinRmdConstantsCtrl.actionTypeTreatment +
			'\' ' +
			'OR BI_PSPB_Reminder_Type__c = \'' +
			BI_PSPB_NotificatinRmdConstantsCtrl.actionTypePrescription +
			'\' )';

		// Execute the query using a utility method
		List<SObject> results = BI_PSP_CommonQueryUtility.executeQuery(
			'BI_PSPB_Treatment_Reminder__c',
			fields,
			conditions,
			false
		);

		// Return the results cast to the expected type
		return (List<BI_PSPB_Treatment_Reminder__c>) results;
	}
}