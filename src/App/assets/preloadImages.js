import FormImages from "../../App/components/Form/assets/images.js";

var allImages = [];

const loadImages = (imageUrls) => {
  imageUrls.forEach((q) => {
    const img = new Image();
    img.src = q;
    allImages.push(img);
  });
};

const images = [
  require("./images/popup-delete.svg"),
  require("./images/popup-error.svg"),
  require("./images/popup-success.svg"),
  require("./images/popup-warn.svg"),
  require("./images/profile_default.svg"),
];

const icons = [
  require("./icons/close.svg"),
  require("./icons/notification.svg"),
  require("./icons/profile.svg"),
  require("./icons/logout.svg"),
  require("./icons/search.svg"),
];

const preloadImages = () => {
  loadImages([...FormImages, ...icons, ...images]);
};

export default preloadImages;
