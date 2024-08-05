/**
* @description  Used to
	create task when a video is uploaded and calling the method to
	send sms and email.
* History
* Version	Author			Date		Detail		Description
* 1.0		Niyas		24-07-2024		Created		Refactored Version
*/
public with sharing class BI_PSPB_SmsAndEmailNotificationHelper { 
	/**
	 * @description  Retrieves treatment reminders based on the given criteria.
	 * @param notificationTypes The ID of the record related to the treatment reminders.
	 * @param communityUserName The type of reminder to filter by.
	 * @return A list of BI_PSPB_Treatment_Reminder__c objects that match the criteria.
	 */
	public static BI_PSPB_SmsAndEmailNotificationDetails getNotificationDetails( // NOPMD
		String notificationTypes,
		List<String> communityUserName
	) {
		// Map to handle notification types
		Map<String, BI_PSPB_SmsAndEmailNotificationDetails> notificationMap = new Map<String, BI_PSPB_SmsAndEmailNotificationDetails>{
			BI_PSPB_NotificatinRmdConstantsCtrl.generalSymptomTracker => new BI_PSPB_SmsAndEmailNotificationDetails(
				BI_PSPB_NotificatinRmdConstantsCtrl.generalSymptomSms,
				BI_PSPB_NotificatinRmdConstantsCtrl.generalSymptomEmail,
				BI_PSPB_NotificatinRmdConstantsCtrl.urlSymptomTracker,
				BI_PSPB_NotificatinRmdConstantsCtrl.actionTypeSymptomTracker,
				communityUserName
			),
			BI_PSPB_NotificatinRmdConstantsCtrl.generalChallenges => new BI_PSPB_SmsAndEmailNotificationDetails(
				BI_PSPB_NotificatinRmdConstantsCtrl.generalChallengesSms,
				BI_PSPB_NotificatinRmdConstantsCtrl.generalChallengesEmail,
				BI_PSPB_NotificatinRmdConstantsCtrl.urlChallenges,
				BI_PSPB_NotificatinRmdConstantsCtrl.actionTypeChallenges,
				communityUserName
			),
			BI_PSPB_NotificatinRmdConstantsCtrl.generalComment => new BI_PSPB_SmsAndEmailNotificationDetails(
				'',
				BI_PSPB_NotificatinRmdConstantsCtrl.generalCommentEmail,
				BI_PSPB_NotificatinRmdConstantsCtrl.urlMyPost,
				BI_PSPB_NotificatinRmdConstantsCtrl.actionTypeGeneralCommunity,
				communityUserName
			),
			BI_PSPB_NotificatinRmdConstantsCtrl.generalCreatePost => new BI_PSPB_SmsAndEmailNotificationDetails(
				'',
				BI_PSPB_NotificatinRmdConstantsCtrl.generalPostEmail,
				BI_PSPB_NotificatinRmdConstantsCtrl.urlAllPost,
				BI_PSPB_NotificatinRmdConstantsCtrl.actionTypeGeneralCommunity,
				communityUserName
			),
			BI_PSPB_NotificatinRmdConstantsCtrl.generalReaction => new BI_PSPB_SmsAndEmailNotificationDetails(
				'',
				BI_PSPB_NotificatinRmdConstantsCtrl.generalReactionEmail,
				BI_PSPB_NotificatinRmdConstantsCtrl.urlMyPost,
				BI_PSPB_NotificatinRmdConstantsCtrl.actionTypeGeneralCommunity,
				communityUserName
			),
			BI_PSPB_NotificatinRmdConstantsCtrl.generalFollow => new BI_PSPB_SmsAndEmailNotificationDetails(
				'',
				BI_PSPB_NotificatinRmdConstantsCtrl.generalFollowEmail,
				BI_PSPB_NotificatinRmdConstantsCtrl.urlFollower,
				BI_PSPB_NotificatinRmdConstantsCtrl.actionTypeGeneralCommunity,
				communityUserName
			),
            BI_PSPB_NotificatinRmdConstantsCtrl.video => new BI_PSPB_SmsAndEmailNotificationDetails(
				BI_PSPB_NotificatinRmdConstantsCtrl.generalVideoSms,
				BI_PSPB_NotificatinRmdConstantsCtrl.generalVideoEmail,
				BI_PSPB_NotificatinRmdConstantsCtrl.urlFollower,
				BI_PSPB_NotificatinRmdConstantsCtrl.notificationQuestionaries,
				communityUserName
			),
			BI_PSPB_NotificatinRmdConstantsCtrl.actionSymptomTracker => new BI_PSPB_SmsAndEmailNotificationDetails(
				BI_PSPB_NotificatinRmdConstantsCtrl.actionSymptomSms,
				BI_PSPB_NotificatinRmdConstantsCtrl.actionSymptomEmail,
				BI_PSPB_NotificatinRmdConstantsCtrl.urlSymptomTracker,
				BI_PSPB_NotificatinRmdConstantsCtrl.treatmentAndRx,
				communityUserName
			),
			BI_PSPB_NotificatinRmdConstantsCtrl.treatmentOne => new BI_PSPB_SmsAndEmailNotificationDetails(
				BI_PSPB_NotificatinRmdConstantsCtrl.actionTreatmentOneSms,
				BI_PSPB_NotificatinRmdConstantsCtrl.actionTreatmentOneEmail,
				BI_PSPB_NotificatinRmdConstantsCtrl.urlDashboard,
				BI_PSPB_NotificatinRmdConstantsCtrl.treatmentAndRx,
				communityUserName
			),
			BI_PSPB_NotificatinRmdConstantsCtrl.treatmentThree => new BI_PSPB_SmsAndEmailNotificationDetails(
				BI_PSPB_NotificatinRmdConstantsCtrl.actionTreatmentThreeSms,
				BI_PSPB_NotificatinRmdConstantsCtrl.actionTreatmentThreeEmail,
				BI_PSPB_NotificatinRmdConstantsCtrl.urlDashboard,
				BI_PSPB_NotificatinRmdConstantsCtrl.treatmentAndRx,
				communityUserName
			),
			BI_PSPB_NotificatinRmdConstantsCtrl.treatmentSeven => new BI_PSPB_SmsAndEmailNotificationDetails(
				BI_PSPB_NotificatinRmdConstantsCtrl.actionTreatmentSevenSms,
				BI_PSPB_NotificatinRmdConstantsCtrl.actionTreatmentSevenEmail,
				BI_PSPB_NotificatinRmdConstantsCtrl.urlDashboard,
				BI_PSPB_NotificatinRmdConstantsCtrl.treatmentAndRx,
				communityUserName
			),
			BI_PSPB_NotificatinRmdConstantsCtrl.treatmentTen => new BI_PSPB_SmsAndEmailNotificationDetails(
				BI_PSPB_NotificatinRmdConstantsCtrl.actionTreatmentTenSms,
				BI_PSPB_NotificatinRmdConstantsCtrl.actionTreatmentTenEmail,
				BI_PSPB_NotificatinRmdConstantsCtrl.urlDashboard,
				BI_PSPB_NotificatinRmdConstantsCtrl.treatmentAndRx,
				communityUserName
			),
			BI_PSPB_NotificatinRmdConstantsCtrl.treatmentFourteen => new BI_PSPB_SmsAndEmailNotificationDetails(
				BI_PSPB_NotificatinRmdConstantsCtrl.actionTreatmentFourteenSms,
				BI_PSPB_NotificatinRmdConstantsCtrl.actionTreatmentFourteenEmail,
				BI_PSPB_NotificatinRmdConstantsCtrl.urlDashboard,
				BI_PSPB_NotificatinRmdConstantsCtrl.treatmentAndRx,
				communityUserName
			),
			BI_PSPB_NotificatinRmdConstantsCtrl.pastDueDateZero => new BI_PSPB_SmsAndEmailNotificationDetails(
				BI_PSPB_NotificatinRmdConstantsCtrl.actionPastDueSms,
				BI_PSPB_NotificatinRmdConstantsCtrl.actionPastDueEmail,
				BI_PSPB_NotificatinRmdConstantsCtrl.urlDashboard,
				BI_PSPB_NotificatinRmdConstantsCtrl.treatmentAndRx,
				communityUserName
			),
			BI_PSPB_NotificatinRmdConstantsCtrl.pastDueDateOne => new BI_PSPB_SmsAndEmailNotificationDetails(
				BI_PSPB_NotificatinRmdConstantsCtrl.actionPastDueOneSms,
				BI_PSPB_NotificatinRmdConstantsCtrl.actionPastDueOneEmail,
				BI_PSPB_NotificatinRmdConstantsCtrl.urlDashboard,
				BI_PSPB_NotificatinRmdConstantsCtrl.treatmentAndRx,
				communityUserName
			),
			BI_PSPB_NotificatinRmdConstantsCtrl.pastDueDateThree => new BI_PSPB_SmsAndEmailNotificationDetails(
				BI_PSPB_NotificatinRmdConstantsCtrl.actionPastDueThreeSms,
				BI_PSPB_NotificatinRmdConstantsCtrl.actionPastDueThreeEmail,
				BI_PSPB_NotificatinRmdConstantsCtrl.urlDashboard,
				BI_PSPB_NotificatinRmdConstantsCtrl.treatmentAndRx,
				communityUserName
			),
			BI_PSPB_NotificatinRmdConstantsCtrl.dlqi => new BI_PSPB_SmsAndEmailNotificationDetails(
				BI_PSPB_NotificatinRmdConstantsCtrl.actionDlqiSms,
				BI_PSPB_NotificatinRmdConstantsCtrl.actionDlqiEmail,
				BI_PSPB_NotificatinRmdConstantsCtrl.urlDlqiQuestionnaires,
				BI_PSPB_NotificatinRmdConstantsCtrl.notificationQuestionaries,
				communityUserName
			),
			BI_PSPB_NotificatinRmdConstantsCtrl.pss => new BI_PSPB_SmsAndEmailNotificationDetails(
				BI_PSPB_NotificatinRmdConstantsCtrl.actionPssSms,
				BI_PSPB_NotificatinRmdConstantsCtrl.actionPssEmail,
				BI_PSPB_NotificatinRmdConstantsCtrl.urlPssQuestionnaires,
				BI_PSPB_NotificatinRmdConstantsCtrl.notificationQuestionaries,
				communityUserName
			),
			BI_PSPB_NotificatinRmdConstantsCtrl.wpai => new BI_PSPB_SmsAndEmailNotificationDetails(
				BI_PSPB_NotificatinRmdConstantsCtrl.actionWpaiSms,
				BI_PSPB_NotificatinRmdConstantsCtrl.actionWpaiEmail,
				BI_PSPB_NotificatinRmdConstantsCtrl.urlWpaiQuestionnaires,
				BI_PSPB_NotificatinRmdConstantsCtrl.notificationQuestionaries,
				communityUserName
			),
			BI_PSPB_NotificatinRmdConstantsCtrl.qsq => new BI_PSPB_SmsAndEmailNotificationDetails(
				BI_PSPB_NotificatinRmdConstantsCtrl.actionQsqSms,
				BI_PSPB_NotificatinRmdConstantsCtrl.actionQsqEmail,
				BI_PSPB_NotificatinRmdConstantsCtrl.urlQsqQuestionnaires,
				BI_PSPB_NotificatinRmdConstantsCtrl.notificationQuestionaries,
				communityUserName
			)
		};
		try {
			// Handle special cases
			Set<String> specialTypes = new Set<String>{
				'TR1333',
				'TR7333',
				'TR100',
				'TR1466'
			};
			if (specialTypes.contains(notificationTypes)) {
				return new BI_PSPB_SmsAndEmailNotificationDetails(
					'BI_PSPB_PR10daysbeforeSmsdddddd',
					'BI_PSPB_PR10daysbeforerrrrrrrr',
					BI_PSPB_NotificatinRmdConstantsCtrl.urlFollower,
					BI_PSPB_NotificatinRmdConstantsCtrl.actionTypeSymptomTracker,
					communityUserName
				);
			}
			// Return the details based on notification type
		} catch (Exception ex) {
			BI_PSP_LogMessagesUtility.exceptionLogMessage(
				'',
				BI_PSPB_SmsAndEmailCtrlModulation.class.toString(),
				ex
			);
		}
		return notificationMap.get(notificationTypes);
	}

	/**
	 * @description  Retrieves treatment reminders based on the given criteria.
	 * @param accountToNotificationsMap The ID of the record related to the treatment reminders.
	 * @param enrollees The type of reminder to filter by.
	 * @param emailList The type of reminder to filter by.
	 * @param smsList The type of reminder to filter by.
	 */
	public static void addContactsToSend(
		Map<Id, List<BI_PSP_Notification_Setting__c>> accountToNotificationsMap,
		List<CareProgramEnrollee> enrollees,
		List<Id> emailList,
		List<Id> smsList
	) {
		try {
			Set<Id> careids = new Set<Id>();
			for (CareProgramEnrollee enrollee : enrollees) {
				Date birthdate = enrollee.Account.BI_PSP_Birthdate__c;
				Integer age = BI_PSPB_EnrolleeQueryHelper.getAge(
					birthdate
				);
				if (BI_PSPB_EnrolleeQueryHelper.isLegalAge(age)) {
					processNotifications(
						accountToNotificationsMap.get(enrollee.Id),
						enrollee.Account.PersonContactId,
						emailList,
						smsList
					);
				}
				careids.add(enrollee.Id);
			}

			// Formulate SOQL query conditions
			String fields = 'Id, BI_PSPB_Care_Program_Enrollee__c, BI_PSPB_Patient__r.BI_PSP_Birthdate__c, BI_PSPB_Patient__r.PersonContactId, BI_PSPB_Caregiver__r.PersonContactId';
			String conditionIds =
				'(\'' +
				String.join(careids, '\', \'') +
				'\')';
			String conditions =
				'BI_PSPB_Care_Program_Enrollee__c IN ' + conditionIds;

			// Execute the query
			List<SObject> caregivers = BI_PSP_CommonQueryUtility.executeQuery(
				'BI_PSPB_Enrollee_Caregiver__c',
				fields,
				conditions,
				false
			);

			// Process caregivers
			for (SObject caregiver : caregivers) {
				Date birthdate = (Date) caregiver.getSObject(
						'BI_PSPB_Patient__r'
					)
					.get('BI_PSP_Birthdate__c');
				Integer age = BI_PSPB_EnrolleeQueryHelper.getAge(
					birthdate
				);
				if (!BI_PSPB_EnrolleeQueryHelper.isLegalAge(age)) {
					Id patientId = (Id) caregiver.getSObject(
							'BI_PSPB_Patient__r'
						)
						.get('Id');
					processNotifications(
						accountToNotificationsMap.get(patientId),
						(Id) caregiver.getSObject('BI_PSPB_Caregiver__r')
							.get('PersonContactId'),
						emailList,
						smsList
					);
				}
			}
		} catch (Exception ex) {
			BI_PSP_LogMessagesUtility.exceptionLogMessage(
				'',
				BI_PSPB_SmsAndEmailCtrlModulation.class.toString(),
				ex
			);
		}
	}

	/**
	 * @description  Retrieves treatment reminders based on the given criteria.
	 * @param notifications The ID of the record related to the treatment reminders.
	 * @param personContactId The type of reminder to filter by.
	 * @param emailList The type of reminder to filter by.
	 * @param smsList The type of reminder to filter by.
	 */
	private static void processNotifications(
		List<BI_PSP_Notification_Setting__c> notifications,
		Id personContactId,
		List<Id> emailList,
		List<Id> smsList
	) {
		try {
			if (notifications != null) {
				for (
					BI_PSP_Notification_Setting__c notification : notifications
				) {
					if (notification.BI_PSP_Email__c) {
						emailList.add(personContactId);
					}
					if (notification.BI_PSP_SMS__c) {
						smsList.add(personContactId);
					}
				}
			}
		} catch (Exception ex) {
			BI_PSP_LogMessagesUtility.exceptionLogMessage(
				'',
				BI_PSPB_SmsAndEmailCtrlModulation.class.toString(),
				ex
			);
		}
	}

	/**
	 * @description  Retrieves treatment reminders based on the given criteria.
	 * @param notificationDetails The ID of the record related to the treatment reminders.
	 * @return A list of BI_PSPB_Treatment_Reminder__c objects that match the criteria.
	 */
	public static String getNotificationUrl(
		BI_PSPB_SmsAndEmailNotificationDetails notificationDetails
	) {
		BI_PSPB_Notification__mdt filteredNotifications = BI_PSPB_Notification__mdt.getInstance(
			BI_PSPB_NotificatinRmdConstantsCtrl.siteUrl
		);
		String bDestUrl = filteredNotifications.BI_PSPB_BrandedUrl__c;
		return bDestUrl + notificationDetails.urlPage;
	}
}