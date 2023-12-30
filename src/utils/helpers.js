/* eslint-disable array-callback-return */
const helpers = {
  validate: (data, error) => {
    let isValid = true;

    Object.entries(error).forEach(([key, obj]) => {
      if (data[key] !== undefined) {
        if (obj.rules !== undefined) {
          obj.message = '';
          obj.valid = true;

          obj.rules.forEach((rule) => {
            if (obj.valid) {
              const result = rule(data[key]);
              if (result !== true) {
                obj.message = result;
                obj.valid = false;
                isValid = false;
                return false;
              }
            }
          });
        }

        if (
          obj.array !== undefined &&
          obj.array === true &&
          obj.errors !== undefined &&
          obj.errors.length > 0
        ) {
          obj.errors.map((objError, index) => {
            Object.entries(objError).forEach(([errKey, errObj]) => {
              errObj.message = '';
              errObj.valid = true;
              errObj.rules.forEach((rule) => {
                if (errObj.valid) {
                  const result = rule(data[key][index][errKey]);
                  if (result !== true) {
                    errObj.message = result;
                    errObj.valid = false;
                    isValid = false;
                    return false;
                  }
                }
              });
            });
          });
        }
      }
    });
    return {
      isValid,
      error,
    };
  },
  onChangeValidate: (data, error) => {
    error.message = '';
    error.valid = true;
    error.rules.forEach((rule) => {
      if (error.valid) {
        const result = rule(data);
        if (result !== true) {
          error.message = result;
          error.valid = false;
          return false;
        }
      }
    });

    return error;
  },
};

export default helpers;
