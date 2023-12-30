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
    email: {
      valid: true,
      message: "",
      rules: [
        (v) => !!v || "Email is required!",
        (v) =>
          // eslint-disable-next-line no-useless-escape
          /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
            v
          ) || "Email must be valid",
      ],
    },
  };
};

const Constants = {
  profileConstants: {
    validationRules: () => {
      return validationRules();
    },
  },
};

module.exports = Constants;
