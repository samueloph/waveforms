// @flow
import React, { PureComponent } from 'react';
import ResizeObserver from 'resize-observer-polyfill';

type Props = {
  children: (width: number) => React$Node,
};

type State = {
  width?: number,
};

class AvailableWidth extends PureComponent<Props, State> {
  state = {};

  elem: HTMLElement;
  observer: ResizeObserver;

  componentDidMount() {
    // Immediately after mount, we can calculate the available width.
    this.setState({
      width: this.elem.getBoundingClientRect().width,
    });

    // We want to be notified of any changes to the size of this element.
    // Enter 'ResizeObserver'!
    // Using a polyfill atm since it's only in Chrome 65+. Polyfill's only
    // 2.4kb though, so I don't feel the need to import() it.
    this.observer = new ResizeObserver(([entry]) => {
      this.setState({ width: entry.contentRect.width });
    });

    this.observer.observe(this.elem);
  }

  componentWillUnmount() {
    this.observer.disconnect();
  }

  render() {
    const { width } = this.state;
    const { children } = this.props;

    return (
      // $FlowFixMe - I trust that ref() captures an HTMLElement. Flow doesn't.
      <div ref={elem => (this.elem = elem)}>
        {/*
          For the very first render, `width` will be undefined; this data is
          only collected _after_ mount. So, a frame needs to pass with the
          container being empty. Immediately after we collect the width and
          re-render, invoking the children function.
        */}
        {width !== undefined && children(width)}
      </div>
    );
  }
}

export default AvailableWidth;