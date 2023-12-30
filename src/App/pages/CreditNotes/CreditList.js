import React, { useState } from "react";
import { Box, Grid, Typography, Button } from "@material-ui/core";
import styles from "./credit.module.css";
import { API, ENDPOINTS } from "../../../api/apiService";
import {
  Loader,
  SearchInput,
  Toast,
  Select,
  MultiSelectCheckBox,
} from "../../components";
import { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import FilterIcon from "../../assets/icons/filter.svg";
import { Pagination } from "@material-ui/lab";
import DownloadIcon from "../../assets/icons/download_icon.svg";
import EmptyCredit from "../../assets/icons/EmptyCredits.svg";
import { capitalizeStr } from "../../../utils/textUtils";

const CreditList = () => {
  const [activeTab, setActiveTab] = useState("Credited");
  const [loading, setLoading] = useState(false);
  const [record, setRecord] = useState([]);
  const [openFilter, setOpenFilter] = useState(false);
  const [search, setSearch] = useState("");
  const [sortValue, setSortValue] = useState(0);
  const [designer_list, setDesignerList] = useState([]);
  const [selectedDesignerList, setSelectedDesignerList] = useState([]);
  const [storeList, setStoreList] = useState([]);
  const [selectedStoreList, setSelectedStoreList] = useState([]);
  const [total, setTotal] = useState();

  const [filter, setFilter] = useState({
    page: 1,
    page_size: 10,
  });

  const ClearAll = () => {
    setFilter({
      page: 1,
      page_size: 10,
    });
    setSelectedDesignerList([]);
    setSelectedStoreList([]);
    setSearch("");
    setSortValue(0);
  };
  const changeTab = (value) => {
    if (value) {
      setActiveTab(value);
      ClearAll();
    }
  };

  const queryBuilder = (url, options) => {
    if (options === undefined || !options) return url;
    let designer = "";
    if (selectedDesignerList.length > 0) {
      for (let i of selectedDesignerList) {
        designer += `&designer=${i.value}`;
      }
    }
    let store = "";
    if (selectedStoreList.length > 0) {
      for (let i of selectedStoreList) {
        store += `&store=${i.value}`;
      }
    }
    let sort = "";
    if (sortValue > 0) {
      sort += `&sort_by=${sortValue}`;
    }
    return `${url}?${
      activeTab === "Credited" ? "is_credited=true&" : "is_credited=false&"
    }${"page=" + options.page}&${"page_size=" + options.page_size}${
      selectedDesignerList.length > 0 ? designer : ""
    }${selectedStoreList.length > 0 ? store : ""}${sortValue > 0 ? sort : ""}${
      search !== "" && search !== undefined ? `&search=${search}` : ""
    }`;
  };

  const handlePage = (event, value) => {
    setFilter({
      ...filter,
      page: value,
    });
  };

  const handleDesignerChange = (event) => {
    setSelectedDesignerList(event);
  };

  const handleStoreChange = (event) => {
    setSelectedStoreList(event);
  };

  const fetchRecord = async () => {
    try {
      setLoading(true);
      let query = queryBuilder(ENDPOINTS.STORECREDITS, filter);
      const resp = await API.get(query);
      if (resp.success) {
        setTotal(resp?.data?.count);
        setRecord(resp?.data?.results);
      }
    } catch (e) {
      const msg =
        typeof e.data.error?.message === "string"
          ? e.data.error?.message
          : e.data.error?.message[0];
      Toast.showErrorToast(
        msg || `Error Fetching Store Details. Please Refresh`
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchDesigner = async () => {
    try {
      const resp = await API.get(
        `${ENDPOINTS.Designer_Name_LIST}?page_size=1000`
      );
      if (resp.success) {
        let resData = [];
        for (let i of resp.data.results) {
          resData.push({
            value: i.id,
            label: i.name,
          });
        }
        setDesignerList(resData);
      }
    } catch (e) {
      const msg =
        typeof e?.data?.error?.message === "string"
          ? e?.data?.error?.message
          : e?.data?.error?.message[0];
      Toast.showErrorToast(msg || `Error Fetching Designer. Please Refresh`);
    }
  };

  const fetchStore = async () => {
    try {
      const resp = await API.get(`${ENDPOINTS.STORELIST}?page_size=1000`);
      if (resp.success) {
        let resData = [];
        for (let i of resp.data.results) {
          resData.push({
            value: i.id,
            label: i.name,
          });
        }
        setStoreList(resData);
      }
    } catch (e) {
      const msg =
        typeof e?.data?.error?.message === "string"
          ? e?.data?.error?.message
          : e?.data?.error?.message[0];
      Toast.showErrorToast(msg || `Error Fetching Stores. Please Refresh`);
    }
  };

  const fetchCsvReportData = async () => {
    setLoading(true);
    const resp = await API.get(
      `${
        ENDPOINTS.CSVREPORT
      }?csv_report_type=CUSTOMER_STORE_CREDITS&is_credited=${
        activeTab === "Credited" ? "True" : "False"
      }`
    );
    if (resp.success) {
      const result = resp.data;
      const link = document.createElement("a");
      link.href = result.url;
      link.click();
    } else {
      const msg = resp.error?.message;
      Toast.showErrorToast(msg || `Error Fetching Csv Report. Please Refresh`);
    }
    setLoading(false);
  };

  const handleSort = (e) => {
    setSortValue(e);
  };

  const moreFilter = () => {
    setOpenFilter((prev) => !prev);
  };

  const handleClear = () => {
    ClearAll();
  };

  useEffect(() => {
    fetchRecord();
    fetchDesigner();
    fetchStore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  useEffect(() => {
    fetchRecord();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDesignerList, selectedStoreList, search, sortValue, filter]);

  const handleSearchInput = (e) => {
    setSearch(e.target.value);
  };

  const handleCloseSearch = () => {
    setSearch("");
  };

  const classes = useStyles();
  return (
    <>
      <Grid
        container
        xs={12}
        justifyContent="space-between"
        className={styles.tabs}
      >
        <Grid
          container
          item
          xs={12}
          sm={6}
          lg={8}
          className={styles.tabs_container}
        >
          {steps.map((step) => {
            return (
              <div
                key={step.id}
                className={
                  activeTab === step.tab ? styles.activeStepCtr : styles.stepCtr
                }
              >
                <div
                  className={
                    activeTab === step.tab
                      ? styles.activeStepText
                      : styles.stepText
                  }
                  onClick={() => changeTab(step.tab)}
                >
                  {step.title}
                </div>
              </div>
            );
          })}
        </Grid>
        <Grid
          container
          item
          xs={12}
          sm={6}
          lg={4}
          justifyContent="flex-end"
          className={styles.filter}
        >
          <Grid
            container
            alignItems="center"
            justifyContent="flex-end"
            className={classes.FilterButton}
          >
            <Button
              className={styles.filter_button}
              onClick={() => moreFilter()}
            >
              <img src={FilterIcon} alt="i" className={styles.FilterIcon} />
              <Typography className={styles.filter_text}>Filters</Typography>
            </Button>
            <Grid item style={{ paddingLeft: "20px", cursor: "pointer" }}>
              <img src={DownloadIcon} alt="img" onClick={fetchCsvReportData} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Box pl={3} pr={2} pt={3} style={{ width: "100%" }}>
        {openFilter && (
          <Grid container>
            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item>
                  <SearchInput
                    is_input_open={true}
                    placeholder="Search Designer or Store"
                    value={search}
                    onChange={handleSearchInput}
                    onClose={handleCloseSearch}
                  />
                </Grid>
                <Grid item>
                  <MultiSelectCheckBox
                    id="Designer"
                    isSecondary
                    items={designer_list}
                    selectedItems={selectedDesignerList}
                    searchEnabled={true}
                    searchPlaceholder="Search By Designer"
                    label="Designer"
                    onSelect={handleDesignerChange}
                    onReset={() => setSelectedDesignerList([])}
                    ShowReset={true}
                    Showcount={true}
                    LabelClass={styles.Multiselectlabel}
                    SlectItemcls={styles.MultiSelectListItems}
                  />
                </Grid>
                <Grid item>
                  <MultiSelectCheckBox
                    id="store"
                    isSecondary
                    items={storeList}
                    selectedItems={selectedStoreList}
                    searchEnabled={true}
                    searchPlaceholder="Search By Store"
                    label="Store"
                    onSelect={handleStoreChange}
                    onReset={() => setSelectedStoreList([])}
                    ShowReset={true}
                    Showcount={true}
                    LabelClass={styles.Multiselectlabel}
                    SlectItemcls={styles.MultiSelectListItems}
                  />
                </Grid>
                <Grid item>
                  <Select
                    id="sort"
                    placeholder="Sort By:"
                    style={{
                      borderRadius: 8,
                    }}
                    items={[
                      { label: "Sort By", value: 0 },
                      { label: "High to Low amount", value: 1 },
                      { label: "Low to High amount", value: 2 },
                      { label: "New to Old created", value: 3 },
                      { label: "Old to New created", value: 4 },
                    ]}
                    value={sortValue}
                    onChange={handleSort}
                    ClassName={styles.sortby_button}
                  />
                </Grid>
                <Grid item>
                  <Typography
                    onClick={handleClear}
                    style={{
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "#FC68A2",
                      marginTop: "10px",
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                    }}
                  >
                    CLEAR ALL
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        )}
      </Box>
      <Grid container>
        {loading && <Loader />}
        <Box className={styles.Overflow}>
          <Box pl={3} pr={2} pt={3} className={styles.table_header_box}>
            {/* Table Header */}
            {record?.length > 0 && (
              <Grid container className={styles.Staff_header}>
                <Grid item>
                  <Typography variant="h5" className={styles.header}>
                    Designer
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant="h5" className={styles.header}>
                    Store
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant="h5" className={styles.header}>
                    Order ID
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant="h5" className={styles.header}>
                    {activeTab === "Used" ? `Used  on` : `Credited on`}
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant="h5" className={styles.header}>
                    Amount
                  </Typography>
                </Grid>
              </Grid>
            )}
          </Box>
          {/* Table Cells */}
          {record?.map((item, index) => (
            <Box pl={3} pr={2} key={index} className={styles.table_cell_box}>
              <Grid
                container
                className={`${styles.table_cell} ${styles.staff_table}`}
              >
                {/* Designer*/}
                <Grid item>
                  <Typography variant="h5" className={styles.content}>
                    {capitalizeStr( item?.designer)}
                  </Typography>
                </Grid>
                {/* Store */}
                <Grid item>
                  <Typography variant="h5" className={styles.content}>
                    {item?.store}
                  </Typography>
                </Grid>
                {/* order_id */}
                <Grid item>
                  <Typography variant="h5" className={styles.content}>
                    #{item?.order_id}
                  </Typography>
                </Grid>
                {/* created_on */}
                <Grid item>
                  <Typography variant="h5" className={styles.content}>
                    {item?.created_on}
                  </Typography>
                </Grid>
                {/* amount */}
                <Grid item>
                  <Typography variant="h5" className={styles.content}>
                    {activeTab === "Credited" ? `+` : `-`}${item?.amount}
                  </Typography>
                </Grid>
                {/* amount */}
                <Grid item>
                  <Button
                    variant="outlined"
                    color="secondary"
                    style={{ borderRadius: 8, minHeight: 38 }}
                  >
                    View Details
                  </Button>
                </Grid>
              </Grid>
            </Box>
          ))}

          {!record.length && (
            <Grid container justifyContent="center">
              <img src={EmptyCredit} alt="credit" />
            </Grid>
          )}
          {/* Pagination */}
          {record.length ? (
            <Box pb={2} pt={2}>
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Pagination
                    color="secondary"
                    shape="rounded"
                    count={Math.ceil(total / 10)}
                    page={filter?.page}
                    onChange={handlePage}
                  />
                </Grid>
              </Grid>
            </Box>
          ) : null}
        </Box>
      </Grid>
    </>
  );
};

export default CreditList;

const steps = [
  {
    title: "Credited",
    tab: "Credited",
    id: 1,
  },
  {
    title: "Used",
    tab: "Used",
    id: 2,
  },
];

const useStyles = makeStyles((theme) => ({
  root: () => ({
    top: 0,
  }),
  FilterButton: {
    // marginLeft: "-20px",
    justifyContent: "flex-end",
    [theme.breakpoints.down("sm")]: {
      // justifyContent: "flex-start",
      marginTop: "15px",
    },
    [theme.breakpoints.down("xs")]: {
      justifyContent: "flex-start",
      marginLeft: "20px",
      marginBottom: "10px",
    },
  },
  sort_Container: {
    justifyContent: "flex-end",
    [theme.breakpoints.down("xs")]: {
      justifyContent: "flex-start",
    },
  },
}));
