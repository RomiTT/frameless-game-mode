import React from 'react';
import { Colors } from '@blueprintjs/core';

interface AppLayoutProps {
  headerBackgroundColor?: string;
  bodyBackgroundColor?: string;
  footerBackgroundColor?: string;
  className?: string;
  style?: object;
}

interface AppLayoutState {
  bodyHeight: number;
}

class AppLayout extends React.Component<AppLayoutProps, AppLayoutState> {
  headerId: string;
  bodyId: string;
  footerId: string;
  header: HTMLElement | null;
  body: HTMLElement | null;
  footer: HTMLElement | null;
  containerStyle: React.CSSProperties;
  headerStyle: React.CSSProperties;
  bodyStyle: React.CSSProperties;
  footerStyle: React.CSSProperties;

  constructor(props: AppLayoutProps) {
    super(props);
    this.headerId = 'romitt_applayout_header';
    this.bodyId = 'romitt_applayout_body';
    this.footerId = 'romitt_applayout_footer';
    this.header = null;
    this.body = null;
    this.footer = null;
    this.containerStyle = {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'stretch',
      width: '100%'
    };
    this.headerStyle = {
      flexGrow: 0,
      flexShrink: 0,
      backgroundColor: this.props.headerBackgroundColor
    };
    this.bodyStyle = {
      flexGrow: 1,
      flexShrink: 0,
      overflow: 'auto',
      backgroundColor: this.props.bodyBackgroundColor
    };
    this.footerStyle = {
      flexGrow: 0,
      flexShrink: 0,
      backgroundColor: this.props.footerBackgroundColor
    };
    this.state = { bodyHeight: 0 };
  }

  componentDidMount() {
    window.addEventListener('DOMContentLoaded', this.handleResize);
    window.addEventListener('resize', this.handleResize);

    this.header = document.getElementById(this.headerId);
    this.body = document.getElementById(this.bodyId);
    this.footer = document.getElementById(this.footerId);
    this.handleResize();
  }

  componentWillUnmount() {
    window.removeEventListener('DOMContentLoaded', this.handleResize);
    window.removeEventListener('resize', this.handleResize);
  }

  handleResize = () => {
    if (this.header && this.footer) {
      let newHeight =
        window.innerHeight -
        (this.header.offsetHeight + this.footer.offsetHeight);

      this.setState({ bodyHeight: newHeight });

      if (this.body) {
        let mainContent: any = this.body.children[0];
        mainContent.style.height = `${newHeight}px`;
        console.log('mainContent.height=', mainContent.style.height);
      }
    }
  };

  render() {
    let header = null;
    let body = null;
    let footer = null;

    if (Array.isArray(this.props.children)) {
      let children = this.props.children;
      switch (this.props.children.length) {
        case 0:
          break;

        case 1:
          body = children[0];
          break;

        case 2:
          header = children[0];
          body = children[1];
          break;

        default:
          header = children[0];
          body = children[1];
          footer = children[2];
          break;
      }
    } else {
      body = this.props.children;
    }

    return (
      <div
        className={this.props.className}
        style={{ ...this.props.style, ...this.containerStyle }}
      >
        <div style={this.headerStyle} id={this.headerId}>
          {header}
        </div>
        <div
          style={{ ...this.bodyStyle, height: this.state.bodyHeight }}
          id={this.bodyId}
        >
          {body}
        </div>
        <div style={this.footerStyle} id={this.footerId}>
          {footer}
        </div>
      </div>
    );
  }
}

export default AppLayout;