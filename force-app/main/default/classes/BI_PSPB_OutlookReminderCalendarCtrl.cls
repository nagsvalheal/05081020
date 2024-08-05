/**
 * @description     This is class is used for getting the date from the LWC and generate a URL link add 
                    reminder events in Google Calendar and outlook calender.
 * History
 * Version  Author      Date            Detail      Description
 * 1.0      Anand S     30-Dec-2024     Created     This was an intial development.
 * 1.1      Rajaa       06-Apr-2024     Updated     Code Review Changes.
 */
public with sharing class BI_PSPB_OutlookReminderCalendarCtrl {
    private static String outlookCalendar = System.Label.BI_PSPB_OutlookCalendarUrl;
    private static final String LOG_SEVERITY_ERROR  = System.Label.BI_PSP_ErrorSeverity;
    /**
    
     *@description          This Method  is used to get URL for the  Outlook Calender.
     *@param                eventDate  The Event Date for the patient.On the date of treatment.
     *@return               caregiverAccounts List of Patients. Returned in the LWC Component 
     *                      Returned in the LWC Component biPspbReminderSetup
    
     **/
    @AuraEnabled(cacheable=true)
    public static String generateOutlookCalendarUrl(Date eventDate) {
        String outlookCalendarUrl;
        try {
            validateEventDate(eventDate);

            BI_PSPB_Notification__mdt notificationMetadata = BI_PSPB_Notification__mdt.getInstance(
                BI_PSPB_ConstantsClassCtrl.dateOfTreatment
            );

            String title = notificationMetadata.BI_PSPB_CalenderTitle__c;
            String detail = notificationMetadata.BI_PSPB_CalenderDescription__c;

            DateTime startDateTime = createDateTime(eventDate, 0, 0, 0);
            DateTime endDateTime = createDateTime(eventDate, 23, 59, 59);

            String startDateTimeString = startDateTime.formatGmt(BI_PSPB_ConstantsClassCtrl.timeFormat);
            String endDateTimeString = endDateTime.formatGmt(BI_PSPB_ConstantsClassCtrl.timeFormat);

            validateCalendarParameters(startDateTimeString, title, detail);

           outlookCalendarUrl = createOutlookCalendarUrl(title, startDateTimeString, endDateTimeString, detail);

           
        } catch (Exception ex) {            
            BI_PSP_LogMessagesUtility.exceptionLogMessage(BI_PSPB_ConstantsClassCtrl.outLookUrlError,BI_PSPB_OutlookReminderCalendarCtrl.class.toString(),ex);
        }

        validateGeneratedUrl(outlookCalendarUrl, BI_PSPB_ConstantsClassCtrl.outLookUrlError);

            return outlookCalendarUrl;
    }

    private static void validateEventDate(Date eventDate) {
        if (eventDate == null) {            
            BI_PSP_LogMessagesUtility.logError(BI_PSPB_ConstantsClassCtrl.parameterError,BI_PSPB_OutlookReminderCalendarCtrl.class.toString(),false,LOG_SEVERITY_ERROR);
        }
    }

    private static void validateCalendarParameters(String startDateTimeString, String title, String detail) {
        if (String.isBlank(startDateTimeString) || String.isBlank(title) || String.isBlank(detail)) {            
            BI_PSP_LogMessagesUtility.logError(BI_PSPB_ConstantsClassCtrl.stringError,BI_PSPB_OutlookReminderCalendarCtrl.class.toString(),false,LOG_SEVERITY_ERROR);
        }
    }

    private static void validateGeneratedUrl(String url, String errorMessage) {
        if (String.isBlank(url)) {
            BI_PSP_LogMessagesUtility.logError(errorMessage,BI_PSPB_OutlookReminderCalendarCtrl.class.toString(),false,LOG_SEVERITY_ERROR);
        }
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
    private static String createOutlookCalendarUrl(String title, String startDateTimeString, String endDateTimeString, String detail) {
        return outlookCalendar +
               EncodingUtil.urlEncode(detail, 'UTF-8') +
               '&subject=' + EncodingUtil.urlEncode(title, 'UTF-8') +
               '&startdt=' + startDateTimeString +
               '&enddt=' + endDateTimeString;
    }

}