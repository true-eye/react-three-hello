// Three JSON Parser

module.exports = function(THREE) {

  /**
   * Converts decimal values in the range 0-1 to hexadecimal values between 00 and FF.
   * @param {Array} rgb: An array of three values, representing red, green and blue values.
   */
  function rgbToHex(rgb) {

    function componentToHex(c) {
      var hex = c.toString(16).toUpperCase();
      return hex.length === 1 ? "0" + hex : hex;
    }

    var color = rgb.map(function(component) {
      return componentToHex(parseInt(component * 255));
    });

    color.unshift("0X");
    color = color.join("");
    return parseInt(color);

  }

  /**
   * Generates a THREE.Mesh using the data passed.
   * @param {Object} data: a JSON file specifying the attributes of the mesh.
   */
  return function generateMesh(data) {
    // Parse data to geometry.
    var geometry = new THREE.Geometry();

    data.vertices.forEach(function(vector) {
      geometry.vertices.push(new THREE.Vector3(vector[0], vector[1], vector[2]));
    });

    for (var i = 0; i < data.faces.length; i++) {
      geometry.faces.push(new THREE.Face3(
        data.faces[i][0],
        data.faces[i][1],
        data.faces[i][2],
        [
          normals[i][0],
          normals[i][1],
          normals[i][2]
        ]));

      geometry.faceVertexUvs[0].push(new THREE.Vector2(data.uvs[i], data.uvs[i+1]));
    }

    geometry.computeFaceNormals();

    var material;
    // Determine material type.
    if (data.diffuse && data.ambient && data.specular) {
      // Phong material.
      material = new THREE.MeshPhongMaterial({
        color: rgbToHex(data.diffuse),
        specular: rgbToHex(data.specular)
      });
    } else if (data.diffuse && data.ambient) {
      // Lambert material.
      material = new THREE.MeshLambertMaterial({
        color: rgbToHex(data.diffuse)
      });
    } else if (data.ambient) {
      // Basic material.
      material = new THREE.MeshBasicMaterial({
        color: rgbToHex(data.diffuse)
      });
    }

    var mesh = new THREE.Mesh(geometry, material);

    return mesh;
  }
}
