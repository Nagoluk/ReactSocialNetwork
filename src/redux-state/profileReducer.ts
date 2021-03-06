
import {PostDataType, ProfileType} from '../interfaces/profile-interfaces';
import {nullable} from '../interfaces/common-interfaces';
import {InferActionsTypes} from './stateRedux';
import { ProfileAPI } from '../api/profile-api';
import { UsersAPI } from '../api/users-api';
import {Dispatch} from 'redux';
import {message} from 'antd';

message.config({duration: 100})


let initialProfilePage = {
    PostsData: [
        {id: 1, content: 'Hello Uface!', likes: 0, rep: 0, comm: 0, dataSend: 'Sun Mar 15 2020 18:44:42'},
    ] as Array<PostDataType>,

    profile: null as nullable<ProfileType>,
    status: '' as nullable<string>,
    isFetching: true as boolean,
    isUploadProfile: false as boolean,
    isFollowed: false as boolean,
    setProfileErrors: '' as string
}

const profileReducer = (state = initialProfilePage, action: ActionsType): initialProfilePageType => {
    switch (action.type) {
        case 'ADD_NEW_POST':
            let currentData = new Date().toString().slice(0, 24);

            let stateCopy = {
                ...state,
                PostsData: [...state.PostsData, {
                    id: 1,
                    content: action.text,
                    likes: 0,
                    rep: 0,
                    comm: 0,
                    dataSend: currentData
                }],
            };

            return stateCopy;

        case 'SET_PROFILE':
            return {
                ...state,
                profile: action.profile
            };

        case 'SET_STATUS':
            return {
                ...state,
                status: action.status
            };

        case 'USERS_IS_FETCHING' : {

            return {
                ...state,
                isFetching: action.payload
            }
        }

        case 'DELETE_POST': {
            return {
                ...state,
                PostsData: state.PostsData.filter(item => item.id !== action.id)
            }
        }

        case 'SET_FOLLOW': {
            return {
                ...state,
                isFollowed: action.payload
            }
        }

        case 'UPLOAD_PROFILE_INFO_PROCESS': {
            return {
                ...state,
                isUploadProfile: action.payload
            }
        }

        case 'SET_PROFILE_ERRORS': {
            return {
                ...state,
                setProfileErrors: action.payload
            }
        }

        default:
            return state;

    }
}

export const actionsProfile = {
    addNewPostAC: (text: string) => ({type: 'ADD_NEW_POST', text} as const),
    deletePostAC: (id: number) => ({type: 'DELETE_POST', id} as const),
    isUploadProfileAC: (payload: boolean) => ({type: 'UPLOAD_PROFILE_INFO_PROCESS', payload} as const),
    setFollowAC: (payload: boolean) => ({type: 'SET_FOLLOW', payload} as const),
    isFetchingAC: (condition: boolean) => ({type: 'USERS_IS_FETCHING', payload: condition} as const),
    setProfile: (profile: nullable<ProfileType> ) => ({type: 'SET_PROFILE', profile: profile} as const),
    setStatus: (status: string | null) => ({type: 'SET_STATUS', status} as const),
    setProfileErrors: (payload: string) => ({type: 'SET_PROFILE_ERRORS', payload} as const),
}

export const getProfileThunkCreator = (id: number) => {
    return (dispatch: any) => {
        dispatch(actionsProfile.setProfileErrors(''))
        dispatch(actionsProfile.isFetchingAC(true))

        ProfileAPI.getProfile(id).then((response: any) => {
            UsersAPI.Search(response.data.fullName).then((i: any) => {
                dispatch(actionsProfile.setFollowAC(i.data.items[0].followed))
                dispatch(actionsProfile.setProfile(response.data))
                dispatch(actionsProfile.isFetchingAC(false))
            })
        }).catch(() => {
            dispatch(actionsProfile.setProfileErrors('Network error'))
        }).finally(() => {
            dispatch(actionsProfile.isFetchingAC(false))
        });
    }
}

export const getStatusThunkCreator = (id: number) => {
    return (dispatch: any) => {
        ProfileAPI.getStatus(id).then((response: any) => {
            dispatch(actionsProfile.setStatus(response.data))
        }).catch(() => {
            message.error('Cannot get user status')
        })
    }
}

export const updateStatusThunkCreator = (status: string) => {
    return (dispatch: any) => {
        ProfileAPI.updateStatus(status).then((response: any) => {
            if (response.data.resultCode === 0)
                dispatch(actionsProfile.setStatus(status))
        }).catch(() => {
            message.error('Cannot update user status')
        })
    }
}

export const uploadAvatarThunkCreator = (avatar: any) => {
    return () => {
        ProfileAPI.uploadAvatar(avatar).then((response: any) => {
            if (response.resultCode === 0) {
                window.location.reload()
            }
        }).catch(() => {
            message.error('Logout error')
        })
    }
}

export const putUserDataThunkCreator = (data: ProfileType) => {
    return (dispatch: Dispatch) => {
        dispatch(actionsProfile.isUploadProfileAC(true));
        ProfileAPI.putProfileData(data).then((response) => {
            if (response.data.resultCode === 0) {
                dispatch(actionsProfile.isUploadProfileAC(false));
            } else if(response.data.messages) {
                dispatch(actionsProfile.setProfileErrors(response.data.messages.join('')))
            }else {
                message.error('Some error')
               dispatch(actionsProfile.isUploadProfileAC(false));
            }
        }).catch(() => {
            message.error('Cannot update user data')
        }).finally(() => {
            dispatch(actionsProfile.isUploadProfileAC(false));
        })
    }
}

export default profileReducer;

type ActionsType = InferActionsTypes<typeof actionsProfile>
type initialProfilePageType = typeof initialProfilePage;
