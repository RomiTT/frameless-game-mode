import React from 'react';
import { autorun } from 'mobx';
import { inject } from 'mobx-react';
import logo from './logo.svg';
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
import { FGM_STATE, FGM_MODE } from './components/FGM';

import WindowAppList from './components/WindowAppList';
import { IStoreFGM } from './stores/StoreFGM';
import styles from './App.module.scss';

const { ipcRenderer } = require('electron');

interface AppProps {
  storeFGM?: IStoreFGM;
}

interface AppState {
  stateFGM: FGM_STATE;
}

@inject('storeFGM')
class App extends React.Component<AppProps, AppState> {
  headerRef: any;
  footerRef: any;

  constructor(props: any) {
    super(props);

    this.headerRef = React.createRef();
    this.footerRef = React.createRef();
    this.props.storeFGM!.loadAppList();
    this.state = {
      stateFGM: this.props.storeFGM!.state
    };
  }

  componentDidMount() {
    autorun(() => {
      this.setState({ stateFGM: this.props.storeFGM!.state });
    });

    if (this.props.storeFGM!.startOnLaunch) {
      this.props.storeFGM!.start();
    }

    ipcRenderer.on('close', this.handleCloseWindow);

    window.addEventListener('unload', this.handleCloseWindow);
  }

  componentWillUnmount() {}

  handleCloseWindow = () => {
    this.props.storeFGM!.saveAppList();
    ipcRenderer.send('closed');
  };

  render() {
    return (
      <AppLayout className='bp3-dark' bodyBackgroundColor={Colors.GOLD5}>
        <header>
          <TitleBar
            app='Frameless Game Mode'
            icon={`./appIcon.ico`}
            theme={TitleBarTheme}
          />
          <Navbar style={{ height: 'auto', overflow: 'hidden' }}>
            <NavbarGroup align={Alignment.LEFT}>
              <NavbarHeading>Frameless Game Mode</NavbarHeading>
            </NavbarGroup>
            <NavbarGroup align={Alignment.RIGHT}>
              <NavbarDivider />
              <Button
                disabled={this.state.stateFGM == FGM_STATE.STARTED}
                className={Classes.MINIMAL}
                intent={
                  this.state.stateFGM == FGM_STATE.STARTED ? 'none' : 'success'
                }
                icon='play'
                onClick={() => {
                  this.props.storeFGM!.start();
                }}
              />
              <Button
                disabled={
                  this.state.stateFGM == FGM_STATE.PAUSED ||
                  this.state.stateFGM == FGM_STATE.STOPPED
                }
                className={Classes.MINIMAL}
                icon='pause'
                intent={
                  this.state.stateFGM == FGM_STATE.PAUSED ||
                  this.state.stateFGM == FGM_STATE.STOPPED
                    ? 'none'
                    : 'success'
                }
                onClick={() => {
                  this.props.storeFGM!.pause();
                }}
              />
              <Button
                disabled={this.state.stateFGM == FGM_STATE.STOPPED}
                className={Classes.MINIMAL}
                icon='stop'
                intent={
                  this.state.stateFGM == FGM_STATE.STOPPED ? 'none' : 'danger'
                }
                onClick={() => {
                  this.props.storeFGM!.stop();
                }}
              />
              <Button className={Classes.MINIMAL} icon='cog' intent='warning' />
            </NavbarGroup>
          </Navbar>
        </header>

        <WindowAppList />

        <footer className={`has-text-centered ${styles.footer}`}>
          <h1>Footer</h1>
        </footer>
      </AppLayout>
    );
  }
}

export default App;
