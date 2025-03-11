import React, { useEffect, useRef, useState } from "react";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";
import "react-phone-number-input/style.css";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Input from "../../components/Input";
import Section from "../../components/Section";
import { PAGE_MODE } from "../../constants/enums";
import { LINK_COUPON } from "../../routes";
import CouponService from "../../services/CouponService";
import {
  validateGetRequest,
  validatePostRequest,
} from "../../utils/commonUtils";

const initialCouponInfo = {
  id: null,
  coupon: "",
  type: "",
  amount: "",
  status: "",
};

const couponTypeOptions = [
  {
    name: "Percentage",
    code: "per",
  },
  {
    name: "Amount",
    code: "dollar",
  },
];

const PageCreateEditCoupon = () => {
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [couponInfo, setCouponInfo] = useState(initialCouponInfo);
  const [submitBtnLoader, setSubmitBtnLoader] = useState(false);
  const pageMode = location.search.includes(PAGE_MODE.EDIT)
    ? PAGE_MODE.EDIT
    : PAGE_MODE.CREATE;

  const toast = useRef(null);

  useEffect(() => {
    onMount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onMount = async () => {
    //
  };

  /*------------------Event Handlers--------------------*/

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitBtnLoader(true);

    const payload = preparePayload();

    try {
      const res = await CouponService.createCoupon("/create_coupon", payload);

      if (validatePostRequest(res)) {
        setSubmitBtnLoader(false);
        setTimeout(() => {
          navigate(LINK_COUPON);
        }, 2000);
        toast.current.show({
          severity: "success",
          summary: "Created",
          detail: "Coupon created successfully",
          life: 2000,
        });
      }
    } catch (error) {
      setSubmitBtnLoader(false);
      console.error(error);
      toast.current.show({
        severity: "error",
        summary: "Unable to create",
        detail: "Try again",
        life: 2000,
      });
    }
  };

  const handleChange = (e) => {
    setCouponInfo((prev) => {
      if (e.target.name === "coupon") {
        return {
          ...prev,
          [e.target.name]: e.target.value.toUpperCase(),
        };
      }
      return {
        ...prev,
        [e.target.name]: e.target.value,
      };
    });
  };

  /*----------------------Helper Functions----------------- */
  const preparePayload = () => {
    const payloadObj = {
      coupon: couponInfo.coupon,
      type: couponInfo.type,
      amount: Number(couponInfo.amount) < 0 ? 0 : Number(couponInfo.amount),
    };
    if (couponInfo.id) {
      payloadObj.id = couponInfo.id;
    }
    if (couponInfo.status) {
      payloadObj.status = couponInfo.status;
    }
    return payloadObj;
  };

  /*-------------------------Sectional Renders--------------------------------*/

  const renderCouponForm = () => {
    return (
      <React.Fragment>
        <div className="col-span-2">
          <Input
            id={"inputCoupon"}
            name={"coupon"}
            label={"Coupon*"}
            placeholder={"Enter coupon code"}
            required={true}
            value={couponInfo.coupon}
            handler={handleChange}
          />
        </div>

        <div className="col-span-2">
          <Input
            id={"inputAmount"}
            name={"amount"}
            type={"number"}
            label={"Amount*"}
            placeholder={"Enter amount"}
            required={true}
            value={couponInfo.amount}
            handler={handleChange}
          />
        </div>

        <div className="col-span-2">
          <div className="grid gap-2">
            <label>Coupon Type*</label>
            <div className="app-dropdown">
              <Dropdown
                className="h-8"
                name="type"
                placeholder="Select coupon type"
                options={couponTypeOptions}
                optionLabel="name"
                optionValue="code"
                value={couponInfo.type}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  };

  return (
    <div>
      <div className="create-webinar-wrapper flex flex-col items-center gap-5">
        <div className="w-full">
          <div className="flex items-center gap-4 font-bold text-primary-pLabel">
            <button
              className="w-8 h-8 border rounded-[50%] text-center hover:bg-primary-light-100"
              onClick={() => {
                navigate(LINK_COUPON);
              }}
            >
              <i className="pi pi-arrow-left"></i>
            </button>
            <span>
              {pageMode === PAGE_MODE.CREATE ? "Create Coupon" : "Edit Coupon"}
            </span>
          </div>
        </div>

        <div className="w-full">
          <Section>
            <div>
              <form className="w-full flex flex-col gap-20" onSubmit={onSubmit}>
                <div className="grid grid-cols-4 gap-10">
                  {renderCouponForm()}
                </div>

                <div className="self-center flex items-center gap-5">
                  <div className="flex items-center justify-center">
                    <button
                      className="w-32 h-8 border-2 border-secondary-bg-silver rounded-full hover:bg-slate-50"
                      type="button"
                      onClick={() => navigate(LINK_COUPON)}
                    >
                      Cancel
                    </button>
                  </div>
                  <div className="flex items-center justify-center">
                    <button
                      type="submit"
                      className="submit-btn w-32 h-8 flex items-center justify-center bg-secondary-bg-btnLight text-primary-pTextLight rounded-full hover:bg-primary-bg-base-dark"
                    >
                      <span>Submit</span>
                      {submitBtnLoader && (
                        <i
                          className={`pi pi-spin pi-spinner absolute right-3`}
                          style={{ fontSize: "12px" }}
                        ></i>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </Section>
        </div>
      </div>

      <Toast
        ref={toast}
        className="app-toast text-sm text-primary-pText"
        position="bottom-right"
      />
    </div>
  );
};

export default PageCreateEditCoupon;
