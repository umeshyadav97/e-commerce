import { Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core";

import React, { useEffect, useState } from "react";
import AccordionFilter from "./AccordianFilter";
import styles from "./FilterModal.module.scss";

const useStyles = makeStyles(() => ({
  appBar: {
    position: "relative",
    backgroundColor: "white",
    color: "black",
    marginTop: "20px",
    marginBottom: "24px"
  },
  modalStyle: {
    width: "378px"
  },
  paperStyle: {
    justifyContent: "flex-end"
  },
  listWrapper: {
    marginBottom: "8px",
    display: "flex",
    flexWrap: "wrap"
  },
  divider: {
    bottom: "94px",
    position: "relative"
  },
  heading: {
    padding: "0px 14px 0px 23px",
    height: "60px",
    color: "#445EBE",
    fontFamily: "Inter SemiBold",
    fontSize: 18
  },
  buttonStyle: {
    color: "#0C0C0C",
    width: "100px",
    fontFamily: "Inter Regular",
    fontSize: "14px",
    letterSpacing: 0,
    lineHeight: "19px",
    fontWeight: 600,
    textTransform: "none",
    "&:focus": {
      outline: "none"
    }
  },
  outlinedPrimary: {
    color: "none",
    border: "none"
  },
  saveAsDraftText: {
    fontSize: 18,
    fontFamily: "Inter SemiBold",
    color: "#445ebe",
    width: 65,
    cursor: "pointer",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: "10px"
  },
  btncontainforms: {
    width: 270,
    alignItems: "center"
  },
  topCtr: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%"
  }
}));

export default function MoreFilters({
  filters = [],
  checked = [],
  handleClear = () => {},
  handleApply = () => {}
}) {
  const classes = useStyles();
  const [tempCheckedData, setTempCheckedData] = useState([checked]);

  const handleToggle = (key, id, name) => {
    const isExist = tempCheckedData.findIndex((el) => el.key === key);
    if (isExist === -1) {
      let payload = {
        key: key,
        value: [{ id, name }]
      };
      setTempCheckedData([...tempCheckedData, payload]);
    } else {
      let newCheckedData1 = tempCheckedData;
      let keyData = newCheckedData1.find((el) => el.key === key)?.value;
      const keyIndex = newCheckedData1.findIndex((el) => el.key === key);
      let spliceIndex = keyData.findIndex((el) => el.id === id);
      if (spliceIndex === -1) {
        keyData.push({ id, name });
      }
      newCheckedData1[keyIndex].value = keyData;
      setTempCheckedData([...newCheckedData1]);
    }
  };

  const handleDeleteFilter = (key, id) => {
    let newCheckedData = tempCheckedData;
    let keyData = newCheckedData.find((el) => el.key === key)?.value;
    const keyIndex = newCheckedData.findIndex((el) => el.key === key);
    let spliceIndex = keyData.findIndex((el) => el.id === id);
    keyData.splice(spliceIndex, 1);

    newCheckedData[keyIndex].value = keyData;
    setTempCheckedData([...newCheckedData]);
  };

  const onHandleApplyClick = () => {
    handleApply(tempCheckedData);
  };

  useEffect(() => {
    setTempCheckedData(JSON.parse(JSON.stringify(checked)));
  }, [checked]);

  return (
    <div>
      {tempCheckedData && (
        <>
          <div className={classes.listWrapper}>
            {filters.map((data, index) => (
              <div
                key={index}
                style={{ marginRight: "16px", marginBottom: "20px" }}>
                <AccordionFilter
                  getData={data.value}
                  title={data.key}
                  isStaticData={data.isStaticData}
                  hasSearchBar={data.hasSearchBar}
                  checked={tempCheckedData}
                  index={tempCheckedData.findIndex((el) => el.key === data.key)}
                  handleToggle={handleToggle}
                  handleDelete={handleDeleteFilter}></AccordionFilter>
              </div>
            ))}
            <Grid container className={classes.btncontainforms}>
              <div className={styles.addInvestmentButtonContainerFilter}>
                <p
                  className={styles.addInvestmentButtonText}
                  onClick={() => onHandleApplyClick()}>
                  Apply
                </p>
              </div>
              <div className={classes.saveAsDraftText}>
                <p onClick={() => handleClear()}>Default</p>
              </div>
            </Grid>
          </div>
        </>
      )}
    </div>
  );
}
