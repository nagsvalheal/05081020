/**

*@description       This Method  is used to get URL for the Google Calender.
* History
 * Version  Author      Date            Detail      Description
 * 1.0      Anand S     30-Dec-2024     Created     This was an intial development.
 * 1.1      Rajaa       06-Apr-2024     Updated     Code Review Changes.
 * 1.2      Rajaa       23-July-2024    Update      Code Refactor .
 */ 
public with sharing class BI_PSPB_GoogleCalendarCtrl {
    private static String googleCalendar = System.Label.BI_PSPB_GoogleCalendarUrl;
    private static String outlookCalendar = System.Label.BI_PSPB_OutlookCalendarUrl;
    // Variable that holds the application name retrieved from Custom Settings.
    private static BI_SFCOE_LOG_App_Settings__c setting = BI_SFCOE_LOG_App_Settings__c.getValues('PSPB');
    // A variable that holds the name of our application to be used in catch exception handler.
    private static String applicationName = setting != null ? setting.BI_SFCOE_LOG_Application__c : '';
    private static final String LOG_SEVERITY_ERROR  = System.Label.BI_PSP_ErrorSeverity;
    /**

*@description       This Method  is used to get URL for the Google Calender.
*@param             eventDate  The Event Date for the patient.On the date of treatment.
*@return            googleCalendarURL return the Url of Google Calender.
*                   Returned in the LWC Component biPspbReminderSetup

**/
    @AuraEnabled(cacheable=true)
    public static String generateGoogleCalendarUrl(Date eventDate) {
        String googleCalendarUrl;
        try {
            if (eventDate == null) {
                BI_PSPB_LogUtilities.logError(BI_PSPB_ConstantsClassCtrl.parameterError,BI_PSPB_GoogleCalendarCtrl.class.toString());
            }

            BI_PSPB_Notification__mdt notificationMetadata = BI_PSPB_Notification__mdt.getInstance(
                BI_PSPB_ConstantsClassCtrl.dateOfTreatment
            );

            String title = notificationMetadata.BI_PSPB_CalenderTitle__c;
            String detail = notificationMetadata.BI_PSPB_CalenderDescription__c;

            DateTime startDateTime = createDateTime(eventDate, 0, 0, 0);
            DateTime endDateTime = createDateTime(eventDate, 23, 59, 59);

            String startDateTimeString = startDateTime.formatGmt(BI_PSPB_ConstantsClassCtrl.timeFormat);
            String endDateTimeString = endDateTime.formatGmt(BI_PSPB_ConstantsClassCtrl.timeFormat);

            boolean isValid = String.isNotBlank(startDateTimeString) &&
                              String.isNotBlank(detail) &&
                              String.isNotBlank(title);

            if (!isValid) {              
                BI_PSP_LogMessagesUtility.logError(BI_PSPB_ConstantsClassCtrl.stringError,BI_PSPB_GoogleCalendarCtrl.class.toString(),false,LOG_SEVERITY_ERROR);
            }

             googleCalendarUrl = createGoogleCalendarUrl(title, startDateTimeString, endDateTimeString, detail);

            if (String.isBlank(googleCalendarUrl)) {               
                BI_PSP_LogMessagesUtility.logError(BI_PSPB_ConstantsClassCtrl.googleUrlError,BI_PSPB_GoogleCalendarCtrl.class.toString(),false,LOG_SEVERITY_ERROR);
            }

        } catch (Exception ex) {
            BI_PSP_LogMessagesUtility.exceptionLogMessage( BI_PSPB_ConstantsClassCtrl.googleUrlError, BI_PSPB_GoogleCalendarCtrl.class.toString(), ex);
        }
        return googleCalendarUrl;
        
    } 

    private static DateTime createDateTime(Date eventDate, Integer hour, Integer minute, Integer second) {
        return DateTime.newInstanceGmt(
            eventDate.year(),
            eventDate.month(),
            eventDate.day(),
            hour,
            minute,
            second
        );
    }

    private static String createGoogleCalendarUrl(String title, String startDateTimeString, String endDateTimeString, String detail) {
        return googleCalendar +
               '&text=' + EncodingUtil.urlEncode(title, 'UTF-8') +
               '&dates=' + startDateTimeString + '/' + endDateTimeString +
               '&details=' + EncodingUtil.urlEncode(detail, 'UTF-8') +
               '&trp=true';
    }
}