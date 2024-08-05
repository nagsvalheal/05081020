/**
 * @description Used to trigger and send notification for Treatment reminders.
 * History
 * Version	Author		Date		Detail		Description
 * 1.0		Niyas		24-07-2024	Created		Refactored Version
 */
public with sharing class BI_PSPB_TaskService {
	/**
	 * @description  Retrieves treatment reminders based on the given criteria.
	 * @param reminder The ID of the record related to the treatment reminders.
	 * @param daysDifference The type of reminder to filter by.
	 * @param daysCount The type of reminder to filter by.
	 * @return A list of BI_PSPB_Treatment_Reminder__c objects that match the criteria.
	 */
	public static Task createTask(
		BI_PSPB_Treatment_Reminder__c reminder,
		Integer daysDifference,
		BI_PSPB_TreatmentReminderDays daysCount
	) {
		List<Task> tasks = new List<Task>();
		try {
			String subject;
			String formattedDate;
			Datetime treatmentDate;

			if (daysDifference == daysCount.before1Day) {
				treatmentDate = reminder.BI_PSPB_Date_of_Treatment__c;
				formattedDate = treatmentDate.format('MM/dd/yyyy');
				subject =
					System.Label.BI_PSPB_OneDayBeforeTreatment +
					' ' +
					formattedDate;
			} else if (daysDifference == daysCount.before3Day) {
				treatmentDate = reminder.BI_PSPB_Date_of_Treatment__c;
				formattedDate = treatmentDate.format('MM/dd/yyyy');
				subject =
					System.Label.BI_PSPB_ThreeDayBeforeTreatment +
					' ' +
					formattedDate;
			} else if (daysDifference == daysCount.before7Day) {
				subject = System.Label.BI_PSPB_SevenDayBeforeTreatment;
			} else if (daysDifference == daysCount.before10Day) {
				subject = System.Label.BI_PSPB_TenDayBeforeTreatment;
			} else if (daysDifference == daysCount.before14Day) {
				subject = System.Label.BI_PSPB_FourteenDayBeforeTreatment;
			} else {
				return null;
			}

			BI_PSPB_TaskParameters params = new BI_PSPB_TaskParameters(
				subject,
				BI_PSPB_NotificatinRmdConstantsCtrl.actionTypeAction,
				BI_PSPB_NotificatinRmdConstantsCtrl.actionTypeTreatment,
				'',
				BI_PSPB_NotificatinRmdConstantsCtrl.actionTypeNotificatonTypeAction
			);
			tasks = BI_PSPB_TaskCreationCtrl.createTasks(
				new List<Id>{ reminder.BI_PSPB_Care_Program_Enrollee__c },
				params
			);
		} catch (Exception ex) {
			BI_PSP_LogMessagesUtility.exceptionLogMessage(
				BI_PSPB_NotificatinRmdConstantsCtrl.recordNotFound,
				BI_PSPB_AssessmentFetcher.class.toString(),
				ex
			);
		}
		return tasks.isEmpty() ? null : tasks[0];
	}
}