import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Input from "../../components/Input";
import Section from "../../components/Section";
import CategoryService from "../../services/CategoryService";
import {
  validateGetRequest,
  validatePostRequest,
} from "../../utils/commonUtils";

const PageCreateCategory = () => {
  const [industryOptions, setIndustryOptions] = useState([]);
  const [listOfCategoriesToIndustryMap, setListOfCategoriesToIndustryMap] =
    useState({});
  const [categoryList, setCategoryList] = useState([]);
  const [industry, setIndustry] = useState("");
  const [category, setCategory] = useState("");
  const [showSelectIndustryError, setShowSelectIndustryError] = useState(false);
  const [showCategoryFieldError, setShowCategoryFieldError] = useState(false);
  const [showAddCategoryTemplate, setShowAddCategoryTemplate] = useState(false);
  const [submitBtnLoader, setSubmitBtnLoader] = useState(false);

  const toast = useRef(null);

  const onMount = useCallback(async () => {
    getIndustryOptions();
  }, []);

  useEffect(() => {
    onMount();
  }, [onMount]);

  useEffect(() => {
    if (industry && Object?.keys(listOfCategoriesToIndustryMap)?.length > 0)
      setCategoryList(listOfCategoriesToIndustryMap[industry]);
  }, [listOfCategoriesToIndustryMap, industry]);

  const getIndustryOptions = async () => {
    try {
      const res = await CategoryService.getCategories("");

      const categoryToIndustryMap = {};
      const industryList = [];

      if (validateGetRequest(res)) {
        res?.data?.forEach((data) => {
          industryList.push({
            name: data?.industry,
            code: data?.industry,
          });
          categoryToIndustryMap[data?.industry] = data?.categories ?? [];
        });
        setListOfCategoriesToIndustryMap(categoryToIndustryMap);
        setIndustryOptions(industryList);
      }
    } catch (error) {
      console.error(error);
    }
  };

  /*------------------------Event Handlers------------------------------*/

  const onAddCategory = () => {
    setShowAddCategoryTemplate(true);
  };

  const handleIndustryChange = (e) => {
    setIndustry(e.target.value);
    setShowSelectIndustryError(false);
  };

  const handleChange = (e) => {
    setCategory(e.target.value);
    setShowSelectIndustryError(false);
    setShowCategoryFieldError(false);
  };

  const onSubmit = async () => {
    if (!industry) {
      setShowSelectIndustryError(true);
      return;
    }
    if (!category) {
      setShowCategoryFieldError(true);
      return;
    }

    setSubmitBtnLoader(true);

    const payload = preparePayload();

    try {
      const res = await CategoryService.addCategory("", payload);

      if (validatePostRequest(res)) {
        setSubmitBtnLoader(false);
        setShowAddCategoryTemplate(false);
        toast.current.show({
          severity: "success",
          summary: "Category ",
          detail: "Category added successfully",
          life: 2000,
        });
        getIndustryOptions();
      }
    } catch (error) {
      setSubmitBtnLoader(false);
      console.error(error);
      toast.current.show({
        severity: "error",
        summary: "Unable to add category",
        detail: "Try again",
        life: 2000,
      });
    }
  };

  const onCancel = () => {
    setShowAddCategoryTemplate(false);
    setShowSelectIndustryError(false);
    setShowCategoryFieldError(false);
  };

  /*-----------------------------Helper functions------------------------------ */
  const preparePayload = () => {
    const payloadData = {
      industry: industry,
      category: category?.toUpperCase(),
    };

    return payloadData;
  };

  /*-----------------------------------Sectional Renders------------------------*/

  const renderAvailableCategories = () => {
    return (
      <React.Fragment>
        <div className="w-full">
          <div className="mb-5 font-bold text-primary-pLabel">Categories</div>

          <ul className="p-6 flex flex-col justify-center gap-2 border border-primary-light-900 rounded-md list-none text-sm">
            {categoryList?.length ? (
              categoryList?.map((category, idx) => (
                <li key={idx} className="text-primary-bg-blue">
                  {category}
                </li>
              ))
            ) : (
              <li className="text-xs">No categories for selected industry.</li>
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
            <span>Industries</span>
          </div>
        </div>

        <div className="flex flex-wrap justify-between gap-20">
          <div className="flex flex-col items-start gap-5 text-primary-pText">
            <div className="w-[296px]">
              <div className="grid gap-2">
                <div className="app-dropdown">
                  <Dropdown
                    className="h-8"
                    name="industry"
                    placeholder="Select industry"
                    options={industryOptions}
                    optionLabel="name"
                    optionValue="code"
                    value={industry}
                    onChange={handleIndustryChange}
                  />
                </div>
              </div>

              {showSelectIndustryError ? (
                <div className="mt-2 text-primary-error-crimson text-xs">
                  <span>{"Please select the industry"}</span>
                </div>
              ) : (
                <div className="mt-6" />
              )}
            </div>

            {industry && renderAvailableCategories(0)}
          </div>

          <div className="flex flex-col items-end gap-5 text-primary-pText">
            <div>
              <button
                className={`max-w-fit h-6 py-3 px-4 flex items-center justify-center gap-2 bg-secondary-bg-btnExtraLight text-primary-pTextLight border border-primary-light-900 rounded-full ${
                  !industry ? "!bg-disabled !text-secondary-sText" : ""
                }`}
                onClick={onAddCategory}
                disabled={!industry}
              >
                <i className="pi pi-plus w-4 h-4"></i>
                <span className="text-sm">Add Category</span>
              </button>
            </div>

            {showAddCategoryTemplate ? (
              <div className="flex flex-col items-center justify-center gap-3">
                <div className="w-[296px]">
                  <Input
                    className={`${
                      showCategoryFieldError
                        ? "!border-primary-error-crimson"
                        : ""
                    }`}
                    label={"Category Name"}
                    value={category}
                    handler={handleChange}
                  />
                  {showCategoryFieldError ? (
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

export default PageCreateCategory;
