import BaseApiService from "./BaseApiService";

const DEFAULT_PATH = "/newsletter_panel";

class NewsletterService extends BaseApiService {
  getNewsletter = (endpoint) => {
    let path = DEFAULT_PATH + endpoint;
    return this.makeGetRequest(path);
  };

  createNewsletter = (endPoint, payload) => {
    let path = DEFAULT_PATH + endPoint;
    return this.makePostRequest(path, payload);
  };

  updateNewsletterStatus = (endPoint, payload) => {
    let path = DEFAULT_PATH + endPoint;
    return this.makePostRequest(path, payload);
  };
}

export default new NewsletterService();
