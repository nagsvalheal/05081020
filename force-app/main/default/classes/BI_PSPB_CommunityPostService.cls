/**
 * @description To send email when a post is being created.
 * History
 * Version	Author			Date		Detail		Description
 * 1.0		Niyas		24-07-2024		Created		Refactored Version
 */
public with sharing class BI_PSPB_CommunityPostService {
	/**
	* @description Checking for tasks and calling other method
	to send mail.
	*/
	public static void processCommunityPostReminders() {
		try {
			List<Task> taskRecords = BI_PSPB_CommunityTaskFetcher.fetchPendingCommunityPosts();

			if (taskRecords.isEmpty()) {
				BI_PSP_LogMessagesUtility.logError(
					BI_PSPB_NotificatinRmdConstantsCtrl.errorMsgRecordNotFound,
					BI_PSPB_ActionNotificationUpdateStatus.class.toString(),
					false,
					BI_PSPB_NotificatinRmdConstantsCtrl.severityError
				);
			} else {
				List<Id> taskIds = new List<Id>();
				List<Task> newTaskList = new List<Task>();
				List<String> communityUserNames = new List<String>();

				for (Task taskToUpdate : taskRecords) {
					Task newTask = createUpdatedTask(taskToUpdate);
					taskIds.add(taskToUpdate.WhatId);
					communityUserNames.add(
						taskToUpdate.BI_PSP_CommunityUserName__c
					);
					newTaskList.add(newTask);
				}

				if (!newTaskList.isEmpty()) {
					BI_PSPB_HandleUtitlites.insertAndHandleErrors(
						newTaskList,
						BI_PSPB_CommunityPostService.class.toString(),
						false
					);
				}

				if (!taskIds.isEmpty()) {
					BI_PSPB_NotificationSender.sendNotifications(
						taskIds,
						BI_PSPB_NotificatinRmdConstantsCtrl.generalCreatePost,
						communityUserNames
					);
				}
			}
		} catch (Exception ex) {
			BI_PSP_LogMessagesUtility.exceptionLogMessage(
				'',
				BI_PSPB_CommunityPostService.class.toString(),
				ex
			);
		}
	}
	/**
	* @description Checking for tasks and calling other method
	to send mail.
	* @param taskToUpdate Task that is to be updated.
	* @return Returning the task that is updated.
	*/
	private static Task createUpdatedTask(Task taskToUpdate) {
		Task newTask = new Task();
		try {
			if (taskToUpdate == null) {
				BI_PSP_LogMessagesUtility.logError(
					BI_PSPB_NotificatinRmdConstantsCtrl.errorMsgRecordNotFound,
					BI_PSPB_ActionNotificationUpdateStatus.class.toString(),
					false,
					BI_PSPB_NotificatinRmdConstantsCtrl.severityError
				);
			} else {
				newTask.Id = taskToUpdate.Id;
				newTask.BI_PSP_CommunityPostStatus__c = BI_PSPB_NotificatinRmdConstantsCtrl.actionTypeNotificatonTypeCompleted;
			}
		} catch (Exception ex) {
			BI_PSP_LogMessagesUtility.exceptionLogMessage(
				'',
				BI_PSPB_CommunityPostService.class.toString(),
				ex
			);
		}
		return newTask;
	}
}