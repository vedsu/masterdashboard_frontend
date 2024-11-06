import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";
import { Toast } from "primereact/toast";
import React, { useEffect, useRef, useState } from "react";
import "react-phone-number-input/style.css";
import { useLocation, useNavigate } from "react-router-dom";
import UploadThumbnailBackground from "../../assets/img/background_image_thumbnail_upload.png";
import Input from "../../components/Input";
import NewsletterThumbnail from "../../components/ProfilePicture";
import Section from "../../components/Section";
import { PAGE_MODE } from "../../constants/enums";
import { LINK_NEWSLETTER } from "../../routes";
import CategoryService from "../../services/CategoryService";
import NewsletterService from "../../services/NewsletterService";
import WebsiteService from "../../services/WebsiteService";
import {
  validateGetRequest,
  validatePostRequest,
} from "../../utils/commonUtils";

const initialNewsletterInfo = {
  topic: "",
  industry: "",
  category: "",
  description: "",
  thumbnail: null,
  website: "",
  price: "",
  document: "",
  publishedDate: new Date(),
};

const PageCreateNewsletter = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [newsletterInfo, setNewsletterInfo] = useState(initialNewsletterInfo);
  const [industryOptions, setIndustryOptions] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [industryToCategoryMap, setIndustryToCategoryMap] = useState([]);
  const [websiteOptions, setWebsiteOptions] = useState([]);
  const [submitBtnLoader, setSubmitBtnLoader] = useState(false);
  const pageMode = location.search.includes(PAGE_MODE.EDIT)
    ? PAGE_MODE.EDIT
    : PAGE_MODE.CREATE;

  const toast = useRef(null);

  useEffect(() => {
    onMount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (newsletterInfo.industry) {
      const categoryOptions = industryToCategoryMap[newsletterInfo?.industry];
      const structuredCategoryOptions = categoryOptions?.map((option) => ({
        name: option,
        code: option,
      }));
      setCategoryOptions(structuredCategoryOptions ?? []);
    }
  }, [newsletterInfo.industry, industryToCategoryMap]);

  const onMount = async () => {
    await getIndustryOptions();
    await getWebsiteOptions();
  };

  const getIndustryOptions = async () => {
    try {
      const res = await CategoryService.getCategories("");

      if (validateGetRequest(res)) {
        const industryList = [];
        const industryCategoryMap = {};
        res?.data?.forEach((data) => {
          industryList.push({
            name: data?.industry ?? "",
            code: data?.industry ?? "",
          });
          industryCategoryMap[data?.industry] = data?.categories;
        });
        setIndustryOptions(industryList);
        setIndustryToCategoryMap(industryCategoryMap);
      } else {
        setIndustryOptions([]);
      }
    } catch (error) {
      setIndustryOptions([]);
      setIndustryToCategoryMap({});
      console.error(error);
    }
  };

  const getWebsiteOptions = async () => {
    try {
      const res = await WebsiteService.getWebsite("");
      const websiteList = [];
      if (validateGetRequest(res)) {
        res?.data?.forEach((data) => {
          websiteList.push({
            name: data?.website,
            code: data?.website,
          });
        });
        setWebsiteOptions(websiteList);
      }
    } catch (error) {
      console.error(error);
    }
  };

  /*------------------Event Handlers--------------------*/

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitBtnLoader(true);

    const payload = preparePayload();

    const formData = new FormData();
    for (const key in payload) {
      formData.append(key, payload[key]);
    }
    formData.append("published_date", new Date(newsletterInfo.publishedDate));

    // POST
    try {
      const res = await NewsletterService.createNewsletter(
        "/create_newsletter",
        formData
      );

      if (validatePostRequest(res)) {
        setSubmitBtnLoader(false);
        setTimeout(() => {
          navigate(LINK_NEWSLETTER);
        }, 2000);
        toast.current.show({
          severity: "success",
          summary: "Created",
          detail: "Newsletter created successfully",
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
    setNewsletterInfo((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const onChangeDate = (e) => {
    setNewsletterInfo((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  /*----------------------Helper Functions----------------- */
  const preparePayload = () => {
    const payloadObj = {
      topic: newsletterInfo.topic,
      category: newsletterInfo.category,
      website: newsletterInfo.website,
      description: newsletterInfo.description,
      price: newsletterInfo.price,
      document: newsletterInfo.document,
      thumbnail: newsletterInfo.thumbnail,
    };
    return payloadObj;
  };

  /*-------------------------Sectional Renders--------------------------------*/
  const renderNewsletterForm = () => {
    return (
      <React.Fragment>
        <div className="col-span-2">
          <div className="w-56 min-h-[370px]">
            <NewsletterThumbnail
              source={newsletterInfo.thumbnail}
              getFile={(file) => {
                setNewsletterInfo((prev) => ({ ...prev, thumbnail: file }));
              }}
              backgroundIcon={UploadThumbnailBackground}
            />
          </div>
        </div>

        <div className="col-span-2" />

        <div className="col-span-2">
          <Input
            id={"inputTopic"}
            name={"topic"}
            label={"Topic*"}
            placeholder={"Enter topic"}
            required={true}
            value={newsletterInfo.topic}
            handler={handleChange}
          />
        </div>

        <div className="col-span-2">
          <div className="grid gap-2">
            <label>Industry*</label>
            <div className="app-dropdown">
              <Dropdown
                className="h-8"
                name="industry"
                placeholder="Select industry"
                options={industryOptions}
                optionLabel="name"
                optionValue="code"
                value={newsletterInfo.industry}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className="col-span-2">
          <div className="grid gap-2">
            <label>Category*</label>
            <div className="app-dropdown">
              <Dropdown
                className="h-8"
                name="category"
                placeholder="Select category"
                options={categoryOptions}
                optionLabel="name"
                optionValue="code"
                value={newsletterInfo.category}
                onChange={handleChange}
                disabled={!newsletterInfo.industry}
              />
            </div>
          </div>
        </div>

        <div className="col-span-2">
          <div className="grid gap-2">
            <label>Website*</label>
            <div className="app-dropdown">
              <Dropdown
                className="h-8"
                name="website"
                placeholder="Select website"
                options={websiteOptions}
                optionLabel="name"
                optionValue="code"
                value={newsletterInfo.website}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className="col-span-2">
          <Input
            id={"inputPrice"}
            name={"price"}
            type={"number"}
            label={"Price($)*"}
            placeholder={"Enter price"}
            required={true}
            value={newsletterInfo.price}
            handler={handleChange}
          />
        </div>

        <div className="col-span-2">
          <Input
            id={"inputDocument"}
            name={"document"}
            label={"Document*"}
            placeholder={"Enter document url"}
            required={true}
            value={newsletterInfo.document}
            handler={handleChange}
          />
        </div>

        <div className="col-span-2">
          <div className="grid gap-2">
            <label>Date & Time</label>
            <Calendar
              className="h-8 px-2 text-sm border border-primary-light-900 rounded-md"
              name="publishedDate"
              value={newsletterInfo.publishedDate}
              onChange={onChangeDate}
              showTime
            />
          </div>
        </div>

        <div className="speaker-bio-box col-span-3 grid gap-2">
          <label>Description*</label>
          <InputTextarea
            className="speaker-bio-box min-h-[720px] p-2 border border-primary-light-900 text-primary-pText text-sm"
            name="description"
            placeholder="Enter description"
            value={newsletterInfo.description}
            onChange={handleChange}
          />
          <small></small>
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
                navigate(LINK_NEWSLETTER);
              }}
            >
              <i className="pi pi-arrow-left"></i>
            </button>
            <span>
              {pageMode === PAGE_MODE.CREATE ? "Create Newsletter" : ""}
            </span>
          </div>
        </div>

        <div className="w-full">
          <Section>
            <div>
              <form className="w-full flex flex-col gap-20" onSubmit={onSubmit}>
                <div className="grid grid-cols-4 gap-10">
                  {renderNewsletterForm()}
                </div>

                <div className="self-center flex items-center gap-5">
                  <div className="flex items-center justify-center">
                    <button
                      className="w-32 h-8 border-2 border-secondary-bg-silver rounded-full hover:bg-slate-50"
                      type="button"
                      onClick={() => navigate(LINK_NEWSLETTER)}
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

export default PageCreateNewsletter;
