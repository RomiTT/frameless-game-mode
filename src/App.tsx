import React from 'react';
import logo from './logo.svg';
import './App.css';
import { TitleBar, TitleBarTheme } from './components/FramelessTitleBar';
import MainContent from './components/MainContent';
import process from 'process';
import {
  Navbar,
  Colors,
  H1,
  Classes,
  Alignment,
  NavbarDivider,
  Button,
  NavbarGroup,
  NavbarHeading
} from '@blueprintjs/core';
const { remote } = require('electron');
const { FGM } = remote.app;

class App extends React.Component<any, object> {
  headerRef: any;
  footerRef: any;
  FGM: any;

  state = {
    isRunningFGM: false,
    isStoppedFGM: true
  };

  constructor(props: any) {
    super(props);
    this.headerRef = React.createRef();
    this.footerRef = React.createRef();

    let arg = [
      { processName: 'sekiro.exe', wpos: 4, wsize: 0, width: 0, height: 0 }
    ];

    FGM.initFramelessGameMode(arg);
  }

  componentWillUnmount() {
    FGM.stopFramelessGameMode();
  }

  render() {
    return (
      <div className='hero is-fullheight bp3-dark'>
        <div className='hero-head' ref={this.headerRef}>
          <TitleBar
            app='Game Save Points Manager'
            icon={`./appIcon.ico`}
            theme={TitleBarTheme}
          />
          <Navbar style={{ height: 'auto', overflow: 'hidden' }}>
            <NavbarGroup align={Alignment.LEFT}>
              <NavbarHeading>Frameless Game Mode</NavbarHeading>
            </NavbarGroup>
            <NavbarGroup align={Alignment.RIGHT}>
              <Button className={Classes.MINIMAL} icon='home' text='Home' />
              <Button
                className={Classes.MINIMAL}
                icon='document'
                text='Files'
              />
              <NavbarDivider />
              <Button
                disabled={this.state.isRunningFGM}
                className={Classes.MINIMAL}
                icon='play'
                onClick={() => {
                  FGM.startFramelessGameMode();
                  this.setState({
                    isRunningFGM: FGM.isRunningFramelessGameMode(),
                    isStoppedFGM: FGM.isStoppedFramelessGameMode()
                  });
                }}
              />
              <Button
                disabled={!this.state.isRunningFGM}
                className={Classes.MINIMAL}
                icon='pause'
                onClick={() => {
                  FGM.pauseFramelessGameMode();
                  this.setState({
                    isRunningFGM: FGM.isRunningFramelessGameMode(),
                    isStoppedFGM: FGM.isStoppedFramelessGameMode()
                  });
                }}
              />
              <Button
                className={Classes.MINIMAL}
                disabled={this.state.isStoppedFGM}
                icon='stop'
                onClick={() => {
                  FGM.stopFramelessGameMode();
                  this.setState({
                    isRunningFGM: FGM.isRunningFramelessGameMode(),
                    isStoppedFGM: FGM.isStoppedFramelessGameMode()
                  });
                }}
              />
              <Button className={Classes.MINIMAL} icon='cog' />
            </NavbarGroup>
          </Navbar>
        </div>
        <div
          className='hero-body'
          id='hero-body'
          style={{
            backgroundColor: Colors.GOLD5,
            padding: 0
          }}
        >
          <MainContent
            className='container has-text-centered'
            headerRef={this.headerRef}
            footerRef={this.footerRef}
          >
            <img src={logo} className='App-logo' alt='logo' />
            <p className='title'>Hello, Frameless Game Mode</p>
            <p className='title'>Hello, Frameless Game Mode</p>
            <p className='title'>Hello, Frameless Game Mode</p>
            <p className='title'>Hello, Frameless Game Mode</p>
            <p className='title'>Hello, Frameless Game Mode</p>
            <p className='title'>Hello, Frameless Game Mode</p>
            <p className='title'>Hello, Frameless Game Mode</p>
            <p className='title'>Hello, Frameless Game Mode</p>
            <p className='title'>Hello, Frameless Game Mode</p>
            <p className='title'>Hello, Frameless Game Mode</p>
            <p className='title'>End, Frameless Game Mode</p>
          </MainContent>
        </div>
        <div
          className='hero-foot'
          style={{ backgroundColor: Colors.DARK_GRAY5 }}
          ref={this.footerRef}
        >
          <nav className='tabs is-boxed is-fullwidth'>
            <div className='container' style={{ overflow: 'hidden' }}>
              <ul>
                <li>
                  <a style={{ color: 'white' }}>Overview</a>
                </li>
                <li>
                  <a style={{ color: 'white' }}>Modifiers</a>
                </li>
                <li>
                  <a style={{ color: 'white' }}>Grid</a>
                </li>
                <li>
                  <a style={{ color: 'white' }}>Elements</a>
                </li>
                <li>
                  <a style={{ color: 'white' }}>Components</a>
                </li>
                <li>
                  <a style={{ color: 'white' }}>Layout</a>
                </li>
              </ul>
            </div>
          </nav>
        </div>
      </div>
    );
  }
}

export default App;
