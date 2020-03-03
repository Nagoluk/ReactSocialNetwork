import React from 'react';
import {connect} from "react-redux";
import Users from "./Users";
import {
    followThunkCreator,
    setCurrentPage,
    setTotalCount,
    setUsers,
    ToggleFetching,
    unfollowThunkCreator,
    toggleFollowProcessing,
    setUsersThunkCreator
} from "../../Redux/usersReducer";

import LoginHoc from "../../hoc/loginHoc";

import Preloader from "../assets/preloader/Preloader";


class userAPIcomponent extends React.Component {
    componentDidMount() {
        this.props.setUsersThunkCreator(this.props.currentPage, this.props.pageSize);
    }

    onPageChange = (p) => {
        this.props.setUsersThunkCreator(p, this.props.pageSize);
    }

    render() {

        console.log(this.props);
        return <>
            {this.props.isFetching ?  <Preloader/> :
            <Users currentPage={this.props.currentPage}
                   totalUsersCount={this.props.totalUsersCount}
                   pageSize={this.props.pageSize}
                   onPageChange={this.onPageChange}
                   users={this.props.users}
                   followThunkCreator={this.props.followThunkCreator}
                   unfollowThunkCreator={this.props.unfollowThunkCreator}
                   followProcces = {this.props.followProcces}
                   toggleFollowProcessing = {this.props.toggleFollowProcessing}
                   />}
                </>
    }
}

let mapStateToProps = (state) => {
    return {
        users: state.UsersReducer.users,
        pageSize: state.UsersReducer.pageSize,
        totalUsersCount: state.UsersReducer.totalUsersCount,
        currentPage: state.UsersReducer.currentPage,
        isFetching: state.UsersReducer.isFetching,
        followProcces: state.UsersReducer.followProcces,
        isLogined: state.LoginReducer.isLogined,
    }
}


let Dispatch = {
    followThunkCreator, unfollowThunkCreator, setUsers, setCurrentPage, 
    setTotalCount,ToggleFetching, toggleFollowProcessing,
    setUsersThunkCreator
}

let isLoginedHoc = LoginHoc(userAPIcomponent)

let UsersContainer = connect(mapStateToProps, Dispatch)(isLoginedHoc);

export default UsersContainer;
