/**
 * @description Batch class for sending SMS notifications to a list of contacts.
 * This batch class retrieves contact information and sends SMS notifications using a specified SMS endpoint.
 * It logs the status of each SMS sent and handles exceptions gracefully.
 *
 * History
 * Version 	Author		Date			Detail		Description
 * 1.0		Rajaa		29-Apr-2024		Created		This was an intial development.
 * 1.1		Rajaa		03-May-2024		Updated		Code Review Changes.
 */
public with sharing class BI_PSPB_SmsBatch implements Database.Batchable<SObject>, Database.AllowsCallouts {
	private List<Id> contactIds;
    private String notificationDeveloperName = '';
    private String destUrl = '';
    private String notificationDate = '';
    private static final String CONTACT_ERROR = System.Label.BI_PSP_ContactErrorMessage;
    private static final String contactError = System.Label.BI_PSP_ContactErrorMessage;
    private static final String recordError = System.Label.BI_PSPB_ErrorInRecord;
    private static final String SMS_ENDPOINT = System.Label.BI_PSPB_SmsEndpoint;
    private static final String LOG_SEVERITY_INFO = System.Label.BI_PSP_InfoSeverity;
    public static final String LOG_SEVERITY_ERROR  = System.Label.BI_PSP_ErrorSeverity;
	private static final String FINISH = System.Label.BI_PSPB_Finish;

	/**
	 *@description Constructs a new instance of the BI_PSPB_SmsBatch class with the provided parameters.
	 *
	 * @param contactIds               A list of contact IDs to whom the SMS notifications will be sent.
	 * @param notificationDeveloperName The developer name of the notification settings to be used.
	 * @param destUrl                  The destination URL to include in the SMS notification.
	 * @param notificationDate         The date information to include in the SMS notification, if applicable.
	 */
	public BI_PSPB_SmsBatch(List<Id> contactIds, String notificationDeveloperName, String destUrl, String notificationDate) {
        if (!contactIds.isEmpty() && !String.isBlank(notificationDeveloperName) && !String.isEmpty(destUrl)) {
            this.contactIds = contactIds;
            this.notificationDeveloperName = notificationDeveloperName;
            this.destUrl = destUrl;
            this.notificationDate = notificationDate;
        } else {
            BI_PSP_LogMessagesUtility.logError(
				BI_PSPB_ConstantsClassCtrl.parameterError,
				BI_PSPB_SmsBatch.class.toString(),
				false,
				LOG_SEVERITY_ERROR
			);
        }
    }
	/**
	 * Returns a Database.QueryLocator instance containing the contacts specified by their IDs.
	 *
	 *@description This method is invoked at the beginning of the batch execution to retrieve the contacts
	 * based on the provided contact IDs for processing.
	 *
	 * @param context The Database.BatchableContext object containing the execution context.
	 * @return A Database.QueryLocator instance containing the contacts to be processed.
	 */
	public Database.QueryLocator start(Database.BatchableContext context) {
		try {
			Set<Id> uniqueContactIds = new Set<Id>(contactIds);
			String query = 'SELECT Id, Phone, Name FROM Contact WHERE Id IN :uniqueContactIds';
			return Database.getQueryLocator(query);
		} catch (Exception LOG_SEVERITY_ERROR) {
			BI_PSP_LogMessagesUtility.exceptionLogMessage(
				CONTACT_ERROR,
				BI_PSPB_SmsBatch.class.toString(),
				LOG_SEVERITY_ERROR
			);
			return null;
		}
	}
	/**
	 * Executes the batch process for sending SMS notifications to the provided contacts.
	 *
	 *@description This method is invoked by the batch framework to process each batch of contacts.
	 * It retrieves the necessary access token, API settings, and notification details.
	 * For each contact, it constructs an SMS payload and sends it via HTTP POST request.
	 * It logs the status of each SMS sent and handles exceptions gracefully.
	 *
	 * @param context The Database.BatchableContext object containing the execution context.
	 * @param scope   The list of contacts to be processed in the current batch.
	 */
	public void execute(Database.BatchableContext context, List<Contact> scope) {
        List<BI_PSPB_OmnichannelLog__c> smsLogList = new List<BI_PSPB_OmnichannelLog__c>();

        try {
            BI_PSPB_Notification__mdt notification = BI_PSPB_Notification__mdt.getInstance(notificationDeveloperName);
            String smsBodyLink = createSmsBodyLink(notification.BI_PSPB_SmsBody__c);
            BI_PSPB_OmnichannelSetting__mdt filteredSettings = BI_PSPB_OmnichannelSetting__mdt.getInstance(SMS_ENDPOINT);

            for (Contact targetContact : scope) {
                if (targetContact.Phone != null && targetContact.Name != null) {
                    String payload = createPayload(targetContact.Phone, smsBodyLink);
                    sendSmsAndLogResponse(targetContact, notification, payload, smsLogList, filteredSettings);
                } else {
                    BI_PSP_LogMessagesUtility.logError(
                        recordError,
                        BI_PSPB_SmsBatch.class.toString(),
                        false,
                        LOG_SEVERITY_ERROR
			);
                }
            }

            if (!smsLogList.isEmpty()) {
                saveSmsLogs(smsLogList);
            } else {
                BI_PSP_LogMessagesUtility.logError(
                    CONTACT_ERROR,
                    BI_PSPB_SmsBatch.class.toString(),
                    false,
                    LOG_SEVERITY_ERROR
        );
            }
        } catch (Exception LOG_SEVERITY_ERROR) {
            BI_PSP_LogMessagesUtility.exceptionLogMessage(
                BI_PSPB_ConstantsClassCtrl.httpResponseError,
				BI_PSPB_SmsBatch.class.toString(),
				LOG_SEVERITY_ERROR
			);
			
        }
    }

	private String createSmsBodyLink(String smsBody) {
        return String.isNotBlank(notificationDate) ? smsBody + ' ' + notificationDate + ' ' + destUrl : smsBody + ' ' + destUrl;
    }

    private String createPayload(String phoneNumber, String smsBodyLink) {
        return '{' +
                '"phoneNumber": "' + phoneNumber + '",' +
                '"body": "' + smsBodyLink + '"' +
                '}';
    }

    private void sendSmsAndLogResponse(Contact targetContact, BI_PSPB_Notification__mdt notification, String payload, List<BI_PSPB_OmnichannelLog__c> smsLogList, BI_PSPB_OmnichannelSetting__mdt filteredSettings) {
        try {
            HttpRequest request = new HttpRequest();
            request.setEndpoint('callout:BI_PSPB_OmnichannelEndpoint' + filteredSettings.BI_PSPB_omnichannelentapi__c + filteredSettings.BI_PSPB_Country__c + filteredSettings.BI_PSPB_configItem__c);
            request.setMethod('POST');
            request.setHeader('Content-Type', 'application/json');
            request.setBody(payload);

            Http http = new Http();
            HttpResponse response = http.send(request);

            processSmsResponse(response, targetContact, notification, smsLogList, payload);
        } catch (Exception LOG_SEVERITY_ERROR) {
           
            BI_PSP_LogMessagesUtility.exceptionLogMessage(
                BI_PSPB_ConstantsClassCtrl.httpResponseError,
				BI_PSPB_SmsBatch.class.toString(),
				LOG_SEVERITY_ERROR
			);
        }
    }

    private void processSmsResponse(HttpResponse response, Contact targetContact, BI_PSPB_Notification__mdt notification, List<BI_PSPB_OmnichannelLog__c> smsLogList, String payload) {
        boolean smsResponse = false;
        String status = '';
        String messageId = '';

        if (response.getStatusCode() == 200 && response.getBody() != null) {
            Map<String, Object> jsonResponse = (Map<String, Object>) JSON.deserializeUntyped(response.getBody());
            status = (String) jsonResponse.get('status');
            messageId = (String) jsonResponse.get('messageId');
            smsResponse = true;
        }

        logSmsResponse(targetContact, notification, smsLogList, smsResponse, status, messageId, response.getStatusCode(), payload);
    }

    private void logSmsResponse(Contact targetContact, BI_PSPB_Notification__mdt notification, List<BI_PSPB_OmnichannelLog__c> smsLogList, boolean smsResponse, String status, String messageId, Integer statusCode, String payload) {
        BI_PSPB_OmnichannelLog__c smsLog = new BI_PSPB_OmnichannelLog__c();
        smsLog.BI_PSPB_ContactName__c = targetContact.Id;
        smsLog.BI_PSPB_StatusResponse__c = String.valueOf(statusCode);
        smsLog.BI_PSPB_SmsBody__c = notification.BI_PSPB_SmsBody__c;
        smsLog.BI_PSPB_MobilePhone__c = targetContact.Phone;
        smsLog.BI_PSPB_EventName__c = notification.BI_PSPB_EventName__c;
        smsLog.BI_PSPB_EventType__c = notification.BI_PSPB_EventType__c;
        smsLog.BI_PSPB_SMSResponse__c = smsResponse;
        smsLog.BI_PSPB_SMSMessageId__c = messageId;
        smsLog.BI_PSPB_SmsStatus__c = status;

        smsLogList.add(smsLog);
    }

    private void logHttpRequestError(Exception ex, Contact targetContact, String payload) {
        String concatenatedParams = targetContact.Id + ',' + targetContact.Phone + ',' + notificationDeveloperName + ',' + payload;
        // BI_SFCOE_LOG_Util.logMessage(app, BI_PSPB_SmsBatch.class.toString(), BI_PSPB_ConstantsClassCtrl.httpResponseError, System.now(), concatenatedParams, BI_SFCOE_LOG_Util.LOG_SEVERITY_ERROR);
        BI_PSP_LogMessagesUtility.logError(
            BI_PSPB_ConstantsClassCtrl.httpResponseError,
            BI_PSPB_SmsBatch.class.toString(),
            false,
            LOG_SEVERITY_ERROR
);
    }
    private void saveSmsLogs(List<BI_PSPB_OmnichannelLog__c> smsLogList) {
        BI_PSP_DatabaseOperationsUtility.insertAndHandleErrors(
            smsLogList,
            BI_PSPB_SmsBatch.class.toString(),
				false
			);
    }

	/**
	 * Handles the finishing tasks after the batch execution completes.
	 *
	 *@description This method is invoked by the batch framework once all batches have been processed.
	 * It logs a message indicating the completion of the batch process.
	 *
	 * @param context The Database.BatchableContext object containing the execution context.
	 */
	public void finish(Database.BatchableContext context) {
        BI_PSP_LogMessagesUtility.logError(  'Batch Finished',BI_PSPB_SmsBatch.class.toString(),false, BI_SFCOE_LOG_Util.LOG_SEVERITY_INFO);
    }
}