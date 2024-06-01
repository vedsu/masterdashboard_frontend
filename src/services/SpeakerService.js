import BaseApiService from "./BaseApiService";

const DEFAULT_PATH = "/speaker_panel";

class SpeakerService extends BaseApiService {
  getSpeaker = (endpoint) => {
    let path = DEFAULT_PATH + endpoint;
    return this.makeGetRequest(path);
  };

  createSpeaker = (endPoint, payload) => {
    let path = DEFAULT_PATH + endPoint;
    return this.makePostRequest(path, payload);
  };

  updateSpeaker = (endPoint, payload) => {
    let path = DEFAULT_PATH + endPoint;
    return this.makePutRequest(path, payload);
  };

  updateSpeakerStatus = (endPoint, payload) => {
    let path = DEFAULT_PATH + endPoint;
    return this.makePostRequest(path, payload);
  };

  deleteSpeaker = (endPoint, payload) => {
    let path = DEFAULT_PATH + endPoint;
    return this.makeDeleteRequest(path, payload);
  };
}

export default new SpeakerService();
