import React, { useEffect, useState } from "react";
import { API } from "../../../../api/apiService";
import { Toast } from "../../../components";
import "react-multi-carousel/lib/styles.css";
import ProductCard from "./ProductCard";
import { Typography } from "@material-ui/core";
import ItemsCarousel from "react-items-carousel";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import { connect } from "react-redux";

const SimilarProductCarousal = (props) => {
  const isLoggedIn = props.isAuthenticated;
  const [similarProductList, setSimilarProductist] = useState([]);
  const [activeItemIndex, setActiveItemIndex] = useState(0);
  const chevronWidth = 60;

  useEffect(() => {
    fetchSimilarProductData();
    //eslint-disable-next-line
  }, []);

  const fetchNoOfCards = () => {
    if (typeof window !== "undefined") {
      if (window.innerWidth <= 700) return 1;
      else if (window.innerWidth < 1120) return 2;
      else if (window.innerWidth < 1480) return 3;
      else return 4;
    } else {
      return 4;
    }
  };
  const [cardNumber, setCardNumber] = useState(fetchNoOfCards());

  const handleResize = () => {
    if (window.innerWidth < 700) {
      setCardNumber(1);
    } else if (window.innerWidth < 1120) setCardNumber(2);
    else if (window.innerWidth < 1480) {
      setCardNumber(3);
    } else {
      setCardNumber(4);
    }
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const fetchSimilarProductData = async () => {
    try {
      const resp = await API.get(
        `product/customer/similar/${props.product_id}`,
        isLoggedIn ? true : false
      );
      if (resp.success) {
        let resData = [];
        for (let i of resp.data) {
          resData.push({
            id: i.product_id,
            url: i.cover_image_url,
            title: i.title,
            price: i.price,
            wishlist: i.wishlist,
            is_custom_product: i.is_custom_product,
            brand_name: i.brand_name,
            offer_price: i.offer ? i.offer.offer_price : "",
            category: i.category ? i.category : "",
            thumbnail: i.p_thumbnail,
            rating: i.rating,
          });
        }
        setSimilarProductist(resData);
      }
    } catch (e) {
      const msg =
        typeof e.data.error?.message === "string"
          ? e.data.error?.message
          : e.data.error?.message?.[0];
      Toast.showErrorToast(
        msg || `Error Fetching product list. Please Refresh`
      );
    }
  };
  return (
    <React.Fragment>
      {similarProductList.length ? (
        <Typography
          style={{ fontSize: "32px", fontWeight: "bold", marginTop: "70px" }}
        >
          Similar Products
        </Typography>
      ) : (
        ""
      )}
      <br />
      <ItemsCarousel
        requestToChangeActive={setActiveItemIndex}
        activeItemIndex={activeItemIndex}
        numberOfCards={cardNumber}
        gutter={40}
        infiniteLoop="true"
        leftChevron={
          <ArrowBackIosIcon
            fontSize="large"
            style={{ marginBottom: "120px", marginRight: "-25px" }}
          />
        }
        rightChevron={
          <ArrowForwardIosIcon
            fontSize="large"
            style={{ marginBottom: "120px", marginLeft: "-10px" }}
          />
        }
        outsideChevron
        chevronWidth={chevronWidth}
      >
        {similarProductList.length
          ? similarProductList.map((data, index) => (
              <div
                key={index}
                style={{
                  borderRadius: "10px",
                  backgroundColor: "#FFFFFF",
                  marginBottom: "80px",
                }}
              >
                <ProductCard
                  history={props.history}
                  data={data}
                  key={index}
                  hrefTitle={props.parentCategoryTitle}
                  ParentCategoryId={props.parentCategoryId}
                />
              </div>
            ))
          : ""}
      </ItemsCarousel>
    </React.Fragment>
  );
};
const mapStateToProps = ({ auth: { isAuthenticated } }) => ({
  isAuthenticated,
});

export default connect(mapStateToProps, null)(SimilarProductCarousal);
