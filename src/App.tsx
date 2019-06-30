import React from 'react';
import logo from './logo.svg';
import './App.css';
import { TitleBar, TitleBarTheme } from './components/FramelessTitleBar';
import MainContent from './components/MainContent';
import AppLayout from './components/AppLayout';
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

import WindowAppList from './components/WindowAppList';

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

  componentDidMount() {}

  render() {
    return (
      <AppLayout className='bp3-dark' bodyBackgroundColor={Colors.GOLD5}>
        <header>
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
        </header>

        <WindowAppList />

        <footer
          className='has-text-centered'
          style={{ backgroundColor: Colors.DARK_GRAY5 }}
        >
          <h1>Footer</h1>
        </footer>
      </AppLayout>
    );
  }
}

export default App;
