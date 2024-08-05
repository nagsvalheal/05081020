/**
* @description  Used to
	create task when a video is uploaded and calling the method to
	send sms and email.
* History
* Version	Author			Date		Detail		Description
* 1.0		Niyas		24-07-2024		Created		Refactored Version
*/
public with sharing class BI_PSPB_EnrolleeFetcher {
	/**
	 * @description  Used to create task when a video is uploaded and calling the
	 * method to send sms and email. 
	 * @return A list of Enrollee objects that match the criteria.
	 */
	public static Set<Id> fetchEnrolleeIds() {
		Set<Id> enrolleeIds = new Set<Id>();
		try {
			List<SObject> enrolleeRecords = BI_PSP_CommonQueryUtility.executeQuery(
				'CareProgramEnrollee',
				'Id',
				null,
				false
			);
			for (SObject cpe : enrolleeRecords) {
				enrolleeIds.add(cpe.Id);
			}
		} catch (Exception ex) {
			BI_PSP_LogMessagesUtility.exceptionLogMessage(
				BI_PSPB_NotificatinRmdConstantsCtrl.recordNotFound,
				BI_PSPB_MessageCenterCtrl.class.toString(),
				ex
			);
		}
		return enrolleeIds;
	}
}