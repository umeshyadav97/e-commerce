import React, { useState, useEffect } from "react";
import { withStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import MuiDialogActions from "@material-ui/core/DialogActions";
import { Box, Grid, Paper, Typography } from "@material-ui/core";
import Placeholder from "../../../assets/icons/product-placeholder.svg";
import styles from "../appointment.module.css";
import EmptyResults from "./EmptyResult";
import { Pagination } from "@material-ui/lab";
import {
  Loader,
  PrimaryButton,
  SearchInput,
  Select,
  Toast,
} from "../../../components";
import useDebounce from "../../../hooks/useDebounce";
import { ENDPOINTS } from "../../../../api/apiRoutes";
import { API } from "../../../../api/apiService";
import Checkbox from "./CheckBox";
import Lottie from "lottie-react";
import ImgLoader from "../../../assets/imageLoader.json";
import { ellipsizeText } from "../../../../utils/textUtils";

const defaultPagination = {
  page: 1,
  pageSize: 12,
};

const AddProduct = (props) => {
  const {
    open,
    title,
    handleClose,
    designerId,
    setProductIds,
    setSelectedIds,
    ProductID,
  } = props;
  const [loading, setLoading] = useState(true);
  const [record, setRecord] = useState([]);
  const [isSelected, setIsSelected] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [updating, setUpdating] = useState(false);
  const [filter, setFilter] = useState({
    search: null,
    category: 0,
    subCategory: 0,
    type: 0,
  });
  const debouncedSearchTerm = useDebounce(filter.search, 500);
  const [pagination, setPagination] = useState(defaultPagination);
  const total = isSelected.length;
  const rtw = "empty";
  const [imgLoading, setImgLoading] = useState(true);

  const queryBuilder = (url, options) => {
    if (options === undefined || !options) return url;

    return `${url}${options.search ? `?search=${options.search}` : ""}${
      options.type && options.search ? `&is_custom_product=${options.type}` : ""
    }${
      options.type && !options.search
        ? `?is_custom_product=${options.type}`
        : ""
    }${
      options.category && !options.type ? `?category=${options.category}` : ""
    }${
      options.category && options.type ? `&category=${options.category}` : ""
    }${options.subCategory ? `&sub_category=${options.subCategory}` : ""}`;
  };

  const handleCloseModal = () => {
    handleClose();
  };

  const handleFilters = () => {
    const temp = { ...filter };
    if (temp.search === "") {
      delete temp.search;
    }
    if (temp.category === 0) {
      delete temp.category;
      delete temp.subCategory;
    }
    if (temp.subCategory === 0) {
      delete temp.subCategory;
    }
    if (temp.type === 0) {
      delete temp.type;
    }
    return temp;
  };

  const handleCloseSearch = () => {
    if (filter.search !== "") {
      let tempData = { ...filter };
      tempData["search"] = "";
      tempData["page"] = 1;
      setFilter(tempData);
    }
  };

  const handleChange = (key) => (event) => {
    let tempData = { ...filter };
    if (key === "search") {
      tempData["search"] = event.target.value;
    } else {
      tempData[key] = event;
    }
    tempData["page"] = 1;
    setFilter(tempData);
  };

  const handleCheckBox = (id) => {
    let tempData = [...isSelected];
    if (tempData.includes(id)) {
      const arr = tempData.filter((item) => item !== id);
      tempData = arr;
    } else {
      tempData.push(id);
    }
    setIsSelected(tempData);
  };

  const fetchProductList = async () => {
    setLoading(true);
    const CURRENT_FILTER = handleFilters();
    const query = queryBuilder(
      `${ENDPOINTS.PRODUCT_LIST}${designerId}/product-list`,
      CURRENT_FILTER
    );
    const resp = await API.get(query);
    if (resp.success) {
      const result = resp.data;
      const Product = result.results.filter(
        (item) => !ProductID?.includes(item.product_id)
      );
      setRecord(Product);
    } else {
      const msg = resp.error?.message;
      Toast.showErrorToast(msg || `Error Fetching Custom List. Please Refresh`);
    }
    setLoading(false);
  };

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const resp = await API.get(ENDPOINTS.PARENT_CATEGORY_LIST);
      if (resp.success) {
        const result = resp.data;
        let temp = result.map((item) => ({
          value: item.id,
          label: item.title,
          id: item.id,
        }));
        temp.unshift({
          label: "Category",
          value: 0,
        });
        setCategory(temp);
      }
    } catch (e) {
      const msg =
        typeof e.data.error?.message === "string"
          ? e.data.error?.message
          : e.data.error?.message[0];
      Toast.showErrorToast(msg || `Error Fetching Categories. Please Refresh`);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubCategories = async () => {
    const resp = await API.get(
      `/product/common/sub-category/${filter.category}`
    );
    if (resp.success) {
      const result = resp.data;
      if (result.length) {
        let temp = result.map((item) => ({
          value: item.sub_category_id,
          label: item.title,
        }));
        temp.unshift({
          label: "Subcategory",
          value: 0,
        });
        setSubCategories(temp);
      }
      setFilter({ ...filter, sub_category: 0 });
    } else {
      const msg = typeof resp.error?.message === "string";
      Toast.showErrorToast(
        msg || `Error Fetching Sub-Categories. Please Refresh`
      );
    }
  };

  const handleSubmit = async () => {
    if (!updating) {
      try {
        setUpdating(true);
        setLoading(true);
        const products = isSelected;
        const payload = { products };
        const resp = await API.post(
          `${ENDPOINTS.PRODUCT_LIST}${designerId}/selected-products`,
          payload
        );
        if (resp.success) {
          setSelectedIds(isSelected);
          setProductIds(resp.data);
          setUpdating(false);
          handleCloseModal();
          handleClose();
        }
      } catch (e) {
        setUpdating(false);
        const msg =
          typeof e.data.error?.message === "string"
            ? e.data.error?.message
            : e.data.error?.message[0];
        Toast.showErrorToast(msg || `Error Adding products. Please try again`);
      } finally {
        setLoading(false);
        setUpdating(false);
      }
    }
  };

  useEffect(() => {
    fetchCategories();

    setFilter({
      search: "",
      category: 0,
      subCategory: 0,
      type: 0,
    });
    setPagination(defaultPagination);
    fetchProductList();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (filter.category !== 0) {
      fetchSubCategories();
    }
    //eslint-disable-next-line
  }, [filter.category]);

  useEffect(() => {
    fetchProductList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchTerm, filter]);
  return (
    <>
      <Dialog
        maxWidth="lg"
        fullWidth
        scroll="body"
        onClose={handleCloseModal}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle id="customized-dialog-title" onClose={handleCloseModal}>
          {title}
        </DialogTitle>
        <DialogContent style={{ background: "#f4f7fd" }}>
          {loading && <Loader />}
          <Paper className={styles.paper_list}>
            <Box p={2} mb={2}>
              <Grid item container justifyContent="space-between" spacing={2}>
                <Grid
                  item
                  xs={12}
                  md={5}
                  container
                  alignItems="center"
                  style={{ display: "flex" }}
                >
                  <div className={styles.header_1}>Select Product-{total}</div>
                  <div className={styles.separator}></div>
                  <SearchInput
                    is_open={false}
                    is_input_open={true}
                    value={filter.search}
                    onChange={handleChange("search")}
                    onClose={handleCloseSearch}
                    placeholder="Search by name"
                    style={{
                      width: "160px",
                      borderRadius: 8,
                      border: "1.4px solid #DFE7F5",
                      height: 42,
                      backgroundColor: "#F4F7FD",
                      color: "#A4B3CC",
                      paddingLeft: "15px",
                      paddingRight: "15px",
                    }}
                  />
                </Grid>
                <Grid
                  item
                  container
                  xs={12}
                  md={7}
                  className={styles.calenderBox}
                  spacing={2}
                >
                  <Grid item>
                    <Box>
                      <Select
                        id="type"
                        isSecondary={true}
                        items={TYPE}
                        value={filter.type}
                        onChange={handleChange("type")}
                        style={{ width: "180px" }}
                      ></Select>
                    </Box>
                  </Grid>
                  <Grid item>
                    <Box ml={1}>
                      <Select
                        id="category"
                        isSecondary={true}
                        items={category}
                        value={filter.category}
                        onChange={handleChange("category")}
                        style={{ width: "180px" }}
                      ></Select>
                    </Box>
                  </Grid>
                  {filter?.category && subCategories?.length > 0 ? (
                    <Grid item>
                      <Box ml={1}>
                        <Select
                          id="subCategory"
                          isSecondary={true}
                          items={subCategories}
                          value={filter.subCategory}
                          onChange={handleChange("subCategory")}
                          style={{ width: "180px" }}
                        ></Select>
                      </Box>
                    </Grid>
                  ) : null}
                </Grid>
              </Grid>
            </Box>
          </Paper>
          {record.length ? (
            <>
              <Grid container xs={12}>
                <Grid container xs={12} style={{ margin: "20px 0px" }}>
                  {record
                    ?.slice(
                      pagination.pageSize * (pagination.page - 1),
                      pagination.pageSize * pagination.page
                    )
                    .map((item, index) => (
                      <Grid item key={index} xs={12} sm={4} md={3} lg={2}>
                        <Box className={styles.product_card_1}>
                          <div
                            className={styles.product_div_1}
                            onClick={() => handleCheckBox(item.product_id)}
                          >
                            {imgLoading && (
                              <Lottie
                                className={styles.product_img_1}
                                animationData={ImgLoader}
                              />
                            )}
                            <img
                              src={item?.cover_image_url || Placeholder}
                              alt="rtw"
                              className={styles.product_img_1}
                              onLoad={() => setImgLoading(false)}
                              style={{
                                display: imgLoading ? "none" : "flex",
                              }}
                            />
                            {item.type === "Ready to Wear" ? (
                              <Grid className={styles.inventory_action_btn_2}>
                                <Typography className={styles.rtw_text}>
                                  RTW
                                </Typography>
                              </Grid>
                            ) : (
                              <Grid className={styles.inventory_action_btn}>
                                <Typography className={styles.custom_text}>
                                  Custom
                                </Typography>
                              </Grid>
                            )}
                            <div className={styles.inventory_action_btn_1}>
                              <Checkbox
                                isOn={isSelected.includes(item.product_id)}
                                onToggle={() => handleCheckBox(item.product_id)}
                              />
                            </div>
                          </div>
                          <Grid item className={styles.product_discp}>
                            <Grid item>
                              <Typography className={styles.product_name}>
                                {item.title
                                  ? item.title?.length > 18
                                    ? item.title?.substring(0, 18) + "..."
                                    : item.title
                                  : "NA"}
                              </Typography>
                            </Grid>
                            <Grid container>
                              <Grid item>
                                <Typography className={styles.product_code}>
                                  Product Code :
                                </Typography>
                              </Grid>
                              <Grid item>
                                <Typography className={styles.product_code}>
                                  {item?.product_code}
                                </Typography>
                              </Grid>
                            </Grid>
                            <Grid
                              container
                              className={styles.mt_12}
                              style={{ marginBottom: 20 }}
                            >
                              <Grid item xs={12} lg={6}>
                                <Typography className={styles.product_amount}>
                                  {ellipsizeText(item?.category, 8)} /{" "}
                                  {item?.sub_category}
                                </Typography>
                              </Grid>
                              <Grid item xs={12} lg={6}>
                                <Typography className={styles.product_price}>
                                  ${parseInt(item?.price)}
                                </Typography>
                              </Grid>
                            </Grid>
                          </Grid>
                        </Box>
                      </Grid>
                    ))}
                </Grid>
              </Grid>
              <Box mb={-1}>
                <Grid container justifyContent="flex-end">
                  <Grid item>
                    <Pagination
                      color="secondary"
                      shape="rounded"
                      count={Math.ceil(record.length / pagination?.pageSize)}
                      page={pagination?.page}
                      onChange={(e, page) =>
                        setPagination((prev) => ({ ...prev, page }))
                      }
                    />
                  </Grid>
                </Grid>
              </Box>
            </>
          ) : (
            <EmptyResults
              isSearch={filter.search || filter.category || filter.subCategory}
              rtw={rtw}
            />
          )}
        </DialogContent>
        <DialogActions>
          <PrimaryButton
            type="submit"
            style={{ width: "130px" }}
            onClick={handleSubmit}
          >
            <Typography variant="h4" className={styles.header_text}>
              Proceed
            </Typography>
          </PrimaryButton>
        </DialogActions>
      </Dialog>
    </>
  );
};

const TYPE = [
  { label: "Type", value: 0 },
  { label: "Ready to Wear", value: "False" },
  { label: "Custom", value: "True" },
];

const styles2 = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(3),
    backgroundColor: "#FC68A2",
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: "#ffffff",
  },
  title: {
    fontFamily: "Inter SemiBold",
    fontSize: 18,
    color: "#ffffff",
  },
});

const DialogTitle = withStyles(styles2)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h5" className={classes.title}>
        {children}
      </Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon fontSize="large" />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles(() => ({
  root: {
    padding: "10px 30px 30px 30px",
  },
}))(MuiDialogContent);

const DialogActions = withStyles(() => ({
  root: {
    margin: 0,
    padding: 30,
    borderTop: "1px solid #DFE7F5",
  },
}))(MuiDialogActions);

export default AddProduct;
