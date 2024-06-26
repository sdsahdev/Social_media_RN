

// export const BASE_URL = "http://192.168.29.140:8200/socialapp/api";
export const BASE_URL = "https://social-media-backend-wkdd.onrender.com/socialapp/api";
export const API_URLS = {
    LOGIN_URL: "/auth/login",
    REGISTER_URL: "/auth/register",
    GET_POST_URL: "/post/getallpost",
    GET_USER_URL: "/users/getUser",
    ADD_POST_URL: "/post/addpost",
    DELETE_POST_URL: "/post/delete",
    UPDATE_POST_URL: "/post/update",
    LIKE_POST_URL: "/post/like",
    ADD_COMMENT: "/comment/add",
    GET_COMMENT: "/comment/getall",
    DELETE_COMMENT: "/comment/delete",
    UPDATE_COMMENT: "/comment/update",
    FOLLOW_USER: "/users/follow",
    GET_USER_POST: "/post/getuserpost",
    UPDATE_URERS: "/users/update",
}
export const RoutesName = {
    Login : "Login",
    Splash:"Splash",
    Signup:"Signup",
    Home:"Home",
    UploadPost:"UploadPost",
    Profile:"Profile",
    BottomTab:"BottomTab",
    Comment:"Comment",
    EditProfile:"EditProfile",
}
export const ImagePath = {
    homeicon: require('../Images/house.png'),
    closeicon: require('../Images/close.png'),
    girlicon: require('../Images/girl.png'),
    hearticon: require('../Images/heart.png'),
    hideicon: require('../Images/hide.png'),
    macicon: require('../Images/joshua-reddekopp-GkFQEOubrCo-unsplash.jpg'),
    logoicon: require('../Images/logo2.png'),
    mailicon: require('../Images/mail.png'),
    manicon: require('../Images/man.png'),
    moreicon: require('../Images/more.png'),
    lockicon: require('../Images/padlock.png'),
    callicon: require('../Images/phone-call.png'),
    saveicon: require('../Images/save-instagram.png'),
    searchicon: require('../Images/search.png'),
    usericon: require('../Images/user.png'),
    shareicon: require('../Images/share.png'),
    sendicon: require('../Images/send.png'),
    cameraicon: require('../Images/camera.png'),
    gallaryicon: require('../Images/gallery.png'),
    menu: require('../Images/dots.png'),
    chaticon: require('../Images/chat.png'),
    editicon: require('../Images/editing.png'),
    deleteicon: require('../Images/delete.png'),
}