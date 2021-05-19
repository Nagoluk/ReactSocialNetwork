import React, {useEffect, useState} from 'react';
import UsersStlyes from './Users.module.css';
import User from './User';
import {Pagitator} from '../common/pagitator/Pagitator';
import {UniversalWrap} from '../../styles/wrap.styles'

import {useDispatch, useSelector} from 'react-redux';
import {
    getPagePagitator,
    getTotalUsersCountSelector,
    getPageSizeSelector,
    getUsersSelector, getCurrentPageSelector, getFollowProccesSelector, getIsFetchingSelector
} from '../../redux-state/selectors/users-selectors';
import {setUsersThunkCreator, unfollowThunkCreator, UsersActions, followThunkCreator} from '../../redux-state/usersReducer';
import Preloader from '../assets/preloader/Preloader';
import {useTranslation} from 'react-i18next';
import { Button } from 'antd';
import Search from 'antd/lib/input/Search';



let Users: React.FC = () => {
    const totalUsersCount = useSelector(getTotalUsersCountSelector)
    const pageSize = useSelector(getPageSizeSelector)
    const pagePagitator = useSelector(getPagePagitator)
    const users = useSelector(getUsersSelector)
    const currentPage = useSelector(getCurrentPageSelector)
    const followProcess = useSelector(getFollowProccesSelector)
    const isFetching = useSelector(getIsFetchingSelector)
    const {t} = useTranslation()

    const [screenWidth, setScreenWidth] = useState(window.innerWidth)


    const dispatch = useDispatch()

    const screenWidthHandler = () => {
        if(window.innerWidth <= 635 && screenWidth >= 635){
            setScreenWidth(window.innerWidth)
        }

        if(window.innerWidth > 635 && screenWidth < 635){
            setScreenWidth(window.innerWidth)
        }
    }

    const onPageChange = (p: number) => {
        dispatch(setUsersThunkCreator(p, pageSize, {friends: false, term:''}));
    }

    const setCurrentPagePagitator = (p: number) => {
        dispatch(UsersActions.setCurrentPagePagitator(p))
    }

    const unfollow = (id: number) => {
        dispatch(unfollowThunkCreator(id))
    }

    const follow = (id: number) => {
        dispatch(followThunkCreator(id))
    }

    useEffect(()=>{
        document.title = "Users"

        window.addEventListener(`resize`, screenWidthHandler, false);

        dispatch(setUsersThunkCreator(currentPage, pageSize, {friends: false, term:''}));

        return () => {
            window.removeEventListener(`resize`, screenWidthHandler, false)
        }

    }, [])


    return (<UniversalWrap maxWidth={550}>
                <Pagitator currentPage={currentPage}
                           onPageChange={onPageChange}
                           pagePagitator={pagePagitator}
                           pageSize={pageSize}
                           setCurrentPagePagitator={setCurrentPagePagitator}
                           totalUsersCount={totalUsersCount}
                           windowsWidth={screenWidth}
                />

                <div className={UsersStlyes.option}>
                    <Button type="primary" size={"large"}>All users</Button>
                    <Button size={"large"}>Following</Button>
                    <Button size={"large"}>Not following</Button>
                    <Search placeholder="input search text" size={"large"} enterButton="Search" />
                </div>


        {isFetching ? <Preloader/> : <div className={UsersStlyes.itemWrap}>
                    {users.map((user, index) => <User user={user}
                                                                    followProcess={followProcess}
                                                                    key={index}
                                                                    t={t}
                                                                    index={index}
                                                                    followThunkCreator={follow}
                                                                    unfollowThunkCreator={unfollow}/>)}
                </div>}
           </UniversalWrap>)
}


export default Users;