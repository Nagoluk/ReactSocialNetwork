import profileReducer from './profileReducer';
import messageReducer from './messageReducer';
import {Action, combineReducers, compose, createStore} from 'redux';
import usersReducer from './usersReducer';
import loginReducer from './loginReducer'
import {applyMiddleware} from 'redux';
import thunkMiddleWare, {ThunkAction} from 'redux-thunk';
import {reducer as formReducer} from 'redux-form';
import appReducer from './appReducer';
import notificationReducer from './notificationReducer';
import { chatReducer } from './chat-reducer';


let reducers = combineReducers({
    ProfilePage: profileReducer,
    MessagePage: messageReducer,
    UsersReducer: usersReducer,
    LoginReducer: loginReducer,
    form: formReducer,
    app: appReducer,
    chat: chatReducer,
    notification: notificationReducer
})

type RootReducerType = typeof reducers;
export type AppStateType = ReturnType<RootReducerType>


// @ts-ignore
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(reducers, composeEnhancers(applyMiddleware(thunkMiddleWare)));

type PropertiesType<T> = T extends { [key: string]: infer U } ? U : never
export type InferActionsTypes<T extends { [key: string]: (...args: any[]) => any }> = ReturnType<PropertiesType<T>>


export type BaseThunkType<A extends Action = Action, R = Promise<void>> = ThunkAction<R, AppStateType, unknown, A>

// @ts-ignore
//window._market = store;

export default store;