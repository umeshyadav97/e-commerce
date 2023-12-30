import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import Inter from "../../../assets/fonts/Inter-Regular.ttf";
import { convertDateFormat } from "../../../../utils/dateUtils";
import { capitalize, capitalizeStr } from "../../../../utils/textUtils";

Font.register({ family: "Inter", src: Inter });

// Create styles
const styles = StyleSheet.create({
  GombleLogo_Container: {
    marginLeft: "25px",
    marginTop: "20px",
  },
  Invoice_headerLetter1: {
    backgroundColor: "#FFE2ED",
    borderRadius: "10px",
    fontWeight: 700,
    fontSize: "20px",
    paddingLeft: "5px",
    marginTop: "2px",
  },
  Invoice_headerLetter2: {
    marginTop: "20px",
    fontWeight: 700,
    fontSize: "20px",
    fontFamily: "Inter",
  },
  OrderNumber: {
    marginLeft: "auto",
    marginBottom: "10px",
    fontWeight: 700,
    fontSize: "16px",
    fontFamily: "Inter",
  },
  InvoiceNumber: {
    marginLeft: "auto",
    marginBottom: "10px",
    fontWeight: 400,
    fontSize: "12px",
    fontFamily: "Inter",
  },
  StatusText: {
    marginLeft: "auto",
    fontWeight: 600,
    fontSize: "12px",
    marginTop: "2px",
    fontFamily: "Inter",
  },
  Bill_fromto: {
    fontWeight: 600,
    fontSize: "12px",
    fontFamily: "Inter",
    marginBottom: "5px",
  },
  Name: {
    fontWeight: 600,
    fontSize: "14px",
    color: "#708099",
    marginBottom: "5px",
    fontFamily: "Inter",
  },
  Address: {
    fontWeight: 400,
    fontSize: "12px",
    color: "#708099",
    marginBottom: "5px",
    fontFamily: "Inter",
  },
  BillTo_Conatiner: {
    marginLeft: "auto",
    padding: "10px",
    marginRight: "50px",
    width: "500px",
  },
  BillFrom_Container: {
    marginLeft: "30px",
    padding: "10px",
    width: "500px",
  },
  TableHeader_color: {
    backgroundColor: "#F4F7FD",
    padding: "5px",
  },
  TableHeader: {
    fontWeight: 600,
    fontSize: "12px",
    margin: "10px",
    color: "#708099",
    width: "120px",
    fontFamily: "Inter",
  },
  TableHeader_Last: {
    fontWeight: 600,
    fontSize: "12px",
    margin: "10px",
    marginRight: "30px",
    color: "#708099",
    width: "150px",
    fontFamily: "Inter",
  },
  Table_Data: {
    fontWeight: 600,
    fontSize: "12px",
    margin: "10px",
    width: "120px",
    alignSelf: "center",
    fontFamily: "Inter",
  },
  Type: {
    fontWeight: 600,
    fontSize: "10px",
    margin: "10px",
    width: "120px",
    borderRadius: "2px",
    fontFamily: "Inter",
  },
  Type_color: {
    backgroundColor: "#E5F8F2",
    padding: "2px",
    borderRadius: "2px",
    alignSelf: "center",
  },
  TableData_Last: {
    fontWeight: 600,
    fontSize: "12px",
    margin: "10px",
    width: "150px",
    marginRight: "30px",
    alignSelf: "center",
    fontFamily: "Inter",
  },
  Customer_Detail_Container: {
    flexDirection: "row",
    border: "1px solid #DFE7F5",
    borderRadius: "4px",
    padding: "10px",
    marginLeft: "40px",
    width: "253px",
  },
  SubTotal_Conatiner: {
    flexDirection: "row",
    marginRight: "35px",
    padding: "10px",
  },
  Sub_Total_Name: {
    marginRight: "100px",
    fontWeight: 600,
    fontSize: "14px",
    color: "#242424",
    fontFamily: "Inter",
  },
  Sub_total_Detail: {
    fontWeight: 600,
    fontSize: "14px",
    color: "#242424",
    marginLeft: "auto",
    fontFamily: "Inter",
  },
  Amount_Breakup_Container: {
    borderTop: "1px dashed #708099",
    borderBottom: "1px dashed #708099",
    marginRight: "35px",
  },
  AmountDetail_Conatiner: {
    flexDirection: "row",
    padding: "10px",
  },
  AmountDetail_Name: {
    marginRight: "100px",
    fontWeight: 400,
    fontSize: "12px",
    color: "#242424",
    fontFamily: "Inter",
  },
  AmountDetail_Text: {
    fontWeight: 600,
    fontSize: "12px",
    color: "#242424",
    marginLeft: "auto",
    fontFamily: "Inter",
  },
  Total_Name: {
    marginRight: "100px",
    fontWeight: 600,
    fontSize: "14px",
    color: "#242424",
    fontFamily: "Inter",
  },
  Total_text: {
    fontWeight: 600,
    fontSize: "16px",
    color: "#708099",
    marginLeft: "auto",
    fontFamily: "Inter",
  },
  Transaction_Container: {
    borderTop: "1px dashed #DFE7F5",
    borderBottom: "1px dashed #DFE7F5",
  },
  Transaction_Data_Container: {
    flexDirection: "row",
    padding: "10px 10px 0px 10px",
    margin: "0px 10px 0px 10px",
  },
  Transaction_Data_Container2: {
    flexDirection: "row",
    padding: "10px 10px 10px 10px",
    margin: "0px 10px 0px 10px",
  },
  Transaction_Data_Name: {
    marginRight: "100px",
    fontWeight: 400,
    fontSize: "12px",
    color: "#242424",
    fontFamily: "Inter",
  },
  Transaction_Data_Name2: {
    marginRight: "100px",
    fontWeight: 400,
    fontSize: "12px",
    color: "#A4B3CC",
    fontFamily: "Inter",
  },

  Transaction_Data_Text: {
    fontWeight: 400,
    fontSize: "12px",
    color: "#242424",
    marginLeft: "auto",
    fontFamily: "Inter",
  },
  Transaction_Data_Text2: {
    fontWeight: 400,
    fontSize: "12px",
    color: "#A4B3CC",
    marginLeft: "auto",
    fontFamily: "Inter",
  },
  Footer_Generated_Text: {
    fontWeight: 400,
    fontSize: "12px",
    marginLeft: "95px",
    color: "#94a2c4",
    fontFamily: "Inter",
  },
  Footer_thanks_text: {
    fontWeight: 600,
    fontSize: "14px",
    color: "#242424",
    fontFamily: "Inter",
  },
  Footer_help_Text: {
    marginLeft: "auto",
    fontWeight: 600,
    fontSize: "14px",
    fontFamily: "Inter",
  },
  Footer_Email: {
    marginLeft: "auto",
    color: "#708099",
    fontWeight: 400,
    fontSize: "14px",
    fontFamily: "Inter",
  },
  Left: {
    marginLeft: "auto",
  },
  Invoice_header: {
    padding: "10px",
    backgroundColor: "#f4f7fd",
    flexDirection: "row",
  },
  Invoice_footer: {
    padding: "30px",
    backgroundColor: "#f4f7fd",
    flexDirection: "row",
  },
  invoice_status_completed: {
    padding: "2px 5px",
    backgroundColor: "#c6ebc9",
    borderRadius: "20px",
  },
  invoice_status_cancelled: {
    padding: "2px 5px",
    backgroundColor: "#ffaaa5",
    borderRadius: "20px",
  },
  invoice_status_InProcess: {
    padding: "2px 5px",
    backgroundColor: "#fff0c1",
    borderRadius: "20px",
  },
});

// Create Document Component
const InvoicePDF = ({ record }) => {
  return (
    <Document>
      <Page size="A4">
        <View style={styles.Invoice_header} fixed>
          <View style={styles.GombleLogo_Container}>
            <Text style={styles.Invoice_headerLetter1}>G</Text>
          </View>
          <View style={styles.Invoice_headerLetter2}>
            <Text>omble</Text>
          </View>
          <View style={{ marginLeft: "auto" }}>
            <Text style={styles.OrderNumber}>
              Order Number-#{record?.invoice_info?.unique_order_id}
            </Text>
            <Text style={styles.InvoiceNumber}>
              {convertDateFormat(record?.invoice_info?.created_at)} | Invoice
              Number: #{record?.invoice_number}
            </Text>
            <View style={{ flexDirection: "row", marginLeft: "auto" }}>
              <View>
                <Text style={styles.StatusText}>Order Status: </Text>
              </View>
              <View
                style={
                  record?.invoice_info?.order_status === "DELIVERED"
                    ? styles.invoice_status_completed
                    : record?.invoice_info?.order_status === "CANCELLED" ||
                      record?.invoice_info?.order_status === "REJECTED"
                    ? styles.invoice_status_cancelled
                    : styles.invoice_status_InProcess
                }
              >
                <Text style={{ fontWeight: 600, fontSize: "12px" }}>
                  {record?.invoice_info?.order_status}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View style={{ flexGrow: 1 }}>
          <View style={{ flexDirection: "row" }} fixed>
            <View style={styles.BillFrom_Container} fixed>
              <Text style={styles.Bill_fromto}>Bill From:</Text>
              <Text style={styles.Name}>
                {record?.invoice_info?.designer?.first_name || ""}{" "}
                {record?.invoice_info?.designer?.last_name || ""}
              </Text>
              <Text style={styles.Address}>
                {record?.invoice_info?.shipping_origin?.address_one || ""}
              </Text>
              <Text style={styles.Address}>
                {record?.invoice_info?.shipping_origin?.address_two || ""}{" "}
                {record?.invoice_info?.shipping_origin?.city || ""}
              </Text>
              <Text style={styles.Address}>
                {record?.invoice_info?.shipping_origin?.state || ""}{" "}
                {record?.invoice_info?.shipping_origin?.country || ""}
              </Text>
              <Text style={styles.Address}>
                {record?.invoice_info?.shipping_origin?.zip_code || ""}
              </Text>
            </View>
            <View style={styles.BillTo_Conatiner} fixed>
              <Text style={styles.Bill_fromto}>Bill To:</Text>
              <Text style={styles.Name}>
                {record?.invoice_info?.shipping?.first_name || ""}{" "}
                {record?.invoice_info?.shipping?.last_name || ""}
              </Text>
              <Text style={styles.Address}>
                {record?.invoice_info?.shipping?.address_one || ""}
              </Text>
              <Text style={styles.Address}>
                {record?.invoice_info?.shipping?.address_two || ""}{" "}
                {record?.invoice_info?.shipping?.city || ""}
              </Text>
              <Text style={styles.Address}>
                {record?.invoice_info?.shipping?.state || ""}{" "}
                {record?.invoice_info?.shipping?.country || ""}
              </Text>
              <Text style={styles.Address}>
                {record?.invoice_info?.shipping?.zip_code || ""}
              </Text>
            </View>
          </View>
          <View fixed>
            {/* Table Header */}
            <View style={styles.TableHeader_color}>
              <View style={{ marginLeft: "25px", flexDirection: "row" }}>
                <Text style={styles.TableHeader}>ITEM</Text>
                <Text style={styles.TableHeader}>TYPE</Text>
                <Text style={styles.TableHeader}>VARIANT</Text>
                <Text style={styles.TableHeader}>SKU</Text>
                <Text style={styles.TableHeader}>SIZE</Text>
                <Text style={styles.TableHeader}>COST</Text>
                <Text style={styles.TableHeader}>QTY</Text>
                <Text style={styles.TableHeader_Last}>PRICE</Text>
              </View>
            </View>
          </View>
          {/* Table Data */}
          {record?.invoice_info?.product?.map((item, index) => (
            <View
              key={index}
              style={{
                padding: "5px",
              }}
            >
              <View style={{ marginLeft: "25px", flexDirection: "row" }}>
                <Text style={styles.Table_Data}>
                  {`${capitalize(item?.item_info?.product_details?.title)}` ||
                    ""}
                </Text>
                <View style={styles.Type}>
                  <Text style={styles.Type_color}>
                    {`${capitalize(item?.item_info?.product_type)}` || ""}
                  </Text>
                </View>
                <Text style={styles.Table_Data}>
                  {`${capitalize(item?.item_info?.colour)}` || ""}
                </Text>
                <Text style={styles.Table_Data}>
                  #
                  {`${capitalize(
                    item?.item_info?.product_details?.product_sku
                  )}` || ""}
                </Text>
                <Text style={styles.Table_Data}>
                  {`${capitalize(item?.item_info?.selected_size)}` || ""}
                </Text>
                <Text style={styles.Table_Data}>
                  ${item?.item_info?.price || ""}
                </Text>
                <Text style={styles.Table_Data}>
                  {item?.item_info?.quantity || ""}
                </Text>
                <Text style={styles.TableData_Last}>
                  $
                  {(item?.item_info?.quantity * item?.item_info?.price).toFixed(
                    2
                  )}
                </Text>
              </View>
            </View>
          ))}
          {record?.invoice_info?.order_type === "CUSTOM" && (
            <View style={styles.Customer_Detail_Container}>
              {record?.invoice_info?.product?.map((Product) =>
                Product?.item_info?.options?.map((option, index) => (
                  <Text
                    key={index}
                    style={{ fontWeight: 400, fontSize: "12px" }}
                  >
                    {`${option?.title}: ${option?.child_option?.title}`}
                  </Text>
                ))
              )}
            </View>
          )}
          <View style={{ marginLeft: "auto", padding: "15px" }}>
            <View style={styles.SubTotal_Conatiner}>
              <Text style={styles.Sub_Total_Name}>Subtotal</Text>
              <Text style={styles.Sub_total_Detail}>
                ${record?.invoice_info?.sub_total || ""}
              </Text>
            </View>
            <View style={styles.Amount_Breakup_Container}>
              {parseFloat(record?.invoice_info?.discount) > 0 && (
                <View style={styles.AmountDetail_Conatiner}>
                  <Text style={styles.AmountDetail_Name}>Discount</Text>
                  <Text style={styles.AmountDetail_Text}>
                    -${record?.invoice_info?.discount || ""}
                  </Text>
                </View>
              )}
              {record?.invoice_info?.tax_details?.map((item, index) => (
                <View key={index} style={styles.AmountDetail_Conatiner}>
                  <Text style={styles.AmountDetail_Name}>
                    {capitalizeStr(item?.name)} ({item?.rate}
                    %)
                  </Text>
                  <Text style={styles.AmountDetail_Text}>
                    ${item?.amount || ""}
                  </Text>
                </View>
              ))}
              <View style={styles.AmountDetail_Conatiner}>
                <Text style={styles.AmountDetail_Name}>Shipping Charges</Text>
                <Text style={styles.AmountDetail_Text}>
                  ${record?.invoice_info?.shipping_fee || ""}
                </Text>
              </View>
              <View style={styles.AmountDetail_Conatiner}>
                <Text style={styles.AmountDetail_Name}>Processing Fee</Text>
                <Text style={styles.AmountDetail_Text}>
                  ${record?.invoice_info?.stripe_fee || ""}
                </Text>
              </View>
            </View>
            <View style={styles.SubTotal_Conatiner}>
              <Text style={styles.Total_Name}>Total</Text>
              <Text style={styles.Total_text}>
                ${record?.invoice_info?.total_amount || ""} USD
              </Text>
            </View>
          </View>
          <View style={styles.Transaction_Container}>
            <View style={styles.Transaction_Data_Container}>
              <Text style={styles.Transaction_Data_Name}>
                Transaction Id-#
                {record?.invoice_info?.transaction_id || "N/A"}
              </Text>
              <Text style={styles.Transaction_Data_Text}>
                ${record?.invoice_info?.total_amount || ""} USD
              </Text>
            </View>
            <View style={styles.Transaction_Data_Container2}>
              <Text style={styles.Transaction_Data_Name2}>
                ${record?.invoice_info?.total_amount || ""} payment from{" "}
                {capitalize(record?.invoice_info?.card_info?.brand)} ...
                {record?.invoice_info?.card_info?.last4 || "N/A"}
              </Text>
              <Text style={styles.Transaction_Data_Text2}>
                {convertDateFormat(record?.invoice_info?.transaction_date)}
              </Text>
            </View>
          </View>
          {record?.invoice_info?.refund?.status === "succeeded" && (
            <View
              style={{
                borderBottom: "1px dashed #DFE7F5",
              }}
            >
              <View style={styles.Transaction_Data_Container}>
                <Text style={styles.Transaction_Data_Name}>
                  Refund Id-#
                  {record?.invoice_info?.refund?.refund_id || "N/A"}
                </Text>
                <Text style={styles.Transaction_Data_Text}>
                  ${record?.invoice_info?.refund?.amount || ""} USD
                </Text>
              </View>
              <View style={styles.Transaction_Data_Container2}>
                <Text style={styles.Transaction_Data_Name2}>
                  {record?.invoice_info?.refund?.amount || ""} payment from{" "}
                  {capitalize(record?.invoice_info?.card_info?.brand)} ...
                  {record?.invoice_info?.card_info?.last4 || "N/A"}
                </Text>
                <Text style={styles.Transaction_Data_Text2}>
                  {convertDateFormat(record?.invoice_info?.refund?.refund_date)}
                </Text>
              </View>
            </View>
          )}
        </View>
        <View fixed>
          <View>
            <Text style={styles.Footer_Generated_Text} fixed>
              This is a system generated receipt hence does not require any
              signature .
            </Text>
          </View>
          <View style={styles.Invoice_footer}>
            <Text style={styles.Footer_thanks_text}>
              Thanks for being a my customer :)
            </Text>
            <Text style={styles.Footer_help_Text}>
              Need Help?
              <Text
                style={styles.Footer_Email}
                src="help@gomble.com"
                target="_blank"
              >
                {" "}
                help@gomble.com
              </Text>
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default InvoicePDF;
