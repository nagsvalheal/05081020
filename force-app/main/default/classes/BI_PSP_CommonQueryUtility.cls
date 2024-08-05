/**
 * @description       : A BI_PSP_CommonQueryUtility A utility class for Dynamic Queries.
 * History:
 * Version  Author      Date            Detail          Description.
 * 1.0      Abinsha     10-Jul-2024     Created         Initial development.
 */

public inherited sharing class BI_PSP_CommonQueryUtility {
  // Method for executing a SOQL query with sharing rules
    public static List<SObject> executeQuery(String sObjectType, String fields, String conditions, Boolean withUserMode) {
       /* if(withUserMode){
            return BI_PSP_DataAccessor.executeQuery(sObjectType,fields,conditions,withUserMode);
        } else {
            return new WithoutShareQuery().executeQuery(sObjectType,fields,conditions,withUserMode);
        }*/
        // Start building the SOQL query string
        String query = 'SELECT ' + fields + ' FROM ' + sObjectType;
        
        if (!String.isBlank(conditions)) {
            conditions = escapeSingleQuotes(conditions);
            query += ' WHERE ' + conditions;
        }
        
        // Add the WITH SECURITY_ENFORCED clause to enforce sharing rules
        if (withUserMode) {
            query += ' WITH USER_MODE';
        }

        // Execute the query and return the results
        return Database.query(query);
    }
    
    // Method to escape single quotes in the conditions string
    private static String escapeSingleQuotes(String str) {
        return str.replaceAll('\'', '\\\'');
    }
    
     // Method for executing a SOQL query, optionally adding the USER_MODE clause
   /* public static List<SObject> executeComplexQuery(String queryString, Boolean withUserMode) {
        if (withUserMode) {
            return BI_PSP_DataAccessor.executeComplexQuery(queryString,withUserMode);
        } else {
            return new WithoutShareQuery().executeComplexQuery(queryString,withUserMode);
        }

        
        
        if (withUserMode) {
            queryString += ' WITH USER_MODE';
        }

        //System.debug('Generated Query: ' + queryString);

        // Execute the query and return the results
        return Database.query(queryString);
    }*/
     public static List<SObject> executeComplexQuery(String queryString, Boolean withUserMode) {
        if (withUserMode) {
            queryString += ' WITH USER_MODE';
        }

        //System.debug('Generated Query: ' + queryString);

        // Execute the query and return the results
        return Database.query(queryString);
    }
   /*  public static List<SObject> executeWholeQueryInString(String queryString) {
        
        // Execute the query and return the results
        return Database.query(queryString);
    }*/
    
     public static Integer getCount(String query,Boolean withUserMode) {
        try {
            if (withUserMode) {
            query += ' WITH USER_MODE';
        }
            return Database.countQuery(query);
        } catch (Exception e) {
            System.debug('Error executing count query: ' + e.getMessage());
            return 0;
        }
    }
     /**
     * @description Retrieves the Record Type Id for a given object and record type developer name.
     * @param sObjectType The API name of the SObject type (e.g., 'Contact').
     * @param developerName The Developer Name of the record type (e.g., 'Physician').
     * @return The Record Type Id as an Id.
     */
    public static Id retrieveRecordTypeId(String sObjectType, String developerName) {
        // Ensure parameters are not null or empty
        if (String.isBlank(sObjectType) || String.isBlank(developerName)) {
          //  throw new IllegalArgumentException('Object type and developer name cannot be null or empty.');
        }
        
        // Retrieve the Record Type Id
        try {
            SObjectType objType = Schema.getGlobalDescribe().get(sObjectType);
            if (objType == null) {
              //  throw new IllegalArgumentException('Invalid SObject type: ' + sObjectType);
            }
            
            // Retrieve record type info by DeveloperName
            Map<String, Schema.RecordTypeInfo> recordTypeInfos = objType.getDescribe().getRecordTypeInfosByDeveloperName();
            if (!recordTypeInfos.containsKey(developerName)) {
                //throw new IllegalArgumentException('Record Type not found: ' + developerName);
            }
            
            Id recordTypeId = recordTypeInfos.get(developerName).getRecordTypeId();
            return recordTypeId;
        } catch (Exception ex) {
            throw ex;
        }
    }
        
    
  /*  private without sharing class WithoutShareQuery{  
        List<SObject> executeQuery(String sObjectType, String fields, String conditions, Boolean withUserMode) {
        	return BI_PSP_DataAccessor.executeQuery(sObjectType,fields,conditions,withUserMode); 
        }
        
        List<SObject> executeComplexQuery(String queryString, Boolean withUserMode) {
        	return BI_PSP_DataAccessor.executeComplexQuery(queryString,withUserMode); 
    	}
    }*/
    
}