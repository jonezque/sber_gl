
var VSHADER_SOURCE = `
    attribute vec4 a_Position;
    attribute vec3 a_color;
    varying vec3 v_Color;

    void main() {
        gl_Position = a_Position;
        v_Color = a_color;
    }
`;

var FSHADER_SOURCE = `
    precision mediump float;
    varying vec3 v_Color;

    void main() {
        gl_FragColor = vec4(v_Color, 1.0);
    }
`;

function createShader(gl, type, source) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
      return shader;
    }

    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
  }

  function createProgram(gl, vertexShader, fragmentShader) {
    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    var success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
      return program;
    }

    console.log(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
  }


function main() {
    var canvas = document.getElementById('webgl');
    if (!canvas) {
        return;
    }

    const gl = canvas.getContext('webgl');
    if (!gl) {
      return;
    }

    var vertexShader = createShader(gl, gl.VERTEX_SHADER, VSHADER_SOURCE);
    var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, FSHADER_SOURCE);
    var program = createProgram(gl, vertexShader, fragmentShader);
    gl.useProgram(program);

    var mode = gl.TRIANGLES;
    let dx = 0;
    function draw () {

        var vertices = new Float32Array([
            0.0 , 0.5, Math.abs(Math.sin(dx)), 0.0, 0.0,
            -0.5, -0.5, 0.0, Math.abs(Math.sin(dx)), 0.0,
            0.5, -0.5, 0.0, 0.0, 1. - Math.abs(Math.sin(dx)),
        ]);
        dx+= 0.01;
        var n = 3;
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        var vertexBuffer = gl.createBuffer();
        var FSIZE = vertices.BYTES_PER_ELEMENT;

        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

        var a_Position = gl.getAttribLocation(program, 'a_Position');
        gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE*5, 0);
        gl.enableVertexAttribArray(a_Position);

        var a_color = gl.getAttribLocation(program, 'a_color');
        gl.vertexAttribPointer(a_color, 3, gl.FLOAT, false, FSIZE*5, FSIZE*2);
        gl.enableVertexAttribArray(a_color);
        gl.drawArrays(mode, 0, n);
        requestAnimationFrame(draw);
    }
    draw();
}

function initVertexBuffers(gl, program) {
    var vertices = new Float32Array([
        0.0, 0.5, 1.0, 0.0, 0.0,
        -0.5, -0.5, 0.0, 1.0, 0.0,
        0.5, -0.5, 0.0, 0.0, 1.0,
    ]);
    var n = 3;

    var vertexBuffer = gl.createBuffer();
    var FSIZE = vertices.BYTES_PER_ELEMENT;

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    var a_Position = gl.getAttribLocation(program, 'a_Position');
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE*5, 0);
    gl.enableVertexAttribArray(a_Position);

    var a_color = gl.getAttribLocation(program, 'a_color');
    gl.vertexAttribPointer(a_color, 3, gl.FLOAT, false, FSIZE*5, FSIZE*2);
    gl.enableVertexAttribArray(a_color);

    return n;
}
