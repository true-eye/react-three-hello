import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import {Switch, Route, HashRouter} from 'react-router-dom';

import './index.css';
//components
import App from './components/App';
import NotFound from './components/NotFound/NotFound'

//SimpleExamples
import RotatingCube from './components/Three/SimpleExamples/RotatingCube'
import GroupExample from './components/Three/SimpleExamples/GroupExample'

//ControlExamples
import OrbitControlExample from './components/Three/ControlExamples/OrbitControlExample'

//LoaderExamples
import TextureLoaderExample from './components/Three/LoaderExamples/TextureLoaderExample'
import ObjectLoaderExample from './components/Three/LoaderExamples/ObjectLoaderExample'
import LogoLoaderExample from './components/Three/LoaderExamples/LogoLoaderExample';
import ShoeExample from './components/Three/LoaderExamples/ShoeExample';


ReactDOM.render(
    <HashRouter hashType="noslash">
        <App>
            <Switch>
                <Route exact path="/" component= {RotatingCube} />
                <Route path="/Three/RotatingCube" component= {RotatingCube} />
                <Route path="/Three/OrbitControlExample" component= {OrbitControlExample} />
                <Route path="/Three/TextureLoaderExample" component= {TextureLoaderExample} />
                <Route path="/Three/ObjectLoaderExample" component= {ObjectLoaderExample} />
                <Route path="/Three/LogoLoaderExample" component= {LogoLoaderExample} />
                <Route path="/Three/ShoeExample" component= {ShoeExample} />
                <Route path="/Three/GroupExample" component= {GroupExample} />

                
            </Switch>
        </App>
    </HashRouter>
    , document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
