import React, { Component } from 'react'
import * as THREE from 'three'
import orbit from 'three-orbitcontrols'
import {MTLLoader, OBJLoader} from 'three-obj-mtl-loader'
import { JSONLoader } from 'three-json-loader'
import createReactClass from 'create-react-class'
import './ShoeExample.css'
                
class ShoeExample extends Component {
    
    initCamera()
    {
        let width = this.mount.clientWidth
        let height = this.mount.clientHeight

        let camera = new THREE.PerspectiveCamera(2, width / height, 0.1, 2000)
        camera.position.set( 800, 400, 1000 );

        this.camera = camera
        
    }
    initScene()
    {
        let scene = new THREE.Scene()
        //scene.background = new THREE.Color( 0x000000 );

        this.scene = scene
    }
    loadModels()
    {
        new MTLLoader().load('models/nike-1.mtl', (materials) => {
            materials.preload()
            let objLoader = new OBJLoader();
            objLoader.setMaterials(materials)
            objLoader.load('models/nike-1.obj', (object) => {
            this.scene.add(object)
            })
        })
    }
    loadModelFromUrl = (url) => {
        console.log(url);
        this.scene.remove(this.scene.children[3]);
        //Load model
        new MTLLoader().load(`models/${url}.mtl`, (materials) => {
            console.log("pre")
            materials.preload()
            const objLoader = new OBJLoader();
            objLoader.setMaterials(materials)
            objLoader.load(
                `models/${url}.obj`
                ,  (object) => {
                    console.log("hello")
                    this.scene.add(object)
                }, (xhr) => {
                    console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
                }
            )
            console.log("world")
        })
        console.log("last");
    }
    initLight()
    {
        let ambientLight = new THREE.AmbientLight( 0xffffff, 0.5 );
        this.scene.add( ambientLight );

        let frontLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
        frontLight.position.set( 100, 100, 100 );

        let backLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
        backLight.position.set( -10, 10, -10 );

        this.scene.add( frontLight, backLight );
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
        let orbit1 = new orbit( this.camera, this.renderer.domElement );
        this.scene.add(orbit1);
    }
    componentDidMount() {

        this.initCamera()
        this.initScene()
        this.initLight()
        this.initRenderer()
        this.initController()
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
        this.renderer.render(this.scene, this.camera)
    }

    onSwitchModel = (model_id) => {
        this.loadModelFromUrl("nike-" + model_id);
    }

    render() {
        var days = [0,1,2,3,4,5];

        var Day = createReactClass({
            onMouseOver: function(elem){
                this.props.onHover(this.props.index);
            },
            render: function(){
                
                return <button className={"day " + "img" + this.props.val + " " + this.props.hoverState} onMouseOver={this.onMouseOver} onClick={()=>{this.props.onButtonClick(this.props.val % 3 + 1)}} /*onClickMy={this.props.onButtonClick(this.props.val)this.onMyClick(this.props.val)}*/>
                        </button>;
            }
        });

        var Days = createReactClass({
            
            getInitialState: function() {
            return {selected: "", hover: ""};
        },
            getHoverState: function(index) {
                if(this.state.hover - 1 === index || this.state.hover + 1 === index){
                    return "sibling";
                } else if(this.state.hover === index) {
                    return "current";
                }
                return "";
            },
            onHover: function(index){
                this.setState({hover: index});
            },
            onMouseOut: function(){
                this.setState({hover: ""});
            },
            render: function(){
                var all_days = this.props.list.map(function(d, i){
                    return <Day index={i} key={d} val={d} hoverState={this.getHoverState(i)} onHover={this.onHover} 
                        onButtonClick={(val) => {this.props.onButtonClick(val)}}/>
                }.bind(this));
                return <div onMouseOut={this.onMouseOut}> {all_days}</div>;
            }
        });
        return (
            <div id="days">
                <Days list={days} onButtonClick={(val) => {this.onSwitchModel(val)}}></Days>
                <div style={{ width: '100%', height: 'calc(100vh - 100px)' }} ref={mount => {this.mount = mount}}/>
            </div>
        )
    }
}

export default ShoeExample
