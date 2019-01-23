# three-js-loader

Loads mesh data from a JSON file, importing it into the scene. Relies on ThreeJS.
The data format expected is produced by [obj-json-parser](https://www.npmjs.com/package/obj-json-parser).

Example:
```javascript
// Standard three.js setup.
var THREE = require("three");

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// The loader relies on three.js.
var loader = require("three-json-loader")(THREE);

// Data can be from anywhere. Inline data, XHR request, etc.
var data = {...};

// Returns a THREE.Mesh.
var mesh = loader(data);
scene.add(mesh);
```
