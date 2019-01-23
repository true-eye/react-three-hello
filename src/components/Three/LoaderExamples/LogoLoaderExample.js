import React, { Component } from 'react'
import * as THREE from 'three'
import OrbitControls from 'three-orbitcontrols'
import {MTLLoader, OBJLoader} from 'three-obj-mtl-loader'
import ImprovedNoise from 'improved-noise'

const path = "img/"
const format = ".jpg"
const FLOOR_RES = 60
const FLOOR_HT = 250

const FLOOR_WIDTH = 3600;
const FLOOR_DEPTH = 4800;
const MOVE_SPD = 1.9;
const noiseScale = 9.5;
const noiseSeed = Math.random() * 100;
                
class LogoLoaderExample extends Component {


    initCamera()
    {
        let width = this.mount.clientWidth
        let height = this.mount.clientHeight

        this.stepCount = 0

        this.mouseX = 0;
        this.mouseY = 0;
        let windowHalfX = width / 2;
        let windowHalfY = height / 2;
        this.snoise = new ImprovedNoise();


        let camera = new THREE.PerspectiveCamera(70, width / height, 1, 4000)
        camera.position.z = 2750;

        this.camera = camera
    }
    initScene()
    {
        let scene = new THREE.Scene()
        scene.fog = new THREE.FogExp2(0x1c3c4a, 0.00045);

        this.scene = scene
    }
    loadModels()
    {
        //Load model
        /*new MTLLoader().load('models/bench.mtl', (materials) => {
            materials.preload()
            let objLoader = new OBJLoader();
            objLoader.setMaterials(materials)
            objLoader.load('models/bench.obj', (object) => {
            this.scene.add(object)
            })
        })*/
    }
    initLight()
    {
        var hemisphereLight = new THREE.HemisphereLight(0xe3feff, 0xe6ddc8, 0.7);
        this.scene.add(hemisphereLight);
        hemisphereLight.position.y = 300;

        var centerLight = new THREE.SpotLight(0xb7f9ff, 1);
        this.scene.add(centerLight);
        centerLight.position.set(2500, 300, 2000);
        centerLight.penumbra = 1;
        centerLight.decay = 5;

        this.pointLight = new THREE.PointLight(0xe07bff, 1.5);
        this.pointLight.position.z = 200;
        this.scene.add(this.pointLight);

        this.pointLight2 = new THREE.PointLight(0xff4e00, 1.2);
        this.pointLight2.position.z = 200;
        this.scene.add(this.pointLight2);
    }
    initSkyBox(){
        let geometry = new THREE.CubeGeometry(6000,6000,6000);
        var cubeMaterials = [
          new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load( "textures/skybox/px.jpg" ), side: THREE.DoubleSide }),
          new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load( 'textures/skybox/nx.jpg' ), side: THREE.DoubleSide }),
          new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load( 'textures/skybox/px.jpg' ), side: THREE.DoubleSide }),
          new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load( 'textures/skybox/nx.jpg' ), side: THREE.DoubleSide }),
          new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load( 'textures/skybox/px.jpg' ), side: THREE.DoubleSide }),
          new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load( 'textures/skybox/nx.jpg' ), side: THREE.DoubleSide })
        ];
      
        var cubeMaterial = new THREE.MeshFaceMaterial( cubeMaterials );
        this.cube = new THREE.Mesh( geometry, cubeMaterial );
        this.scene.add(this.cube);
      }
    
    initRenderer()
    {
        let width = this.mount.clientWidth
        let height = this.mount.clientHeight

        let renderer = new THREE.WebGLRenderer({ alpha: true })
        renderer.setSize(width, height)
        renderer.setPixelRatio( window.devicePixelRatio );

        this.renderer = renderer

    }

    initController()
    {
        //add orbit
        let orbit = new OrbitControls( this.camera, this.renderer.domElement );
        this.scene.add(orbit);
    }
    initGeometry()
    {
        this.moverGroup = new THREE.Object3D();
        this.scene.add(this.moverGroup);
        
        var floorGroup = new THREE.Object3D();
        var floorMaterial = new THREE.MeshPhongMaterial({
            color: 0xcccccc, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, wireframe: false
        });
        this.floorGeometry = new THREE.PlaneGeometry(FLOOR_WIDTH + 1200, FLOOR_DEPTH, FLOOR_RES, FLOOR_RES);

        var floorMesh = new THREE.Mesh(this.floorGeometry, floorMaterial);
        var floorMesh2 = new THREE.Mesh(this.floorGeometry, floorMaterial);
        floorMesh2.position.y = 20;
        floorMesh2.position.z = 5;
        floorGroup.add(floorMesh);
        floorGroup.add(floorMesh2);

        this.scene.add(floorGroup);

        floorMesh.rotation.x = Math.PI / 1.65;
        floorMesh2.rotation.x = Math.PI / 1.65;
        floorGroup.position.y = 180;

        this.pGeometry = new THREE.Geometry();
        let textureLoader = new THREE.TextureLoader();
        var sprite = textureLoader.load("textures/aarp.png");
        for( var i = 0; i < 2000; i++ ) {
            var vertex = new THREE.Vector3();
            vertex.x = 4000 * Math.random() - 2000;
            vertex.y = 700 * Math.random() - 200;
            vertex.z = 5000 * Math.random() - 2000;
            this.pGeometry.vertices.push(vertex);
        }

        var logo = textureLoader.load("textures/aarp.png");
        var geometry = new THREE.PlaneBufferGeometry(266, 59, 1);
        var material = new THREE.MeshLambertMaterial({
            transparent: true, opacity: 0.7, blending: THREE.AdditiveBlending, map: logo, side: THREE.DoubleSide
        });

        var plane = new THREE.Mesh(geometry, material);
        plane.position.set(0, 70, 2400);
        this.scene.add(plane);

    }

    setWaves() {
        this.stepCount++;
        this.moverGroup.position.z = -MOVE_SPD;
        var i, ipos;
        var offset = this.stepCount * MOVE_SPD / FLOOR_DEPTH * FLOOR_RES;
        for( i = 0; i < FLOOR_RES; i++) {
            for( var j = 0; j < FLOOR_RES + 1; j++) {
                ipos = i + offset;
                if( (i > 30) || (j < 12) || (j > 48)) {
                    this.floorGeometry.vertices[i * (FLOOR_RES + 1) + j].z = this.snoise.noise(ipos / FLOOR_RES * noiseScale, j / FLOOR_RES * noiseScale, noiseSeed) * FLOOR_HT;
                } else if ( i > 25 && i < 30 ) {
                    this.floorGeometry.vertices[i * (FLOOR_RES + 1) + j].z = this.snoise.noise(ipos / FLOOR_RES * noiseScale, j / FLOOR_RES * noiseScale, noiseSeed) * (FLOOR_HT / 1.2);
                } else {
                    this.floorGeometry.vertices[i * (FLOOR_RES + 1) + j].z = this.snoise.noise(ipos / FLOOR_RES * noiseScale, j / FLOOR_RES * noiseScale, noiseSeed) * (FLOOR_HT / 2);
                }
            }
        }
        this.floorGeometry.verticesNeedUpdate = true;
    }
    
    componentDidMount() {

        this.stepCount = 0;

        this.initCamera()
        this.initScene()
        this.initLight()
        this.initRenderer()
        //this.initSkyBox()
        this.initController()
        this.initGeometry()
        this.loadModels()
        

        //response for changing window size
        window.addEventListener('resize', this.handleResize)

        this.mount.appendChild(this.renderer.domElement)
        this.start()
    }

    componentWillUnmount() {
        window.removeEventListener('resize',  this.handleResize)
        this.stop()
        this.mount.removeChild(this.renderer.domElement)
    }

    handleResize = () => {
        
        let width = this.mount.clientWidth
        let height = this.mount.clientHeight
        
        this.renderer.setSize(width, height)
        this.camera.aspect = width / height
        this.camera.updateProjectionMatrix()
    }

    start = () => {
        if (!this.frameId) {
        this.frameId = requestAnimationFrame(this.animate)
        }
    }

    stop = () => {
        cancelAnimationFrame(this.frameId)
    }

    animate = () => {
        this.renderScene()
        this.frameId = window.requestAnimationFrame(this.animate)
    }

    renderScene = () => {
        var timer = -0.0002 * Date.now();
        this.pointLight.x = 2400 * Math.cos(timer);
        this.pointLight.z = 2400 * Math.sin(timer);
        this.pointLight2.x = 1800 * Math.cos(-timer * 1.5);
        this.pointLight2.z = 1800 * Math.sin(-timer * 1.5);
        //this.camera.position.x += (this.mouseX - this.camera.position.x) * 0.05;
        //this.camera.position.y += (this.mouseY - this.camera.position.y) * 0.05;
        this.setWaves()
        //this.camera.lookAt(this.scene.position);
        this.renderer.render(this.scene, this.camera)
    }

    render() {
        return (
        <div
            style={{ width: '100%', height: 'calc(100vh - 100px)' }}
            ref={mount => {
            this.mount = mount
            }}
        />
        )
    }
}

export default LogoLoaderExample
