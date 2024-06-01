import BaseApiService from "./BaseApiService";

const DEFAULT_PATH = "/website_panel";

class WebsiteService extends BaseApiService {
  getWebsite = () => {
    const path = DEFAULT_PATH;
    return this.makeGetRequest(path);
  };

  addWebsite = (endPoint, payload) => {
    const path = DEFAULT_PATH + endPoint;
    return this.makePostRequest(path, payload);
  };
}

export default new WebsiteService();
