# react-parametric-eq

React Parametric EQ is 9-band parametric equalizer built on Web Audio API

## Install

`npm install react-parametric-eq`

## Usage

```
import ParametricEq from "react-parametric-eq"

<ParametricEq
	audioBuffer={audioBuffer} // required for rendering only
	onReady={() => {
		// Everything has been initialized now
	}}
	onChange={(band) => {
		console.log(band)
	}}
	onRender={(rendered) => {
		// do something with rendered buffer
	}}
	className='custom-css-selector'
	style={{ width: '100%' }}
/>
```

## Props

```
eQbands, eQreset, eQrender, eQexport
```

## Methods

```
window.ParametricEq.reset()

window.ParametricEq.render()

```

## Updating this package

You need to have NPM user account and be a member of sumoapps organization.

After you've updated the code, you can test the package by installing it from local directory.
For example:  `npm install ../sumo-filedrop` would add unpublished package.

When you're certain that the package will work correctly, it's time to update it to npm.

1. Run `npm build` 
2. Commit and push the changes to git repo
3. You need to be logged in to npm: `npm login`
4. Increment version number [read more here](https://docs.npmjs.com/cli/version)
5. run `npm publish`

This package template was taken from here:

