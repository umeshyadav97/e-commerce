import React, { useState, useEffect } from "react";
import { Grid, Typography, makeStyles } from "@material-ui/core";
import { API, ENDPOINTS } from "../../../api/apiService";
import { OutlinedPrimaryButton, Toast } from "../../components";
import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
    height: "100%",
    padding: "48px 80px",
    background: "#fff",
  },
  content: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    textAlign: "justify",
  },
  appbar: {
    backgroundColor: "#FFFFFF",
    color: "black",
    padding: "13px 0px 13px 21px",
  },
  logo: {
    cursor: "pointer",
    fontSize: 24,
    fontWeight: 600,
  },
  header: {
    fontSize: 18,
    fontWeight: 600,
  },
  title: {
    fontFamily: "Inter SemiBold",
    fontSize: "24px",
    lineHeight: "40px",
    color: "#242424",
  },
  side_header: {
    fontFamily: "Inter SemiBold",
    fontSize: "14px",
    lineHeight: "22px",
    letterSpacing: "normal",
  },
  question: {
    fontFamily: "Inter SemiBold",
    fontSize: "16px",
    lineHeight: "28px",
    color: "#242424",
  },
  answer: {
    fontFamily: "Inter Regular",
    fontSize: "16px",
    lineHeight: "28px",
    color: "#242424",
  },
  paper: {
    paddingBottom: "20px",
    borderBottom: "1px solid #D3DCEB",
  },
  container: {
    width: "100%",
  },
}));

const FAQs = (props) => {
  const classes = useStyles();
  const [record, setRecord] = useState(null);
  const [faqs, setFAQS] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const ID = props.match.params.id;

  const fetchCMSPage = async () => {
    try {
      const resp = await API.get(`${ENDPOINTS.CMS}/${ID}`, false);
      if (resp.success) {
        let result = resp.data;
        result = {
          ...result,
        };
        const arr = JSON.parse(result.body);
        setFAQS(arr);
        setRecord(result);
      }
    } catch (e) {
      const msg =
        typeof e.data.error?.message === "string"
          ? e.data.error?.message
          : e.data.error?.message[0];
      Toast.showErrorToast(msg || `Error Fetching CMS Page. Please Refresh`);
    }
  };

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  useEffect(() => {
    fetchCMSPage();
  }, []);

  return (
    <div>
      {record && (
        <>
          <div className={classes.root}>
            <Grid container className={classes.headerBox}>
              <Grid
                container
                justify={"space-between"}
                alignItems={"center"}
                className={classes.paper}
              >
                <Grid item className={classes.header}>
                  <Typography className={classes.title}>
                    {record.title}
                  </Typography>
                </Grid>
                <Grid item>
                  <OutlinedPrimaryButton
                    wide
                    onClick={() =>
                      props.history.replace(`/cms/faqs/${ID}/user-agreement`)
                    }
                  >
                    <Typography className={classes.side_header}>
                      User Agreement
                    </Typography>
                  </OutlinedPrimaryButton>
                </Grid>
              </Grid>
            </Grid>
            <Grid container className={classes.contentBox}>
              <Grid item className={classes.content}>
                {faqs.map((faq, index) => {
                  return (
                    <div key={index} className={classes.container}>
                      <Accordion
                        expanded={expanded === index}
                        onChange={handleChange(index)}
                      >
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls={index}
                          id={index}
                        >
                          <Typography className={classes.question}>
                            {faq.question}
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Typography className={classes.answer}>
                            {faq.answer}
                          </Typography>
                        </AccordionDetails>
                      </Accordion>
                    </div>
                  );
                })}
              </Grid>
            </Grid>
          </div>
        </>
      )}
    </div>
  );
};

export default FAQs;
