import BaseApiService from "./BaseApiService";

const DEFAULT_PATH = "/webinar_panel";
const DEFAULT_PATH_UCW = "/ucw";

class WebinarService extends BaseApiService {
  getWebinar = (endpoint) => {
    let path = DEFAULT_PATH + endpoint;
    return this.makeGetRequest(path);
  };

  getUpcomingWebinars = (endpoint) => {
    let path = DEFAULT_PATH_UCW + endpoint;
    return this.makeGetRequest(path);
  };

  getWebinarSpeakers = (endpoint) => {
    let path = DEFAULT_PATH + endpoint;
    return this.makeGetRequest(path);
  };

  createWebinar = (endPoint, payload) => {
    let path = DEFAULT_PATH + endPoint;
    return this.makePostRequest(path, payload);
  };

  updateWebinar = (endPoint, payload) => {
    let path = DEFAULT_PATH + endPoint;
    return this.makePutRequest(path, payload);
  };

  updateWebinarStatus = (endPoint, payload) => {
    let path = DEFAULT_PATH + endPoint;
    return this.makePostRequest(path, payload);
  };

  deleteWebinar = (endPoint, payload) => {
    let path = DEFAULT_PATH + endPoint;
    return this.makeDeleteRequest(path, payload);
  };
}

export default new WebinarService();
