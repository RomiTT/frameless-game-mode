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

import {
  FGM,
  FGM_STATE,
  FGM_WINDOW_POSITION,
  FGM_WINDOW_SIZE,
  FGM_MODE
} from './components/FGM';

class App extends React.Component<any, object> {
  headerRef: any;
  footerRef: any;

  state = {
    FGMState: FGM_STATE.STOPPED
  };

  constructor(props: any) {
    super(props);
    this.headerRef = React.createRef();
    this.footerRef = React.createRef();

    this.handleStarted = this.handleStarted.bind(this);
    this.handlePaused = this.handlePaused.bind(this);
    this.handleStopped = this.handleStopped.bind(this);

    let arg = [
      {
        processName: 'D:\\Games\\Sekiro\\sekiro.exe',
        title: '',
        wpos: FGM_WINDOW_POSITION.MIDDLE_CENTER,
        wsize: FGM_WINDOW_SIZE.BASED_ON_CLIENT_AREA,
        width: 0,
        height: 0
      }
    ];

    FGM.setDataList(arg);
    FGM.setEventListener('started', this.handleStarted);
    FGM.setEventListener('paused', this.handlePaused);
    FGM.setEventListener('stopped', this.handleStopped);
    FGM.setMode(FGM_MODE.ALL_WINDOWS);
  }

  handleStarted(msg: String) {
    console.log(`%c${msg}`, 'font-size:2em; color:red;');
    console.log(`FGM_STATE: ${FGM_WINDOW_POSITION.MIDDLE_CENTER}`);

    let newState: FGM_STATE = FGM.state();
    this.setState({
      FGMState: newState
    });

    console.log('FGM.getWindowAppList: ', FGM.getWindowAppList());
  }

  handlePaused(msg: String) {
    console.log(`%c${msg}`, 'font-size:2em; color:red;');

    let newState: FGM_STATE = FGM.state();
    this.setState({
      FGMState: newState
    });
  }

  handleStopped(msg: String) {
    console.log(`%c${msg}`, 'font-size:2em; color:red;');

    let newState: FGM_STATE = FGM.state();
    this.setState({
      FGMState: newState
    });
  }

  componentWillUnmount() {
    //FGM.stopFramelessGameMode();
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
                disabled={this.state.FGMState == FGM_STATE.STARTED}
                className={Classes.MINIMAL}
                icon='play'
                onClick={() => {
                  FGM.start();
                }}
              />
              <Button
                disabled={
                  this.state.FGMState == FGM_STATE.PAUSED ||
                  this.state.FGMState == FGM_STATE.STOPPED
                }
                className={Classes.MINIMAL}
                icon='pause'
                onClick={() => {
                  FGM.pause();
                }}
              />
              <Button
                disabled={this.state.FGMState == FGM_STATE.STOPPED}
                className={Classes.MINIMAL}
                icon='stop'
                onClick={() => {
                  FGM.stop();
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
