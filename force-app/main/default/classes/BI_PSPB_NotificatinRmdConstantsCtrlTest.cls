@isTest
public class BI_PSPB_NotificatinRmdConstantsCtrlTest {

    @isTest
    static void testConstants() {
        // Arrange
        // Expected values should be the same as what's defined in Custom Labels or hardcoded for the test

        // Test some of the constants to ensure they are correctly set
        String expectedActionTypeGeneral = System.Label.BI_PSPB_General;
        String expectedActionTypeAction = System.Label.BI_PSPB_Action;
        String expectedErrorMsgRecordNotFound = System.Label.BI_PSPB_EnrolleRecNotFound;

        // Act and Assert
        System.assertEquals(expectedActionTypeGeneral, BI_PSPB_NotificatinRmdConstantsCtrl.actionTypeGeneral, 'actionTypeGeneral should match');
        System.assertEquals(expectedActionTypeAction, BI_PSPB_NotificatinRmdConstantsCtrl.actionTypeAction, 'actionTypeAction should match');
        System.assertEquals(expectedErrorMsgRecordNotFound, BI_PSPB_NotificatinRmdConstantsCtrl.errorMsgRecordNotFound, 'errorMsgRecordNotFound should match');
        
        // Add more assertions as needed for other constants
        System.assertEquals('Day of Treatment', BI_PSPB_NotificatinRmdConstantsCtrl.dayOfTreatment, 'dayOfTreatment should match');
        System.assertEquals('Treatment Video', BI_PSPB_NotificatinRmdConstantsCtrl.treatmentVideo, 'treatmentVideo should match');
        System.assertEquals(System.Label.BI_PSPB_Yes, BI_PSPB_NotificatinRmdConstantsCtrl.actionResponseYes, 'actionResponseYes should match');
        System.assertEquals('Error in passing parameter', BI_PSPB_NotificatinRmdConstantsCtrl.parameterError, 'parameterError should match');
    }
}