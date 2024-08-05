import { LightningElement } from 'lwc';
import {resources} from 'c/biPspbResourceProfileManager';

export default class BiPspDisplayErrorPage extends LightningElement {
    errorMessage;
    somethingWrong=resources.SOMETHING_WRONG;
    error=resources.ERROR;
    sorryMessage=resources.SORRY_MESSAGE;
    possibleReason=resources.POSSIBLE_REASON;
    unavailable=resources.UNAVAILABLE;
    pageNotExist=resources.PAGE_NOT_EXIST;
    technicalIssue=resources.TECHNICAL_ISSUE;
    questionContent=resources.QUESTION_CONTENT;
    reloadPage=resources.RELOAD_PAGE;
    previousPage=resources.PREVIOUS_PAGE;
    furtherAssistance=resources.FURTHER_ASSISTANCE;
    connectedCallback() {
        const globalThis = window;
        // Retrieve data from sessionStorage when the component is connected
        this.errorMessage = globalThis.sessionStorage.getItem('errorMessage');
    }
}