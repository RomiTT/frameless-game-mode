import React from 'react';
import logo from './logo.svg';
import './App.css';
import { TitleBar, TitleBarTheme } from './FramelessTitleBar';

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

const App: React.FC = () => {
  return (
    <div className='hero is-fullheight bp3-dark'>
      <div className='hero-head' style={{ backgroundColor: Colors.DARK_GRAY5 }}>
        <TitleBar
          app='Game Save Points Manager'
          icon={`./appIcon.ico`}
          theme={TitleBarTheme}
        />
        <Navbar>
          <NavbarGroup align={Alignment.LEFT}>
            <NavbarHeading>Frameless Game Mode</NavbarHeading>
          </NavbarGroup>
          <NavbarGroup align={Alignment.RIGHT}>
            <Button className={Classes.MINIMAL} icon='home' text='Home' />
            <Button className={Classes.MINIMAL} icon='document' text='Files' />
            <NavbarDivider />
            <Button className={Classes.MINIMAL} icon='user' />
            <Button className={Classes.MINIMAL} icon='notifications' />
            <Button className={Classes.MINIMAL} icon='cog' />
          </NavbarGroup>
        </Navbar>
      </div>
      <div
        className='hero-body'
        style={{
          backgroundColor: Colors.GOLD5
        }}
      >
        <div className='container has-text-centered'>
          <img src={logo} className='App-logo' alt='logo' />
          <p className='title'>Hello, Frameless Game Mode</p>
        </div>
      </div>
    </div>
  );
};

export default App;
