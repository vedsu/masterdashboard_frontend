import { Dropdown } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";
import { Toast } from "primereact/toast";
import React, { useEffect, useRef, useState } from "react";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Input from "../../components/Input";
import ProfilePicture from "../../components/ProfilePicture";
import Section from "../../components/Section";
import { PAGE_MODE } from "../../constants/enums";
import { LINK_SPEAKER } from "../../routes";
import CategoryService from "../../services/CategoryService";
import SpeakerService from "../../services/SpeakerService";
import {
  validateGetRequest,
  validatePostRequest,
  validatePutRequest,
} from "../../utils/commonUtils";

const initialSpeakerInfo = {
  id: null,
  name: "",
  email: "",
  contact: "",
  imageInfo: null,
  industry: "",
  speakerBio: "",
  status: "",
  history: [],
};

const PageCreateSpeaker = () => {
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [speakerInfo, setSpeakerInfo] = useState(initialSpeakerInfo);
  const [industryOptions, setIndustryOptions] = useState([]);
  const [submitBtnLoader, setSubmitBtnLoader] = useState(false);
  const pageMode = location.search.includes(PAGE_MODE.EDIT)
    ? PAGE_MODE.EDIT
    : PAGE_MODE.CREATE;

  const toast = useRef(null);
  const phnInputRef = useRef(null);

  useEffect(() => {
    onMount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onMount = async () => {
    if (pageMode === PAGE_MODE.EDIT) {
      getSpeakerInfo();
    }
    getIndustryOptions();
  };

  const getSpeakerInfo = async () => {
    try {
      const res = await SpeakerService.getSpeaker(
        `${params?.speakerId ? `/${params?.speakerId}` : ""}`
      );
      if (validateGetRequest(res)) {
        const { data } = res;
        setSpeakerInfo((prev) => ({
          ...prev,
          id: `${data?.id ?? null}`,
          name: data?.name,
          email: data?.email,
          contact: data?.contact,
          imageInfo: data?.photo,
          industry: data?.industry,
          speakerBio: data?.bio,
          history: data?.history ?? [],
          status: data?.status,
        }));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getIndustryOptions = async () => {
    try {
      const res = await CategoryService.getCategories("");

      if (validateGetRequest(res)) {
        const industryList = res?.data?.map((data) => {
          return {
            name: data?.industry ?? "",
            code: data?.industry ?? "",
          };
        });
        setIndustryOptions(industryList);
      } else {
        setIndustryOptions([]);
      }
    } catch (error) {
      setIndustryOptions([]);
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

    // //PUT
    if (payload.id) {
      try {
        const res = await SpeakerService.updateSpeaker(
          `/${payload.id}`,
          formData
        );

        if (validatePutRequest(res)) {
          setSubmitBtnLoader(false);
          setTimeout(() => {
            navigate(LINK_SPEAKER);
          }, 2000);
          toast.current.show({
            severity: "success",
            summary: "Updated",
            detail: "Speaker updated successfully",
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
        const res = await SpeakerService.createSpeaker(
          "/create_speaker",
          formData
        );

        if (validatePostRequest(res)) {
          setSubmitBtnLoader(false);
          setTimeout(() => {
            navigate(LINK_SPEAKER);
          }, 2000);
          toast.current.show({
            severity: "success",
            summary: "Created",
            detail: "Speaker created successfully",
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
    setSpeakerInfo((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  /*----------------------Helper Functions----------------- */
  const preparePayload = () => {
    const payloadObj = {
      name: speakerInfo.name,
      email: speakerInfo.email,
      industry: speakerInfo.industry,
      contact: speakerInfo.contact,
      bio: speakerInfo.speakerBio,
      photo: speakerInfo.imageInfo,
    };
    if (speakerInfo.id) {
      payloadObj.id = speakerInfo.id;
    }
    if (speakerInfo.status) {
      payloadObj.status = speakerInfo.status;
    }
    return payloadObj;
  };

  /*-------------------------Sectional Renders--------------------------------*/

  const renderSpeakerForm = () => {
    return (
      <React.Fragment>
        <div className="col-span-2">
          <div className="w-56 min-h-[370px]">
            <ProfilePicture
              source={speakerInfo.imageInfo}
              getFile={(file) => {
                setSpeakerInfo((prev) => ({ ...prev, imageInfo: file }));
              }}
            />
          </div>
        </div>

        <div className="col-span-2" />

        <div className="col-span-2">
          <Input
            id={"inputName"}
            name={"name"}
            label={"Name*"}
            placeholder={"Enter name"}
            required={true}
            value={speakerInfo.name}
            handler={handleChange}
          />
        </div>

        <div className="col-span-2">
          <Input
            id={"inputEmail"}
            name={"email"}
            type={"email"}
            label={"Email*"}
            placeholder={"Enter email"}
            required={true}
            value={speakerInfo.email}
            handler={handleChange}
          />
        </div>

        <div className="col-span-2">
          <div className="grid gap-2">
            <label>Contact*</label>
            <PhoneInput
              ref={phnInputRef}
              className="app-phn-input gap-2 text-sm rounded-md"
              name={"contact"}
              country
              defaultCountry="US"
              placeholder="Enter phone number"
              value={speakerInfo.contact}
              // onCountryChange={(country) => {
              //   console.log(country);
              // }}
              onChange={(val) => {
                setSpeakerInfo((prev) => ({ ...prev, contact: val ?? "" }));
              }}
            />
          </div>
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
                value={speakerInfo.industry}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className="speaker-bio-box col-span-3 grid gap-2">
          <label>Speaker Bio*</label>
          <InputTextarea
            className="speaker-bio-box min-h-[720px] p-2 border border-primary-light-900 text-primary-pText text-sm"
            name="speakerBio"
            placeholder="Enter bio"
            value={speakerInfo.speakerBio}
            onChange={handleChange}
          />
          <small></small>
        </div>

        <div className="speaker-bio-box col-span-3 grid gap-2">
          <label>History</label>
          <div className="content-disabled border border-primary-light-900 min-h-40 max-h-[400px] overflow-y-auto">
            <ul className="p-5 list-none flex flex-col gap-2">
              {speakerInfo.history.map((item, idx) => (
                <li key={idx + 1}>{item}</li>
              ))}
            </ul>
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
                navigate(LINK_SPEAKER);
              }}
            >
              <i className="pi pi-arrow-left"></i>
            </button>
            <span>
              {pageMode === PAGE_MODE.CREATE
                ? "Create Speaker"
                : "Edit Speaker"}
            </span>
          </div>
        </div>

        <div className="w-full">
          <Section>
            <div>
              <form className="w-full flex flex-col gap-20" onSubmit={onSubmit}>
                <div className="grid grid-cols-4 gap-10">
                  {renderSpeakerForm()}
                </div>

                <div className="self-center flex items-center gap-5">
                  <div className="flex items-center justify-center">
                    <button
                      className="w-32 h-8 border-2 border-secondary-bg-silver rounded-full hover:bg-slate-50"
                      type="button"
                      onClick={() => navigate(LINK_SPEAKER)}
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

export default PageCreateSpeaker;
