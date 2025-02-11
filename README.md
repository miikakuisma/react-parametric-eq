# react-parametric-eq

React Parametric EQ is 9-band parametric equalizer built on Web Audio API

## Live demo

[Check out this CodeSandbox example]([https://codesandbox.io/p/devbox/react-parametric-eq-demo-tyr9tx](https://tyr9tx-5173.csb.app/))

## Install

`npm install react-parametric-eq`

or

`yarn add react-parametric-eq`

## Usage

Import the package..

```
import ParametricEq from "react-parametric-eq"
```

then add it..

```
<ParametricEq
	audioBuffer={audioBuffer}
	onReady={() => {
		// EQ is ready now
		// This is where you can connect audio nodes
	}}
	onChange={(band) => {
		// This gets triggered as sliders are updated
		console.log(band)
	}}
	onRender={(renderedBuffer) => {
		// When eQrender() method is called the current EQ settings
		// are applied onto the given audioBuffer, after which this
		// onRender is called, returns with updated audioBuffer.
	}}
	className='custom-css-selector'
	style={{ width: '100%' }}
/>
```

## Props

```
eQbands
```

## Methods

```
eQreset()
eQrender()
eQexport()
```


