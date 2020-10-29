import React, { useEffect, useRef } from "react";
import { Engine } from "@babylonjs/core/Engines/engine";
import { Scene } from "@babylonjs/core/scene";
import { Vector3, Color4 } from "@babylonjs/core/Maths";
import { ArcRotateCamera } from "@babylonjs/core/Cameras";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { PointLight } from "@babylonjs/core/Lights/pointLight";
import { MeshBuilder } from "@babylonjs/core/Meshes";
import "@babylonjs/core/Materials/standardMaterial";
import "./canvas.css";

export default () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    function resize() {
      engine.resize();
    }

    const engine = new Engine(canvas, true);
    const createScene = function () {
      const scene = new Scene(engine);

      const camera = new ArcRotateCamera(
        "Camera",
        Math.PI / 2,
        Math.PI / 2,
        5,
        new Vector3(0, 0, 5),
        scene
      );
      camera.attachControl(canvas, true);

      new HemisphericLight("light1", new Vector3(1, 1, 0), scene);
      new PointLight("light2", new Vector3(0, 1, -1), scene);

      const plane = MeshBuilder.CreateGroundFromHeightMap(
        "gdhm",
        "https://images.unsplash.com/photo-1541715301255-12a4839b424a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80",
        { width: 5, height: 5, subdivisions: 800, maxHeight: 0.25 },
        scene
      );

      plane.rotation.z = Math.PI / 2;
      plane.rotation.y = Math.PI / 2;

      return scene;
    };

    const scene = createScene();

    engine.runRenderLoop(function () {
      scene.render();
    });

    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);
  return <canvas ref={canvasRef} />;
};
