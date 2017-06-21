import React, { Component } from 'react';

import styles from './tableHeader.css'

const
  multiselectDropdown = 'multiselectDropdown',
  FILTER_TYPES = { msdd: multiselectDropdown};

class TableHeader extends Component {
  constructor(props) {
    super(props);

    this.adjustScroll = this.adjustScroll.bind(this);
    this.handleRef = this.handleRef.bind(this);
  }

  getFloor(width, factor) {
    return Math.floor(width * factor);
  }

  handleRef(el) {
    const {link} = this.props;
    this.th = el;
    if (typeof link === 'function') {
      link(el);
    }
  }

  renderChildren(descriptions) {
    const {widthFactor} = this.props;
    return descriptions.map(rowDescription => {
      return <div className={styles.tableHeaderRow} key={rowDescription.key}>
        {rowDescription.map((cellDescription, index) => {
          const {props} = cellDescription;
          const {width, dataField} = props;
          const _width = Array.isArray(width) ?
            width.reduce((total, next) => {
              total += this.getFloor(descriptions.byDataField[next].props.width, widthFactor);
              return total;
            }, 0) :
            this.getFloor(width, widthFactor);
          return <div className={styles.tableHeaderCell}
                      key={dataField || index}
                      style={{ width: _width + 'px' }}>
            {cellDescription.props.children}
          </div>
        })}
      </div>
    })
  }

  render() {
    const {className, descriptions} = this.props;

    return (
      <div className={styles.tableHeader} ref={this.handleRef}>
        {this.renderChildren(descriptions)}
      </div>
    )
  }

  componentDidMount() {
    if (this.th) {
      this.th.addEventListener('scroll', this.adjustScroll);
    }
  }

  componentWillUnmount() {
    if (this.th) {
      this.th.removeEventListener('scroll', this.adjustScroll);
    }
  }

  adjustScroll(e) {
    const {handleAdjustScroll} = this.props;
    if (typeof handleAdjustScroll === 'function') {
      handleAdjustScroll(e)
    }
  }
}

export {FILTER_TYPES, TableHeader};
export default TableHeader;