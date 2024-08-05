//This is a consolidated component that creates a dashboard layout featuring user notifications, update prescription, challenges, and articles. It utilizes Lightning Layout for responsive design, organizing components into rows and columns
//To import Libraries
import { LightningElement} from 'lwc';
//To import current user ID

import { resource } from "c/biPspbEnrollmentFormResource";
//To import custom labels
// import ERROR_MESSAGE from '@salesforce/label/c.BI_PSP_ConsoleError';
// import ERROR_VARIANT from '@salesforce/label/c.BI_PSP_ErrorVariantToast';
export default class BiPspbDashboardUaParent extends LightningElement 
{
userId = resource.ID;
showSpinner=false;
// connectedCallback() {
// try {
// 			this.showSpinner=true;
// 			setTimeout(() => {
// 			this.showSpinner = false;
// 			}, 2000);
// 		} catch (error) {
// 			this.showToast(ERROR_MESSAGE, error.message, ERROR_VARIANT); // catch Exception
// 		}
// }
}