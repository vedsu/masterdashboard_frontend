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
import Section from "../../components/Section";
import { PAGE_MODE, statusEnum } from "../../constants/enums";
import { LINK_CREATE_SPEAKER, LINK_EDIT_SPEAKER } from "../../routes";
import SpeakerService from "../../services/SpeakerService";
import {
  getInitialLetterUpperCase,
  validateGetRequest,
  validatePostRequest,
} from "../../utils/commonUtils";

const PageSpeakerPanel = () => {
  const navigate = useNavigate();

  const [tableData, setTableData] = useState([]);
  const [isTableDataLoading, setIsTableDataLoading] = useState(true);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    email: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    contact: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    industry: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    status: { value: null, matchMode: FilterMatchMode.EQUALS },
  });

  const [currentRowInfo, setCurrentRowInfo] = useState(null);

  const [isStatusDialogVisible, setIsStatusDialogVisible] = useState(false);
  const [isSpeakerPreviewVisible, setIsSpeakerPreviewVisible] = useState(false);

  const toast = useRef(null);

  const globalFilterFieldsStructure = [
    "name",
    "email",
    "contact",
    "industry",
    "status",
  ];

  const onMount = useCallback(async () => {
    getSpeakerInfo();
  }, []);

  useEffect(() => {
    onMount();
  }, [onMount]);

  const getSpeakerInfo = async () => {
    setIsTableDataLoading(true);

    try {
      const res = await SpeakerService.getSpeaker("");

      if (validateGetRequest(res)) {
        const speakers = res?.data;
        if (Array.isArray(speakers) && speakers.length > 0)
          setTableData(speakers);
        else setTableData([]);
        setIsTableDataLoading(false);
      }
    } catch (error) {
      setTableData([]);
      setIsTableDataLoading(false);
      console.error(error);
    }
  };

  const updateStatusOfSpeaker = async () => {
    try {
      const payload = { status: currentRowInfo?.status };
      if (payload.status === statusEnum.inactive) {
        payload.status = statusEnum.active;
      } else if (payload.status === statusEnum.active) {
        payload.status = statusEnum.inactive;
      }
      const res = await SpeakerService.updateSpeakerStatus(
        `${currentRowInfo?.id ? `/${currentRowInfo?.id}` : ""}`,
        payload
      );

      if (validatePostRequest(res)) {
        getSpeakerInfo();
      }
    } catch (error) {
      console.error(error);
    }
  };

  /*----------------------------------Event Handlers---------------------------- */

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };
    _filters["global"].value = value;
    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const onStatusToggle = (e, rowData) => {
    setIsStatusDialogVisible(true);
    setCurrentRowInfo(rowData);
  };

  const onAcceptStatusToggle = async () => {
    await updateStatusOfSpeaker();
  };

  const onEditSpeaker = (rowData) => {
    navigate(`${LINK_EDIT_SPEAKER}/${rowData.id}?mode=${PAGE_MODE.EDIT}`);
  };

  const onPreviewSpeaker = (e, rowData) => {
    setIsSpeakerPreviewVisible(true);
    setCurrentRowInfo(rowData);
  };

  const hideStatusDialog = () => {
    setIsStatusDialogVisible(false);
  };
  const hideSpeakerPreviewDialog = () => {
    setIsSpeakerPreviewVisible(false);
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
            placeholder="Search Speaker"
          />
        </IconField>
      </div>
    );
  };
  const renderColName = (rowData) => {
    return (
      <div
        className="pl-6 text-left"
        title={getInitialLetterUpperCase(rowData?.name)}
      >
        {getInitialLetterUpperCase(rowData?.name) ?? "-"}
      </div>
    );
  };
  const renderColEmail = (rowData) => {
    return (
      <div className="text-left" title={rowData?.email}>
        {rowData?.email}
      </div>
    );
  };
  const renderColContact = (rowData) => {
    return (
      <div className="text-left" title={rowData?.contact}>
        {rowData?.contact}
      </div>
    );
  };
  const renderColIndustry = (rowData) => {
    return (
      <div
        className="text-left"
        title={getInitialLetterUpperCase(rowData?.industry)}
      >
        {getInitialLetterUpperCase(rowData?.industry) ?? "-"}
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
        options={["Active", "Inactive"]}
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
        <button onClick={() => onEditSpeaker(rowData)}>
          <i className="pi pi-pencil text-blue-900 cursor-pointer"></i>
        </button>

        <button
          onClick={(e) => {
            onPreviewSpeaker(e, rowData);
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
          <div className="font-bold text-primary-pLabel">Speakers</div>

          <div>
            <Link
              to={`${LINK_CREATE_SPEAKER}?mode=${PAGE_MODE.CREATE}`}
              className="text-blue-900"
            >
              Create Speaker
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
                rows={50}
                rowsPerPageOptions={[50, 100, 150, 200]}
                removableSort
                filters={filters}
                filterDisplay="row"
                globalFilterFields={globalFilterFieldsStructure}
                emptyMessage="No speakers found."
                // paginatorTemplate="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink RowsPerPageDropdown"
                // currentPageReportTemplate="{first} to {last} of {totalRecords}"
              >
                <Column
                  field="name"
                  header="Name"
                  headerClassName="h-12 table-header table-header-left"
                  body={renderColName}
                />
                <Column
                  field="email"
                  header="Email"
                  headerClassName="h-12 table-header"
                  body={renderColEmail}
                />
                <Column
                  field="contact"
                  header="Contact"
                  headerClassName="h-12 table-header"
                  body={renderColContact}
                />
                <Column
                  field="industry"
                  header="Industry"
                  headerClassName="h-12 table-header"
                  body={renderColIndustry}
                />
                <Column
                  field="status"
                  header="Status"
                  headerClassName="h-12 table-header"
                  body={renderColStatus}
                  filter
                  filterMenuStyle={{ width: "64px" }}
                  style={{ minWidth: "64px", padding: "4px" }}
                  filterElement={renderStatusFilter}
                  showFilterMenu={false}
                />
                <Column
                  header="Action"
                  headerClassName="h-12 table-header table-header-right"
                  body={renderColAction}
                />
              </DataTable>
            </div>
          )}
        </Section>
      </div>

      <Dialog
        className="w-[278px] p-5 bg-primary-bg-section gap-5"
        visible={isStatusDialogVisible}
        header={`Speaker Status`}
        headerClassName="text-primary-pLabel text-[1rem]"
        onHide={hideStatusDialog}
      >
        {currentRowInfo?.id ? (
          <div className="flex flex-col gap-5 text-xs text-primary-pText">
            <div className="flex gap-2 items-center">
              <i className="text-[32px] pi pi-info-circle"></i>
              <span>{`Do you want to make this speaker ${
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
        visible={isSpeakerPreviewVisible}
        header={`Speaker Details`}
        headerClassName="text-primary-pLabel text-[1rem]"
        onHide={hideSpeakerPreviewDialog}
      >
        {currentRowInfo?.id ? (
          <div className="p-2 grid grid-cols-4 gap-5 text-primary-pText">
            <div className="col-span-2">
              <div className="text-primary-pLabel font-bold">
                <span>Name</span>
              </div>
              <div>
                <span>
                  {getInitialLetterUpperCase(currentRowInfo?.name) ?? "-"}
                </span>
              </div>
            </div>

            <div className="col-span-2">
              <div className="text-primary-pLabel font-bold">
                <span>Industry</span>
              </div>
              <div>
                <span>
                  {getInitialLetterUpperCase(currentRowInfo?.industry) ?? "-"}
                </span>
              </div>
            </div>

            <div className="col-span-2">
              <div className="text-primary-pLabel font-bold">
                <span>Email</span>
              </div>
              <div>
                <span>{currentRowInfo?.email ?? "-"}</span>
              </div>
            </div>

            <div className="col-span-2">
              <div className="text-primary-pLabel font-bold">
                <span>Contact</span>
              </div>
              <div>
                <span>{currentRowInfo?.contact ?? "-"}</span>
              </div>
            </div>

            <div className="col-span-4">
              <div className="text-primary-pLabel font-bold">
                <span>Speaker Status</span>
              </div>
              <div>
                <span>{currentRowInfo?.status ?? "-"}</span>
              </div>
            </div>

            <div className="col-span-4">
              <div className="text-primary-pLabel font-bold">
                <span>Bio</span>
              </div>
              <div>
                <span>{currentRowInfo?.bio ?? "-"}</span>
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
    </div>
  );
};

export default PageSpeakerPanel;
