import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Input from "../../components/Input";
import Section from "../../components/Section";
import WebsiteService from "../../services/WebsiteService";
import {
  validateGetRequest,
  validatePostRequest,
} from "../../utils/commonUtils";

const PageWebsiteConfig = () => {
  const [websiteOptions, setWebsiteOptions] = useState([]);
  const [webinarToWebsiteMap, setWebinarToWebsiteMap] = useState(null);
  const [selectedWebsite, setSelectedWebsite] = useState("");
  const [addedWebsite, setAddedWebsite] = useState("");
  const [webinarList, setWebinarList] = useState([]);
  const [showSelectWebsiteError, setShowSelectWebsiteError] = useState(false);
  const [showAddWebsiteFieldError, setShowAddWebsiteFieldError] =
    useState(false);
  const [showAddWebsiteTemplate, setShowAddWebsiteTemplate] = useState(false);
  const [submitBtnLoader, setSubmitBtnLoader] = useState(false);

  const toast = useRef(null);

  const onMount = useCallback(async () => {
    getWebsiteOptions();
  }, []);

  useEffect(() => {
    onMount();
  }, [onMount]);

  const getWebsiteOptions = async () => {
    try {
      const res = await WebsiteService.getWebsite("");
      const websiteToWebinarMap = {};
      const websiteList = [];
      if (validateGetRequest(res)) {
        res?.data?.forEach((data) => {
          websiteList.push({
            name: data?.website,
            code: data?.website,
          });
          websiteToWebinarMap[data?.website] = data?.webinar;
        });
        setWebsiteOptions(websiteList);
        setWebinarToWebsiteMap(websiteToWebinarMap);
      }
    } catch (error) {
      console.error(error);
    }
  };

  /*------------------------Event Handlers------------------------------*/

  const onAddWebsite = () => {
    setShowAddWebsiteTemplate(true);
  };

  const handleWebsiteDropdownChange = (e) => {
    setSelectedWebsite(e.target.value);
    setShowSelectWebsiteError(false);
    console.log(webinarToWebsiteMap[e.target.value]);
    setWebinarList(webinarToWebsiteMap[e.target.value]);
  };

  const handleAddWebsiteChange = (e) => {
    setAddedWebsite(e.target.value);
    setShowSelectWebsiteError(false);
    setShowAddWebsiteFieldError(false);
  };

  const onSubmit = async () => {
    if (!selectedWebsite) {
      setShowSelectWebsiteError(true);
      return;
    }
    if (!addedWebsite) {
      setShowAddWebsiteFieldError(true);
      return;
    }
    setSubmitBtnLoader(true);

    const payload = preparePayload();
    try {
      const res = await WebsiteService.addWebsite("", payload);
      if (validatePostRequest(res)) {
        setSubmitBtnLoader(false);
        setShowAddWebsiteTemplate(false);
        getWebsiteOptions();
        toast.current.show({
          severity: "success",
          summary: "Website ",
          detail: "Website added successfully",
          life: 2000,
        });
      }
    } catch (error) {
      setSubmitBtnLoader(false);
      console.error(error);
      toast.current.show({
        severity: "error",
        summary: "Unable to add website",
        detail: "Try again",
        life: 2000,
      });
    }
  };

  const onCancel = () => {
    setShowAddWebsiteTemplate(false);
    setShowSelectWebsiteError(false);
    setShowAddWebsiteFieldError(false);
  };

  /*-----------------------------Helper functions------------------------------ */

  const preparePayload = () => {
    const payloadData = {
      website: addedWebsite?.toUpperCase(),
    };

    return payloadData;
  };

  /*-----------------------------------Sectional Renders------------------------*/

  const renderAvailableWebinars = () => {
    return (
      <React.Fragment>
        <div>
          <ul className="p-6 flex flex-col justify-center gap-2 border border-primary-light-900 rounded-md list-none text-sm">
            {webinarList?.length ? (
              webinarList?.map((webinar, idx) => (
                <li key={idx} className="text-primary-bg-blue">
                  {webinar}
                </li>
              ))
            ) : (
              <li className="text-xs">No webinars for selected website.</li>
            )}
          </ul>
        </div>
      </React.Fragment>
    );
  };

  return (
    <div>
      <Section className={`min-h-[400px]`}>
        <div className="mb-5 flex items-center justify-between">
          <div className="font-bold text-primary-pLabel">
            <span>Websites</span>
          </div>
        </div>

        <div className="flex flex-wrap justify-between gap-20">
          <div className="flex flex-col items-start gap-5 text-primary-pText">
            <div className="w-[296px]">
              <div className="grid gap-2">
                <div className="app-dropdown">
                  <Dropdown
                    className="h-8"
                    name="selectedWebsite"
                    placeholder="Select website"
                    options={websiteOptions}
                    optionLabel="name"
                    optionValue="code"
                    value={selectedWebsite}
                    onChange={handleWebsiteDropdownChange}
                  />
                </div>
              </div>

              {showSelectWebsiteError ? (
                <div className="mt-2 text-primary-error-crimson text-xs">
                  <span>{"Please select the website"}</span>
                </div>
              ) : (
                <div className="mt-6" />
              )}
            </div>

            {selectedWebsite && renderAvailableWebinars(0)}
          </div>

          <div className="flex flex-col items-end gap-5 text-primary-pText">
            <div>
              <button
                className="w-32 h-6 py-3 flex items-center justify-center gap-2 bg-secondary-bg-btnExtraLight text-primary-pTextLight border border-primary-light-900 rounded-full"
                onClick={onAddWebsite}
              >
                <i className="pi pi-plus w-4 h-4"></i>
                <span className="text-sm">Add</span>
              </button>
            </div>

            {showAddWebsiteTemplate ? (
              <div className="flex flex-col items-center justify-center gap-3">
                <div className="w-[296px]">
                  <Input
                    className={`${
                      showAddWebsiteFieldError
                        ? "!border-primary-error-crimson"
                        : ""
                    }`}
                    label={"Website Name"}
                    value={addedWebsite}
                    handler={handleAddWebsiteChange}
                  />
                  {showAddWebsiteFieldError ? (
                    <small className="text-primary-error-crimson">
                      Mandatory
                    </small>
                  ) : (
                    <div className="mt-8"></div>
                  )}
                </div>

                <div className="self-center flex items-center gap-5">
                  <div className="flex items-center justify-center">
                    <button
                      className="w-32 h-8 border-2 border-secondary-bg-silver rounded-full hover:bg-slate-50"
                      type="button"
                      onClick={onCancel}
                    >
                      Cancel
                    </button>
                  </div>
                  <div className="flex items-center justify-center">
                    <button
                      type="button"
                      className="submit-btn w-32 h-8 flex items-center justify-center bg-secondary-bg-btnLight text-primary-pTextLight rounded-full hover:bg-primary-bg-base-dark"
                      onClick={onSubmit}
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
              </div>
            ) : null}
          </div>
        </div>
      </Section>

      <Toast
        ref={toast}
        className="app-toast text-sm text-primary-pText"
        position="bottom-right"
      />
    </div>
  );
};

export default PageWebsiteConfig;
