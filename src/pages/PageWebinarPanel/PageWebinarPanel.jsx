import { FilterMatchMode } from "primereact/api";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputSwitch } from "primereact/inputswitch";
import { InputText } from "primereact/inputtext";
import { ProgressSpinner } from "primereact/progressspinner";
import { Toast } from "primereact/toast";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ButtonCustom from "../../components/ButtonCustom";
import Section from "../../components/Section";
import { PAGE_MODE, statusEnum } from "../../constants/enums";
import { LINK_CREATE_WEBINAR, LINK_EDIT_WEBINAR } from "../../routes";
import WebinarService from "../../services/WebinarService";
import {
  validateDeleteRequest,
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
  const [isDeleteDialogVisible, setIsDeleteDialogVisible] = useState(false);

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

  const deleteWebinar = async () => {
    try {
      const res = await WebinarService.deleteWebinar(
        `${currentRowInfo?.id ? `/${currentRowInfo?.id}` : ""}`
      );
      if (validateDeleteRequest(res)) {
        getWebinarInfo();
        toast.current.show({
          severity: "success",
          summary: "Deleted",
          detail: "Webinar deleted successfully",
          life: 2000,
        });
      }
    } catch (error) {
      console.error(error);
      toast.current.show({
        severity: "error",
        summary: "Unable to delete",
        detail: "Try again",
        life: 2000,
      });
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

  const onDeleteWebinar = (e, rowData) => {
    setIsDeleteDialogVisible(true);
    setCurrentRowInfo(rowData);
  };

  const onAcceptDeleteWebinar = async () => {
    await deleteWebinar();
  };

  const hideStatusDialog = () => {
    setIsStatusDialogVisible(false);
  };
  const hideDeleteDialog = () => {
    setIsDeleteDialogVisible(false);
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
  const renderColTopic = (rowData) => {
    return <div className="pl-6 text-left">{rowData.topic}</div>;
  };
  const renderColSpeaker = (rowData) => {
    return <div className="text-left">{rowData.speaker}</div>;
  };
  const renderColCategory = (rowData) => {
    return <div className="text-left">{rowData.category}</div>;
  };
  const renderColIndustry = (rowData) => {
    return <div className="text-left">{rowData.industry}</div>;
  };
  const renderColSessionType = (rowData) => {
    return (
      <div className="px-6 text-left text-primary-pText underline">
        <button
          className="underline"
          onClick={(e) => onViewSession(e, rowData)}
        >
          View
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
            onDeleteWebinar(e, rowData);
          }}
        >
          <i className="pi pi-trash text-red-500 cursor-pointer"></i>
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
                  header="Session Type"
                  headerClassName="h-12 table-header"
                  body={renderColSessionType}
                />
                <Column
                  field="status"
                  header="Status"
                  headerClassName="h-12 table-header"
                  body={renderColStatus}
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
              <div className="grid grid-cols-4 gap-5 text-primary-pText">
                <div className="col-span-2">
                  <div className="flex flex-col gap-5">
                    <span>
                      {`Session Live : ${
                        currentSessionTypeInfo.sessionLive === true
                          ? "Yes"
                          : "No"
                      }`}
                    </span>
                    <span>Price Live : {currentSessionTypeInfo.priceLive}</span>
                    <span>URL Live : {currentSessionTypeInfo.urlLive}</span>
                  </div>
                </div>

                <div className="col-span-2">
                  <div className="flex flex-col gap-5">
                    <span>
                      {`Session Recording : ${
                        currentSessionTypeInfo.sessionRecording === true
                          ? "Yes"
                          : "No"
                      }`}
                    </span>
                    <span>
                      {`Price Recording : ${currentSessionTypeInfo.priceRecording}`}
                    </span>
                    <span>
                      {`URL Recording : ${currentSessionTypeInfo.urlRecording}`}
                    </span>
                  </div>
                </div>

                <div className="col-span-2">
                  <div className="flex flex-col gap-5">
                    <span>
                      {`Session DD : ${
                        currentSessionTypeInfo.sessionDigitalDownload === true
                          ? "Yes"
                          : "No"
                      }`}
                    </span>
                    <span>
                      {`Price DD : ${currentSessionTypeInfo.priceDigitalDownload}`}
                    </span>
                    <span>
                      {`URL DD : ${currentSessionTypeInfo.urlDigitalDownload}`}
                    </span>
                  </div>
                </div>

                <div className="col-span-2">
                  <div className="flex flex-col gap-5">
                    <span>
                      {`Session Transcript : ${
                        currentSessionTypeInfo.sessionTranscript === true
                          ? "Yes"
                          : "No"
                      }`}
                    </span>
                    <span>
                      {`Price Transcript : ${currentSessionTypeInfo.priceTranscript}`}
                    </span>
                    <span>
                      {`URL Transcript : ${currentSessionTypeInfo.urlTranscript}`}
                    </span>
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
            className="w-[278px] p-5 bg-primary-bg-section gap-5"
            visible={isDeleteDialogVisible}
            header={`Delete Webinar`}
            headerClassName="text-primary-pLabel text-[1rem]"
            onHide={hideDeleteDialog}
          >
            {currentRowInfo?.id ? (
              <div className="flex flex-col gap-5 text-xs text-primary-pText">
                <div className="flex gap-2 items-center">
                  <i className="text-[32px] pi pi-exclamation-triangle"></i>
                  <span>Do you want to delete this record?</span>
                </div>
                <div className="h-7 border-none font-bold text-right">
                  <ButtonCustom
                    containerClassName="!inline-block"
                    className="inline-flex font-bold items-center justify-center pop-up-btn-no"
                    label={"No"}
                    handleClick={hideDeleteDialog}
                  />

                  <ButtonCustom
                    containerClassName="!inline-block"
                    className="inline-flex font-bold items-center justify-center pop-up-btn-yes pop-up-btn-del"
                    label={"Yes"}
                    handleClickWithLoader={onAcceptDeleteWebinar}
                    callbackSuccess={hideDeleteDialog}
                  />
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
