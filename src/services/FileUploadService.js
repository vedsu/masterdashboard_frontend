import BaseApiService from "./BaseApiService";

const DEFAULT_PATH =
  "https://5y8uqbectl.execute-api.us-east-1.amazonaws.com/dev/vedsubrandwebsite";

class FileUploadService extends BaseApiService {
  upload = (endPoint, payload) => {
    const path = DEFAULT_PATH + `/${endPoint}`;
    return this.makePutRequest(path, payload);
  };
}

export default new FileUploadService();
