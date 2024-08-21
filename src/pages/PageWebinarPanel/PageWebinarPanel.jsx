import { FilterMatchMode } from "primereact/api";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputSwitch } from "primereact/inputswitch";
import { InputText } from "primereact/inputtext";
import { ProgressSpinner } from "primereact/progressspinner";
import { Toast } from "primereact/toast";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ButtonCustom from "../../components/ButtonCustom";
import IndicatorCustom from "../../components/IndicatorCustom";
import Section from "../../components/Section";
import {
  PAGE_MODE,
  statusEnum,
  WEBINAR_STATUS_INDICATOR,
} from "../../constants/enums";
import { LINK_CREATE_WEBINAR, LINK_EDIT_WEBINAR } from "../../routes";
import WebinarService from "../../services/WebinarService";
import {
  ddmmyy,
  getInitialLetterUpperCase,
  validateGetRequest,
  validatePostRequest,
} from "../../utils/commonUtils";

const PageWebinarPanel = () => {
  const navigate = useNavigate();

  const [tableData, setTableData] = useState([]);
  const [isTableDataLoading, setIsTableDataLoading] = useState(true);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    topic: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    speaker: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    category: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    industry: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    date: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    sessionType: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    status: { value: null, matchMode: FilterMatchMode.EQUALS },
  });
  const [viewSessionVisibility, setViewSessionVisibility] = useState(false);
  const [currentSessionTypeInfo, setCurrentSessionTypeInfo] = useState(null);

  const [currentRowInfo, setCurrentRowInfo] = useState(null);
  const [isStatusDialogVisible, setIsStatusDialogVisible] = useState(false);
  const [isWebinarPreviewVisible, setIsWebinarPreviewVisible] = useState(false);

  const toast = useRef(null);

  const globalFilterFieldsStructure = [
    "topic",
    "speaker",
    "category",
    "industry",
    "date",
    "sessionType",
    "status",
  ];

  const onMount = useCallback(async () => {
    getWebinarInfo();
  }, []);

  useEffect(() => {
    onMount();
  }, [onMount]);

  useEffect(() => {
    if (currentSessionTypeInfo && currentSessionTypeInfo.id) {
      setViewSessionVisibility(true);
    }
  }, [currentSessionTypeInfo]);

  const getWebinarInfo = async () => {
    setIsTableDataLoading(true);

    try {
      const res = await WebinarService.getWebinar("");

      if (validateGetRequest(res)) {
        const webinars = res?.data?.[0] ?? [];
        if (Array.isArray(webinars) && webinars.length > 0)
          setTableData(webinars);
        else setTableData([]);
        setIsTableDataLoading(false);
      }
    } catch (error) {
      setTableData([]);
      setIsTableDataLoading(false);
      console.error(error);
    }
  };

  const updateStatusOfWebinar = async () => {
    try {
      const payload = { status: currentRowInfo?.status };
      if (payload.status === statusEnum.inactive) {
        payload.status = statusEnum.active;
      } else if (payload.status === statusEnum.active) {
        payload.status = statusEnum.inactive;
      }
      const res = await WebinarService.updateWebinarStatus(
        `${currentRowInfo?.id ? `/${currentRowInfo?.id}` : ""}`,
        payload
      );

      if (validatePostRequest(res)) {
        getWebinarInfo();
      }
    } catch (error) {
      console.error(error);
    }
  };

  /*----------------- Event Handlers --------------------------*/

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };
    _filters["global"].value = value;
    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const onViewSession = (e, rowData) => {
    setCurrentSessionTypeInfo(rowData);
  };

  const onStatusToggle = (e, rowData) => {
    setIsStatusDialogVisible(true);
    setCurrentRowInfo(rowData);
  };

  const onEditWebinar = (rowData) => {
    navigate(`${LINK_EDIT_WEBINAR}/${rowData.id}?mode=${PAGE_MODE.EDIT}`);
  };

  const onAcceptStatusToggle = async () => {
    await updateStatusOfWebinar();
  };

  const onWebinarPreview = (e, rowData) => {
    setIsWebinarPreviewVisible(true);
    setCurrentRowInfo(rowData);
  };

  const hideStatusDialog = () => {
    setIsStatusDialogVisible(false);
  };
  const hideWebinarPreviewDialog = () => {
    setIsWebinarPreviewVisible(false);
  };

  /* table col body jsx */
  const renderHeader = () => {
    return (
      <div className="flex justify-content-end">
        <IconField iconPosition="left">
          <InputIcon className="pi pi-search" />
          <InputText
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder="Search Webinar"
          />
        </IconField>
      </div>
    );
  };
  const renderColWebinarLiveOrNot = (rowData) => {
    return (
      <div className="pl-6 text-left">
        <IndicatorCustom
          variant={
            rowData?.sessionLive
              ? WEBINAR_STATUS_INDICATOR.LIVE
              : WEBINAR_STATUS_INDICATOR.NOT_LIVE
          }
        />
      </div>
    );
  };
  const renderColTopic = (rowData) => {
    return (
      <div
        className="w-72 pl-6 text-left overflow-hidden text-ellipsis"
        title={rowData?.topic}
      >
        {rowData?.topic}
      </div>
    );
  };
  const renderColSpeaker = (rowData) => {
    return (
      <div
        className="w-40 pr-2 text-left overflow-hidden text-ellipsis"
        title={getInitialLetterUpperCase(rowData?.speaker)}
      >
        {getInitialLetterUpperCase(rowData?.speaker)}
      </div>
    );
  };
  const renderColCategory = (rowData) => {
    return (
      <div
        className="w-40 pr-2 text-left overflow-hidden text-ellipsis"
        title={getInitialLetterUpperCase(rowData?.category)}
      >
        {getInitialLetterUpperCase(rowData?.category) ?? "-"}
      </div>
    );
  };
  const renderColIndustry = (rowData) => {
    return (
      <div
        className="w-40 text-left overflow-hidden text-ellipsis"
        title={getInitialLetterUpperCase(rowData?.industry)}
      >
        {getInitialLetterUpperCase(rowData?.industry)}
      </div>
    );
  };
  const renderColSessionType = (rowData) => {
    return (
      <div className="w-16 flex justify-center items-center">
        <button onClick={(e) => onViewSession(e, rowData)}>
          <span className="underline text-primary-bg-blue">View</span>
        </button>
      </div>
    );
  };
  const renderColDate = (rowData) => {
    return (
      <div className="text-left">
        {new Date(rowData?.date).toLocaleDateString()}
      </div>
    );
  };

  const renderStatusFilter = (options) => {
    return (
      <Dropdown
        className="p-column-filter p-[2px] text-sm"
        placeholder="Filter"
        style={{ minWidth: "64px" }}
        itemTemplate={(option) => <div className="px-1 text-xs">{option}</div>}
        options={[statusEnum.active, statusEnum.inactive]}
        onChange={(e) => {
          options.filterApplyCallback(e.value);
        }}
        value={options.value}
      />
    );
  };

  const renderColStatus = (rowData) => {
    return (
      <div className="w-10 h-4 status-switch">
        <InputSwitch
          className="w-full h-full"
          checked={
            rowData.status === statusEnum.active
              ? true
              : rowData.status === statusEnum.inactive
              ? false
              : null
          }
          onChange={(e) => onStatusToggle(e, rowData)}
        />
      </div>
    );
  };
  const renderColAction = (rowData) => {
    return (
      <div className="pr-5 flex gap-6 justify-end items-center">
        <button onClick={() => onEditWebinar(rowData)}>
          <i className="pi pi-pencil text-blue-900 cursor-pointer"></i>
        </button>
        <button
          onClick={(e) => {
            onWebinarPreview(e, rowData);
          }}
        >
          {/* <i className="pi pi-trash text-red-500 cursor-pointer"></i> */}
          <i className="pi pi-eye cursor-pointer"></i>
        </button>
      </div>
    );
  };

  return (
    <div>
      <div className="flex flex-col items-center gap-5 text-primary-pText">
        <div className="w-full flex items-center justify-between">
          <div className="font-bold text-primary-pLabel">Webinars</div>
          <div>
            <Link
              to={`${LINK_CREATE_WEBINAR}?mode=${PAGE_MODE.CREATE}`}
              className="text-blue-900"
            >
              Create Webinar
            </Link>
          </div>
        </div>
        <Section>
          {isTableDataLoading ? (
            <div className="flex items-center justify-center h-screen">
              <ProgressSpinner
                aria-label="Loading"
                style={{ width: "50px", height: "50px" }}
                strokeWidth="5"
                fill="var(--surface-ground)"
                animationDuration=".5s"
              />
            </div>
          ) : (
            <div className="app-table">
              <DataTable
                value={tableData}
                dataKey="id"
                tableStyle={{ minWidth: "50rem" }}
                header={renderHeader()}
                stripedRows
                paginator
                rows={10}
                rowsPerPageOptions={[10, 20, 30, 40, 50]}
                removableSort
                filters={filters}
                filterDisplay="row"
                globalFilterFields={globalFilterFieldsStructure}
                emptyMessage="No webinars found."
                // paginatorTemplate="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink RowsPerPageDropdown"
                // currentPageReportTemplate="{first} to {last} of {totalRecords}"
              >
                <Column
                  field=""
                  header=""
                  headerClassName="h-12 table-header table-header-left"
                  body={renderColWebinarLiveOrNot}
                />
                <Column
                  field="topic"
                  header="Topic"
                  headerClassName="h-12 table-header table-header-left"
                  body={renderColTopic}
                />
                <Column
                  field="speaker"
                  header="Speaker"
                  headerClassName="h-12 table-header"
                  body={renderColSpeaker}
                />
                <Column
                  field="category"
                  header="Category"
                  headerClassName="h-12 table-header"
                  body={renderColCategory}
                />
                <Column
                  field="industry"
                  header="Industry"
                  headerClassName="h-12 table-header"
                  body={renderColIndustry}
                />
                <Column
                  field="date"
                  header="Date"
                  sortable
                  headerClassName=""
                  body={renderColDate}
                />
                <Column
                  field="sessionType"
                  header="Session"
                  headerClassName="h-12 table-header"
                  body={renderColSessionType}
                />
                <Column
                  field="status"
                  header="Status"
                  headerClassName="h-12 table-header !max-w-[64px]"
                  body={renderColStatus}
                  filter
                  filterMenuStyle={{ width: "64px" }}
                  showFilterMenu={false}
                  style={{ minWidth: "64px", padding: "4px" }}
                  filterElement={renderStatusFilter}
                />
                <Column
                  header="Action"
                  headerClassName="h-12 table-header table-header-right"
                  body={renderColAction}
                />
              </DataTable>
            </div>
          )}

          <Dialog
            className="session-type-dialog p-5 bg-primary-bg-section gap-5"
            header="Session Type Details"
            headerClassName="text-primary-pLabel"
            visible={viewSessionVisibility}
            style={{ width: "50vw" }}
            onHide={() => setViewSessionVisibility(false)}
          >
            {currentSessionTypeInfo && currentSessionTypeInfo.id ? (
              <div className="grid grid-cols-8 gap-5 text-primary-pText">
                <div className="col-span-8">
                  <div className="w-full flex items-center justify-between">
                    <div className="text-primary-pLabel font-bold">
                      Session Live :
                      <span className="px-1 font-normal">
                        {currentSessionTypeInfo?.sessionLive === true
                          ? "Yes"
                          : "No"}
                      </span>
                    </div>

                    <div className="text-primary-pLabel font-bold">
                      Price Live ($) :
                      <span className="px-1 font-normal">
                        {currentSessionTypeInfo?.priceLive}
                      </span>
                    </div>
                  </div>

                  <div className="w-full text-primary-pLabel font-bold">
                    URL Live :
                    <a
                      className="px-1 font-normal text-primary-bg-blue"
                      href={currentSessionTypeInfo?.urlLive}
                      target="_blank"
                    >
                      {currentSessionTypeInfo?.urlLive}
                    </a>
                  </div>
                </div>

                <div className="col-span-8">
                  <div className="w-full flex items-center justify-between">
                    <div className="text-primary-pLabel font-bold">
                      Session Recording :
                      <span className="px-1 font-normal">
                        {currentSessionTypeInfo?.sessionRecording === true
                          ? "Yes"
                          : "No"}
                      </span>
                    </div>

                    <div className="text-primary-pLabel font-bold">
                      Price Recording ($) :
                      <span className="px-1 font-normal">
                        {currentSessionTypeInfo?.priceRecording}
                      </span>
                    </div>
                  </div>

                  <div className="w-full text-primary-pLabel font-bold">
                    URL Recording :
                    <a
                      className="px-1 font-normal text-primary-bg-blue"
                      href={currentSessionTypeInfo?.urlRecording}
                      target="_blank"
                    >
                      {currentSessionTypeInfo?.urlRecording}
                    </a>
                  </div>
                </div>

                <div className="col-span-8">
                  <div className="w-full flex items-center justify-between">
                    <div className="text-primary-pLabel font-bold">
                      Session Recording :
                      <span className="px-1 font-normal">
                        {currentSessionTypeInfo?.sessionRecording === true
                          ? "Yes"
                          : "No"}
                      </span>
                    </div>

                    <div className="text-primary-pLabel font-bold">
                      Price Recording ($) :
                      <span className="px-1 font-normal">
                        {currentSessionTypeInfo?.priceRecording}
                      </span>
                    </div>
                  </div>

                  <div className="w-full text-primary-pLabel font-bold">
                    URL Recording :
                    <a
                      className="px-1 font-normal text-primary-bg-blue"
                      href={currentSessionTypeInfo?.urlRecording}
                      target="_blank"
                    >
                      {currentSessionTypeInfo?.urlRecording}
                    </a>
                  </div>
                </div>

                <div className="col-span-8">
                  <div className="w-full flex items-center justify-between">
                    <div className="text-primary-pLabel font-bold">
                      Session Transcript :
                      <span className="px-1 font-normal">
                        {currentSessionTypeInfo?.sessionTranscript === true
                          ? "Yes"
                          : "No"}
                      </span>
                    </div>

                    <div className="text-primary-pLabel font-bold">
                      Price Transcript ($) :
                      <span className="px-1 font-normal">
                        {currentSessionTypeInfo?.priceTranscript}
                      </span>
                    </div>
                  </div>

                  <div className="w-full text-primary-pLabel font-bold">
                    URL Transcript :
                    <a
                      className="px-1 font-normal text-primary-bg-blue"
                      href={currentSessionTypeInfo?.urlTranscript}
                      target="_blank"
                    >
                      {currentSessionTypeInfo?.urlTranscript}
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center">No session information found.</div>
            )}
          </Dialog>

          <Dialog
            className="w-[278px] p-5 bg-primary-bg-section gap-5"
            visible={isStatusDialogVisible}
            header={`Webinar Status`}
            headerClassName="text-primary-pLabel text-[1rem]"
            onHide={hideStatusDialog}
          >
            {currentRowInfo?.id ? (
              <div className="flex flex-col gap-5 text-xs text-primary-pText">
                <div className="flex gap-2 items-center">
                  <i className="text-[32px] pi pi-info-circle"></i>
                  <span>{`Do you want to make this webinar ${
                    currentRowInfo?.status === statusEnum.active
                      ? "Inactive"
                      : "Active"
                  }?`}</span>
                </div>
                <div className="h-7 border-none font-bold text-right">
                  <ButtonCustom
                    containerClassName="!inline-block"
                    className="inline-flex font-bold items-center justify-center pop-up-btn-no"
                    label={"No"}
                    handleClick={hideStatusDialog}
                  />

                  <ButtonCustom
                    containerClassName="!inline-block"
                    className="inline-flex font-bold items-center justify-center pop-up-btn-yes pop-up-btn-accept"
                    label={"Yes"}
                    handleClickWithLoader={onAcceptStatusToggle}
                    callbackSuccess={hideStatusDialog}
                  />
                </div>
              </div>
            ) : null}
          </Dialog>

          <Dialog
            className="w-[60%] max-h-[540px] p-5 bg-primary-bg-section gap-5"
            visible={isWebinarPreviewVisible}
            header={`Webinar Details`}
            headerClassName="text-primary-pLabel text-[1rem]"
            onHide={hideWebinarPreviewDialog}
          >
            {currentRowInfo?.id ? (
              <div className="p-2 grid grid-cols-8 gap-5 text-primary-pText">
                <div className="col-span-8">
                  <div className="text-primary-pLabel font-bold">
                    <span>Topic</span>
                  </div>
                  <div>
                    <span>{currentRowInfo?.topic ?? "-"}</span>
                  </div>
                </div>

                <div className="col-span-4">
                  <div className="text-primary-pLabel font-bold">
                    <span>Duration</span>
                  </div>
                  <div>
                    <span>{currentRowInfo?.duration ?? "0"} minutes</span>
                  </div>
                </div>

                <div className="col-span-4">
                  <div className="text-primary-pLabel font-bold">
                    <span>Date</span>
                  </div>
                  <div>
                    <span>{ddmmyy(currentRowInfo?.date) ?? "-"}</span>
                  </div>
                </div>

                <div className="col-span-4">
                  <div className="text-primary-pLabel font-bold">
                    <span>Time</span>
                  </div>
                  <div>
                    <span>{currentRowInfo?.time ?? "-"}</span>
                  </div>
                </div>

                <div className="col-span-4">
                  <div className="text-primary-pLabel font-bold">
                    <span>Timezone</span>
                  </div>
                  <div>
                    <span>{currentRowInfo?.timeZone ?? "-"}</span>
                  </div>
                </div>

                <div className="col-span-4">
                  <div className="text-primary-pLabel font-bold">
                    <span>Webinar Status</span>
                  </div>
                  <div>
                    <span>
                      {getInitialLetterUpperCase(currentRowInfo?.status) ?? "-"}
                    </span>
                  </div>
                </div>

                <div className="col-span-4">
                  <div className="text-primary-pLabel font-bold">
                    <span>Industry</span>
                  </div>
                  <div>
                    <span>
                      {getInitialLetterUpperCase(currentRowInfo?.industry) ??
                        "-"}
                    </span>
                  </div>
                </div>

                <div className="col-span-4">
                  <div className="text-primary-pLabel font-bold">
                    <span>Category</span>
                  </div>
                  <div>
                    <span>
                      {getInitialLetterUpperCase(currentRowInfo?.category) ??
                        "-"}
                    </span>
                  </div>
                </div>

                <div className="col-span-4">
                  <div className="text-primary-pLabel font-bold">
                    <span>Speaker</span>
                  </div>
                  <div>
                    <span>
                      {getInitialLetterUpperCase(currentRowInfo?.speaker) ??
                        "-"}
                    </span>
                  </div>
                </div>

                <div className="col-span-8">
                  <div className="w-full flex items-center justify-between">
                    <div className="text-primary-pLabel font-bold">
                      Session Live :
                      <span className="px-1 font-normal">
                        {currentRowInfo?.sessionLive === true ? "Yes" : "No"}
                      </span>
                    </div>

                    <div className="text-primary-pLabel font-bold">
                      Price Live ($) :
                      <span className="px-1 font-normal">
                        {currentRowInfo?.priceLive}
                      </span>
                    </div>
                  </div>

                  <div className="w-full text-primary-pLabel font-bold">
                    URL Live :
                    <a
                      className="px-1 font-normal text-primary-bg-blue"
                      href={currentRowInfo?.urlLive}
                      target="_blank"
                    >
                      {currentRowInfo?.urlLive}
                    </a>
                  </div>
                </div>

                <div className="col-span-8">
                  <div className="w-full flex items-center justify-between">
                    <div className="text-primary-pLabel font-bold">
                      Session Recording :
                      <span className="px-1 font-normal">
                        {currentRowInfo?.sessionRecording === true
                          ? "Yes"
                          : "No"}
                      </span>
                    </div>

                    <div className="text-primary-pLabel font-bold">
                      Price Recording ($) :
                      <span className="px-1 font-normal">
                        {currentRowInfo?.priceRecording}
                      </span>
                    </div>
                  </div>

                  <div className="w-full text-primary-pLabel font-bold">
                    URL Recording :
                    <a
                      className="px-1 font-normal text-primary-bg-blue"
                      href={currentRowInfo?.urlRecording}
                      target="_blank"
                    >
                      {currentRowInfo?.urlRecording}
                    </a>
                  </div>
                </div>

                <div className="col-span-8">
                  <div className="w-full flex items-center justify-between">
                    <div className="text-primary-pLabel font-bold">
                      Session DD :
                      <span className="px-1 font-normal">
                        {currentRowInfo?.sessionDigitalDownload === true
                          ? "Yes"
                          : "No"}
                      </span>
                    </div>

                    <div className="text-primary-pLabel font-bold">
                      Price DD ($) :
                      <span className="px-1 font-normal">
                        {currentRowInfo?.priceDigitalDownload}
                      </span>
                    </div>
                  </div>

                  <div className="w-full text-primary-pLabel font-bold">
                    URL DD :
                    <a
                      className="px-1 font-normal text-primary-bg-blue"
                      href={currentRowInfo?.urlDigitalDownload}
                      target="_blank"
                    >
                      {currentRowInfo?.urlDigitalDownload}
                    </a>
                  </div>
                </div>

                <div className="col-span-8">
                  <div className="w-full flex items-center justify-between">
                    <div className="text-primary-pLabel font-bold">
                      Session Transcript :
                      <span className="px-1 font-normal">
                        {currentRowInfo?.sessionTranscript === true
                          ? "Yes"
                          : "No"}
                      </span>
                    </div>

                    <div className="text-primary-pLabel font-bold">
                      Price Transcript ($) :
                      <span className="px-1 font-normal">
                        {currentRowInfo?.priceTranscript}
                      </span>
                    </div>
                  </div>

                  <div className="w-full text-primary-pLabel font-bold">
                    URL Transcript :
                    <a
                      className="px-1 font-normal text-primary-bg-blue"
                      href={currentRowInfo?.urlTranscript}
                      target="_blank"
                    >
                      {currentRowInfo?.urlTranscript}
                    </a>
                  </div>
                </div>

                <div className="col-span-8">
                  <div className="text-primary-pLabel font-bold">
                    <span>Description</span>
                  </div>
                  <div>
                    <span>{currentRowInfo?.description ?? "-"}</span>
                  </div>
                </div>
              </div>
            ) : null}
          </Dialog>

          <Toast
            ref={toast}
            className="app-toast text-sm text-primary-pText"
            position="bottom-right"
          />
        </Section>
      </div>
    </div>
  );
};

export default PageWebinarPanel;
