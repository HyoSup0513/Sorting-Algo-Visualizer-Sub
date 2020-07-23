import VolumeDownIcon from "@material-ui/icons/VolumeDown";
import VolumeOffIcon from "@material-ui/icons/VolumeOff";
import React from "react";
import Button from "@material-ui/core/Button";

export let allowedVolume = true;
export default () => {
  const [checked, setChecked] = React.useState(true);

  const toggleChecked = () => {
    setChecked((prev) => !prev);
    allowedVolume = !allowedVolume;
  };

  return (
    <div>
      <Button
        variant="contained"
        color="secondary"
        onClick={toggleChecked}
        startIcon={checked ? <VolumeDownIcon /> : <VolumeOffIcon />}
      />
    </div>
  );
};
