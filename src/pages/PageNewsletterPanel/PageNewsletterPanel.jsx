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
import { Link } from "react-router-dom";
import ButtonCustom from "../../components/ButtonCustom";
import Section from "../../components/Section";
import { PAGE_MODE, statusEnum } from "../../constants/enums";
import { LINK_CREATE_NEWSLETTER } from "../../routes";
import NewsletterService from "../../services/NewsletterService";
import {
  ddmmyy,
  getInitialLetterUpperCase,
  validateGetRequest,
  validatePostRequest,
} from "../../utils/commonUtils";

const PageNewsletterPanel = () => {
  const [tableData, setTableData] = useState([]);
  const [isTableDataLoading, setIsTableDataLoading] = useState(true);
  const [isStatusDialogVisible, setIsStatusDialogVisible] = useState(false);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    topic: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    category: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    website: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    price: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    status: { value: null, matchMode: FilterMatchMode.EQUALS },
  });
  const [currentRowInfo, setCurrentRowInfo] = useState(null);
  const [isNewsletterPreviewVisible, setIsNewsletterPreviewVisible] =
    useState(false);

  const toast = useRef(null);

  const globalFilterFieldsStructure = [
    "topic",
    "category",
    "website",
    "price",
    "status",
  ];

  const onMount = useCallback(async () => {
    getNewsletterInfo();
  }, []);

  useEffect(() => {
    onMount();
  }, [onMount]);

  const getNewsletterInfo = async () => {
    setIsTableDataLoading(true);

    try {
      const res = await NewsletterService.getNewsletter("");

      if (validateGetRequest(res)) {
        const newsletters = res?.data;
        if (Array.isArray(newsletters) && newsletters.length > 0)
          setTableData(newsletters);
        else setTableData([]);
        setIsTableDataLoading(false);
      }
    } catch (error) {
      setTableData([]);
      setIsTableDataLoading(false);
      console.error(error);
    }
  };

  const updateStatusOfNewsletter = async () => {
    try {
      const payload = { status: currentRowInfo?.status };
      if (payload.status === statusEnum.inactive) {
        payload.status = statusEnum.active;
      } else if (payload.status === statusEnum.active) {
        payload.status = statusEnum.inactive;
      }
      const res = await NewsletterService.updateNewsletterStatus(
        `${currentRowInfo?.id ? `/${currentRowInfo?.id}` : ""}`,
        payload
      );

      if (validatePostRequest(res)) {
        getNewsletterInfo();
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
    await updateStatusOfNewsletter();
  };

  const hideStatusDialog = () => {
    setIsStatusDialogVisible(false);
  };

  const onPreviewNewsletter = (e, rowData) => {
    setIsNewsletterPreviewVisible(true);
    setCurrentRowInfo(rowData);
  };

  const hideNewsletterPreviewDialog = () => {
    setIsNewsletterPreviewVisible(false);
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
            placeholder="Search Newsletter"
          />
        </IconField>
      </div>
    );
  };

  const renderColTopic = (rowData) => {
    return (
      <div
        className="pl-6 max-w-[350px] text-left"
        title={getInitialLetterUpperCase(rowData?.topic)}
      >
        {getInitialLetterUpperCase(rowData?.topic) ?? "-"}
      </div>
    );
  };

  const renderColCategory = (rowData) => {
    return (
      <div className="text-left" title={rowData?.category}>
        {getInitialLetterUpperCase(rowData?.category) ?? ""}
      </div>
    );
  };

  const renderColWebsite = (rowData) => {
    return (
      <div className="text-left" title={rowData?.website}>
        {getInitialLetterUpperCase(rowData?.website) ?? "-"}
      </div>
    );
  };

  const renderColPrice = (rowData) => {
    return (
      <div className="w-16 text-center" title={rowData?.price}>
        {rowData?.price ?? "-"}
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
      <div className="w-[100%] flex justify-center">
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
      </div>
    );
  };

  const renderColAction = (rowData) => {
    return (
      <div className="pr-5 flex gap-6 justify-end items-center">
        <button
          onClick={(e) => {
            onPreviewNewsletter(e, rowData);
          }}
        >
          <i className="pi pi-eye cursor-pointer"></i>
        </button>
      </div>
    );
  };

  return (
    <div>
      <div className="flex flex-col items-center gap-5 text-primary-pText">
        <div className="w-full flex items-center justify-between">
          <div className="font-bold text-primary-pLabel">Newsletters</div>

          <div>
            <Link
              to={`${LINK_CREATE_NEWSLETTER}?mode=${PAGE_MODE.CREATE}`}
              className="text-blue-900"
            >
              Create Newsletter
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
                emptyMessage="No newsletters found."
              >
                <Column
                  field="topic"
                  header="Topic"
                  headerClassName="h-12 table-header table-header-left"
                  body={renderColTopic}
                />
                <Column
                  field="category"
                  header="Category"
                  headerClassName="h-12 table-header"
                  body={renderColCategory}
                />
                <Column
                  field="website"
                  header="Website"
                  headerClassName="h-12 table-header"
                  body={renderColWebsite}
                />
                <Column
                  field="price"
                  header="Price($)"
                  headerClassName="h-12 table-header"
                  body={renderColPrice}
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
        header={`Newsletter Status`}
        headerClassName="text-primary-pLabel text-[1rem]"
        onHide={hideStatusDialog}
      >
        {currentRowInfo?.id ? (
          <div className="flex flex-col gap-5 text-xs text-primary-pText">
            <div className="flex gap-2 items-center">
              <i className="text-[32px] pi pi-info-circle"></i>
              <span>{`Do you want to make this newsletter ${
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
        visible={isNewsletterPreviewVisible}
        header={`Newsletter Details`}
        headerClassName="text-primary-pLabel text-[1rem]"
        onHide={hideNewsletterPreviewDialog}
      >
        {currentRowInfo?.id ? (
          <div className="p-2 grid grid-cols-4 gap-5 text-primary-pText">
            <div className="col-span-3">
              <div className="text-primary-pLabel font-bold ">
                <span>Thumbnail</span>
              </div>
              <div className="w-full h-[300px] flex place-items-center text-xs">
                <img
                  className="w-full h-full"
                  src={currentRowInfo?.thumbnail}
                  alt="newsletter-thumbnail"
                />
              </div>
            </div>

            <div className="col-span-2">
              <div className="text-primary-pLabel font-bold">
                <span>Topic</span>
              </div>
              <div>
                <span>
                  {getInitialLetterUpperCase(currentRowInfo?.topic) ?? "-"}
                </span>
              </div>
            </div>

            <div className="col-span-2">
              <div className="text-primary-pLabel font-bold">
                <span>Category</span>
              </div>
              <div>
                <span>
                  {getInitialLetterUpperCase(currentRowInfo?.category) ?? "-"}
                </span>
              </div>
            </div>

            <div className="col-span-2">
              <div className="text-primary-pLabel font-bold">
                <span>Website</span>
              </div>
              <div>
                <span>
                  {getInitialLetterUpperCase(currentRowInfo?.website) ?? "-"}
                </span>
              </div>
            </div>

            <div className="col-span-2">
              <div className="text-primary-pLabel font-bold">
                <span>{`Price($)`}</span>
              </div>
              <div>
                <span>{currentRowInfo?.price ?? "-"}</span>
              </div>
            </div>

            <div className="col-span-4">
              <div className="text-primary-pLabel font-bold">
                <span>Newsletter Status</span>
              </div>
              <div>
                <span>{currentRowInfo?.status ?? "-"}</span>
              </div>
            </div>

            <div className="col-span-4">
              <div className="text-primary-pLabel font-bold">
                <span>Published Date</span>
              </div>
              <div>
                <span>{ddmmyy(currentRowInfo?.published_date) ?? "-"}</span>
              </div>
            </div>

            <div className="col-span-2">
              <div className="text-primary-pLabel font-bold">
                <span>Document</span>
              </div>
              <a
                className="text-blue-600"
                href={currentRowInfo?.document}
                target="_blank"
                rel="noopener noreferrer"
                download
              >
                <span>Show document</span>
                <i className="pi pi-file-pdf"></i>
              </a>
            </div>

            <div className="col-span-4">
              <div className="text-primary-pLabel font-bold">
                <span>Description</span>
              </div>
              <div>
                <span
                  dangerouslySetInnerHTML={{
                    __html:
                      currentRowInfo?.description ??
                      "<h4><strong>N.A</strong</h4>",
                  }}
                />
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

export default PageNewsletterPanel;
