import React from "react";
import PropTypes from "prop-types";
import "./Eq.css";

const propTypes = {
  equalizer: PropTypes.array,
  updateBand: PropTypes.func,
  resetBand: PropTypes.func
};

function Bands({ equalizer, updateBand }) {
  const eqSliders = equalizer.map((eq) => (
    <div className="slider" key={`slider-${eq.frequency}`}>
      <input
        type="range"
        min="-10"
        max="10"
        value={eq.value}
        step="0.1"
        title={eq.value}
        onChange={(e) => {
          if (e.target.value !== eq.value) {
            updateBand({
              filter: `eq${eq.frequency}`,
              param: "gain",
              frequency: eq.frequency,
              value: e.target.value
            });
          }
        }}
        onDoubleClick={(e) => {
          updateBand({
            filter: `eq${eq.frequency}`,
            param: "gain",
            frequency: eq.frequency,
            value: 0
          });
        }}
      />
      <label>{eq.label}</label>
    </div>
  ));

  return <div className={"bands"}>{eqSliders}</div>;
}

Bands.propTypes = propTypes;
export default Bands;
