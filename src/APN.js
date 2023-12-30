let handleNotification;
const handlePermission = (callback) => {
  handleNotification = callback;
  if (window.safari && window.safari.pushNotification) {
    let result = window.safari.pushNotification.permission(
      "web.com.designer.gomble"
    );
    checkPermission(result);
  }
};

const checkPermission = (permissionData) => {
  if (permissionData.permission === "default") {
    window.safari.pushNotification.requestPermission(
      process.env.REACT_APP_API_Endpoint,
      "web.com.designer.gomble",
      { panel: "gomble" },
      checkPermission
    );
  } else if (permissionData.permission === "denied") {
    console.log("denied");
  } else if (permissionData.permission === "granted") {
    console.log("granted");
    handleNotification(permissionData.deviceToken);
  }
};

export { handlePermission };
