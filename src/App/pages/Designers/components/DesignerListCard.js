import React from "react";
import { Divider, Grid, Typography } from "@material-ui/core";
import Location from "../../../assets/icons/location.svg";
import "../Designer.css";
import { capitalize } from "../../../../utils/textUtils";
import { useHistory } from "react-router-dom";
import ProfilePlaceholder from "../../../assets/images/ProfilePlaceholder.svg";
const DesignerListCard = ({ data, viewDetail, props }) => {
  const history = useHistory();
  const handleProductChange = (productId, ParentCategoryId) => {
    history.push(`/product-details/${ParentCategoryId}/${productId}`);
    window.scrollTo(0, 0);
  };

  const handleCustomProductChange = (productId, ParentCategoryId) => {
    history.push(`/custom-product-details/${ParentCategoryId}/${productId}`);
    window.scrollTo(0, 0);
  };

  return (
    <React.Fragment key={props.key}>
      <Grid container direction="column" className={"designerCard"}>
        <Grid
          container
          item
          direction="row"
          spacing={1}
          onClick={viewDetail}
        >
          <Grid
            container
            item
            lg={4}
            md={4}
            sm={4}
            xs={12}
            justify="center"
            alignItems="center"
          >
            <div className={"imgCtr"}>
              {data?.profile_picture !==null ? (
                <img
                  className={"SRC"}
                  src={data?.profile_picture}
                  alt="profile"
                />
              ) : (
                <img className={"SRC"} src={ProfilePlaceholder} alt="placeholder" />
              )}
            </div>
          </Grid>
          <Grid
            container
            item
            direction="column"
            lg={8}
            md={8}
            sm={8}
            xs={12}
            className={"personalDetail"}
          >
            <Grid style={{ display: "flex", alignItems: "center", marginBottom: "30px" }}>
              <Grid  xl={12}>
                <Typography className={"name"}>{`${capitalize(
                  data?.first_name
                )} ${capitalize(data?.last_name)}`}</Typography>
              </Grid>
            </Grid>
            <Grid style={{ display: "flex", alignItems: "center" }}>
              <Grid  xl={12}>
                <Typography className={"brandName"}>
                  {capitalize(data?.brand_name)}
                </Typography>
              </Grid>
            </Grid>
            <Grid style={{ display: "flex", alignItems: "center" }}>
              <Grid lg={9} xl={12}>
                <Typography className={"location"}>
                  {capitalize(data?.email)}
                </Typography>
              </Grid>
            </Grid>
            <Grid style={{ display: "flex", alignItems: "center" }}>
              <img src={Location} style={{ cursor: "pointer" }} alt="" />
              <Grid xl={12} lg={9}>
                <Typography
                  className={"location"}
                  style={{ marginLeft: "10px" }}
                >{`${capitalize(data?.state)}, ${capitalize(
                  data?.country
                )}`}</Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Divider style={{ marginTop: "10px", marginBottom: "10px" }} />
        <Grid container>
          {data?.recent_products?.length > 0 &&
            data?.recent_products.slice(0, 3).map((item, index) => {
              return (
                <Grid
                  item
                  sm={4}
                  xs={6}
                  key={index}
                  className={"designerCardBottom"}
                >
                  <a
                    href={
                      item.is_custom_product
                        ? "/custom-product-details/" +
                          `${item?.category}/` +
                          `${item.product_id}`
                        : "/product-details/" +
                          `${item?.category}/` +
                          `${item?.product_id}`
                    }
                  >
                    <img
                      className={"productsSRC"}
                      src={item?.p_thumbnail ? item?.p_thumbnail : item?.cover_image_url}
                      alt="products"
                      onClick={() =>
                        item.is_custom_product
                          ? handleCustomProductChange(
                              item?.product_id,
                              item?.category?.id
                            )
                          : handleProductChange(
                              item?.product_id,
                              item?.category?.id
                            )
                      }
                    />
                  </a>
                </Grid>
              );
            })}
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default DesignerListCard;
