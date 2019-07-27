import React from 'react';
import styles from './AppLayout.module.scss';

interface IProps {
  className?: string;
  style?: object;
}

interface IState {
  bodyHeight: number;
}

export default class AppLayout extends React.PureComponent<IProps, IState> {
  private headerId: string = 'romitt_applayout_header';
  private bodyId: string = 'romitt_applayout_body';
  private footerId: string = 'romitt_applayout_footer';
  private header: HTMLElement | null = null;
  private footer: HTMLElement | null = null;
  state = { bodyHeight: 0 };

  componentDidMount() {
    window.addEventListener('DOMContentLoaded', this.handleResize);
    window.addEventListener('resize', this.handleResize);

    this.header = document.getElementById(this.headerId);
    this.footer = document.getElementById(this.footerId);
    this.handleResize();
  }

  componentWillUnmount() {
    window.removeEventListener('DOMContentLoaded', this.handleResize);
    window.removeEventListener('resize', this.handleResize);
  }

  private handleResize = () => {
    if (this.header && this.footer) {
      let newHeight =
        window.innerHeight -
        (this.header.offsetTop + this.header.offsetHeight + this.footer.offsetHeight);

      this.setState({ bodyHeight: newHeight });
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
      <div className={`${this.props.className} ${styles.container}`} style={this.props.style}>
        <div className={styles.header} id={this.headerId}>
          {header}
        </div>
        <div className={styles.body} style={{ height: this.state.bodyHeight }} id={this.bodyId}>
          {body}
        </div>
        <div className={styles.footer} id={this.footerId}>
          {footer}
        </div>
      </div>
    );
  }
}
