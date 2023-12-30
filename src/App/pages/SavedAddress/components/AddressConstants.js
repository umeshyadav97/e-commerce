const newAddress = () => {
  return {
    address_one: "",
    address_two: "",
    first_name: "",
    last_name: "",
    country_code: "+1",
    city: "",
    zip_code: "",
    state: "-1",
    country: "",
    is_default: false,
    phone: "",
  };
};

const validationRules = () => {
  return {
    first_name: {
      valid: true,
      message: "",
      rules: [(v) => !!v || "First Name is required!"],
    },
    last_name: {
      valid: true,
      message: "",
      rules: [(v) => !!v || "Last Name is required!"],
    },
    phone: {
      valid: true,
      message: "",
      rules: [
        (v) => !!v || "Phone number is required!",
        (v) =>
          (v && v.length >= 7) || "Phone number must be atleast 7 digit no",
        (v) => (v && v.length < 16) || "Max Phone number can be 15 digit no",
      ],
    },
    country: {
      valid: true,
      message: "",
      rules: [
        (v) => !!v || "Country is required!",
        (v) => (v && v !== "-1") || "Country is required!",
      ],
    },
    country_code: {
      valid: true,
      message: "",
      rules: [(v) => !!v || "Invalid!", (v) => (v && v !== "+") || "Invalid!"],
    },
    state: {
      valid: true,
      message: "",
      rules: [
        (v) => !!v || "State is required!",
        (v) => (v && v !== "-1") || "State is required!",
      ],
    },
    city: {
      valid: true,
      message: "",
      rules: [(v) => !!v || "City is required!"],
    },
    zip_code: {
      valid: true,
      message: "",
      rules: [
        (v) => !!v || "Zip Code is required!",
        (v) =>
          (v && v.length >= 5) || "Minimum Zip Code length is 5 characters",
        (v) =>
          (v && v.length < 11) || "Maximum Zip Code length is 10 characters",
      ],
    },
    address_one: {
      valid: true,
      message: "",
      rules: [(v) => !!v || "Address is required!"],
    },
  };
};

const Constants = {
  addressConstants: {
    newAddress: () => {
      return newAddress();
    },
    validationRules: () => {
      return validationRules();
    },
  },
};

module.exports = Constants;
