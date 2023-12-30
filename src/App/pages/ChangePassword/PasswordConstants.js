const newPassword = () => {
  return {
    current_password: "",
    new_password: "",
    confirm_password: "",
  };
};

const validationRules = () => {
  return {
    current_password: {
      valid: true,
      message: "",
      rules: [
        (v) => !!v || "Current Password is Required!",
        (v) => (v && v.length > 7) || "Minimum password length is 8 characters",
      ],
    },
    new_password: {
      valid: true,
      message: "",
      rules: [
        (v) => !!v || "New Password is Required!",
        (v) =>
          (v && v.length < 25) || "Maximum password length is 25 characters",
        (v) =>
          /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/.test(
            v
          ) ||
          "Password must contain at least 8 characters, one uppercase, one number and one special case character",
      ],
    },
    confirm_password: {
      valid: true,
      message: "",
      rules: [(v) => !!v || "Confirm Password is Required!"],
    },
  };
};

const Constants = {
  passwordConstants: {
    newPassword: () => {
      return newPassword();
    },
    validationRules: () => {
      return validationRules();
    },
  },
};

module.exports = Constants;
