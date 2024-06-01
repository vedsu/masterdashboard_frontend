import BaseApiService from "./BaseApiService";

const DEFAULT_PATH = "/category";

class CategoryService extends BaseApiService {
  getCategories = (endPoint) => {
    const path = DEFAULT_PATH + endPoint;
    return this.makeGetRequest(path);
  };

  addCategory = (endPoint, payload) => {
    const path = DEFAULT_PATH + endPoint;
    return this.makePostRequest(path, payload);
  };
}

export default new CategoryService();
