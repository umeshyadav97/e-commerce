import { Box, Typography } from "@material-ui/core";
import { Grid } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { API, ENDPOINTS } from "../../../../api/apiService";
import Designers from "../../Designers";
import {useLocation} from "react-router-dom";
import Filters from "../../Dashboard/components/Filters";


const SearchProduct = () => {
  const location = useLocation();
  const [isProduct, setProductActive] = useState(true);
  const [isDesigner, setDesignerActive] = useState(false);
  const search = location?.pathname?.split("/")[2];
  const [totalProduct, setTotalProduct] = useState(0);
  const [totalDesigner, setTotalDesigner] = useState(0);

  useEffect(() => {
    getDesignerList();
    getProductList();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const getProductList = async () => {
    const searchParam = search !== "" ? `?search=${search}` : "";
    try {
      const resp = await API.get(
        `/customer/designer/search-by-product${searchParam}`,
        false
      );
      if (resp.success) {
        setTotalProduct(resp.data.count);
      }
    } catch (e) {
      console.log(e, "error in search get product list");
    }
  };

  const getDesignerList = async () => {
    const searchParam = search !== "" ? `?search=${search}` : "";
    try {
      const resp = await API.get(
        `${ENDPOINTS.GET_DESIGNERS_LIST}${searchParam}`,
        false
      );
      if (resp.success) {
        setTotalDesigner(resp.data.count);
      }
    } catch (e) {
      console.log(e, "error in search get designer list");
    }
  };
  return (
    <React.Fragment>
      <Box mx={3}>
        {search ? (
          <Typography
            style={{
              fontSize: "24px",
              fontWeight: 600,
              textTransform: "capitalize",
              marginBottom: "39px",
            }}
          >
            Search Results for "{search}"
          </Typography>
        ) : (
          ""
        )}

        <Grid container spacing={3} style={{ marginBottom: "5px" }}>
          <Grid item>
            <Typography
              onClick={() => {
                setProductActive(true);
                setDesignerActive(false);
              }}
              style={{
                fontFamily: isProduct ? "Inter Bold" : "Inter Regular",
                color: isProduct ? "#242424" : "#708099",
                fontSize: "18px",
                cursor: "pointer",
              }}
            >
              Products ({totalProduct})
            </Typography>
          </Grid>
          <Grid item>
            <Typography
              onClick={() => {
                setProductActive(false);
                setDesignerActive(true);
              }}
              style={{
                fontFamily: isDesigner ? "Inter Bold" : "Inter Regular",
                color: isDesigner ? "#242424" : "#708099",
                fontSize: "18px",
                cursor: "pointer",
              }}
            >
              Designers ({totalDesigner})
            </Typography>
          </Grid>
        </Grid>
        <Grid container>
          <div
            style={{
              borderBottom: isProduct
                ? "2px solid #242424"
                : "2px solid #DFE7F5",
              width: "120px",
            }}
          ></div>
          <div
            style={{
              borderBottom: isDesigner
                ? "2px solid #242424"
                : "2px solid #DFE7F5",
              width: "135px",
            }}
          ></div>
        </Grid>
        <br />
      </Box>
      {isProduct ? (
        <Filters  search={search} />
        // <ProductListing search={search} setTotalProductsFromChild={setTotalProductsFromChild} history={props.history} />
      ) : (
        <Designers search={search} />
      )}
    </React.Fragment>
  );
};
export default SearchProduct;
