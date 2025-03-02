import BaseApiService from "./BaseApiService";

const DEFAULT_PATH = "/order_panel";
const ORDER_DOWNLOAD_PATH = "/g_csv";

class OrderService extends BaseApiService {
  getOrders = () => {
    const path = DEFAULT_PATH;
    return this.makeGetRequest(path);
  };

  getOrderById = (endPoint) => {
    const path = DEFAULT_PATH + endPoint;
    return this.makeGetRequest(path);
  };

  getOrderDownloadLink = () => {
    const path = ORDER_DOWNLOAD_PATH;
    return this.makeGetRequest(path);
  };
}

export default new OrderService();
