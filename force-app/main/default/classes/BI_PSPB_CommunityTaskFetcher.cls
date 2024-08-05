/**
* @description  Used to
	create task when a video is uploaded and calling the method to
	send sms and email.
* History
* Version	Author			Date		Detail		Description
* 1.0		Niyas		24-07-2024		Created		Refactored Version
*/
public with sharing class BI_PSPB_CommunityTaskFetcher {
	/**
	 * @description  Used to create task when a video is uploaded and calling the
	 * method to send sms and email.
	 */
	public static List<Task> fetchPendingCommunityPosts() {
		String fields = 'Id, WhatId, BI_PSP_CommunityPostStatus__c, BI_PSP_ChatterType__c, BI_PSP_Category__c, Status, BI_PSP_CommunityUserName__c';
		String conditions =
			'BI_PSP_Category__c = \'' +
			BI_PSPB_NotificatinRmdConstantsCtrl.actionTypeGeneralCommunity +
			'\' ' +
			'AND BI_PSP_ChatterType__c = \'' +
			BI_PSPB_NotificatinRmdConstantsCtrl.createPost +
			'\' ' +
			'AND Status = \'' +
			BI_PSPB_NotificatinRmdConstantsCtrl.actionTypeUnRead +
			'\' ' +
			'AND BI_PSP_CommunityPostStatus__c = \'' +
			BI_PSPB_NotificatinRmdConstantsCtrl.inProgressType +
			'\' ';
		List<SObject> results = BI_PSP_CommonQueryUtility.executeQuery(
			'Task',
			fields,
			conditions,
			false
		);
		return (List<Task>) results;
	}
}