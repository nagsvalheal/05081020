/**
* @description  Used to
	create task when a video is uploaded and calling the method to
	send sms and email.
* History
* Version	Author			Date		Detail		Description
* 1.0		Niyas		24-07-2024		Created		Refactored Version
*/
public with sharing class BI_PSPB_SymptomTrackerFetcher {
	/**
	 * @description  Retrieves treatment reminders based on the given criteria.
	 * @param enrolleeIds The ID of the record related to the treatment reminders.
	 * @return A list of BI_PSPB_Treatment_Reminder__c objects that match the criteria.
	 */
	public static List<BI_PSP_Symptom_Tracker__c> fetchSymptomTrackers(
		List<SObject> enrolleeIds
	) {
		DateTime sevenDaysAgo = System.now().addDays(-7);
        // Extract IDs from the List<SObject>
        List<Id> enrolleeIdsList = new List<Id>();
        for (SObject obj : enrolleeIds) {
            if (obj.Id != null) {
                enrolleeIdsList.add(obj.Id);
            }
        }

        if (enrolleeIdsList.isEmpty()) {
            return new List<BI_PSP_Symptom_Tracker__c>();
        }
        String sevenDaysAgoStr = sevenDaysAgo.formatGMT('yyyy-MM-dd\'T\'HH:mm:ss\'Z\'');
         // Create the query condition string
        String conditionIds = '(\'' + String.join(enrolleeIdsList, '\', \'') + '\')';// Format for SOQL
        String fields = 'Id, BI_PSP_Care_Program_Enrollee__c, BI_PSP_Care_Program_Enrollee__r.AccountId, BI_PSP_Are_you_currently_experiencing__c, BI_PSP_EditEntrydates__c, CreatedDate';
        String conditions = 'BI_PSP_Care_Program_Enrollee__c IN ' + conditionIds + ' ' 
                            + 'AND CreatedDate >= ' + sevenDaysAgoStr + ' '
                            + 'AND BI_PSP_Are_you_currently_experiencing__c = TRUE';
		List<BI_PSP_Symptom_Tracker__c> symptomTrackers = BI_PSP_CommonQueryUtility.executeQuery('BI_PSP_Symptom_Tracker__c', fields, conditions, false);
        Map<Id, BI_PSP_Symptom_Tracker__c> latestSymptomMap = new Map<Id, BI_PSP_Symptom_Tracker__c>();
				for (BI_PSP_Symptom_Tracker__c symptom : symptomTrackers) {
					latestSymptomMap.put(
						symptom.BI_PSP_Care_Program_Enrollee__c,
						symptom
					);
				}
		return new List<BI_PSP_Symptom_Tracker__c>(latestSymptomMap.values());
	}
}