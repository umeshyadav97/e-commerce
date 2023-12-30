import React, { useState } from 'react';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Grid from '@material-ui/core/Grid';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { PrimaryButton, InputField, Dropdown } from '../../../components';

const reasons = [
  {
    id: 1,
    text: `Product not required anymore`,
  },
  {
    id: 2,
    text: `Incorrect size ordered`,
  },
  {
    id: 3,
    text: `Ordered by mistake`,
  },
  {
    id: 4,
    text: `Want to change style/color`,
  },
  {
    id: 5,
    text: `Duplicate Order`,
  },
  {
    id: 8,
    text: `Other Reason`,
  },
];

const useStyles = makeStyles((theme)=>({
  root: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    borderRadius: 0,
  },
  content: {
    marginBottom: 30,
    maxWidth: 460,
    width: 460,
    [theme.breakpoints.down("xs")]:{
      width : 275,
    }
  },
  input: {
    padding: '0px 20px',
    marginTop: 20,
  },
  subTitle: {
    color: '#708099',
    fontFamily: 'Inter Regular',
    fontSize: 16,
    padding: '0px 20px',
  },
  label: {
    fontFamily: 'Inter Medium',
    fontSize: 14,
    marginBottom: 10,
  },
  reason: {
    marginTop: 10,
  },
}));

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(3),
    color: theme.palette.grey[900],
    height: 40,
  },
  title: {
    fontFamily: 'Inter SemiBold',
    fontSize: 18,
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h4" className={classes.title}>
        {children}
      </Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const CancelOrder = ({ title, open, handleClose, handleModalSubmit }) => {
  const classes = useStyles();
  const [record, setRecord] = useState({ reason: '', other_reason: '' });

  const handleChange = (key) => (event) => {
    let tempData = { ...record };
    tempData[key] = event.target.value;
    setRecord(tempData);
  };

  return (
    <Dialog open={open} onClose={handleClose} className={classes.root}>
      <DialogContent className={classes.content}>
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          {title}
        </DialogTitle>
        <Typography variant="h4" className={classes.subTitle}>
          Please select the reason for cancellation
        </Typography>
        <Grid
          container
          direction="column"
          spacing={2}
          className={classes.input}
        >
          {/* Reason */}
          <Grid item xs={12}>
            <Typography variant="h4" className={classes.label}>
              Reason
            </Typography>
            <Dropdown
              variant="outlined"
              labelId="dropdown-label"
              id="reason"
              defaultValue="Product not required anymore"
              fullWidth
              style={{ padding: '2px' }}
              onChange={handleChange('reason')}
            >
              {reasons.map((item) => (
                <MenuItem key={item.id} value={item.text}>
                  {item.text}
                </MenuItem>
              ))}
            </Dropdown>
            {record.reason === 'Other Reason' && (
              <InputField
                id="parent_category"
                type="text"
                placeholder="Enter Reason"
                variant="outlined"
                value={record.other_reason}
                onChange={handleChange('other_reason')}
                multiline
                rows={4}
                fullWidth
                className={classes.reason}
              />
            )}
          </Grid>
          <Grid item>
            <PrimaryButton
              style={{ width: '100%', marginTop: 20 }}
              variant="contained"
              color="primary"
              onClick={() => handleModalSubmit(record)}
            >
              Cancel
            </PrimaryButton>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default CancelOrder;
