const ellipsizeText = (text, outputLength = 30) => {
  if (text !== undefined && text.length > outputLength) {
    return text.substring(0, outputLength) + "...";
  } else {
    return text;
  }
};

const capitalize = (s) => {
  if (typeof s !== "string") return "";
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
};

const removeUnderScore = (str) => {
  var newStr = str?.replace(/_/g, " ");
  return newStr;
};

const capitalizeStr = (s) => {
  if (typeof s !== "string") return "";
  const arr = s.split(" ");
  for (var i = 0; i < arr.length; i++) {
    arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1).toLowerCase();
  }
  const str2 = arr.join(" ");
  return str2;
};

export { ellipsizeText, capitalize, removeUnderScore, capitalizeStr };
