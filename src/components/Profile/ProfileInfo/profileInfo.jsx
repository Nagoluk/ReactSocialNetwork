import React from "react"
import p from "../profile.module.css";
import Status from "./status/statusHook";
import profileAvatar from "../../../img/Profile/avatar.png";



const ProfileInfo = (props) => {
        let uploadPhoto = (e) => {
            props.uploadAvatarThunkCreator((e.target.files[0]));
        }

        let amI = props.profile.profile.userId === props.loginData.id;


        return (
            <div className={p.profileWrap}>
               
             <div className={p.photowrap} ></div>
                
                <div className={p.information}>


                    <div >
                        <img src={props.profile.profile.photos.large || profileAvatar} className={p.avatar} alt="Avatar"/>
                    </div>

                    {amI && <div className={p.AvatarControl}>
                        <label htmlFor="avatar"><i className="fas fa-upload"></i>Upload avatar</label>
                        <input type="file" id="avatar" className={p.Avatar} onChange={uploadPhoto}/>
                    </div>}

                    <div className={p.info}>
                        <h2>{props.profile.profile.fullName}</h2>
                        <ul>
                            <li><span className={p.infoItem}>{(props.lang.eng) ? "Status:" : "Статус"} </span>
                                <Status status={props.status || props.profile.aboutMe || "No status"}
                                        updateStatusThunkCreator={props.updateStatusThunkCreator}
                                        amI={amI}
                                />
                            </li>
                            <li></li>
                            <li></li>
                            <li></li>
                        </ul>
                    </div>

                </div>

            </div>
        );
}

export default ProfileInfo;