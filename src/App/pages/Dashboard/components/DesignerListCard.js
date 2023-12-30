import React, { useState } from "react";
import { Divider, Grid, Typography } from "@material-ui/core";
import Location from "../../../assets/icons/location.svg";
import "../Designer.css";
import { capitalize } from "../../../../utils/textUtils";
import { useHistory } from "react-router-dom";
import ProfilePlaceholder from "../../../assets/images/ProfilePlaceholder.svg";
import Lottie from "lottie-react";
import ImgLoader from "../../../assets/imageLoader.json";
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

  const [imgLoading, setImgLoading] = useState(true);
  const [imgLoadingThumbnail, setImgLoadingThumbnail] = useState(true);

  return (
    <React.Fragment key={props.key}>
      <Grid
        container
        direction="column"
        className={"designerCard"}
        onClick={viewDetail}
        style={{ cursor: "pointer" }}
      >
        <Grid item>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4} md={5}>
              <div className={"imgCtr"}>
                {imgLoading && (
                  <Lottie
                    animationData={ImgLoader}
                    style={{
                      width: 100,
                      height: 110,
                    }}
                  />
                )}
                {data?.profile_picture ? (
                  <img
                    className={"SRC"}
                    src={data?.profile_picture}
                    alt="profile"
                    style={{
                      display: imgLoading ? "none" : "inline",
                    }}
                    onLoad={() => setImgLoading(false)}
                  />
                ) : (
                  <img
                    className={"SRC"}
                    src={ProfilePlaceholder}
                    alt="profile"
                    style={{
                      display: imgLoading ? "none" : "inline",
                    }}
                    onLoad={() => setImgLoading(false)}
                  />
                )}
              </div>
            </Grid>
            <Grid item xs={12} sm={8} md={7}>
              <Grid
                container
                justifyContent="flex-start"
                className={"personalDetail"}
              >
                <Grid container justifyContent="flex-start">
                  <Grid item xs={12} style={{ paddingBottom: 10 }}>
                    <Typography className={"name"}>{`${capitalize(
                      data?.first_name
                    )} ${capitalize(data?.last_name)}`}</Typography>
                  </Grid>
                  <Grid item xs={12} style={{ paddingBottom: 5 }}>
                    <Typography className={"brandName"}>
                      {capitalize(data?.brand_name)}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} style={{ paddingTop: 0 }}>
                    <Typography className={"location"}>
                      {capitalize(data?.email)}
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      paddingTop: 0,
                    }}
                  >
                    <img src={Location} style={{ cursor: "pointer" }} alt="" />
                    <Grid item xs={12}>
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
                    {imgLoadingThumbnail && (
                      <Lottie
                        animationData={ImgLoader}
                        style={{
                          width: 100,
                          height: 80,
                        }}
                      />
                    )}
                    <img
                      className={"productsSRC"}
                      src={
                        item?.p_thumbnail
                          ? item?.p_thumbnail
                          : item?.cover_image_url
                      }
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
                      style={{
                        display: imgLoadingThumbnail ? "none" : "inline",
                      }}
                      onLoad={() => setImgLoadingThumbnail(false)}
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
