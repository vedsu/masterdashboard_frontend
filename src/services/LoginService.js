import BaseApiService from "./BaseApiService";

class LoginService extends BaseApiService {
  postLoginData = (endPoint, payload) => {
    return this.makePostRequest(endPoint, payload);
  };
}

export default new LoginService();
