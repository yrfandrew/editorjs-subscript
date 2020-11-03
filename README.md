![](https://badgen.net/badge/Editor.js/v2.0/blue)

# Subscript Tool

Subscript Tool for marking text-fragments for the [Editor.js](https://ifmo.su/editor).

## Installation

### Install via NPM

Get the package

```shell
npm i --save-dev editorjs-subscript
```

Include module at your application

```javascript
const Subscript = require('editorjs-subscript');
```

### Download to your project's source dir

1. Upload folder `dist` from repository
2. Add `dist/bundle.js` file to your page.

## Usage

Add a new Tool to the `tools` property of the Editor.js initial config.

```javascript
var editor = EditorJS({
  ...
  
  tools: {
    ...
    subscript: {
      class: Subscript
    },
  },
  
  ...
});
```

## Config Params

This Tool has no config params

## Output data

Marked text will be wrapped with a `sub` tag with an `cdx-subscript` class.

```json
{
    "type" : "text",
    "data" : {
        "text" : "This is test<sub class='cdx-subscript'>text</sub>."
    }
}
```
