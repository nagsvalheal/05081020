/**
 * @description Controller class for BI_PSPB_Widget, providing methods to fetch treatment reminders associated with a given Care program enrolle .
 * History
 * Version 	Author					Date				Detail		Description
 * 1.0		Anand S					16-Dec-2024			Created		This was an intial development.
 * 1.1		Rajaa					06-Apr-2024			Updated		Code Review Changes.
 * 1.2      Rajaa                   22-July-2024        Updated     Code Refactor.
 */
public with Sharing class BI_PSPB_TreatmentWidgetCtrl {
	// Error message labels
	   private static String trtNotFound = System.Label.BI_PSPB_TreatRemindNotFound;
	   private static String cpeNotFound = System.Label.BI_PSP_CareProgramEnrolleeErrorMessage;
	   private static String dayOfTreatment = System.Label.BI_PSPB_DayOfTreatment;
	   private static String selectedCheckBox = System.Label.BI_PSPB_SelectedCheckBox;
	   private static String taskRecNotFound = System.Label.BI_PSPB_TaskRecNotFound;
	   private static final String LOG_SEVERITY_ERROR  = System.Label.BI_PSP_ErrorSeverity;

		/**
		* @description Fetches a list of BI_PSPB_Treatment_Reminder__c records with a non-null Date of Treatment for a given Care program enrolle .
		* @return List of BI_PSPB_Treatment_Reminder__c records.
		* @throws Exception if any error occurs during processing.
		*/
	   @AuraEnabled(cacheable=true)
	   public static List<BI_PSPB_Treatment_Reminder__c> getTasksWithDateOfTreatment() {
		   List<BI_PSPB_Treatment_Reminder__c> tasks;
		   try {
			   String accountId = BI_PSP_CurrentUser.getEnrolleeRecords()[0].id;
			    
			  
			  
			   tasks = getTreatmentReminders(accountId);		
		   } catch (Exception e) {
			   BI_PSP_LogMessagesUtility.exceptionLogMessage(null,BI_PSPB_TreatmentWidgetCtrl.class.toString(),e);
		   }		
		   return tasks;
		  
	   }
	/**
		* @description Retrieves the CareProgramEnrollee record for a given account ID.
		* @param accountId ID of the account to fetch the CareProgramEnrollee record for.
		* @return CareProgramEnrollee record.
		*/
      @TestVisible
	   private static CareProgramEnrollee getCareProgramEnrollee(String accountId) {
		   String fields = 'Id';
	   String conditions = 'Id = \'' + accountId + '\' LIMIT 1';
	   List<SObject> results = BI_PSP_CommonQueryUtility.executeQuery('CareProgramEnrollee', fields, conditions, false);
	   
	   if (results.isEmpty()) {
		   BI_PSP_LogMessagesUtility.logError(cpeNotFound, BI_PSPB_TreatmentWidgetCtrl.class.toString(),false,LOG_SEVERITY_ERROR);
		   
	   }
	   
	   return (CareProgramEnrollee) results[0];
	   }
   /**
		* @description Retrieves a list of BI_PSPB_Treatment_Reminder__c records for a given CareProgramEnrollee ID.
		* @param careProgramEnrolleeId ID of the CareProgramEnrollee to fetch treatment reminders for.
		* @return List of BI_PSPB_Treatment_Reminder__c records.
		*/
	   private static List<BI_PSPB_Treatment_Reminder__c> getTreatmentReminders(String careProgramEnrolleeId) {
		   String fields = 'Id, BI_PSPB_Subject__c, BI_PSPB_Date_of_Treatment__c, BI_PSPB_Status__c, BI_PSPB_Reminder_Date__c, BI_PSPB_Care_Program_Enrollee__c';
		   String conditions = 'BI_PSPB_Care_Program_Enrollee__c = \'' + careProgramEnrolleeId + '\' ' +
			   'AND BI_PSPB_Date_of_Treatment__c != NULL ' +
			   'AND BI_PSPB_Reminder_Date__c > TODAY ' +
			   'AND BI_PSPB_Reminder_Date__c != TODAY ' +
			   'AND BI_PSPB_Status__c = \'' + BI_PSPB_ConstantsClassCtrl.actionTypeActive + '\' ' +
			   'ORDER BY BI_PSPB_Reminder_Date__c ASC ' +
			   'LIMIT 1';
		   
		   List<SObject> results = BI_PSP_CommonQueryUtility.executeQuery('BI_PSPB_Treatment_Reminder__c', fields, conditions, false);
		   
		   if (results.isEmpty()) {
			   return new List<BI_PSPB_Treatment_Reminder__c>();
		   }
		   
		   return (List<BI_PSPB_Treatment_Reminder__c>) results;
	   } 
	  /**
	* @description Retrieves prepopulated values for a given enrolleeId. This includes
	*              the latest treatment date and selected checkboxes.	
	* @return Map<String, Object> A map containing the prepopulated values, including the date of treatment and selected checkboxes.
	* @throws AuraHandledException if an error occurs or if required records are not found.
	*/
	   @AuraEnabled(cacheable=true)
	   public static Map<String, Object> prepopulatedValues() {
		   Map<String, Object> prepopulatedValues = new Map<String, Object>();
		   String enrolleeId = BI_PSP_CurrentUser.getEnrolleeRecords()[0].id;
		   
		   try {
			 // Retrieve the latest Treatment Reminder record
		   String fields = 'BI_PSPB_Date_of_Treatment__c';
		   String conditions = 'BI_PSPB_Care_Program_Enrollee__c = \'' + enrolleeId + '\' ' +
							   'AND BI_PSPB_Status__c = \'' + BI_PSPB_ConstantsClassCtrl.actionTypeActive + '\' ' +
							   'ORDER BY CreatedDate DESC ' +
							   'LIMIT 1';
		   List<SObject> results = BI_PSP_CommonQueryUtility.executeQuery('BI_PSPB_Treatment_Reminder__c', fields, conditions, false);
		   
		   if (!results.isEmpty()) {
			   BI_PSPB_Treatment_Reminder__c latestTreatmentReminder = (BI_PSPB_Treatment_Reminder__c) results[0];
			   prepopulatedValues.put(dayOfTreatment, latestTreatmentReminder.BI_PSPB_Date_of_Treatment__c);
		   } else {
			   BI_PSP_LogMessagesUtility.logError(taskRecNotFound, BI_PSPB_TreatmentWidgetCtrl.class.toString(),false,LOG_SEVERITY_ERROR);
			   return null;
		   }
   
		   // Retrieve checkbox values from CareProgramEnrollee
		   fields = 'BI_PSPB_Selected_Checkboxes__c';
		   conditions = 'Id = \'' + enrolleeId + '\'';
		   results = BI_PSP_CommonQueryUtility.executeQuery('CareProgramEnrollee', fields, conditions, false);
		   
		   if (!results.isEmpty()) {
			   CareProgramEnrollee enrollee = (CareProgramEnrollee) results[0];
			   prepopulatedValues.put(selectedCheckBox, enrollee.BI_PSPB_Selected_Checkboxes__c);
		   } else {
			   BI_PSP_LogMessagesUtility.logError(cpeNotFound, BI_PSPB_TreatmentWidgetCtrl.class.toString(),false,LOG_SEVERITY_ERROR);
			   return null;
		   }
   
		    if (prepopulatedValues.isEmpty()) {
                BI_PSP_LogMessagesUtility.logError(cpeNotFound, BI_PSPB_TreatmentWidgetCtrl.class.toString(),false,LOG_SEVERITY_ERROR);			   	
            }
		   
		   } catch (Exception ex) {
			 
			   BI_PSP_LogMessagesUtility.exceptionLogMessage(null,BI_PSPB_TreatmentWidgetCtrl.class.toString(),ex);
			   
		   }
		   
	   return prepopulatedValues;
   }
   
	   
   }