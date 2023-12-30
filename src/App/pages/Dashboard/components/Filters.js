import React, { useEffect, useState } from "react";
import {
  Select,
  SelectSearch,
  MultiSelectCheckBox,
  Toast,
  Loader,
  OutlinedPrimaryButton,
  LoaderContent,
} from "../../../components";
import PaginationLoader from "../../../components/PaginationLoader";
import { API, ENDPOINTS } from "../../../../api/apiService";
import FilterIcon from "../../../assets/icons/FilterIconGrey.svg";
import noProductAVailableImage from "../../../assets/images/No-product-found.svg";
import noDesignerAVailableImage from "../../../assets/images/No-designer.svg";
import { Button, Grid, Typography } from "@material-ui/core";
import styles from "../Dashboard.module.css";
import InfiniteScroll from "react-infinite-scroll-component";
import ProductCard from "../../ProductListing/components/ProductCard";
import DesignerListCard from "./DesignerListCard";
import { connect } from "react-redux";
import useDebounce from "../../../hooks/useDebounce";
import { makeStyles } from "@material-ui/core/styles";
import { AccordionFilter } from "../../../components";

import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: () => ({
    top: 0,
    [theme.breakpoints.between("md", "sm")]: {
      paddingLeft: "40px",
    },
    [theme.breakpoints.down("xs")]: {
      paddingLeft: "20px",
    },
  }),
  leftContainer: {
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
  rightContainer: {
    display: "flex",
    [theme.breakpoints.down("sm")]: {
      marginRight: "48px",
    },
    [theme.breakpoints.down("xs")]: {
      marginRight: "0px",
    },
  },
  FilterButton: {
    // marginLeft: "-20px",
    justifyContent: "flex-end",
    [theme.breakpoints.down("sm")]: {
      justifyContent: "flex-start",
      marginTop: "15px",
    },
  },
}));

const Filters = (props) => {
  const ProductType = [
    {
      value: "ready",
      label: "Ready to Wear",
    },
    {
      value: "custom",
      label: "Custom Wear",
    },
  ];
  const [designerRecord, setDesignerRecord] = useState([]);
  const [selectedDesignerCountry, setSelectedDesignerCountry] = useState("");
  const [designerNameList, setDesignerNameList] = useState([]);
  const [designerCountryList, setDesignerCountryList] = useState([]);
  const [designerBrandlist, setDesignerBrandlist] = useState([]);

  const [openFilter, setOpenFilter] = useState(false);
  const [selectedProductlist, setselectedProductlist] = useState([]);
  const [selectedSubCategorylist, setselectedSubCategorylist] = useState([]);
  const [selectedSizelist, setselectedSizelist] = useState([]);
  const [sortValue, setSortValue] = useState(0);
  const [designerSortValue, setDesignerSortValue] = useState(0);
  const [activeTab, setActiveTab] = useState("all");
  const [ProductData, setProductData] = useState([]);
  const [sub_category_list, setSubCategoryList] = useState([]);
  const [Size_list, setSize_list] = useState([]);
  const [Brand_list, setBrand_list] = useState([]);
  const [Color_list, setColor_list] = useState([]);
  const [Price_list, setPrice_list] = useState([1, 9999]);
  const [Price_listLabel, setPrice_listLabel] = useState([
    { label: "Start Value", value: 1 },
    { label: "EndValue", value: 9999 },
  ]);
  const [Price_listApply, setPrice_listApply] = useState([1, 9999]);
  const [loading, setLoading] = useState(false);
  const [steps, setSteps] = useState([]);
  const [is_custom_product, setIsCustomProduct] = useState("");
  const [hasMore, setHasMore] = useState(false);
  const [hasMoreDesigner, setHasMoreDesigner] = useState(false);
  const [nextPage, setNextPage] = useState("");
  const [nextPageColor, setNextPageColor] = useState("");
  const [nextPageBrand, setNextPageBrand] = useState("");
  const [updatingColor, setUpdatingColor] = useState(false);
  const [totalColors, setTotalColors] = useState("");
  const [totalDesignerName, setDesignerNameTotal] = useState("");
  const [nextDesignerNamePage, setNextDesignerNamePage] = useState("");
  const [nextDesignerBrandPage, setNextDesignerBrandPage] = useState("");
  const [totalDesignerBrand, setTotalDesignerBrand] = useState("");
  const [totalBrand, setTotalBrand] = useState("");
  const [hasMoreColor, setHasMoreColor] = useState(false);
  const [nextDesignerPage, setNextDesignerPage] = useState("");
  const [totalProducts, setTotalProducts] = useState("");
  const [updating, setUpdating] = useState(false);
  const isLoggedIn = props.isAuthenticated;
  const [LoadMore, setLoadMore] = useState(1);
  const [Price_Label, setPriceLabel] = useState("Price Range");
  const [LoadDesignerMore, setLoadDesignerMore] = useState(1);
  const [tempCheckedData, setTempCheckedData] = useState([]);
  const [tempCheckedBrandData, setTempCheckedBrandData] = useState([]);
  const [tempCheckedDataDesigner, setTempCheckedDataDesigner] = useState([]);
  const [tempCheckedDataDesignerBrand, setTempCheckedDataDesignerBrand] =
    useState([]);
  const [prevPrice, setPrevPrice] = useState([1, 9999]);
  const debouncedDesignerName = useDebounce(tempCheckedDataDesigner, 500);
  const debouncedDesignerBrand = useDebounce(
    tempCheckedDataDesignerBrand,
    1000
  );
  const debouncedPriceTerm = useDebounce(Price_listApply, 500);

  const classes = useStyles();

  const search = props.search ? props.search : "";

  const history = useHistory();
  const title = "Test";
  const filter = {
    id: "",
    start_price: 1,
    end_price: 9999,
    page: 1,
    page_size: 20,
  };

  const queryBuilder = (url, options, searchData) => {
    if (options === undefined || !options) return url;
    let sub_category = "";
    if (selectedSubCategorylist.length > 0) {
      for (let i of selectedSubCategorylist) {
        sub_category += `&sub_category=${i.value}`;
      }
    }
    return `${url}?${"start_price=" + Price_listApply[0]}&${
      "end_price=" + Price_listApply[1]
    }&${"page=" + options.page}&${"page_size=" + options.page_size}${
      selectedSubCategorylist.length > 0 ? sub_category : ""
    }${
      searchData !== "" && searchData !== undefined
        ? `&search=${searchData}`
        : ""
    }`;
  };
  const dataQueryBuilder = (url, options, searchData) => {
    if (options === undefined || !options) return url;
    let sub_category = "";
    if (selectedSubCategorylist.length > 0) {
      for (let i of selectedSubCategorylist) {
        sub_category += `&sub_category=${i.value}`;
      }
    }
    let selected_color = "";
    if (tempCheckedData[0]?.value?.length > 0) {
      for (let i of tempCheckedData[0]?.value) {
        selected_color += `&c_id=${i.id}`;
      }
    }
    let selected_size = "";
    if (selectedSizelist.length > 0) {
      for (let i of selectedSizelist) {
        selected_size += `&size=${i.value}`;
      }
    }
    let selected_branbd = "";
    if (tempCheckedBrandData[0]?.value?.length > 0) {
      for (let i of tempCheckedBrandData[0]?.value) {
        selected_branbd += `&brand=${i.id}`;
      }
    }
    return `${url}?${"start_price=" + Price_listApply[0]}&${
      "end_price=" + Price_listApply[1]
    }&${"page=" + options.page}&${"page_size=" + options.page_size}${
      selectedSubCategorylist.length > 0 ? sub_category : ""
    }${
      is_custom_product !== "" ? `&is_custom_product=${is_custom_product}` : ""
    }${selected_color !== "" ? selected_color : ""}${
      selectedSizelist.length > 0 ? selected_size : ""
    }${selected_branbd !== "" ? selected_branbd : ""}${
      sortValue > 0 ? `&sort_by=${sortValue}` : ""
    }${
      searchData !== "" && searchData !== undefined
        ? `&search=${searchData}`
        : ""
    }`;
  };

  const dataSearchQueryBuilder = (url, options, searchResult) => {
    if (options === undefined || !options) return url;
    let sub_category = "";
    if (selectedSubCategorylist.length > 0) {
      for (let i of selectedSubCategorylist) {
        sub_category += `&sub_category=${i.value}`;
      }
    }
    let selected_color = "";
    if (tempCheckedData[0]?.value?.length > 0) {
      for (let i of tempCheckedData[0]?.value) {
        selected_color += `&c_id=${i.id}`;
      }
    }
    let selected_size = "";
    if (selectedSizelist.length > 0) {
      for (let i of selectedSizelist) {
        selected_size += `&size=${i.value}`;
      }
    }
    let selected_branbd = "";
    if (tempCheckedBrandData[0]?.value?.length > 0) {
      for (let i of tempCheckedBrandData[0]?.value) {
        selected_branbd += `&brand=${i.id}`;
      }
    }
    return `${url}?${
      searchResult !== undefined && searchResult !== ""
        ? `search=${search}&${
            activeTab !== "all" ? `category=${activeTab}&` : ""
          }`
        : ""
    }${"start_price=" + Price_listApply[0]}&${
      "end_price=" + Price_listApply[1]
    }&${"page=" + options.page}&${"page_size=" + options.page_size}${
      selectedSubCategorylist.length > 0 ? sub_category : ""
    }${
      is_custom_product !== "" ? `&is_custom_product=${is_custom_product}` : ""
    }${selected_color !== "" ? selected_color : ""}${
      selectedSizelist.length > 0 ? selected_size : ""
    }${selected_branbd !== "" ? selected_branbd : ""}${
      sortValue > 0 ? `&sort_by=${sortValue}` : ""
    }`;
  };

  const fetchSubCategories = async () => {
    try {
      let query;
      if (activeTab === "Designer") {
        return;
      }
      if (activeTab === "all") {
        query = queryBuilder(`/product/customer/sub-category`, filter);
      } else {
        query = dataQueryBuilder(
          `/product/common/sub-category/${activeTab}`,
          filter
        );
      }
      const resp = await API.get(query, false);
      if (resp.success) {
        let resData = [];
        for (let i of resp.data) {
          resData.push({
            value: i.sub_category_id,
            label: i.title,
          });
        }
        setSubCategoryList(resData);
      }
    } catch (e) {
      const msg =
        typeof e?.data?.error?.message === "string"
          ? e?.data?.error?.message
          : e?.data?.error?.message[0];
      Toast.showErrorToast(
        msg || `Error Fetching Sub Category. Please Refresh`
      );
    }
  };

  const fetchSizelist = async () => {
    try {
      let query;
      if (activeTab === "Designer") {
        return;
      }
      if (activeTab === "all") {
        query = queryBuilder(`/product/customer/size`, filter);
      } else {
        query = dataQueryBuilder(
          `/product/customer/${activeTab}/used/size`,
          filter,
          search
        );
      }

      const resp = await API.get(query, false);
      if (resp.success) {
        let resData = [];
        for (let i of resp.data) {
          resData.push({
            value: i.id,
            label: i.title,
          });
        }
        setSize_list(resData);
      }
    } catch (e) {
      const msg =
        typeof e?.data?.error?.message === "string"
          ? e?.data?.error?.message
          : e?.data?.error?.message[0];
      Toast.showErrorToast(msg || `Error Fetching Size List. Please Refresh`);
    }
  };

  const fetchBrandlist = async (searchData) => {
    try {
      let query;
      if (activeTab === "Designer") {
        return;
      }
      if (activeTab === "all") {
        query = queryBuilder(`/product/customer/brand`, filter, searchData);
      } else {
        query = dataQueryBuilder(
          `/product/customer/brand/${activeTab}`,
          filter,
          searchData
        );
      }

      const resp = await API.get(query, false);
      if (resp.success) {
        setTotalBrand(resp.data.count || 0);
        let resData = [];
        for (let i of resp.data.results) {
          resData.push({
            value: i.id,
            label: i.brand_name,
          });
        }
        setBrand_list(resData);
        setNextPageBrand(resp.data.next ? resp.data.next : "");
      }
    } catch (e) {
      const msg =
        typeof e?.data?.error?.message === "string"
          ? e?.data?.error?.message
          : e?.data?.error?.message[0];
      Toast.showErrorToast(msg || `Error Fetching Brand List. Please Refresh`);
    }
  };

  const fetchMoreBrandlist = async () => {
    if (nextPageBrand !== null) {
      try {
        let endPoint1 = nextPageBrand ? nextPageBrand : "";
        let endPoint2 = endPoint1.slice(0, 4) + "s" + endPoint1.slice(4);
        const resp = await API.get(endPoint2, isLoggedIn ? true : false);
        if (resp.success) {
          setTotalBrand(resp.data.count || 0);
          let resData = [...Brand_list];
          for (let i of resp.data) {
            resData.push({
              value: i.id,
              label: i.brand_name,
            });
          }
          setBrand_list(resData);
          setNextPageBrand(resp.data.next ? resp.data.next : "");
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

  const fetchColorlist = async (searchData) => {
    try {
      let query;
      if (activeTab === "Designer") {
        return;
      }
      if (activeTab === "all") {
        query = queryBuilder(`/product/customer/colour`, filter, searchData);
      } else {
        query = dataQueryBuilder(
          `/product/customer/${activeTab}/used/colour`,
          filter,
          searchData
        );
      }

      const resp = await API.get(query, false);
      if (resp.success) {
        let resData = [];
        setTotalColors(resp.data.count || 0);
        for (let i of resp.data.results) {
          resData.push({
            value: i.id,
            label: i.name,
            hexcode: i.hex_code,
          });
        }
        setColor_list(resData);
        if (resp.data.next == null) {
          setHasMoreColor(false);
        } else if (resp.data.next !== null) {
          setHasMoreColor(true);
        }
        if (resData.length === resp.data.count) {
          setHasMoreColor(false);
        }

        setColor_list(resData);
        setNextPageColor(resp.data.next ? resp.data.next : "");
      }
    } catch (e) {
      const msg =
        typeof e?.data?.error?.message === "string"
          ? e?.data?.error?.message
          : e?.data?.error?.message[0];
      Toast.showErrorToast(msg || `Error Fetching color List. Please Refresh`);
    }
  };

  const fetchMoreColorlist = async () => {
    if (!updatingColor && nextPageColor !== null) {
      try {
        setUpdatingColor(true);
        let endPoint1 = nextPageColor ? nextPageColor : "";
        let endPoint2 = endPoint1.slice(0, 4) + "s" + endPoint1.slice(4);
        const resp = await API.get(endPoint2, isLoggedIn ? true : false);
        if (resp.success) {
          setTotalColors(resp.data.count || 0);
          let resData = [...Color_list];
          for (let i of resp.data.results) {
            resData.push({
              value: i.id,
              label: i.name,
              hexcode: i.hex_code,
            });
          }
          setColor_list(resData);
          setNextPageColor(resp.data.next ? resp.data.next : "");
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
      } finally {
        setUpdatingColor(false);
      }
    }
  };

  /*Fetch product parent category */
  const getParentCategoryList = async () => {
    try {
      const resp = await API.get(ENDPOINTS.PARENT_CATEGORIES, false);
      if (resp.success) {
        let resData1 = [];
        let resData = [
          {
            title: "All",
            tab: "all",
            id: "all",
          },
        ];
        for (let i of resp.data) {
          resData1.push({
            value: i.id,
            label: i.title,
          });
          resData.push({
            id: i.id,
            title: i.title,
            tab: i.id,
          });
        }
        setSteps(resData);
        fetchSubCategories(resData1);
        fetchSizelist(resData1);
        fetchBrandlist(resData1);
        setActiveTab("all");
      }
    } catch (e) {
      console.log(e, "error in get parent category list");
    }
  };

  const getallproductList = async () => {
    try {
      setLoading(true);
      let query;
      if (activeTab === "Designer") {
        return;
      }
      if (activeTab === "all") {
        if (search !== undefined && search !== "") {
          query = dataSearchQueryBuilder(`${ENDPOINTS.SEARCH}`, filter, search);
        } else {
          query = dataQueryBuilder(ENDPOINTS.ALL, filter);
        }
      } else {
        if (search !== undefined && search !== "") {
          query = dataSearchQueryBuilder(`${ENDPOINTS.SEARCH}`, filter, search);
        } else {
          query = dataQueryBuilder(`${ENDPOINTS.ALL}${activeTab}`, filter);
        }
      }
      const resp = await API.get(query, isLoggedIn ? true : false);
      if (resp.success) {
        setTotalProducts(resp.data.count || 0);
        setProductData([]);
        let resData = [];
        for (let i of resp.data.results) {
          resData.push({
            id: i.product_id,
            url: i.cover_image_url,
            title: i.title,
            price: i.price,
            wishlist: i.wishlist,
            is_custom_product: i.is_custom_product,
            offer_price: i.offer ? i.offer.offer_price : "",
            category: i.category ? i.category : "",
            rating: i.rating,
            thumbnail: i.p_thumbnail,
          });
        }
        if (resp.data.next == null) {
          setHasMore(false);
        } else if (resp.data.next !== null) {
          setHasMore(true);
        }
        if (resData.length === resp.data.count) {
          setHasMore(false);
        }

        setProductData(resData);
        setNextPage(resp.data.next ? resp.data.next : "");
      }
    } catch (e) {
      console.log(e, "error in fetching Product");
    } finally {
      setLoading(false);
    }
  };

  const fetchMoreData = async () => {
    if (!updating && nextPage !== null) {
      try {
        setUpdating(true);
        let endPoint1 = nextPage ? nextPage : "";
        let endPoint2 = endPoint1.slice(0, 4) + "s" + endPoint1.slice(4);
        const resp = await API.get(endPoint2, isLoggedIn ? true : false);
        if (resp.success) {
          setTotalProducts(resp.data.count || 0);
          let resData = [...ProductData];
          for (let i of resp.data.results) {
            resData.push({
              id: i.product_id,
              url: i.cover_image_url,
              title: i.title,
              price: i.price,
              wishlist: i.wishlist,
              is_custom_product: i.is_custom_product,
              offer_price: i.offer ? i.offer.offer_price : "",
              category: i.category ? i.category : "",
              rating: i.rating,
              thumbnail: i.p_thumbnail,
            });
          }
          if (resp.data.next == null) {
            setHasMore(false);
          } else if (resp.data.next !== null) {
            if (LoadMore === 3) {
              setLoadMore(1);
              setHasMore(true);
            } else {
              setLoadMore(LoadMore + 1);
              if (LoadMore + 1 === 3) {
                setHasMore(false);
              } else {
                setHasMore(true);
              }
            }
          }
          if (resData.length === totalProducts) {
            setLoadMore(1);
            setHasMore(false);
          } else if (resData.length !== totalProducts && LoadMore + 1 < 3) {
            setHasMore(true);
          }
          setProductData(resData);

          setNextPage(resp.data.next ? resp.data.next : "");
        }
      } catch (e) {
        const msg =
          typeof e.data.error?.message === "string"
            ? e.data.error?.message
            : e.data.error?.message[0];
        Toast.showErrorToast(
          msg || `Error Fetching product list. Please Refresh`
        );
      } finally {
        setUpdating(false);
      }
    }
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
    return `${url}/?${`page=${options.page}`}&${`page_size=${options.page_size}`}${
      designerSortValue !== 0 ? `&ordering=${designerSortValue}` : ""
    }${tempCheckedDataDesigner[0]?.value?.length > 0 ? designer : ``}${
      tempCheckedDataDesignerBrand[0]?.value?.length > 0 ? brand : ``
    }${selectedDesignerCountry ? `&country=${selectedDesignerCountry}` : ""}${
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
        search
      );
      const resp = await API.get(query, false);
      if (resp.success) {
        const temp = resp.data;
        setDesignerRecord(temp.results);
        setNextDesignerPage(resp.data.next ? resp.data.next : "");
        if (!temp.next) {
          setHasMoreDesigner(false);
        } else {
          setHasMoreDesigner(true);
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
  const fetchDesignerMoreData = async () => {
    if (!updating && nextPage !== null) {
      try {
        setUpdating(true);
        let endPoint1 = nextDesignerPage ? nextDesignerPage : "";
        let endPoint2 = endPoint1.slice(0, 4) + "s" + endPoint1.slice(4);
        const resp = await API.get(endPoint2, isLoggedIn ? true : false);
        if (resp.success) {
          const temp = resp.data;
          setTotalProducts(resp.data.count || 0);
          setDesignerRecord([...designerRecord, ...temp.results]);
          if (!temp.next) {
            setHasMoreDesigner(false);
          } else {
            if (LoadDesignerMore === 3) {
              setTimeout(async () => await setLoadDesignerMore(1), 1000);
              setHasMoreDesigner(true);
            } else {
              setTimeout(
                async () => await setLoadDesignerMore(LoadDesignerMore + 1),
                1000
              );
              if (LoadDesignerMore + 1 === 3) {
                setHasMoreDesigner(false);
              } else {
                setHasMoreDesigner(true);
              }
            }
          }
        }
      } catch (e) {
        const msg =
          typeof e.data.error?.message === "string"
            ? e.data.error?.message
            : e.data.error?.message[0];
        Toast.showErrorToast(msg || `Error Fetching Designers. Please Refresh`);
        setHasMoreDesigner(false);
      } finally {
        setUpdating(false);
      }
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

  const fetchDesignerBrandlist = async (resData) => {
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
        setDesignerBrandlist(resData);
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
          let resData = [...designerBrandlist];
          for (let i of resp.data.results) {
            resData.push({
              value: i.id,
              label: i.brand_name,
            });
          }
          setDesignerBrandlist(resData);
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

  const fetchDesignerCountryList = async () => {
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
        setDesignerCountryList(resData);
      }
    } catch (e) {
      const msg =
        typeof e?.data?.error?.message === "string"
          ? e?.data?.error?.message
          : e?.data?.error?.message[0];
      Toast.showErrorToast(msg || `Error Fetching color List. Please Refresh`);
    }
  };

  const moreFilter = () => {
    setOpenFilter((prev) => !prev);
  };

  const handleChange = (event) => {
    if (event?.length > 0) {
      if (event?.length === 1 && event[0].value === "custom") {
        setIsCustomProduct(true);
      } else {
        setIsCustomProduct(false);
      }
    }
    if (event?.length === 2) {
      setIsCustomProduct("");
    }
    if (event?.length === 0) {
      setIsCustomProduct("");
    }
    setselectedProductlist(event);
  };

  const handleSubCategoryChange = (event) => {
    setselectedSubCategorylist(event);
  };

  const handleSizeChange = (event) => {
    setselectedSizelist(event);
  };

  const handleDesignerCountrySelect = (event) => {
    setSelectedDesignerCountry(event);
  };

  const changeTab = (value) => {
    if (value) {
      handleClear();
      setActiveTab(value);
      setOpenFilter(false);
    }
  };

  const handleSort = (e) => {
    setSortValue(e);
  };

  const handleDesignerSort = (e) => {
    setDesignerSortValue(e);
  };

  const handleResetProduct_Type = () => {
    setIsCustomProduct("");
    setselectedProductlist([]);
  };

  useEffect(() => {
    if (activeTab === "Designer") {
      fetchDesigners();
    }
    //eslint-disable-next-line
  }, [
    debouncedDesignerName,
    selectedDesignerCountry,
    debouncedDesignerBrand,
    designerSortValue,
  ]);

  useEffect(() => {
    if (activeTab === "Designer") {
      fetchDesignerCountryList();
      fetchDesignerNameList();
      fetchDesignerBrandlist();
    }
  }, [activeTab]);

  /*Reset price in select list */
  const handlePriceReset = () => {
    setPrice_list([1, 9999]);
    setPrevPrice(Price_listApply);
    setPrice_listApply([1, 9999]);
    const val = [
      { label: "Start Value", value: 1 },
      { label: "EndValue", value: 9999 },
    ];
    setPrice_listLabel(val);
  };

  /*Clear all filters */
  const handleClear = () => {
    handleResetProduct_Type();
    setselectedSubCategorylist([]);
    setPrice_list([1, 9999]);
    setPrevPrice(Price_listApply);
    setPrice_listApply([1, 9999]);
    setTempCheckedData([]);
    setselectedSizelist([]);
    setTempCheckedBrandData([]);
    setSelectedDesignerCountry("");
    setTempCheckedDataDesignerBrand([]);
    setTempCheckedDataDesigner([]);
    setSortValue(0);
    setDesignerSortValue(0);
    const val = [
      { label: "Start Value", value: 1 },
      { label: "EndValue", value: 9999 },
    ];
    setPrice_listLabel(val);
    setPriceLabel("Price Range");
  };

  const handlePriceChange = (event) => {
    const val = [
      { label: "Start Value", value: event[0] },
      { label: "EndValue", value: event[1] },
    ];
    setPrevPrice(Price_listApply);
    setPrice_listLabel(val);
  };

  const handleDeleteFilter = (key, id) => {
    let newCheckedData = tempCheckedData;
    let keyData = newCheckedData.find((el) => el.key === key)?.value;
    const keyIndex = newCheckedData.findIndex((el) => el.key === key);
    let spliceIndex = keyData.findIndex((el) => el.id === id);
    keyData.splice(spliceIndex, 1);

    newCheckedData[keyIndex].value = keyData;
    setTempCheckedData([...newCheckedData]);
  };

  const handleDeleteBrandFilter = (key, id) => {
    let newCheckedData = tempCheckedBrandData;
    let keyData = newCheckedData.find((el) => el.key === key)?.value;
    const keyIndex = newCheckedData.findIndex((el) => el.key === key);
    let spliceIndex = keyData.findIndex((el) => el.id === id);
    keyData.splice(spliceIndex, 1);

    newCheckedData[keyIndex].value = keyData;
    setTempCheckedBrandData([...newCheckedData]);
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

  const handleDeleteDesignerBrandFilter = (key, id) => {
    let newCheckedData = tempCheckedDataDesignerBrand;
    let keyData = newCheckedData.find((el) => el.key === key)?.value;
    const keyIndex = newCheckedData.findIndex((el) => el.key === key);
    let spliceIndex = keyData.findIndex((el) => el.id === id);
    keyData.splice(spliceIndex, 1);

    newCheckedData[keyIndex].value = keyData;
    setTempCheckedDataDesignerBrand([...newCheckedData]);
  };

  const handleToggle = (key, id, name, hexcode) => {
    const isExist = tempCheckedData.findIndex((el) => el.key === key);
    if (isExist === -1) {
      let payload = {
        key: key,
        value: [{ id, name, hexcode }],
      };
      setTempCheckedData([...tempCheckedData, payload]);
    } else {
      let newCheckedData1 = tempCheckedData;
      let keyData = newCheckedData1.find((el) => el.key === key)?.value;
      const keyIndex = newCheckedData1.findIndex((el) => el.key === key);
      let spliceIndex = keyData.findIndex((el) => el.id === id);
      if (spliceIndex === -1) {
        keyData.push({ id, name, hexcode });
      }
      newCheckedData1[keyIndex].value = keyData;
      setTempCheckedData([...newCheckedData1]);
    }
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

  const handleToggleBrand = (key, id, name) => {
    const isExist = tempCheckedBrandData.findIndex((el) => el.key === key);
    if (isExist === -1) {
      let payload = {
        key: key,
        value: [{ id, name }],
      };
      setTempCheckedBrandData([...tempCheckedBrandData, payload]);
    } else {
      let newCheckedData1 = tempCheckedBrandData;
      let keyData = newCheckedData1.find((el) => el.key === key)?.value;
      const keyIndex = newCheckedData1.findIndex((el) => el.key === key);
      let spliceIndex = keyData.findIndex((el) => el.id === id);
      if (spliceIndex === -1) {
        keyData.push({ id, name });
      }
      newCheckedData1[keyIndex].value = keyData;
      setTempCheckedBrandData([...newCheckedData1]);
    }
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

  const fetchFilters = async () => {
    await fetchColorlist();
    await fetchSizelist();
    await fetchBrandlist();
    await fetchSubCategories();
  };

  useEffect(() => {
    getParentCategoryList();
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    fetchFilters();
    //eslint-disable-next-line
  }, [selectedSubCategorylist, activeTab]);

  useEffect(() => {
    getallproductList();
    //eslint-disable-next-line
  }, [
    is_custom_product,
    tempCheckedBrandData,
    selectedSubCategorylist,
    tempCheckedData,
    selectedSizelist,
    activeTab,
    sortValue,
    search,
  ]);

  useEffect(() => {
    if (
      debouncedPriceTerm[0] !== prevPrice[0] ||
      debouncedPriceTerm[1] !== prevPrice[1]
    ) {
      getallproductList();
    }
    //eslint-disable-next-line
  }, [debouncedPriceTerm]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <React.Fragment>
      {loading && <Loader />}
      <Grid container className={styles.filter_section}>
        <Grid container xs={12} md={8} lg={8} sm={12} xl={8} spacing={3}>
          {/*Sort by filter */}
          {activeTab !== "Designer" ? (
            <Grid item container sm={5} md={5} lg={6} xs={12} xl={5}>
              <Grid container justify="flex-start" alignItems="center">
                <Grid item xs={5}>
                  <Select
                    id="sort"
                    placeholder="Sort By:"
                    style={{
                      borderRadius: 8,
                      width: "9.5em",
                    }}
                    items={[
                      { label: "Sort By", value: 0 },
                      { label: "Latest", value: 4 },
                      { label: "Price- High to Low", value: 2 },
                      { label: "Price- Low to High ", value: 3 },
                      { label: "Sale", value: 6 },
                      { label: "Rating : High to Low", value: 5 },
                    ]}
                    value={sortValue}
                    onChange={handleSort}
                    ClassName={styles.sortby_button}
                  />
                </Grid>
              </Grid>
            </Grid>
          ) : (
            <Grid item container sm={5} md={5} lg={6} xs={12} xl={5}>
              <Grid container justify="flex-start" alignItems="center">
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
                  value={designerSortValue}
                  onChange={handleDesignerSort}
                  ClassName={styles.sortby_button}
                />
              </Grid>
            </Grid>
          )}

          {/*Category Tab */}
          <Grid item sm={7} md={7} lg={6} xl={6} xs={12} spacing={1}>
            <Grid container alignItems="center" justifyContent="center">
              {steps.map((step) => {
                return (
                  <Grid
                    key={step.id}
                    className={
                      activeTab === step.tab
                        ? styles.activeStepCtr
                        : styles.stepCtr
                    }
                    onClick={() => changeTab(step.id)}
                  >
                    <div
                      className={
                        activeTab === step.tab
                          ? styles.activeStepText
                          : styles.stepText
                      }
                    >
                      {step.title}
                    </div>
                  </Grid>
                );
              })}
            </Grid>
          </Grid>
        </Grid>
        {/*Filter Icon */}
        <Grid item sm={4} md={4} lg={4} xs={4}>
          <Grid container alignItems="center" className={classes.FilterButton}>
            <Button
              className={styles.filter_button}
              onClick={() => moreFilter()}
            >
              <img src={FilterIcon} alt="i" className={styles.FilterIcon} />
              <Typography className={styles.activeStepText}>Filters</Typography>
            </Button>
          </Grid>
        </Grid>

        {openFilter &&
          (activeTab !== "Designer" ? (
            <Grid
              container
              spacing={1}
              style={{
                marginTop: "1.5em",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Grid item xs={12} sm={10} md={11}>
                <Grid container spacing={1}>
                  <Grid item>
                    <MultiSelectCheckBox
                      id="Product-type"
                      isSecondary
                      items={ProductType}
                      selectedItems={selectedProductlist}
                      label="Product Type"
                      onSelect={handleChange}
                      onReset={handleResetProduct_Type}
                      ShowReset={true}
                      Showcount={true}
                      LabelClass={styles.Multiselectlabel}
                      SlectItemcls={styles.MultiSelectListItems}
                    />
                  </Grid>
                  <Grid item>
                    <MultiSelectCheckBox
                      id="sub-category"
                      isSecondary
                      items={sub_category_list}
                      selectedItems={selectedSubCategorylist}
                      searchEnabled={true}
                      searchPlaceholder="Search By Sub categories"
                      label="Sub Categories"
                      onSelect={handleSubCategoryChange}
                      onReset={() => setselectedSubCategorylist([])}
                      ShowReset={true}
                      Showcount={true}
                      LabelClass={styles.Multiselectlabel}
                      SlectItemcls={styles.MultiSelectListItems}
                    />
                  </Grid>
                  <Grid item>
                    <MultiSelectCheckBox
                      id="price-range"
                      isSecondary
                      items={Price_listLabel}
                      selectedItems={Price_listLabel}
                      label={Price_Label}
                      onSelect={handlePriceChange}
                      onReset={handlePriceReset}
                      ShowReset={false}
                      Showcount={true}
                      ShowSlider={true}
                      SliderValue={Price_list}
                      SliderData={setPrice_list}
                      SliderMin={1}
                      SliderMax={9999}
                      SliderStep={10}
                      SliderStartlabel="Start Price"
                      SliderEndlabel="End Price"
                      ShowSliderField={true}
                      LabelClass={styles.Multiselectlabel}
                      SlectItemcls={styles.MultiSelectListItems}
                      ShowApplyClear={true}
                      onApply={() => setPrice_listApply(Price_list)}
                    />
                  </Grid>
                  <Grid item>
                    <AccordionFilter
                      getData={fetchColorlist}
                      title="Color"
                      placeholder="Color"
                      isStaticData={false}
                      hasSearchBar={true}
                      checked={tempCheckedData}
                      Data={Color_list}
                      fetchMore={fetchMoreColorlist}
                      maxCount={totalColors}
                      hasMore={hasMoreColor}
                      index={0}
                      handleToggle={handleToggle}
                      handleDelete={handleDeleteFilter}
                    />
                  </Grid>
                  <Grid item>
                    <MultiSelectCheckBox
                      id="size"
                      isSecondary
                      items={Size_list}
                      selectedItems={selectedSizelist}
                      label="Size"
                      onSelect={handleSizeChange}
                      onReset={() => setselectedSizelist([])}
                      ShowReset={true}
                      Showcount={true}
                      LabelClass={styles.Multiselectlabel}
                      SlectItemcls={styles.MultiSelectListItems}
                    />
                  </Grid>
                  <Grid item>
                    <AccordionFilter
                      getData={fetchBrandlist}
                      title="Brand"
                      placeholder="Brand"
                      isStaticData={false}
                      hasSearchBar={true}
                      checked={tempCheckedBrandData}
                      Data={Brand_list}
                      fetchMore={fetchMoreBrandlist}
                      maxCount={totalBrand}
                      index={0}
                      handleToggle={handleToggleBrand}
                      handleDelete={handleDeleteBrandFilter}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} sm={2} md={1}>
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
          ) : (
            <Grid
              container
              spacing={1}
              style={{
                marginTop: "1.5em",
                padding: "0 20px",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Grid item xs={12} md={10}>
                <Grid container spacing={1} style={{ display: "flex" }}>
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
                      getData={fetchDesignerBrandlist}
                      title="Brand"
                      placeholder="Brand"
                      isStaticData={false}
                      hasSearchBar={true}
                      checked={tempCheckedDataDesignerBrand}
                      Data={designerBrandlist}
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
                      items={designerCountryList}
                      selectedItems={selectedDesignerCountry}
                      searchEnabled={true}
                      searchPlaceholder="Search Location"
                      label={selectedDesignerCountry || "Location"}
                      onSelect={handleDesignerCountrySelect}
                      onReset={() => setSelectedDesignerCountry("")}
                      ShowReset={true}
                      Showcount={true}
                      LabelClass={styles.Multiselectlabel}
                      SlectItemcls={styles.MultiSelectListItems}
                      MultiSelectCss={styles.MultiselectDesigner}
                      isDesigner={true}
                      ShowValue={true}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid
                item
                xs={12}
                md={2}
                style={{ display: "flex", justifyContent: "flex-end" }}
              >
                <Typography
                  onClick={handleClear}
                  style={{
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "#FC68A2",
                    marginTop: "10px",
                    cursor: "pointer",
                    alignItems: "center",
                  }}
                >
                  CLEAR ALL
                </Typography>
              </Grid>
            </Grid>
          ))}

        {activeTab === "Designer" ? (
          <Grid
            item
            xs={12}
            styles={{ marginTop: "20px", marginBottom: "20px" }}
          >
            {!loading ? (
              <>
                <Grid
                  container
                  spacing={4}
                  style={{ marginTop: "20px", alignItems: "center" }}
                >
                  {designerRecord.length
                    ? designerRecord.map((item, index) => (
                        <Grid
                          item
                          key={index}
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
                {designerRecord.length ? (
                  <InfiniteScroll
                    dataLength={designerRecord.length}
                    next={fetchDesignerMoreData}
                    hasMore={hasMoreDesigner}
                    loader={<PaginationLoader />}
                    style={{ overflow: "hidden" }}
                  >
                    {LoadDesignerMore === 3 && (
                      <Grid
                        container
                        justifyContent="center"
                        style={{ marginTop: 10 }}
                      >
                        <OutlinedPrimaryButton
                          wide
                          onClick={fetchDesignerMoreData}
                        >
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
        ) : (
          <>
            {ProductData.length ? (
              <Grid container justifyContent="center">
                <Grid container spacing={4} className={styles.ProductContainer}>
                  {ProductData.length
                    ? ProductData.map((data, index) => (
                        <Grid
                          item
                          xs={12}
                          md={4}
                          lg={3}
                          xl={3}
                          sm={6}
                          key={index}
                        >
                          <ProductCard data={data} hrefTitle={title} />
                        </Grid>
                      ))
                    : ""}
                </Grid>
                <InfiniteScroll
                  dataLength={ProductData.length}
                  loader={<PaginationLoader />}
                  style={{ overflow: "hidden" }}
                  next={fetchMoreData}
                  hasMore={hasMore}
                ></InfiniteScroll>
                {LoadMore === 3 && (
                  <Grid
                    container
                    justifyContent="center"
                    style={{ marginTop: 10 }}
                  >
                    <OutlinedPrimaryButton wide onClick={fetchMoreData}>
                      Load More
                    </OutlinedPrimaryButton>
                  </Grid>
                )}
              </Grid>
            ) : (
              <Grid
                item
                xs={12}
                style={{ textAlign: "center", marginTop: "45px" }}
              >
                <img
                  height="330px"
                  maxWidth="446px"
                  alt="product"
                  src={noProductAVailableImage}
                  style={{ alignContent: "center" }}
                ></img>
                <Typography
                  style={{
                    marginTop: "24px",
                    fontSize: "16px",
                    fontWeight: 600,
                  }}
                >
                  No products found!!
                </Typography>
              </Grid>
            )}
          </>
        )}
      </Grid>
    </React.Fragment>
  );
};

const mapStateToProps = ({ auth: { isAuthenticated } }) => ({
  isAuthenticated,
});
export default connect(mapStateToProps, null)(Filters);
