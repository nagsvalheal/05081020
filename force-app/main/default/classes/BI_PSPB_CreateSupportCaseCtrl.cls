/**
 * @description Apex class for creating and managing support cases related to the BI_PSPB module.
 * History
 * Version  Author          Date        Detail      Description
 * 59       Niyas       06-01-2024      Created     Initial Version
 * 59       Niyas       18-04-2024      Updated     Code review changes
 */
public with sharing class BI_PSPB_CreateSupportCaseCtrl {
	private static final String LOG_SEVERITY_ERROR = System.Label.BI_PSP_ErrorSeverity;
	private static String caseRecordTypeName = System.Label.BI_PSPB_SupportCenter;

	/** * @description Creates a new support case.
	 * @param wrapper The LeadWrapper object containing case details.
	 * @param fileIds The IDs of the files to be linked to the case.
	 * @return The ID of the created case.*/

	@AuraEnabled(cacheable=false)
	public static id createCase(LeadWrapper wrapper, List<String> fileIds) {
		//We are not checking LeadWrapper because all fields are mandatory in UI.
		Case supportCaseToInsert = new Case();
		try {
			String sObjectType = 'CareProgramEnrollee';
			String fields = 'Id, AccountId';
			String conditions = 'Id = \'' + wrapper.accountId + '\'';
			Boolean withUserMode = false; // Set this based on your requirement

			// Use the common query utility to execute the query
			List<SObject> results = BI_PSP_CommonQueryUtility.executeQuery(
				sObjectType,
				fields,
				conditions,
				withUserMode
			);
			CareProgramEnrollee careProgramRecord = (results.isEmpty()
				? null
				: (CareProgramEnrollee) results[0]);
			if (careProgramRecord != null) {
				String recordTypeId = Schema.SObjectType.Case.getRecordTypeInfosByName()
					.get(caseRecordTypeName)
					.getRecordTypeId();
				if (String.isBlank(recordTypeId)) {
					// Return null if leadId is blank
					BI_PSP_LogMessagesUtility.logError(
						BI_PSPB_ConstantsClassCtrl.errorMsgRecordTypeNotFound,
						BI_PSPB_CreateSupportCaseCtrl.class.toString(),
						false,
						LOG_SEVERITY_ERROR
					);
					return null;
				}
				supportCaseToInsert.Type = wrapper.type;
				supportCaseToInsert.BI_PSPB_Sub_Type__c = wrapper.subType;
				supportCaseToInsert.Description = wrapper.description;
				supportCaseToInsert.BI_PSP_Patient__c = careProgramRecord.Id;
				supportCaseToInsert.AccountId = careProgramRecord.AccountId;
				supportCaseToInsert.RecordTypeId = recordTypeId;
				supportCaseToInsert.Status = BI_PSPB_ConstantsClassCtrl.submitted;
				BI_PSP_DatabaseOperationsUtility.insertOperation(
					new List<Case>{ supportCaseToInsert },
					BI_PSPB_CreateSupportCaseCtrl.class.toString(),
					false
				);
				if (supportCaseToInsert == null) {
					BI_PSP_LogMessagesUtility.logError(
						BI_PSPB_ConstantsClassCtrl.errorMsgCaseRecordNotFound,
						BI_PSPB_CreateSupportCaseCtrl.class.toString(),
						false,
						LOG_SEVERITY_ERROR
					);
					return null;
				} else {
					if (!fileIds.isEmpty()) {
						BI_PSPB_PatientCasesFilesCtrl.getContentDocumentLinks(
							fileIds,
							supportCaseToInsert.Id
						);
					}
					return supportCaseToInsert.id;
				}
			} else {
				BI_PSP_LogMessagesUtility.logError(
					BI_PSPB_ConstantsClassCtrl.errorMsgRecordNotFound,
					BI_PSPB_CreateSupportCaseCtrl.class.toString(),
					false,
					LOG_SEVERITY_ERROR
				);
				return null;
			}
		} catch (Exception LOG_SEVERITY_ERROR) {
			BI_PSP_LogMessagesUtility.exceptionLogMessage(
				BI_PSPB_ConstantsClassCtrl.recordCannotFound,
				BI_PSPB_CreateSupportCaseCtrl.class.toString(),
				LOG_SEVERITY_ERROR
			);
			return null;
		}
	}

	/** * @description Updates a Case record with the provided information and links files to it.
	 * @param wrapper The LeadWrapper object containing case details.
	 * @param fileIds The IDs of the files to be linked to the case.
	 * @return The ID of the updated case. */

	@AuraEnabled(cacheable=false)
	public static id caseDraft(LeadWrapper wrapper, List<String> fileIds) {
		//We are not checking LeadWrapper because all fields are mandatory in UI.
		Case supportCaseToUpdate = new Case();
		try {
			String sObjectType = 'CareProgramEnrollee';
			String fields = 'Id, AccountId';
			String conditions = 'Id = \'' + wrapper.accountId + '\'';
			Boolean withUserMode = false; // Set this based on your requirement

			// Use the common query utility to execute the query
			List<SObject> results = BI_PSP_CommonQueryUtility.executeQuery(
				sObjectType,
				fields,
				conditions,
				withUserMode
			);
			CareProgramEnrollee careProgramRecord = (results.isEmpty()
				? null
				: (CareProgramEnrollee) results[0]);
			if (careProgramRecord != null) {
				String recordTypeId = Schema.SObjectType.Case.getRecordTypeInfosByName()
					.get(caseRecordTypeName)
					.getRecordTypeId();
				if (String.isBlank(recordTypeId)) {
					BI_PSP_LogMessagesUtility.logError(
						BI_PSPB_ConstantsClassCtrl.errorMsgRecordTypeNotFound,
						BI_PSPB_CreateSupportCaseCtrl.class.toString(),
						false,
						LOG_SEVERITY_ERROR
					);
					return null;
				}
				supportCaseToUpdate.Type = wrapper.type;
				supportCaseToUpdate.BI_PSPB_Sub_Type__c = wrapper.subType;
				supportCaseToUpdate.Description = wrapper.description;
				supportCaseToUpdate.BI_PSP_Patient__c = careProgramRecord.Id;
				supportCaseToUpdate.AccountId = careProgramRecord.AccountId;
				supportCaseToUpdate.RecordTypeId = recordTypeId;
				supportCaseToUpdate.Status = BI_PSPB_ConstantsClassCtrl.draft;
				BI_PSP_DatabaseOperationsUtility.insertOperation(
					new List<Case>{ supportCaseToUpdate },
					BI_PSPB_CreateSupportCaseCtrl.class.toString(),
					false
				);
				if (supportCaseToUpdate == null) {
					BI_PSP_LogMessagesUtility.logError(
						BI_PSPB_ConstantsClassCtrl.errorMsgCaseRecordNotFound,
						BI_PSPB_CreateSupportCaseCtrl.class.toString(),
						false,
						LOG_SEVERITY_ERROR
					);
					return null;
				} else {
					if (!fileIds.isEmpty()) {
						BI_PSPB_PatientCasesFilesCtrl.getContentDocumentLinks(
							fileIds,
							supportCaseToUpdate.Id
						);
					}
					return supportCaseToUpdate.id;
				}
			} else {
				BI_PSP_LogMessagesUtility.logError(
					BI_PSPB_ConstantsClassCtrl.errorMsgRecordNotFound,
					BI_PSPB_CreateSupportCaseCtrl.class.toString(),
					false,
					LOG_SEVERITY_ERROR
				);
				return null;
			}
		} catch (Exception LOG_SEVERITY_ERROR) {
			BI_PSP_LogMessagesUtility.exceptionLogMessage(
				BI_PSPB_ConstantsClassCtrl.recordCannotFound,
				BI_PSPB_CreateSupportCaseCtrl.class.toString(),
				LOG_SEVERITY_ERROR
			);
			return null;
		}
	}
	/** * @description A wrapper class used to hold a group of related data fields together. This class encapsulates information about a patient or caregiver. */
	public class LeadWrapper {
		/** * @description The account ID associated with the patient or caregiver. */
		@AuraEnabled
		public String accountId { get; set; }
		/**     * @description The type of the patient or caregiver. */
		@AuraEnabled
		public String type { get; set; }
		/** * @description The subtype address of the patient or caregiver. */
		@AuraEnabled
		public String subType { get; set; }
		/** * @description The description of the patient or caregiver. */
		@AuraEnabled
		public String description { get; set; }
	}
}