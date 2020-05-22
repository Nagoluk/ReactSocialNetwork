import axios from "axios";
import {ProfileType} from "../Redux/profileReducer";



const instance = axios.create({
    withCredentials: true,
    baseURL: "https://social-network.samuraijs.com/api/1.0/",
    headers: {
        "API-KEY": "9b1ed003-d374-49c4-a5a6-e095c440ccd1",  
    }
})

//const socket = io.connect("https://social-network.samuraijs.com/api/1.0/dialogs")
export enum ResultsCodes{
    Success = 0,
    Error = 1,
}

export enum ResultCodeForCaptcha {
    CaptchaIsRequired= 10
}
type GetLoginResponseType = {
    resultCode: ResultsCodes,
    messages: Array<string>,
    data: {
        id: number,
        email: string,
        login: string
    }
}

type LoginResponseType = {
    resultCode: ResultsCodes | ResultCodeForCaptcha
    messages: Array<string>,
    data: {
        userId: number
    }
}

type LogoutResponseType = {
    resultCode: ResultsCodes
    messages: Array<string>,
    data: {}
}

export let AuthAPI = {
    getLogin () {
        return instance.get<GetLoginResponseType>("auth/me").then(response => response.data);
    },

    login (email: string, password: string, rememberMe = false, captcha: null | string = null){

        if(captcha) return instance.post<LoginResponseType>("auth/login", {email, password, rememberMe, captcha});

        return instance.post<LoginResponseType>("auth/login", {email, password, rememberMe});
    },

    logout () {
        return instance.delete<LogoutResponseType>("auth/login");
    }
};


export let UsersAPI = {
    getUsers(currentPage = 1, pageSize = 10) {
        return instance.get(`users?page=${currentPage}&count=${pageSize}`)
        .then(response => response.data);
    },

    Search(text: string) {
        return instance.get(`users?term=${text}&count=${5}`)
    }
};

export let DialogsAPI = {
    getDialogs(){
        return instance.get("dialogs")
    },

    startChating(id: number) {
        return instance.put(`dialogs/${id}`)
    },

   sendMessage(id: number, body: string){
    return instance.post(`dialogs/${id}/messages`, {body: body}).then(response => response.data)
    },

    getMessages(UserId: number){

        return instance.get(`dialogs/${UserId}/messages/new?newerThen=2019-4-19`);
    },

    getMessageCount (){
        return instance.get("dialogs/messages/new/count");
    },

    deleteMessage(messageId: string){
        return instance.delete(`dialogs/messages/${messageId}`)
    }
}



export let ProfileAPI = {
    getProfile(id: number) {
        return instance.get("profile/" + id);
    },

    getStatus(id: number){
        return instance.get("profile/status/" + id);
    },

    putProfileData(data: ProfileType){
        return instance.put("profile", data)
    },

    updateStatus(status: string){
        return instance.put("profile/status", {status: status});
    },

    uploadAvatar(avatar: any) {
        let formData = new FormData();
        formData.append("image", avatar)


        return instance.put("profile/photo", formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }).then(response => response.data)
    }
};

export let getSecureCaptcha = () => {
    return instance.get("security/get-captcha-url").then(response => response.data.url);
}


export let followAPI = (id: number) => {
    return instance.post("follow/" + id, {}).then(response => response.data);
}

export let unfollowAPI = (id: number) => {
    return instance.delete(("follow/" + id)).then(response => response.data)
}