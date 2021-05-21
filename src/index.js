import React from "react";
import PropTypes from "prop-types";
import Bands from "./Bands";
import { createAudioContext, equalizerDefaults, render, bufferToWave } from "./core";
import "./Eq.css";

const propTypes = {
  audioBuffer: PropTypes.object,
  onReady: PropTypes.func,
  onChange: PropTypes.func,
  onRender: PropTypes.func,
  className: PropTypes.string,
  style: PropTypes.object
};

const defaultProps = {
  className: "react-parametric-eq"
};

export let eQbands
export let eQreset
export let eQrender
export let eQexport

class ParametricEq extends React.Component {
  constructor() {
    super();
    this.state = {
      equalizer: JSON.parse(JSON.stringify(equalizerDefaults))
    };
  }

  componentDidMount() {
    const { onReady } = this.props;
    createAudioContext()
      .then(() => {
        onReady()
      });

    eQbands = this.state.equalizer
    eQreset = this.handleResetAll.bind(this)
    eQrender = this.handleRender.bind(this)
    eQexport = bufferToWave
  }

  handleResetAll() {
    const { equalizer } = this.state;
    let newBands = equalizer;
    newBands.forEach((band) => {
      band.value = 0;
      window[`eq${band.frequency}`]["gain"].value = 0;
    });
    this.setState({ equalizer: newBands });
  }

  handleUpdateBand({ filter, param, frequency, value }) {
    const { onChange } = this.props;
    const { equalizer } = this.state;
    window[filter][param].value = value;
    let newBands = equalizer;
    newBands.find((band) => band.frequency === frequency).value = value;
    this.setState({ equalizer: newBands });
    onChange({ frequency, value })
  }

  handleRender() {
    const { audioBuffer, onRender } = this.props;
    render(audioBuffer).then((newBuffer) => {
      this.handleResetAll();
      onRender(newBuffer)
    });
  }

  render() {
    const { className, style } = this.props;
    const { equalizer } = this.state;

    return (
      <div className={className} style={style}>
        <div className="bands-container">
          <Bands
            equalizer={equalizer}
            updateBand={this.handleUpdateBand.bind(this)}
          />
        </div>
      </div>
    );
  }
}

ParametricEq.propTypes = propTypes;
ParametricEq.defaultProps = defaultProps;
export default ParametricEq;
