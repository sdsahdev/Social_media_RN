export const LOCAL_HOST = 'http://192.168.29.140:8200';
export const BASE_URL = `${LOCAL_HOST}/socialapp/api`;
// export const BASE_URL = "https://social-media-backend-wkdd.onrender.com/socialapp/api";
export const API_URLS = {
  LOGIN_URL: '/auth/login',
  REGISTER_URL: '/auth/register',
  GET_POST_URL: '/post/getallpost',
  GET_USER_URL: '/users/getUser',
  ADD_POST_URL: '/post/addpost',
  DELETE_POST_URL: '/post/delete',
  UPDATE_POST_URL: '/post/update',
  LIKE_POST_URL: '/post/like',
  ADD_COMMENT: '/comment/add',
  GET_COMMENT: '/comment/getall',
  DELETE_COMMENT: '/comment/delete',
  UPDATE_COMMENT: '/comment/update',
  FOLLOW_USER: '/users/follow',
  GET_ALL_USERS: '/users/getAllUser',
  GET_USER_POST: '/post/getuserpost',
  UPDATE_URERS: '/users/update',
  REFRESH_TOKEN: '/refresh-token',

  // chat
  GET_USERS_CHATLIST: '/chat/get_my_chat',
  GET_CHAT_MESSAGE: '/chat/message',
  GET_CHAT_DETAILS: '/chat/getchat',
  SEND_PICS: '/chat/send-attachments',
  CREATE_GROUP: '/chat/create-group',
  LIST_WITHOUT_CHAT: '/chat/users-without-personal-chat',
  CRAETE_PERSONAL_CHAT: '/chat/create-personal-chat',
  DETELET_GROUP: '/chat/delete-group',
  RENAME_GROUP: '/chat/rename-group',
  LEAVE_GROUP: '/chat/leave-group',
};
export const RoutesName = {
  Login: 'Login',
  Splash: 'Splash',
  Signup: 'Signup',
  Home: 'Home',
  UploadPost: 'UploadPost',
  Profile: 'Profile',
  BottomTab: 'BottomTab',
  Comment: 'Comment',
  EditProfile: 'EditProfile',
  OtherProfile: 'OtherProfile',
  ChatScreen: 'ChatScreen',
  MessageScreen: 'MessageScreen',
  GallaryScreen: 'GallaryScreen',
  ListWithoutChat: 'ListWithoutChat',
  ChatDetails: 'ChatDetails',
  VideoCalling: 'VideoCalling',
  SigninOption: 'SigninOption',
};
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
  plsuicon: require('../Images/plus.png'),
  peopleicon: require('../Images/people.png'),
  adduser: require('../Images/invite.png'),
  leave: require('../Images/logout.png'),
  blurBg: require('../Images/Blur.jpeg'),
};
