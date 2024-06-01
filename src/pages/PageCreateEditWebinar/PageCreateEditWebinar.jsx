import { Calendar } from "primereact/calendar";
import { Checkbox } from "primereact/checkbox";
import { Dropdown } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";
import { Toast } from "primereact/toast";
import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Input from "../../components/Input";
import Section from "../../components/Section";
import { PAGE_MODE } from "../../constants/enums";
import { LINK_WEBINAR } from "../../routes";
import CategoryService from "../../services/CategoryService";
import WebinarService from "../../services/WebinarService";
import {
  validateGetRequest,
  validatePostRequest,
  validatePutRequest,
} from "../../utils/commonUtils";

const timezoneOptions = [
  { name: "EST", code: "EST" },
  { name: "PST", code: "PST" },
  { name: "CST", code: "CST" },
  { name: "IST", code: "IST" },
  { name: "UTC", code: "UTC" },
];

const initialWebinarInfo = {
  id: null,
  topic: "",
  url: "",
  date: new Date(),
  speaker: "",
  industry: "",
  category: "",
  website: "",
  timezone: "",
  duration: "",
  isSessionLive: true,
  livePrice: "199",
  urlLive: "",
  isSessionRecording: true,
  recordingPrice: "299",
  urlRecording: "",
  isSessionDD: true,
  ddPrice: "299",
  urlDd: "",
  isSessionTranscript: true,
  transcriptPrice: "299",
  urlTranscript: "",
  description: "",
  status: "Active",
};

const PageCreateEditWebinar = () => {
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [webinarInfo, setWebinarInfo] = useState(initialWebinarInfo);
  const [submitBtnLoader, setSubmitBtnLoader] = useState(false);
  const [speakerOptions, setSpeakerOptions] = useState([]);
  const [industryToCategoryMap, setIndustryToCategoryMap] = useState({});
  const [industryOptions, setIndustryOptions] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [websiteOptions, setWebsiteOptions] = useState([]);
  const [pageIndex, setPageIndex] = useState(1);

  const pageMode = location.search.includes(PAGE_MODE.EDIT)
    ? PAGE_MODE.EDIT
    : PAGE_MODE.CREATE;

  const toast = useRef(null);

  useEffect(() => {
    onMount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (webinarInfo.industry) {
      const categoryList = industryToCategoryMap[webinarInfo?.industry] ?? [];
      const structuredCategoryList = categoryList?.map((category) => {
        return {
          name: category,
          code: category,
        };
      });
      setCategoryOptions(structuredCategoryList);
    }
  }, [webinarInfo.industry, industryToCategoryMap]);

  const onMount = async () => {
    if (pageMode === PAGE_MODE.EDIT) {
      getWebinarInfo();
    }
    getSpeakerAndWebsiteOptions();
    getCategoryAndIndustry();
  };

  const getSpeakerAndWebsiteOptions = async () => {
    const res = await WebinarService.getWebinarSpeakers("");
    if (validateGetRequest(res)) {
      const speakerOptions = res?.data?.[1]?.map((speaker) => {
        return {
          name: speaker,
          code: speaker,
        };
      });
      const websiteOptions = res?.data?.[2]?.map((websiteListItem) => {
        return {
          name: websiteListItem?.website,
          code: websiteListItem?.website,
        };
      });
      setSpeakerOptions(speakerOptions);
      setWebsiteOptions(websiteOptions);
    }
  };

  const getCategoryAndIndustry = async () => {
    try {
      const res = await CategoryService.getCategories("");
      const industryToCategoryMapping = {};
      const industryList = [];
      if (validateGetRequest(res)) {
        res?.data?.forEach((data) => {
          industryToCategoryMapping[`${data?.industry}`] =
            data?.categories ?? [];
          industryList.push({
            name: data?.industry ?? "",
            code: data?.industry ?? "",
          });
        });
        setIndustryToCategoryMap(industryToCategoryMapping);
        setIndustryOptions(industryList);
      } else {
        setIndustryOptions([]);
      }
    } catch (error) {
      setIndustryOptions([]);
      console.error(error);
    }
  };

  const getWebinarInfo = async () => {
    const res = await WebinarService.getWebinar(
      `${params?.webinarId ? `/${params?.webinarId}` : ""}`
    );

    if (validateGetRequest(res)) {
      const { data } = res;

      setWebinarInfo((prev) => ({
        ...prev,
        id: `${data?.id ?? ""}`,
        topic: data?.topic ?? "",
        url: data?.webinar_url ?? "",
        date: new Date(data?.date) ?? new Date(),
        speaker: data?.speaker ?? "",
        industry: data?.industry ?? "",
        category: data?.category ?? "",
        website: data?.website ?? "",
        duration: data?.duration ?? "",
        timezone: data?.timeZone ?? "",
        isSessionLive: data?.sessionLive ?? "",
        livePrice: data?.priceLive ?? "",
        urlLive: data?.urlLive ?? "",
        isSessionRecording: data?.sessionRecording ?? "",
        recordingPrice: data?.priceRecording ?? "",
        urlRecording: data?.urlRecording ?? "",
        isSessionDD: data?.sessionDigitalDownload ?? "",
        ddPrice: data?.priceDigitalDownload ?? "",
        urlDd: data?.urlDigitalDownload ?? "",
        isSessionTranscript: data?.sessionTranscript ?? "",
        transcriptPrice: data?.priceTranscript ?? "",
        urlTranscript: data?.urlTranscript ?? "",
        description: data?.description ?? "",
      }));
    }
  };

  /*------------------Event Handlers--------------------*/

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitBtnLoader(true);

    const payload = preparePayload();

    // //PUT
    if (payload.id) {
      try {
        const res = await WebinarService.updateWebinar(
          `/${payload.id}`,
          payload
        );

        if (validatePutRequest(res)) {
          setSubmitBtnLoader(false);
          setTimeout(() => {
            navigate(LINK_WEBINAR);
          }, 2000);
          toast.current.show({
            severity: "success",
            summary: "Updated",
            detail: "Webinar updated successfully",
            life: 2000,
          });
        }
      } catch (error) {
        setSubmitBtnLoader(false);
        console.error(error);
        toast.current.show({
          severity: "error",
          summary: "Unable to update",
          detail: "Try again",
          life: 2000,
        });
      }
    }

    // // POST
    else {
      try {
        const res = await WebinarService.createWebinar(
          "/create_webinar",
          payload
        );
        if (validatePostRequest(res)) {
          setSubmitBtnLoader(false);
          setTimeout(() => {
            navigate(LINK_WEBINAR);
          }, 2000);
          toast.current.show({
            severity: "success",
            summary: "Created",
            detail: "Webinar created successfully",
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
    }
  };

  const handleChange = (e) => {
    setWebinarInfo((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleChangeCheckbox = (e) => {
    setWebinarInfo((prev) => ({
      ...prev,
      [e.target.name]: e.target.checked,
    }));
  };

  const onChangeDate = (e) => {
    setWebinarInfo((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const onBack = () => {
    setPageIndex((prev) => prev - 1);
  };

  const onNext = () => {
    setPageIndex((prev) => prev + 1);
  };

  /*----------------------Helper Functions----------------- */

  const preparePayload = () => {
    const payloadObj = {
      topic: webinarInfo.topic,
      speaker: webinarInfo.speaker,
      industry: webinarInfo.industry,
      date: webinarInfo.date,
      time: webinarInfo.time,
      timeZone: webinarInfo.timezone,
      duration: webinarInfo.duration,
      category: webinarInfo.category,

      sessionLive: webinarInfo.isSessionLive,
      priceLive: webinarInfo.livePrice,
      urlLive: webinarInfo.urlLive,

      sessionRecording: webinarInfo.isSessionRecording,
      priceRecording: webinarInfo.recordingPrice,
      urlRecording: webinarInfo.urlRecording,

      sessionDigitalDownload: webinarInfo.isSessionDD,
      priceDigitalDownload: webinarInfo.ddPrice,
      urlDigitalDownload: webinarInfo.urlDd,

      sessionTranscript: webinarInfo.isSessionTranscript,
      priceTranscript: webinarInfo.transcriptPrice,
      urlTranscript: webinarInfo.urlTranscript,
      status: webinarInfo.status,
      webinar_url: webinarInfo.url,
      website: webinarInfo.website,
      description: webinarInfo.description,
    };

    if (webinarInfo.id) {
      payloadObj.id = webinarInfo.id;
    }

    return payloadObj;
  };

  /*--------------Sectional Renders------------------- */

  const renderFormTemplateWebinarBasic = () => {
    return (
      <React.Fragment>
        <div className="col-span-2">
          <Input
            id={"inputTopic"}
            name={"topic"}
            label={"Topic"}
            required={true}
            value={webinarInfo.topic}
            handler={handleChange}
          />
        </div>

        <div className="col-span-2">
          <Input
            id={"inputUrl"}
            name={"url"}
            label={"URL"}
            required={true}
            value={webinarInfo.url}
            handler={handleChange}
            disabled
          />
        </div>

        <div className="col-span-2">
          <div className="grid gap-2">
            <label>Speaker</label>
            <div className="app-dropdown">
              <Dropdown
                className="h-8"
                name="speaker"
                placeholder="Select speaker"
                options={speakerOptions}
                optionLabel="name"
                optionValue="code"
                value={webinarInfo.speaker}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className="col-span-2">
          <div className="grid gap-2">
            <label>Industry</label>
            <div className="app-dropdown">
              <Dropdown
                className="h-8"
                name="industry"
                placeholder="Select industry"
                options={industryOptions}
                optionLabel="name"
                optionValue="code"
                value={webinarInfo.industry}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className="col-span-2">
          <div className="grid gap-2">
            <label>Category</label>
            <div className="app-dropdown">
              <Dropdown
                className="h-8"
                name="category"
                placeholder="Select category"
                options={categoryOptions}
                optionLabel="name"
                optionValue="code"
                value={webinarInfo.category}
                onChange={handleChange}
                disabled={!webinarInfo.industry}
              />
            </div>
          </div>
        </div>

        <div className="col-span-2">
          <div className="grid gap-2">
            <label>Date & Time</label>
            <Calendar
              className="h-8 px-2 text-sm border border-primary-light-900 rounded-md"
              name="date"
              value={webinarInfo.date}
              onChange={onChangeDate}
              showTime
            />
          </div>
        </div>

        <div className="col-span-2">
          <Input
            id={"inputDuration"}
            name={"duration"}
            label={"Duration"}
            required={true}
            value={webinarInfo.duration}
            handler={handleChange}
          />
        </div>

        <div className="col-span-2">
          <div className="grid gap-2">
            <label>TimeZone</label>
            <div className="app-dropdown">
              <Dropdown
                className="h-8"
                name="timezone"
                placeholder="Select timezone"
                options={timezoneOptions}
                optionLabel="name"
                optionValue="code"
                value={webinarInfo.timezone}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  };

  const renderFormTemplateWebinarSession = () => {
    return (
      <React.Fragment>
        <div className="col-span-2 text-sm text-primary-pText">
          <div className="mb-3 flex justify-between">
            <label htmlFor="sessionLive">Session Live</label>
            <Checkbox
              id="sessionLive"
              name="isSessionLive"
              className="w-7 h-7 border-2 border-primary-light-900 rounded-md"
              checked={webinarInfo.isSessionLive}
              onChange={handleChangeCheckbox}
            />
          </div>

          <div>
            <Input
              id={"inputSessionLivePrice"}
              name={"livePrice"}
              label={"Price Live"}
              required={true}
              value={webinarInfo.livePrice}
              handler={handleChange}
            />
          </div>

          <div>
            <Input
              id={"inputSessionUrlLive"}
              name={"urlLive"}
              label={"URL Live"}
              required={true}
              value={webinarInfo.urlLive}
              handler={handleChange}
            />
          </div>
        </div>

        <div className="col-span-2 text-sm text-primary-pText">
          <div className="mb-3 flex justify-between">
            <label htmlFor="sessionRecording">Session Recording</label>
            <Checkbox
              id="sessionRecording"
              name="isSessionRecording"
              className="w-7 h-7 border-2 border-primary-light-900 rounded-md"
              checked={webinarInfo.isSessionRecording}
              onChange={handleChangeCheckbox}
            />
          </div>

          <div>
            <Input
              id={"inputSessionRecordingPrice"}
              name={"recordingPrice"}
              label={"Price Recorded"}
              required={true}
              value={webinarInfo.recordingPrice}
              handler={handleChange}
            />
          </div>

          <div>
            <Input
              id={"inputSessionUrlRecording"}
              name={"urlRecording"}
              label={"URL Recording"}
              required={true}
              value={webinarInfo.urlRecording}
              handler={handleChange}
            />
          </div>
        </div>

        <div className="col-span-2 text-sm text-primary-pText">
          <div className="mb-3 flex justify-between">
            <label htmlFor="sessionDD">Session DD</label>
            <Checkbox
              id="sessionDD"
              name="isSessionDD"
              className="w-7 h-7 border-2 border-primary-light-900 rounded-md"
              checked={webinarInfo.isSessionDD}
              onChange={handleChangeCheckbox}
            />
          </div>

          <div>
            <Input
              id={"inputSessionDDPrice"}
              name={"ddPrice"}
              label={"Price DD"}
              required={true}
              value={webinarInfo.ddPrice}
              handler={handleChange}
            />
          </div>

          <div>
            <Input
              id={"inputSessionUrlDD"}
              name={"urlDd"}
              label={"URL DD"}
              required={true}
              value={webinarInfo.urlDd}
              handler={handleChange}
            />
          </div>
        </div>

        <div className="col-span-2 text-sm text-primary-pText">
          <div className="mb-3 flex justify-between">
            <label htmlFor="sessionTranscript">Session Transcript</label>
            <Checkbox
              id="sessionTranscript"
              name="isSessionTranscript"
              className="w-7 h-7 border-2 border-primary-light-900 rounded-md"
              checked={webinarInfo.isSessionTranscript}
              onChange={handleChangeCheckbox}
            />
          </div>

          <div>
            <Input
              id={"inputSessionTranscriptPrice"}
              name={"transcriptPrice"}
              label={"Price Transcript"}
              required={true}
              value={webinarInfo.transcriptPrice}
              handler={handleChange}
            />
          </div>

          <div>
            <Input
              id={"inputSessionUrlTranscript"}
              name={"urlTranscript"}
              label={"URL Transcript"}
              required={true}
              value={webinarInfo.urlTranscript}
              handler={handleChange}
            />
          </div>
        </div>
      </React.Fragment>
    );
  };

  const renderFormTemplateWebinarDescription = () => {
    return (
      <React.Fragment>
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
                value={webinarInfo.website}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className="description-box col-span-3 grid gap-2">
          <div className="flex flex-col gap-2">
            <label>Description</label>
            <InputTextarea
              className="description-box min-h-52 max-h-40 p-2 border border-primary-light-900 text-primary-pText text-sm"
              name="description"
              value={webinarInfo.description}
              onChange={handleChange}
              maxLength={1000}
            />
            <small></small>
          </div>
        </div>
      </React.Fragment>
    );
  };

  return (
    <div>
      <div className="create-webinar-wrapper flex flex-col items-center gap-5">
        <div className="w-full flex items-center justify-between">
          <div className="font-bold text-primary-pLabel">
            {pageMode === PAGE_MODE.CREATE ? "Create Webinar" : "Edit Webinar"}
          </div>
        </div>

        <div className="w-full">
          <Section>
            <div>
              <form className="w-full flex flex-col gap-20" onSubmit={onSubmit}>
                <div className="min-h-[430px] grid grid-cols-4 gap-10">
                  {pageIndex === 1 && renderFormTemplateWebinarBasic()}
                  {pageIndex === 2 && renderFormTemplateWebinarSession()}
                  {pageIndex === 3 && renderFormTemplateWebinarDescription()}
                </div>

                <div className="self-center flex items-center gap-5">
                  <button
                    className="w-32 h-8 border-2 border-secondary-bg-silver rounded-full hover:bg-slate-50"
                    type="button"
                    onClick={() => navigate(LINK_WEBINAR)}
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    className={`w-24 h-8 px-2 py-1 bg-secondary-bg-btnExtraLight text-primary-pTextLight rounded-full  ${
                      pageIndex <= 1
                        ? "!bg-secondary-bg-lightGray !text-secondary-sText"
                        : ""
                    }`}
                    onClick={onBack}
                    disabled={pageIndex <= 1}
                  >
                    Back
                  </button>

                  <div className="font-bold text-primary-pLabel">
                    <span>{pageIndex} / 3</span>
                  </div>

                  <button
                    type="button"
                    className={`w-24 h-8 px-2 py-1 bg-secondary-bg-btnExtraLight text-primary-pTextLight rounded-full ${
                      pageIndex >= 3
                        ? "!bg-secondary-bg-lightGray !text-secondary-sText"
                        : ""
                    }`}
                    onClick={onNext}
                    disabled={pageIndex >= 3}
                  >
                    Next
                  </button>

                  {pageIndex === 3 && (
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
                  )}
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

export default PageCreateEditWebinar;
