import { LOCAL_STORAGE } from "../constants/enums";

class HelperService {
  getUserInfo() {
    if (localStorage(LOCAL_STORAGE.USER_INFO)) {
      return JSON.parse(localStorage(LOCAL_STORAGE.USER_INFO));
    }
    return null;
  }

  getHeaders(contentType) {
    return {
      "content-type": contentType ?? "application/json",
    };
  }
}

export default new HelperService();
