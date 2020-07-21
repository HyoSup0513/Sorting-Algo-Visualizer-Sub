import React from "react";
import Switch from "@material-ui/core/Switch";
import FormGroup from "@material-ui/core/FormGroup";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

const AntSwitch = withStyles((theme) => ({
  root: {
    width: 28,
    height: 16,
    padding: 0,
    display: "flex",
  },
  switchBase: {
    padding: 2,
    color: theme.palette.grey[500],
    "&$checked": {
      transform: "translateX(12px)",
      color: theme.palette.common.white,
      "& + $track": {
        opacity: 1,
        backgroundColor: theme.palette.primary.main,
        borderColor: theme.palette.primary.main,
      },
    },
  },
  thumb: {
    width: 12,
    height: 12,
    boxShadow: "none",
  },
  track: {
    border: `1px solid ${theme.palette.grey[500]}`,
    borderRadius: 16 / 2,
    opacity: 1,
    backgroundColor: theme.palette.common.white,
  },
  checked: {},
}))(Switch);

export let DURATION;
export default () => {
  const [checked, setChecked] = React.useState(false);

  const toggleChecked = () => {
    setChecked((prev) => !prev);

    if (checked == false) {
      DURATION = 5;
    } else {
      DURATION = 100;
    }
  };
  return (
    <div>
      <FormGroup>
        <Typography component="div">
          <Grid component="label" container alignItems="center" spacing={1}>
            <Grid item>Slow</Grid>
            <Grid item>
              <AntSwitch
                checked={checked}
                onChange={toggleChecked}
                name="checkedC"
              />
            </Grid>
            <Grid item>Fast</Grid>
          </Grid>
        </Typography>
      </FormGroup>

      <style jsx>
        {`
          .container {
            padding: 32px;
          }
          .buttonBox {
            width: 100%;
            height: 60px;
            background-color: pink;
            text-align: right;
          }
          .button {
            font-size: 40px;
          }
          .h3 {
            font-size: 24px;
            font-family: "Roboto", "Helvetica", "Arial", sans-serif;
            margin: 0px;
            color: white;
            margin: 10px 0px;
          }
          .indexBox {
            color: white;
            padding: 0px 10px 0px 10px;
            box-sizing: border-box;
          }
          .index {
            position: absolute;
            width: 20px;
            background-color: yellow;
            color: white;
            opacity: 0.8;
          }
          .index.i {
            background-color: red;
          }
          .index.j {
            background-color: blue;
          }
          .running {
            font-size: 40px;
          }
        `}
      </style>
    </div>
  );
};
