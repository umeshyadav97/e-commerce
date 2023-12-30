import React, { useEffect, useState } from "react";
import {
  Select,
  SelectSearch,
  Toast,
  Loader,
  LoaderContent,
  OutlinedPrimaryButton,
  AccordionFilter,
} from "../../../components";
import PaginationLoader from "../../../components/PaginationLoader";
import { API, ENDPOINTS } from "../../../../api/apiService";
import FilterIcon from "../../../assets/icons/FilterIconGrey.svg";
import noDesignerAVailableImage from "../../../assets/images/No-designer.svg";
import { Button, Grid, Typography } from "@material-ui/core";
import styles from "../Dashboard.module.css";
import InfiniteScroll from "react-infinite-scroll-component";
import { connect } from "react-redux";
import DesignerListCard from "../../Dashboard/components/DesignerListCard";
import useDebounce from "../../../hooks/useDebounce";
import { useHistory } from "react-router-dom";

const Filters = (props) => {
  const [openFilter, setOpenFilter] = useState(false);
  const [record, setRecord] = useState([]);
  const [designerNameList, setDesignerNameList] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [sortValue, setSortValue] = useState(0);
  const [Brand_list, setBrand_list] = useState([]);
  const [countryList, setCountryList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [updating, setUpdating] = useState(false);
  const isLoggedIn = props.isAuthenticated;
  const [LoadMore, setLoadMore] = useState(1);
  const [nextDesignerPage, setNextDesignerPage] = useState("");
  const [totalDesignerName, setDesignerNameTotal] = useState("");
  const [nextDesignerNamePage, setNextDesignerNamePage] = useState("");
  const [tempCheckedDataDesigner, setTempCheckedDataDesigner] = useState([]);
  const debouncedDesignerName = useDebounce(tempCheckedDataDesigner, 1000);
  const [nextDesignerBrandPage, setNextDesignerBrandPage] = useState("");
  const [totalDesignerBrand, setTotalDesignerBrand] = useState("");
  const [
    tempCheckedDataDesignerBrand,
    setTempCheckedDataDesignerBrand,
  ] = useState([]);
  const debouncedDesignerBrand = useDebounce(
    tempCheckedDataDesignerBrand,
    1000
  );

  const history = useHistory();
  const filter = {
    id: "",
    start_price: 1,
    end_price: 9999,
    page: 1,
    page_size: 20,
  };

  const queryDesignerBuilder = (url, options, searchResult) => {
    if (options === undefined || !options) return url;
    let designer = "";
    if (tempCheckedDataDesigner[0]?.value?.length > 0) {
      for (let i of tempCheckedDataDesigner[0]?.value) {
        designer += `&designer=${i.id}`;
      }
    }
    let brand = "";
    if (tempCheckedDataDesignerBrand[0]?.value?.length > 0) {
      for (let i of tempCheckedDataDesignerBrand[0]?.value) {
        brand += `&brand=${i.id}`;
      }
    }
    return `${url}?${options.page ? `&page=${options.page}` : ""}${
      options.page_size ? `&page_size=${options.page_size}` : ""
    }${sortValue !== 0 ? `&ordering=${sortValue}` : ""}${
      tempCheckedDataDesigner[0]?.value?.length > 0 ? designer : ``
    }${tempCheckedDataDesignerBrand[0]?.value?.length > 0 ? brand : ``}${
      selectedCountry ? `&country=${selectedCountry}` : ""
    }${
      searchResult !== undefined && searchResult !== ""
        ? `&search=${searchResult}`
        : ""
    }    
    `;
  };

  const fetchDesigners = async () => {
    try {
      setLoading(true);
      const query = queryDesignerBuilder(
        ENDPOINTS.GET_DESIGNERS_LIST,
        filter,
        props.search
      );
      const resp = await API.get(query, false);
      if (resp.success) {
        const temp = resp.data;
        setRecord(temp.results);
        setNextDesignerPage(resp.data.next ? resp.data.next : "");
        if (!temp.next) {
          setHasMore(false);
        } else {
          setHasMore(true);
        }
      }
    } catch (e) {
      const msg =
        typeof e.data.error?.message === "string"
          ? e.data.error?.message
          : e.data.error?.message[0];
      Toast.showErrorToast(msg || `Error Fetching Designers. Please Refresh`);
    } finally {
      setLoading(false);
    }
  };

  const fetchDesignerNameList = async (resData) => {
    try {
      const resp = await API.get(
        `${ENDPOINTS.Designer_Name_LIST}/${
          resData ? `?search=${resData}` : ""
        }`,
        false
      );
      if (resp.success) {
        setDesignerNameTotal(resp.data.count || "");
        let resData = [];
        for (let i of resp.data.results) {
          resData.push({
            value: i.id,
            label: i.name,
          });
        }
        setDesignerNameList(resData);
        setNextDesignerNamePage(resp.data.next ? resp.data.next : "");
      }
    } catch (e) {
      const msg =
        typeof e?.data?.error?.message === "string"
          ? e?.data?.error?.message
          : e?.data?.error?.message[0];
      Toast.showErrorToast(msg || `Error Fetching Brand List. Please Refresh`);
    }
  };

  const fetchMoreDesignerNamelist = async () => {
    if (nextDesignerNamePage !== null) {
      try {
        let endPoint1 = nextDesignerNamePage ? nextDesignerNamePage : "";
        let endPoint2 = endPoint1.slice(0, 4) + "s" + endPoint1.slice(4);
        const resp = await API.get(endPoint2, isLoggedIn ? true : false);
        if (resp.success) {
          setDesignerNameTotal(resp.data.count || 0);
          let resData = [...designerNameList];
          for (let i of resp.data.results) {
            resData.push({
              value: i.id,
              label: i.name,
            });
          }
          setDesignerNameList(resData);
          setNextDesignerNamePage(resp.data.next ? resp.data.next : "");
          return resData;
        }
      } catch (e) {
        const msg =
          typeof e.data.error?.message === "string"
            ? e.data.error?.message
            : e.data.error?.message[0];
        Toast.showErrorToast(
          msg || `Error Fetching color list. Please Refresh`
        );
      }
    }
  };

  const handleDeleteDesignerFilter = (key, id) => {
    let newCheckedData = tempCheckedDataDesigner;
    let keyData = newCheckedData.find((el) => el.key === key)?.value;
    const keyIndex = newCheckedData.findIndex((el) => el.key === key);
    let spliceIndex = keyData.findIndex((el) => el.id === id);
    keyData.splice(spliceIndex, 1);

    newCheckedData[keyIndex].value = keyData;
    setTempCheckedDataDesigner([...newCheckedData]);
  };

  const handleToggleDesigner = (key, id, name) => {
    const isExist = tempCheckedDataDesigner.findIndex((el) => el.key === key);
    if (isExist === -1) {
      let payload = {
        key: key,
        value: [{ id, name }],
      };
      setTempCheckedDataDesigner([...tempCheckedDataDesigner, payload]);
    } else {
      let newCheckedData1 = tempCheckedDataDesigner;
      let keyData = newCheckedData1.find((el) => el.key === key)?.value;
      const keyIndex = newCheckedData1.findIndex((el) => el.key === key);
      let spliceIndex = keyData.findIndex((el) => el.id === id);
      if (spliceIndex === -1) {
        keyData.push({ id, name });
      }
      newCheckedData1[keyIndex].value = keyData;
      setTempCheckedDataDesigner([...newCheckedData1]);
    }
  };

  const fetchBrandlist = async (resData) => {
    try {
      const resp = await API.get(
        `${ENDPOINTS.BRAND_LIST}/${resData ? `?search=${resData}` : ""}`,
        false
      );
      if (resp.success) {
        setTotalDesignerBrand(resp.data.count || "");
        let resData = [];
        for (let i of resp.data.results) {
          resData.push({
            value: i.id,
            label: i.brand_name,
          });
        }
        setBrand_list(resData);
        setNextDesignerBrandPage(resp.data.next ? resp.data.next : "");
      }
    } catch (e) {
      const msg =
        typeof e?.data?.error?.message === "string"
          ? e?.data?.error?.message
          : e?.data?.error?.message[0];
      Toast.showErrorToast(msg || `Error Fetching Brand List. Please Refresh`);
    }
  };

  const fetchMoreDesignerBrandlist = async () => {
    if (nextDesignerBrandPage !== null) {
      try {
        let endPoint1 = nextDesignerBrandPage ? nextDesignerBrandPage : "";
        let endPoint2 = endPoint1.slice(0, 4) + "s" + endPoint1.slice(4);
        const resp = await API.get(endPoint2, isLoggedIn ? true : false);
        if (resp.success) {
          setTotalDesignerBrand(resp.data.count || 0);
          let resData = [...Brand_list];
          for (let i of resp.data.results) {
            resData.push({
              value: i.id,
              label: i.brand_name,
            });
          }
          setBrand_list(resData);
          setNextDesignerBrandPage(resp.data.next ? resp.data.next : "");
          return resData;
        }
      } catch (e) {
        const msg =
          typeof e.data.error?.message === "string"
            ? e.data.error?.message
            : e.data.error?.message[0];
        Toast.showErrorToast(
          msg || `Error Fetching Brand list. Please Refresh`
        );
      }
    }
  };

  const handleDeleteDesignerBrandFilter = (key, id) => {
    let newCheckedData = tempCheckedDataDesignerBrand;
    let keyData = newCheckedData.find((el) => el.key === key)?.value;
    const keyIndex = newCheckedData.findIndex((el) => el.key === key);
    let spliceIndex = keyData.findIndex((el) => el.id === id);
    keyData.splice(spliceIndex, 1);

    newCheckedData[keyIndex].value = keyData;
    setTempCheckedDataDesignerBrand([...newCheckedData]);
  };

  const handleToggleDesignerBrand = (key, id, name) => {
    const isExist = tempCheckedDataDesignerBrand.findIndex(
      (el) => el.key === key
    );
    if (isExist === -1) {
      let payload = {
        key: key,
        value: [{ id, name }],
      };
      setTempCheckedDataDesignerBrand([
        ...tempCheckedDataDesignerBrand,
        payload,
      ]);
    } else {
      let newCheckedData1 = tempCheckedDataDesignerBrand;
      let keyData = newCheckedData1.find((el) => el.key === key)?.value;
      const keyIndex = newCheckedData1.findIndex((el) => el.key === key);
      let spliceIndex = keyData.findIndex((el) => el.id === id);
      if (spliceIndex === -1) {
        keyData.push({ id, name });
      }
      newCheckedData1[keyIndex].value = keyData;
      setTempCheckedDataDesignerBrand([...newCheckedData1]);
    }
  };

  const fetchCountryList = async () => {
    try {
      const resp = await API.get(ENDPOINTS.COUNTRY_LIST, false);
      if (resp.success) {
        let resData = [];
        for (let i of resp.data) {
          resData.push({
            value: i.name,
            label: i.name,
          });
        }
        setCountryList(resData);
      }
    } catch (e) {
      const msg =
        typeof e?.data?.error?.message === "string"
          ? e?.data?.error?.message
          : e?.data?.error?.message[0];
      Toast.showErrorToast(msg || `Error Fetching color List. Please Refresh`);
    }
  };

  const fetchMoreData = async () => {
    if (!updating && nextDesignerPage !== null) {
      try {
        setUpdating(true);
        let endPoint1 = nextDesignerPage ? nextDesignerPage : "";
        let endPoint2 = endPoint1.slice(0, 4) + "s" + endPoint1.slice(4);
        const resp = await API.get(endPoint2, isLoggedIn ? true : false);
        if (resp.success) {
          const temp = resp.data;
          setRecord([...record, ...temp.results]);
          if (!temp.next) {
            setHasMore(false);
          } else {
            if (LoadMore === 3) {
              setTimeout(async () => await setLoadMore(1), 1000);
              setHasMore(true);
            } else {
              setTimeout(async () => await setLoadMore(LoadMore + 1), 1000);
              if (LoadMore + 1 === 3) {
                setHasMore(false);
              } else {
                setHasMore(true);
              }
            }
          }
          setNextDesignerPage(resp.data.next ? resp.data.next : "");
        }
      } catch (e) {
        const msg =
          typeof e.data.error?.message === "string"
            ? e.data.error?.message
            : e.data.error?.message[0];
        Toast.showErrorToast(msg || `Error Fetching Designers. Please Refresh`);
        setHasMore(false);
      } finally {
        setUpdating(false);
      }
    }
  };
  const moreFilter = () => {
    setOpenFilter((prev) => !prev);
  };

  const handleCountrySelect = (event) => {
    setSelectedCountry(event);
  };

  const handleSort = (e) => {
    setSortValue(e);
  };

  const handleResetProduct_Type = () => {
    setTempCheckedDataDesigner([]);
  };

  const handleClear = () => {
    handleResetProduct_Type();
    setSelectedCountry("");
    setTempCheckedDataDesignerBrand([]);
    setSortValue(0);
  };

  useEffect(() => {
    fetchDesigners();
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    fetchCountryList();
    fetchDesignerNameList();
    fetchBrandlist();
  }, [openFilter]);

  useEffect(() => {
    fetchDesigners();
    //eslint-disable-next-line
  }, [
    debouncedDesignerName,
    selectedCountry,
    debouncedDesignerBrand,
    sortValue,
  ]);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <React.Fragment>
      {loading && <Loader />}
      <Grid container>
        <Grid
          container
          justify="space-between"
          className={styles.filter_section}
        >
          <Grid item container xs={5} justify="flex-start" alignItems="center">
            <Select
              id="sort"
              placeholder="Sort By:"
              style={{
                borderRadius: 8,
                width: "8.5em",
              }}
              items={[
                { label: "Sort By", value: 0 },
                { label: "Latest", value: "newest" },
                { label: "Oldest", value: "oldest" },
              ]}
              value={sortValue}
              onChange={handleSort}
              ClassName={styles.sortby_button}
            />
          </Grid>
          {/* <Grid
            item
            container
            xs={2}
            justify="flex-end"
            style={{ marginLeft: "-20px" }}
          > */}
          <Grid item sm={4} md={4} lg={4} xs={4}>
            <Grid container alignItems="center" justifyContent="flex-end">
              <Button
                className={styles.filter_button}
                onClick={() => moreFilter()}
              >
                <img src={FilterIcon} alt="i" className={styles.FilterIcon} />
                <Typography className={styles.activeStepText}>
                  Filters
                </Typography>
              </Button>
            </Grid>
          </Grid>
          {/* </Grid> */}
          {openFilter && (
            <Grid
              container
              spacing={1}
              style={{
                marginTop: "1.5em",
                display: "flex",
                padding: "0px 70px !important",
              }}
            >
              <Grid item>
                <AccordionFilter
                  getData={fetchDesignerNameList}
                  title="Designer Name"
                  placeholder="Designer Name"
                  isStaticData={false}
                  hasSearchBar={true}
                  checked={tempCheckedDataDesigner}
                  Data={designerNameList}
                  fetchMore={fetchMoreDesignerNamelist}
                  maxCount={totalDesignerName}
                  index={0}
                  handleToggle={handleToggleDesigner}
                  handleDelete={handleDeleteDesignerFilter}
                />
              </Grid>
              <Grid item>
                <AccordionFilter
                  getData={fetchBrandlist}
                  title="Brand"
                  placeholder="Brand"
                  isStaticData={false}
                  hasSearchBar={true}
                  checked={tempCheckedDataDesignerBrand}
                  Data={Brand_list}
                  fetchMore={fetchMoreDesignerBrandlist}
                  maxCount={totalDesignerBrand}
                  index={0}
                  handleToggle={handleToggleDesignerBrand}
                  handleDelete={handleDeleteDesignerBrandFilter}
                />
              </Grid>
              <Grid item>
                <SelectSearch
                  id="location"
                  isSecondary
                  items={countryList}
                  selectedItems={selectedCountry}
                  searchEnabled={true}
                  searchPlaceholder="Search Location"
                  label={selectedCountry || "Location"}
                  onSelect={handleCountrySelect}
                  onReset={() => setSelectedCountry("")}
                  ShowReset={true}
                  Showcount={true}
                  LabelClass={styles.Multiselectlabel}
                  SlectItemcls={styles.MultiSelectListItems}
                  MultiSelectCss={styles.Multiselect}
                  isDesigner={true}
                  ShowValue={true}
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
                  }}
                >
                  CLEAR ALL
                </Typography>
              </Grid>
            </Grid>
          )}
        </Grid>
        <Grid item xs={12} className={styles.bottomCtr}>
          {!loading ? (
            <>
              <Grid
                container
                spacing={4}
                style={{ marginTop: "20px", alignItems: "center" }}
              >
                {record.length
                  ? record.map((item) => (
                      <Grid
                        key={item?.id}
                        item
                        xs={12}
                        md={4}
                        lg={3}
                        xl={3}
                        sm={6}
                      >
                        <DesignerListCard
                          key={item?.id}
                          data={item}
                          viewDetail={() =>
                            history.push(`/designers/${item.id}`)
                          }
                          props={props}
                        />
                      </Grid>
                    ))
                  : null}
              </Grid>
              {record.length ? (
                <InfiniteScroll
                  dataLength={record.length}
                  next={fetchMoreData}
                  hasMore={hasMore}
                  loader={<PaginationLoader />}
                  style={{ overflow: "hidden" }}
                >
                  {LoadMore === 3 && (
                    <Grid container justifyContent="center">
                      <OutlinedPrimaryButton wide onClick={fetchMoreData}>
                        Load More
                      </OutlinedPrimaryButton>
                    </Grid>
                  )}
                </InfiniteScroll>
              ) : (
                <Grid container justify="center">
                  <Grid item xs={12}>
                    <div style={{ textAlign: "center" }}>
                      <img
                        height="399px"
                        maxWidth="446px"
                        alt="product"
                        src={noDesignerAVailableImage}
                      ></img>
                      <Typography variant="h6" style={{ marginTop: "24px" }}>
                        No Designers Available!
                      </Typography>
                    </div>
                  </Grid>
                </Grid>
              )}
            </>
          ) : (
            <LoaderContent />
          )}
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

const mapStateToProps = ({ auth: { isAuthenticated } }) => ({
  isAuthenticated,
});
export default connect(mapStateToProps, null)(Filters);
