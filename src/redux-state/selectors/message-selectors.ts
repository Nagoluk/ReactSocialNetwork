import {createSelector} from 'reselect';
import {AppStateType} from '../stateRedux';


export const getDialogsSelector = (state: AppStateType) => state.MessagePage.dialogs;
export const getMessagesSelector = (state: AppStateType) => state.MessagePage.messages

export const getDialogInfoSelector = createSelector(
    (state => state.MessagePage.dialogs),
    (_: AppStateType, id: string) => id,
    (dialogs, id) => dialogs?.filter(dialog => String(dialog.id) === id)
)