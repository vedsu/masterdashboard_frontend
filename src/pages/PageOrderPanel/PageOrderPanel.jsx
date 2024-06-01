import { FilterMatchMode } from "primereact/api";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { ProgressSpinner } from "primereact/progressspinner";
import React, { useCallback, useEffect, useState } from "react";
import Section from "../../components/Section";
import OrderService from "../../services/OrderService";
import { validateGetRequest } from "../../utils/commonUtils";

const PageOrderPanel = () => {
  const [tableData, setTableData] = useState([]);
  const [isTableDataLoading, setIsTableDataLoading] = useState(true);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    email: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    contact: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    industry: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  });

  const [currentRowInfo, setCurrentRowInfo] = useState(null);
  const [currentRowSessionInfo, setCurrentRowSessionInfo] = useState(null);
  const [showSessionPopUp, setShowSessionPopUp] = useState(false);
  const [showOrderDetailsPopUp, setShowOrderDetailsPopUp] = useState(false);

  const globalFilterFieldsStructure = [
    "orderdate",
    "webinardate",
    "topic",
    "customername",
    "customeremail",
    "orderamount",
  ];

  const onMount = useCallback(async () => {
    getOrderInfo();
  }, []);

  useEffect(() => {
    onMount();
  }, [onMount]);

  useEffect(() => {
    if (currentRowSessionInfo) {
      setShowSessionPopUp(true);
    }
  }, [currentRowSessionInfo]);

  useEffect(() => {
    if (currentRowInfo) {
      setShowOrderDetailsPopUp(true);
    }
  }, [currentRowInfo]);

  const getOrderInfo = async () => {
    setIsTableDataLoading(true);

    try {
      const res = await OrderService.getOrders();
      if (validateGetRequest(res)) {
        const orders = res?.data;
        if (Array.isArray(orders) && orders.length > 0) setTableData(orders);
        else setTableData([]);
        setIsTableDataLoading(false);
      }
    } catch (error) {
      setTableData([]);
      setIsTableDataLoading(false);
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

  const onDownloadOrderDoc = () => {
    const pdfUrl = currentRowInfo?.document;
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
            placeholder="Search Orders"
          />
        </IconField>
      </div>
    );
  };

  const renderColOrderDate = (rowData) => {
    return <div className="pl-6 text-left">{rowData?.orderdate}</div>;
  };
  const renderColWebinarDate = (rowData) => {
    return <div className="text-left">{rowData?.webinardate}</div>;
  };
  const renderColTopic = (rowData) => {
    return <div className="text-left">{rowData?.topic}</div>;
  };
  const renderColSession = (rowData) => {
    return (
      <div className="flex justify-start items-center">
        <button
          className="ml-4"
          onClick={(e) => {
            onViewSessionDetails(e, rowData);
          }}
        >
          <i className="pi pi-eye"></i>
        </button>
      </div>
    );
  };
  const renderColName = (rowData) => {
    return <div className="text-left">{rowData?.customername}</div>;
  };
  const renderColEmail = (rowData) => {
    return <div className="text-left">{rowData?.customeremail}</div>;
  };
  const renderColAmount = (rowData) => {
    return <div className="text-center">{rowData?.orderamount}</div>;
  };
  const renderColAction = (rowData) => {
    return (
      <div className="flex justify-end items-center">
        <button
          className="mr-9"
          onClick={(e) => {
            onViewOrderDetails(e, rowData);
          }}
        >
          <i className="pi pi-eye"></i>
        </button>
      </div>
    );
  };

  /*------------------------------------Helper Functions--------------------------*/

  const onViewSessionDetails = (e, rowData) => {
    setCurrentRowSessionInfo([...(rowData?.session ?? [])]);
  };

  const onViewOrderDetails = (e, rowData) => {
    setCurrentRowInfo({ ...rowData });
  };

  return (
    <div>
      <div className="flex flex-col items-center gap-5 text-primary-pText">
        <div className="w-full flex items-center justify-between">
          <div className="font-bold text-primary-pLabel">Orders</div>
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
                emptyMessage="No orders found."
                // paginatorTemplate="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink RowsPerPageDropdown"
                // currentPageReportTemplate="{first} to {last} of {totalRecords}"
              >
                <Column
                  field="orderdate"
                  header="Order Date"
                  headerClassName="h-12 table-header table-header-left"
                  body={renderColOrderDate}
                />
                <Column
                  field="webinardate"
                  header="Webinar Date"
                  headerClassName="h-12 table-header"
                  body={renderColWebinarDate}
                />
                <Column
                  field="topic"
                  header="Topic"
                  headerClassName="h-12 table-header"
                  body={renderColTopic}
                />
                <Column
                  field="session"
                  header="Session"
                  headerClassName="h-12 table-header"
                  body={renderColSession}
                />
                <Column
                  field="customername"
                  header="Customer Name"
                  headerClassName="h-12 table-header"
                  body={renderColName}
                />
                <Column
                  field="customeremail"
                  header="Customer Email"
                  headerClassName="h-12 table-header"
                  body={renderColEmail}
                />
                <Column
                  field="orderamount"
                  header="Order Amount (₹)"
                  headerClassName="w-32 h-12 table-header"
                  body={renderColAmount}
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

        <Dialog
          className="session-type-dialog p-5 bg-primary-bg-section gap-5"
          header="Session Type Details"
          headerClassName="text-primary-pLabel"
          visible={showSessionPopUp}
          style={{ width: "25vw" }}
          onHide={() => setShowSessionPopUp(false)}
        >
          {currentRowSessionInfo?.length ? (
            <div className="text-primary-pText">
              <div className="my-2 flex items-center justify-between">
                <h4 className="font-bold text-primary-pLabel">Session Type</h4>
                <h4 className="font-bold text-primary-pLabel">Price</h4>
              </div>

              {currentRowSessionInfo?.map((sessionInfo) => {
                const sessionTypeName = Object.keys(sessionInfo);
                return (
                  <div
                    key={sessionTypeName}
                    className="my-3 flex items-center justify-between"
                  >
                    <span>{`${sessionTypeName[0]}`}</span>
                    <span>{`${
                      sessionInfo[sessionTypeName]
                        ? `${sessionInfo[sessionTypeName]} ₹`
                        : "-"
                    }`}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center">No session information found.</div>
          )}
        </Dialog>

        <Dialog
          className="order-detail-dialog p-5 bg-primary-bg-section gap-5"
          header="Order Details"
          headerClassName="text-primary-pLabel"
          visible={showOrderDetailsPopUp}
          style={{ width: "65vw" }}
          onHide={() => setShowOrderDetailsPopUp(false)}
        >
          {currentRowInfo ? (
            <React.Fragment>
              <div className="grid grid-cols-3 gap-5 text-primary-pText text-sm">
                <div className="col-span-1">
                  <div className="text-primary-pLabel font-bold">
                    <span>Order Date </span>
                  </div>
                  <div>
                    <span>{currentRowInfo?.orderdate ?? "-"}</span>
                  </div>
                </div>

                <div className="col-span-1">
                  <div className="text-primary-pLabel font-bold">
                    <span>Customer Name</span>
                  </div>
                  <div>
                    <span>{currentRowInfo?.customername ?? "-"}</span>
                  </div>
                </div>

                <div className="col-span-1">
                  <div className="text-primary-pLabel font-bold">
                    <span>Customer Email</span>
                  </div>
                  <div>
                    <span>{currentRowInfo?.customeremail ?? "-"}</span>
                  </div>
                </div>

                <div className="col-span-1">
                  <div className="text-primary-pLabel font-bold">
                    <span>Webinar Date</span>
                  </div>
                  <div>
                    <span>{currentRowInfo?.webinardate ?? "-"}</span>
                  </div>
                </div>

                <div className="col-span-1">
                  <div className="text-primary-pLabel font-bold">
                    <span>Website</span>
                  </div>
                  <div>
                    <span>{currentRowInfo?.website ?? "-"}</span>
                  </div>
                </div>

                <div className="col-span-1">
                  <div className="text-primary-pLabel font-bold">
                    <span>Topic</span>
                  </div>
                  <div>
                    <span>{currentRowInfo?.topic ?? "-"}</span>
                  </div>
                </div>

                <div className="col-span-3">
                  <div className="text-primary-pLabel font-bold">
                    <span>Address</span>
                  </div>
                  <div>
                    <span>{currentRowInfo?.address ?? "-"}</span>
                  </div>
                </div>

                <div className="col-span-1">
                  <div className="text-primary-pLabel font-bold">
                    <span>City</span>
                  </div>
                  <div>
                    <span>{currentRowInfo?.city ?? "-"}</span>
                  </div>
                </div>

                <div className="col-span-1">
                  <div className="text-primary-pLabel font-bold">
                    <span>State</span>
                  </div>
                  <div>
                    <span>{currentRowInfo?.state ?? "-"}</span>
                  </div>
                </div>

                <div className="col-span-1">
                  <div className="text-primary-pLabel font-bold">
                    <span>Zip Code</span>
                  </div>
                  <div>
                    <span>{currentRowInfo?.zipcode ?? "-"}</span>
                  </div>
                </div>

                <div className="col-span-1">
                  <div className="text-primary-pLabel font-bold">
                    <span>Country</span>
                  </div>
                  <div>
                    <span>{currentRowInfo?.country ?? "-"}</span>
                  </div>
                </div>

                <div className="col-span-1">
                  <div className="text-primary-pLabel font-bold">
                    <span>Payment Status</span>
                  </div>
                  <div>
                    <span>
                      {currentRowInfo?.paymentstatus?.toUpperCase() ?? "-"}
                    </span>
                  </div>
                </div>

                <div className="col-span-1" />
                <div className="col-span-1" />

                <div className="col-span-2 flex items-center justify-end">
                  <button
                    type="button"
                    className="submit-btn w-32 h-8 flex items-center justify-center gap-4 bg-secondary-bg-btnLight text-primary-pTextLight rounded-full hover:bg-primary-bg-base-dark"
                    onClick={onDownloadOrderDoc}
                  >
                    <span>Download</span>

                    <i
                      className={`pi pi-download`}
                      style={{ fontSize: "12px" }}
                    ></i>
                  </button>
                </div>
              </div>
            </React.Fragment>
          ) : (
            <div className="text-center">No order information found.</div>
          )}
        </Dialog>
      </div>
    </div>
  );
};

export default PageOrderPanel;
