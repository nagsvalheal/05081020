/**
 * @description To send email when a post is being created.
 * History
 * Version	Author			Date		Detail		Description
 * 1.0		Niyas		24-07-2024		Created		Refactored Version
 */
public with sharing class BI_PSPB_TaskNotificationHandler {
	/**
	 * @description  Retrieves treatment reminders based on the given criteria.
	 * @param enrolleeRecords The ID of the record related to the treatment reminders.
	 * @param context The type of reminder to filter by.
	 */
	public static void handleNotifications(
		List<CareProgramEnrollee> enrolleeRecords,
		BI_PSPB_NotificationContext context
	) {
		if (
			context.category ==
			BI_PSPB_NotificatinRmdConstantsCtrl.actionTypeGeneralCommunity &&
			context.notificationType ==
			BI_PSPB_NotificatinRmdConstantsCtrl.actionTypeGeneral
		) {
			handleGeneralCommunityNotifications(context);
		} else if (
			context.category ==
			BI_PSPB_NotificatinRmdConstantsCtrl.actionTypeChallenges &&
			context.notificationType ==
			BI_PSPB_NotificatinRmdConstantsCtrl.actionTypeGeneral
		) {
			handleTriggerWithMessage(
				context.recordId,
				BI_PSPB_NotificatinRmdConstantsCtrl.generalChallenges,
				new List<String>{ '' }
			);
		} else if (
			context.category ==
			BI_PSPB_NotificatinRmdConstantsCtrl.actionTypeSymptomTracker &&
			context.notificationType ==
			BI_PSPB_NotificatinRmdConstantsCtrl.actionTypeGeneral
		) {
			handleTriggerWithMessage(
				context.recordId,
				BI_PSPB_NotificatinRmdConstantsCtrl.generalSymptomTracker,
				new List<String>{ '' }
			);
		}
	}
	/**
	 * @description  Retrieves treatment reminders based on the given criteria.
	 * @param context The type of reminder to filter by.
	 */
	private static void handleGeneralCommunityNotifications(
		BI_PSPB_NotificationContext context
	) {
		Map<String, String> chatterTypeToMessageMap = new Map<String, String>{
			BI_PSPB_NotificatinRmdConstantsCtrl.comment => BI_PSPB_NotificatinRmdConstantsCtrl.generalComment,
			BI_PSPB_NotificatinRmdConstantsCtrl.reaction => BI_PSPB_NotificatinRmdConstantsCtrl.generalReaction,
			BI_PSPB_NotificatinRmdConstantsCtrl.follow => BI_PSPB_NotificatinRmdConstantsCtrl.generalFollow
		};

		String messageType = chatterTypeToMessageMap.get(context.chatterType);

		if (messageType != null) {
			handleTriggerWithMessage(
				context.recordId,
				messageType,
				context.communityUserName
			);
		}
	}
	/**
	 * @description  Retrieves treatment reminders based on the given criteria.
	 * @param recordId The ID of the record related to the treatment reminders.
	 * @param messageType The type of reminder to filter by.
	 * @param communityUserName The type of reminder to filter by.
	 */
	private static void handleTriggerWithMessage(
		List<Id> recordId,
		String messageType,
		List<String> communityUserName
	) {
		BI_PSPB_SmsAndEmailSenderCtrl.handleTrigger(
			recordId,
			messageType,
			communityUserName,
			''
		);
	}
}