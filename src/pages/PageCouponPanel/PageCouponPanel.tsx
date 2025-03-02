import React, { useCallback, useEffect, useRef, useState } from "react";
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
import { Link } from "react-router-dom";
import ButtonCustom from "../../components/ButtonCustom";
import Section from "../../components/Section";
import { PAGE_MODE, statusEnum } from "../../constants/enums";
import { LINK_CREATE_COUPON } from "../../routes";
import CouponService from "../../services/CouponService";
import {
  getInitialLetterUpperCase,
  validateGetRequest,
  validatePostRequest,
} from "../../utils/commonUtils";

const PageCouponPanel = () => {
  const [tableData, setTableData] = useState([]);
  const [isTableDataLoading, setIsTableDataLoading] = useState(true);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    coupon: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    amount: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    type: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    status: { value: null, matchMode: FilterMatchMode.EQUALS },
  });

  const [currentRowInfo, setCurrentRowInfo] = useState(null);

  const [isStatusDialogVisible, setIsStatusDialogVisible] = useState(false);

  const toast = useRef(null);

  const globalFilterFieldsStructure = ["coupon", "amount", "type", "status"];

  const onMount = useCallback(async () => {
    getCouponsInfo();
  }, []);

  useEffect(() => {
    onMount();
  }, [onMount]);

  const getCouponsInfo = async () => {
    setIsTableDataLoading(true);

    try {
      const res = await CouponService.getCoupons();

      if (validateGetRequest(res)) {
        const coupons = res?.data;
        if (Array.isArray(coupons) && coupons.length > 0) setTableData(coupons);
        else setTableData([]);
        setIsTableDataLoading(false);
      }
    } catch (error) {
      setTableData([]);
      setIsTableDataLoading(false);
      console.error(error);
    }
  };

  const updateStatusofCoupon = async () => {
    try {
      const payload = { status: currentRowInfo?.status };
      if (payload.status === statusEnum.inactive) {
        payload.status = statusEnum.active;
      } else if (payload.status === statusEnum.active) {
        payload.status = statusEnum.inactive;
      }
      const res = await CouponService.updateCoupon(
        `${currentRowInfo?.id ? `/${currentRowInfo?.id}` : ""}`,
        payload
      );

      if (validatePostRequest(res)) {
        getCouponsInfo();
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
    await updateStatusofCoupon();
  };

  const hideStatusDialog = () => {
    setIsStatusDialogVisible(false);
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
            placeholder="Search Coupon"
          />
        </IconField>
      </div>
    );
  };

  const renderColCoupon = (rowData) => {
    return (
      <div
        className="pl-6 text-left"
        title={getInitialLetterUpperCase(rowData?.coupon)}
      >
        {getInitialLetterUpperCase(rowData?.coupon) ?? "-"}
      </div>
    );
  };

  const renderColAmount = (rowData) => {
    return (
      <div className="text-left" title={rowData?.amount}>
        {rowData?.amount}
      </div>
    );
  };

  const renderColType = (rowData) => {
    return (
      <div
        className="text-left"
        title={getInitialLetterUpperCase(rowData?.type)}
      >
        {getInitialLetterUpperCase(rowData?.type) ?? "-"}
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

  return (
    <div>
      <div className="flex flex-col items-center gap-5 text-primary-pText">
        <div className="w-full flex items-center justify-between">
          <div className="font-bold text-primary-pLabel">Coupons</div>

          <div>
            <Link
              to={`${LINK_CREATE_COUPON}?mode=${PAGE_MODE.CREATE}`}
              className="text-blue-900"
            >
              Create Coupon
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
                emptyMessage="No coupons found."
                // paginatorTemplate="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink RowsPerPageDropdown"
                // currentPageReportTemplate="{first} to {last} of {totalRecords}"
              >
                <Column
                  field="coupon"
                  header="Coupon"
                  headerClassName="h-12 table-header table-header-left"
                  body={renderColCoupon}
                />
                <Column
                  field="amount"
                  header="Amount"
                  headerClassName="h-12 table-header"
                  body={renderColAmount}
                />
                <Column
                  field="type"
                  header="Type"
                  headerClassName="h-12 table-header"
                  body={renderColType}
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
              </DataTable>
            </div>
          )}
        </Section>
      </div>

      <Dialog
        className="w-[278px] p-5 bg-primary-bg-section gap-5"
        visible={isStatusDialogVisible}
        header={`Coupon Status`}
        headerClassName="text-primary-pLabel text-[1rem]"
        onHide={hideStatusDialog}
      >
        {currentRowInfo?.id ? (
          <div className="flex flex-col gap-5 text-xs text-primary-pText">
            <div className="flex gap-2 items-center">
              <i className="text-[32px] pi pi-info-circle"></i>
              <span>{`Do you want to make this coupon ${
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

      <Toast
        ref={toast}
        className="app-toast text-sm text-primary-pText"
        position="bottom-right"
      />
    </div>
  );
};

export default PageCouponPanel;
