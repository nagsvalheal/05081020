public with sharing class BI_PSP_SymptomTrackerGraphCtrl {
    @AuraEnabled(cacheable=true)
    public static List<SymptomTracker> getSymptomTrackerDetails(
        String erolleId,
        Date firstDate,
        Date lastDate
    ) {
        System.debug('Starting getSymptomTrackerDetails with parameters: erolleId=' + erolleId + ', firstDate=' + firstDate + ', lastDate=' + lastDate);
        
        if (!isValidInput(erolleId, firstDate, lastDate)) {
            System.debug('Invalid input parameters');
            return null;
        }

        try {
            List<BI_PSP_Symptom_Tracker__c> recordSymptom = fetchSymptomRecords(erolleId, firstDate, lastDate);
            System.debug('Fetched symptom records: ' + recordSymptom);
            
            if (recordSymptom.isEmpty()) {
                System.debug('No symptom records found');
                return null;
            }

            List<SymptomTracker> symptomTrackers = processSymptomRecords(recordSymptom);
            System.debug('Processed symptom trackers: ' + symptomTrackers);
            
            return symptomTrackers.isEmpty() ? null : symptomTrackers;
        } catch (Exception ex) {
            BI_PSP_LogMessagesUtility.logError(
                BI_PSP_SymptomTrackerConstantCtrl.symptomErrorMsg,
                BI_PSP_SymptomTrackerGraphCtrl.class.toString(),
                true,
                BI_PSP_SymptomTrackerConstantCtrl.LOG_SEVERITY_ERROR
            );
            System.debug('Exception in getSymptomTrackerDetails: ' + ex.getMessage());
            return null;
        }
    }

    private static Boolean isValidInput(String erolleId, Date firstDate, Date lastDate) {
        Boolean isValid = !String.isBlank(erolleId) && firstDate != null && lastDate != null;
        System.debug('Input validation result: ' + isValid);
        return isValid;
    }

    private static List<BI_PSP_Symptom_Tracker__c> fetchSymptomRecords(String erolleId, Date firstDate, Date lastDate) {
        String activeStatusValue = String.valueOf(BI_PSP_QuestionnaireConstant.symptomStatusInactive);
        String query = 
            'SELECT Id, LastModifiedDate, BI_PSP_Care_Program_Enrollee__c, BI_PSP_EditEntrydates__c, CreatedDate ' +
            'FROM BI_PSP_Symptom_Tracker__c ' +
            'WHERE BI_PSP_Care_Program_Enrollee__c = \'' + erolleId + '\' ' +
            'AND BI_PSP_EditEntrydates__c > :firstDate ' +
            'AND BI_PSP_EditEntrydates__c < :lastDate ' +
            'AND BI_PSP_Symptom_Staus__c != \'' + activeStatusValue + '\' ' +
            'ORDER BY BI_PSP_EditEntrydates__c ASC';
    
        System.debug('Executing query to fetch symptom records: ' + query);
        List<BI_PSP_Symptom_Tracker__c> symptomRecords = Database.query(query);
        return symptomRecords;
    }

    private static List<SymptomTracker> processSymptomRecords(List<BI_PSP_Symptom_Tracker__c> recordSymptom) {
        List<SymptomTracker> symptomTrackers = new List<SymptomTracker>();
        Set<Id> symptomIds = extractSymptomIds(recordSymptom);
        System.debug('Extracted symptom IDs: ' + symptomIds);
        
        if (!symptomIds.isEmpty()) {
            List<AllergyIntolerance> allergyTrack = fetchAllergyIntolerance(symptomIds);
            System.debug('Fetched allergy intolerance records: ' + allergyTrack);

            if (!allergyTrack.isEmpty()) {
                for (AllergyIntolerance allergy : allergyTrack) {
                    symptomTrackers.add(createSymptomTracker(allergy));
                }
            }
        }
        return symptomTrackers;
    }

    private static Set<Id> extractSymptomIds(List<BI_PSP_Symptom_Tracker__c> recordSymptom) {
        Set<Id> symptomIds = new Set<Id>();
        for (BI_PSP_Symptom_Tracker__c symp : recordSymptom) {
            if (symp.Id != null) { // Ensure Id is not null
                symptomIds.add(symp.Id);
            }
        }
        System.debug('Extracted symptom IDs from records: ' + symptomIds);
        return symptomIds;
    }

    private static List<AllergyIntolerance> fetchAllergyIntolerance(Set<Id> symptomIds) {
        String query = 
            'SELECT Id, BI_PSP_Graph_Symptom_Name__c, BI_PSP_Symptom_Name__r.BI_PSP_EditEntrydates__c, ' +
            'BI_PSP_Symptoms__r.HealthCloudGA__CarePlanTemplate__r.Name ' +
            'FROM AllergyIntolerance ' +
            'WHERE BI_PSP_Symptom_Name__r.Id IN :symptomIds ' +
            'AND BI_PSP_Symptoms__r.HealthCloudGA__CarePlanTemplate__r.Name != NULL ' +
            'AND BI_PSP_Symptoms__c != NULL ' +
            'ORDER BY BI_PSP_Symptom_Name__r.BI_PSP_EditEntrydates__c';
    
        System.debug('Executing query to fetch allergy intolerance records: ' + query);
        List<AllergyIntolerance> allergyIntoleranceRecords = Database.query(query);
        return allergyIntoleranceRecords;
    }
    
    private static SymptomTracker createSymptomTracker(AllergyIntolerance allergy) {
        SymptomTracker symp = new SymptomTracker();
        symp.symptom = allergy.BI_PSP_Graph_Symptom_Name__c;
        	symp.symptom = allergy.BI_PSP_Symptom_Name__c;
        symp.dates = allergy.BI_PSP_Symptom_Name__r.BI_PSP_EditEntrydates__c;
        symp.name = allergy.BI_PSP_Symptoms__r.HealthCloudGA__CarePlanTemplate__r.Name;
        System.debug('Created SymptomTracker: ' + symp);
        return symp;
    }

    /*
     * @description Inner class representing a symptom tracker record.
     */
    public class SymptomTracker {
        @AuraEnabled
        public Date dates; // Date of the symptom tracker record.

        @AuraEnabled
        public String name; // Name associated with the symptom.

        @AuraEnabled
        public String symptom; // Description of the symptom.
    }
}