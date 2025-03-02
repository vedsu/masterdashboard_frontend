import BaseApiService from "./BaseApiService";

const DEFAULT_PATH = "/coupon_panel";

class CouponService extends BaseApiService {
  getCoupons = () => {
    const path = DEFAULT_PATH;
    return this.makeGetRequest(path);
  };

  createCoupon = (endPoint, payload) => {
    const path = DEFAULT_PATH + endPoint;
    return this.makePostRequest(path, payload);
  };

  updateCoupon = (endPoint, payload) => {
    const path = DEFAULT_PATH + endPoint;
    return this.makePutRequest(path, payload);
  };
}

export default new CouponService();
