import React, {useEffect} from 'react';
import {Route, Switch, useHistory} from 'react-router-dom';

import Login from './components/Login/Login';
import {useDispatch, useSelector} from 'react-redux';
import {initializeApp} from './redux-state/appReducer';
import Preloader from './components/assets/preloader/Preloader';

import {getNewMessageCountThunkCreator} from './redux-state/notificationReducer';
import {createGlobalStyle, ThemeProvider} from 'styled-components';
import {AdaptiveMenu} from './components/Nav/adaptiveNav';
import Dialogs from "./components/Dialogs";

import Header from './components/Header/header';

import Setting from './components/Setting/setting';
import {getInitializedSelector, getIsBlackSelector} from './redux-state/selectors/app-selectors';
import Profile from './components/Profile/profile';
import Users from './components/Users/Users';

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import {resources} from './localization';
import {ChatPage} from './components/Chat/Chat';
import {getIsLoginedSelector} from './redux-state/selectors/login-selectors';

i18n
    .use(initReactI18next) // passes i18n down to react-i18next
    .init({
        resources: resources,
        lng: "eng",
        fallbackLng: "eng",

        interpolation: {
            escapeValue: false
        }
    });




type themeType = {
    theme: {
        mode: string
    }
}

const GlobalStyle = createGlobalStyle<themeType>`
  body {
    background: ${props => (props.theme.mode === 'dark' ? '#3C3F41' : '#E7EBF0')};
  }
`

const App = () => {
    const dispatch = useDispatch()
    const history = useHistory()
    const initialized = useSelector(getInitializedSelector)
    const isBlackTheme = useSelector(getIsBlackSelector)
    const isLogined = useSelector(getIsLoginedSelector)

    useEffect(() => {
        dispatch(initializeApp())
        dispatch(getNewMessageCountThunkCreator())
    }, [dispatch])


    if (!initialized) {
        return <Preloader/>
    }

    if(!isLogined) {
        history.push('/login')
    }


    return (
        <ThemeProvider theme={{mode: isBlackTheme ? 'dark' : 'light'}}>
            <div className="render">
                <GlobalStyle/>
                <Header/>
                <AdaptiveMenu/>

                <React.Suspense fallback={<Preloader/>}>
                    <Switch>
                        <Route path="/login" exact render={() => <Login/>}/>
                        {!isLogined && <Route path="*" exact render={() => <Login/>}/>}

                        <div className="main-wrap">
                            {isLogined && <main>
                                <Route path="/dialogs/:userID?"
                                       render={() => <Dialogs/>}/>
                                <Route path="/setting" render={() => <Setting/>}/>
                                <Route path="/chat" render={() => <ChatPage/>}/>
                                <Route path={['/profile/:userID?', '/']} exact render={() => <Profile/>}/>
                                <Route path="/friends" render={() => <Users/>}/>
                                {/*<Route path={'*'} exact render={() => <NotFound/>}/>*/}
                            </main>}
                        </div>
                    </Switch>
                </React.Suspense>
            </div>
        </ThemeProvider>);
}
export default App