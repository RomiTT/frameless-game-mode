import React from 'react';

interface MainContentProps {
  headerRef: React.RefObject<HTMLElement>;
  footerRef: React.RefObject<HTMLElement>;
  style?: Object;
  className?: string;
  onHeightChanged?: Function;
}

export default class MainContent extends React.PureComponent<MainContentProps> {
  state = {
    height: 0
  };

  constructor(props: MainContentProps) {
    super(props);
  }

  componentDidMount() {
    window.addEventListener('DOMContentLoaded', this.calcHeight);
    window.addEventListener('resize', this.calcHeight);
  }

  componentWillUnmount() {
    window.removeEventListener('DOMContentLoaded', this.calcHeight);
    window.removeEventListener('resize', this.calcHeight);
  }

  private calcHeight = () => {
    if (this.props.headerRef.current && this.props.footerRef.current) {
      let newHeight =
        window.innerHeight -
        (this.props.headerRef.current.offsetHeight +
          this.props.footerRef.current.offsetHeight);

      this.setState({ height: newHeight });

      if (this.props.onHeightChanged) {
        this.props.onHeightChanged(newHeight);
      }
    }
  };

  render() {
    return (
      <div
        className={this.props.className}
        style={{
          ...this.props.style,
          height: this.state.height,
          overflow: 'auto',
          width: '100%'
        }}
      >
        {this.props.children}
      </div>
    );
  }
}
