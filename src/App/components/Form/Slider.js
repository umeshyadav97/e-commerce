import React, { useState, useEffect } from "react";
import { Grid, InputAdornment, Slider, TextField, Typography } from "@material-ui/core";
import Toast from "../toast";

const CustomSlider = ({
  SliderValue,
  SliderMax,
  SliderMin,
  SliderStep,
  SliderData,
  SliderEndlabel,
  SliderStartlabel,
  ShowSliderField,
  onToggle,
}) => {
  const [SliderVal, setSliderVal] = useState(SliderValue);
  const handleSliderChange = (event, newValue) => {
    if (parseInt(newValue[0]) > parseInt(newValue[1])) {
        return Toast.showErrorToast(`Start price can not be greater than end`);
    }
    if (parseInt(newValue[1]) < parseInt(newValue[0])) {
      return Toast.showErrorToast(`Start price can not be greater than end`);
  }
    setSliderVal(newValue);
    SliderData(newValue);
    onToggle(newValue)
  };

  const handleStartchange = (event) => {
    let newarr = [...SliderVal];
    newarr[0] = event.target.value;
    if (parseInt(newarr[0]) > parseInt(newarr[1])) {
      return Toast.showErrorToast(`Start price can not be greater than end`);
    }
    setSliderVal(newarr);
    SliderData(newarr);
    onToggle(newarr);
  };
  const handleEndChange = (event) => {
    let newarr = [...SliderVal];
    newarr[1] = event.target.value;
    if (parseInt(newarr[1]) < parseInt(newarr[0])) {
      return Toast.showErrorToast(`End price can not be less than start`);
    }
    setSliderVal(newarr);
    SliderData(newarr);
    onToggle(newarr);
  };

  useEffect(() => {
    setSliderVal(SliderValue);
  }, [SliderValue]);
  return (
    <>
      <Grid item>
        <Slider
          min={SliderMin}
          max={SliderMax}
          step={SliderStep}
          value={SliderVal}
          onChange={handleSliderChange}
          valueLabelDisplay="auto"
          aria-labelledby="range-slider"
          color="secondary"
        />
        {ShowSliderField && (
          <Grid container justify="center" spacing={2}>
            <Grid item xs={6}>
              <Typography>{SliderStartlabel}</Typography>
              <TextField
                id="outlined-helperText"
                variant="outlined"
                margin="normal"
                defaultValue={SliderVal[0]}
                onChange={handleStartchange}
                value={SliderVal[0]}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" style={{marginRight:0}}>
                      <Typography
                      >
                        $
                      </Typography>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <Typography>{SliderEndlabel}</Typography>
              <TextField
                id="outlined-margin-normal"
                margin="normal"
                variant="outlined"
                fullWidth
                defaultValue={SliderVal[1]}
                onChange={handleEndChange}
                value={SliderVal[1]}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start"  style={{marginRight:0}}>
                      <Typography
                      >
                        $
                      </Typography>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
        )}
      </Grid>
    </>
  );
};

export default CustomSlider;
