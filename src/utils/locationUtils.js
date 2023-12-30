import { geocodeByAddress, getLatLng } from "react-places-autocomplete";

const getAddress = (values) => {
  return `${values?.address_line1 ?? ""} ${values?.address_line2 ?? ""} ${
    values?.city ?? ""
  } ${values?.zipcode ?? ""} ${values?.state ?? ""} ${values?.country ?? ""}`;
};

const getLatLngByAddress = async (address) => {
  const addresses = await geocodeByAddress(address);

  if (addresses.length > 0) {
    return await getLatLng(addresses[0]);
  } else {
    return null;
  }
};

export { getAddress, getLatLngByAddress };
