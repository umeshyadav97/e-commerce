/* eslint-disable react-hooks/exhaustive-deps */
import { CircularProgress, Menu, MenuItem } from "@material-ui/core";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { makeStyles } from "@material-ui/core";
import CloseIconChip from "../../assets/icons/cross.svg";
import CrossIcon from "./assets/cross-icon.svg";
import styles1 from "./AccordianFilter.module.css";
import React, { useEffect, useState, useRef, Fragment } from "react";
import SearchIcon from "./assets/search-line.svg";
import InputBase from "@material-ui/core/InputBase";
import { Grid } from "@material-ui/core";
import useDebounce from "../../hooks/useDebounce";
import { capitalizeStr } from "../../../utils/textUtils";

const useStyles = makeStyles(() => ({
  heading: {
    color: "#0C0C0C",
    fontFamily: "Inter Regular",
    fontSize: "16px",
    fontWeight: 600,
  },
  summaryRoot: {
    minHeight: "48px",
    padding: "0px 23px",
  },
  iconColor: {
    color: "black",
  },
  details: {
    padding: "0px 16px",
  },
  listIcon: {
    minWidth: "0px",
  },
  title: {
    color: "#191919",
    fontFamily: "Inter Regular",
    fontSize: "14px",
    fontWeight: 400,
    flex: 1,
    marginBottom: 5,
  },
  titleTag: {
    color: "#242424",
    fontFamily: "Inter SemiBold",
    fontWeight: 500,
    flex: 1,
    whiteSpace: "nowrap",
    overflow: "auto",
  },
  SearchCtr: {
    padding: "0px 10px",
    marginBottom: "10px",
  },
  text: {
    fontFamily: "Inter SemiBold",
    color: "red",
  },
  listItemText: {
    fontSize: "14px",
    fontFamily: "Inter Regular !important",
    fontWeight: "400 !important",
  },
  chipContainer: {
    width: "290px",
    overflowX: "scroll",
  },
  listCtr: {
    maxHeight: "192px",
    overflowY: "scroll",
    marginTop: 10,
  },
  loaderCtr: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "10px 0",
  },
  container: {
    backgroundColor: "#FFFFFF",
    display: "flex",
    alignItems: "center",
    padding: "8px 12px",
    borderRadius: 8,
    border: "1px solid #dfe7f5",
    cursor: "pointer",
    fontFamily: "Inter semibold",
    fontSize: 14,
    fontWeight: 600,
    width: "195px",
    height: 27,
  },
  mainMenu: {
    width: 353,
    maxHeight: 257,
    boxSizing: "border-box",
    border: "1px solid #EBEFFF",
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
  },
  searchCtr: {
    width: "100%",
    padding: "20px 0px 0",
    "& div:first-child": {
      width: "90% !important",
    },
  },
  expand: {
    marginLeft: 15,
    marginBottom: "-5px",
    marginRight: "-5px",
  },
  listContainer: {
    width: "100%",
    marginTop: 5,
    maxHeight: 160,
    boxSizing: "border-box",
    overflowY: "scroll",
  },
  itemContainer: {
    padding: "5px 15px 2px 20px",
    display: "flex",
    width: "100%",
    alignItems: "center",
    cursor: "pointer",
    justifyContent: "space-between",
    borderRadius: 3,
    "&:hover": {
      backgroundColor: "#F5F7FB",
    },
  },
  itemText: {
    fontFamily: "Inter semibold",
    fontSize: 14,
    fontWeight: 600,
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  chipsCtr: {
    marginTop: "2px",
    marginRight: "10px",
    display: "flex",
  },
  selectBorder: {
    borderColor: "#FC68A2",
    border: "2px solid",
  },
  backgroundSelected: {
    background: "#f4f7fd",
  },
}));
export default function AccordionFilter({
  getData,
  checked,
  title,
  handleToggle,
  index,
  handleDelete,
  Data,
  fetchMore,
  maxCount,
  placeholder,
}) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [data, setData] = useState(Data);
  const isLoadingRef = useRef(false);
  const open = Boolean(anchorEl);
  const [query, setQuery] = useState("");
  const debouncedSearch = useDebounce(query, 1000);

  const handleClose = () => {
    setAnchorEl(null);
    setIsExpanded(false);
  };
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setIsExpanded(!isExpanded);
  };

  /*Show selected Data in form of chips in select list */
  const getFilterChips = () => {
    return (
      <div className={classes.chipsCtr}>
        {checked[index]?.value?.map((selected) => (
          <div
            key={Math.random()}
            className={styles1.chips}
            style={{ minWidth: "fit-content" }}
          >
            <div className={styles1.chipsText}>{selected.name}</div>
            {selected?.hexcode && (
              <Grid container justify="flex-end" style={{ marginRight: "1em" }}>
                <span className="c1" style={{ marginTop: -4 }}>
                  <div
                    style={{
                      border: "1px solid #A4B3CC",
                      borderRadius: "12px",
                      height: "22px",
                      width: "22px",
                      background: `${selected.hexcode}`,
                    }}
                  ></div>
                </span>
              </Grid>
            )}
            <div
              onClick={() => handleDelete(checked?.[index].key, selected.id)}
            >
              <img
                width="12px"
                height="10px"
                src={CloseIconChip}
                alt="cross"
                className={styles1.crossIcon}
              />
            </div>
          </div>
        ))}
      </div>
    );
  };

  /*Used to trigger for fetching more data */
  const loadMore = async (search) => {
    isLoadingRef.current = true;
    const resp = await fetchMore(search);
    setData(resp);
    isLoadingRef.current = false;
  };

  /*Used to manage scroll on dropdown list */
  const handleScroll = (e) => {
    if (isLoadingRef.current) {
      return;
    }
    if (
      data.length < maxCount &&
      e.target.scrollHeight - e.target.scrollTop - 25 <= e.target.clientHeight
    ) {
      loadMore();
    }
  };

  useEffect(() => {
    getData(query);
  }, [debouncedSearch]);

  useEffect(() => {
    setData(Data);
  }, [Data]);

  return (
    <>
      <div className={classes.root}>
        <div
          className={`${classes.container}  ${open && classes.selectBorder} ${
            checked[index]?.value.length > 0 && classes.backgroundSelected
          }`}
          onClick={handleClick}
        >
          <span className={classes.titleTag}>
            {checked[index]?.value?.length
              ? checked[index]?.value?.map((selected, index) => (
                  <Fragment key={Math.random()}>
                    {index === 0
                      ? `${capitalizeStr(selected.name)}`
                      : `, ${capitalizeStr(selected.name)}`}
                  </Fragment>
                ))
              : `${title}`}
          </span>
          <div className={classes.expand}>
            {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </div>
        </div>

        <Menu
          anchorEl={anchorEl}
          style={{ top: "32px" }}
          keepMounted
          open={open}
          onClose={handleClose}
        >
          <div className={classes.chipContainer}>{getFilterChips()}</div>

          <div
            className="row-center"
            style={{
              height: 42,
              marginTop: 5,
            }}
          >
            <img
              src={SearchIcon}
              alt="search"
              style={{ marginLeft: 20, marginRight: 10 }}
            />
            <InputBase
              value={query}
              placeholder={`Search By ${placeholder}`}
              onChange={(e) => setQuery(e.target.value)}
              fullWidth
              style={{
                fontSize: 13,
                lineHeight: 20 / 13,
                fontWeight: 500,
              }}
            />
            {query !== "" && (
              <div
                onClick={() => {
                  setQuery("");
                }}
                className="cursor-pointer"
              >
                <img
                  src={CrossIcon}
                  alt="cross"
                  style={{ marginBottom: -5, marginRight: 20 }}
                />
              </div>
            )}
          </div>
          <div className={classes.listCtr} onScroll={handleScroll}>
            {data.length > 0 ? (
              data.map((value) => {
                return (
                  <MenuItem
                    key={value?.value}
                    style={{ padding: 10, borderTop: "1px solid #f2f2f7" }}
                    onClick={() =>
                      handleToggle(
                        title,
                        value.value,
                        value.label,
                        value?.hexcode
                      )
                    }
                  >
                    <div className={classes.itemContainer}>
                      <div className={classes.itemText}>{value.label}</div>
                    </div>
                    {value?.hexcode && (
                      <Grid
                        container
                        justify="flex-end"
                        style={{ marginRight: "1em" }}
                      >
                        <span className="c1" style={{ marginTop: -4 }}>
                          <div
                            style={{
                              border: "1px solid #A4B3CC",
                              borderRadius: "12px",
                              height: "22px",
                              width: "22px",
                              background: `${value.hexcode}`,
                            }}
                          ></div>
                        </span>
                      </Grid>
                    )}
                  </MenuItem>
                );
              })
            ) : (
              <MenuItem>No Result Found</MenuItem>
            )}
            {data.length < maxCount ? (
              <div className={classes.loaderCtr}>
                <CircularProgress
                  variant="indeterminate"
                  disableShrink
                  classes={{
                    circle: classes.circle,
                  }}
                  size={30}
                  thickness={4}
                />
              </div>
            ) : null}
          </div>
        </Menu>
      </div>
    </>
  );
}
