/**
* @description  Used to
	create task when a video is uploaded and calling the method to
	send sms and email.
* History
* Version	Author			Date		Detail		Description
* 1.0		Niyas		24-07-2024		Created		Refactored Version
*/
public with sharing class BI_PSPB_QsqEnrolleeProcessor {
	/**
	 * @description  Retrieves treatment reminders based on the given criteria.
	 * @param enrolleeIds The ID of the record related to the treatment reminders.
	 * @param qsqCount The type of reminder to filter by.
	 * @return A list of BI_PSPB_Treatment_Reminder__c objects that match the criteria.
	 */
	public static List<Id> processEnrollees(
		Set<Id> enrolleeIds,
		Integer qsqCount
	) {
		List<Id> enrolleeRecIds = new List<Id>();
		try {
            List<CareProgramEnrollee> enrollees = BI_PSPB_AssessmentFetcher.getEnrolleeQuery(enrolleeRecIds);

			for (CareProgramEnrollee enrollee : enrollees) {
				Date enrolleeCreatedDate = enrollee.CreatedDate.date();
				if (enrolleeCreatedDate == System.today().addDays(-qsqCount)) {
					enrolleeRecIds.add(enrollee.Id);
				}
			}
		} catch (Exception ex) {
			BI_PSP_LogMessagesUtility.exceptionLogMessage(
				'',
				BI_PSPB_QsqQuestionnaireService.class.toString(),
				ex
			);
		}
		return enrolleeRecIds;
	}
}