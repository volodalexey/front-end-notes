import React, { Component } from 'react';

import styles from './tableBody.css'

class TableBody extends Component {
  constructor(props) {
    super(props);

    this.adjustBody = this.adjustBody.bind(this);
    this.adjustScroll = this.adjustScroll.bind(this);
    this.handleRef = this.handleRef.bind(this);
    this.handleRowClick = this.handleRowClick.bind(this);
    this.handleCellClick = this.handleCellClick.bind(this);
  }

  renderDivRows(cellDescriptions, data, keyField) {
    const {rowClassName, widthFactor} = this.props;
    return data.map((row, index) => {
      return <div className={`${styles.tableBodyRow} ${rowClassName}`} key={row[keyField]}
                  data-index={index} onClick={this.handleRowClick}>
        {cellDescriptions.map(cellDescription => {
          const {props} = cellDescription;
          const {dataField, dataFormat, cellClassName, width} = props;
          const value = row[dataField];
          const resultValue = dataFormat ? dataFormat(value, row) : value;
          return <div className={`${styles.tableBodyCell} ${cellClassName}`} key={dataField}
                      data-index={index} data-key={dataField} onClick={this.handleCellClick}
                      style={{ width: this.getFloor(width, widthFactor) + 'px' }}>
            {resultValue ? resultValue : '\u00A0'}
          </div>
        })}
      </div>
    });
  }

  getCellDescriptions(descriptions) {
    let cellDescriptions = [];
    descriptions.forEach(rowDescription => {
      rowDescription.forEach((cellDescription) => {
        if (cellDescription.props.dataField) {
          cellDescriptions.push(cellDescription);
        }
      })
    });
    return cellDescriptions;
  }

  handleRef(el) {
    const {link} = this.props;
    this.tb = el;
    if (typeof link === 'function') {
      link(el);
    }
  }

  render() {
    const {className, descriptions, data, keyField} = this.props;
    const cellDescriptions = this.getCellDescriptions(descriptions);

    return (
      <div className={`${styles.tableBody} ${className}`} ref={this.handleRef}>
        {this.renderDivRows(cellDescriptions, data, keyField)}
      </div>
    )
  }

  componentDidMount() {
    this.adjustBody();
    window.addEventListener('resize', this.adjustBody);
    if (this.tb) {
      this.tb.addEventListener('scroll', this.adjustScroll);
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.adjustBody);
    if (this.tb) {
      this.tb.removeEventListener('scroll', this.adjustScroll);
    }
  }

  componentDidUpdate() {
    this.adjustBody();
  }

  getFloor(width, factor) {
    return Math.floor(width * factor);
  }

  adjustBody() {
    const {descriptions, handleAdjustBody} = this.props;
    if (handleAdjustBody) {
      const cellDescriptions = this.getCellDescriptions(descriptions);
      let initialCellsWidth = 0;
      cellDescriptions.forEach(cd => {
        initialCellsWidth += cd.props.width;
      });
      handleAdjustBody(this.tb.offsetWidth, initialCellsWidth);
    }
  }

  adjustScroll(e) {
    const {handleAdjustScroll} = this.props;
    if (typeof handleAdjustScroll === 'function') {
      handleAdjustScroll(e);
    }
  }

  handleRowClick(e) {
    const {handleRowClick, data} = this.props;
    const {index} = e.currentTarget.dataset;
    if (typeof handleRowClick === 'function') {
      handleRowClick(e, data[index], data);
    }
  }

  handleCellClick(e) {
    const {handleCellClick, data} = this.props;
    const {key, index} = e.currentTarget.dataset;
    if (typeof handleCellClick === 'object' && typeof handleCellClick[key] === 'function') {
      handleCellClick[key](e, data[index][key], data[index], data);
    }
  }
}

export {TableBody}
export default TableBody;