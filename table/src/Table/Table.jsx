import React, { Component } from 'react';

function getColumnDescriptions(children) {
  let byRows = {}, byDataField = {};
  React.Children.forEach(children, (column) => {
    const {row, hidden, dataField} = column.props;
    if (column === null || column === undefined || typeof row !== 'number' || hidden) { return; }
    if (!byRows[row]) { byRows[row] = [] }
    byRows[row].push(column);
    if (dataField) { byDataField[dataField] = column }
  });
  let descriptions = Object.keys(byRows).sort().map(row => {
    byRows[row].key = row;
    return byRows[row];
  });
  descriptions.byRows = byRows;
  descriptions.byDataField = byDataField;
  return descriptions;
}

function handleFiltersChange(newActiveFilters) {
  this.setState({ activeFilters: newActiveFilters });
}

function handleSortsChange(newActiveSorts) {
  this.setState({ activeSorts: newActiveSorts });
}

function handleAdjustBody(bodyWidth, initialCellsWidth) {
  const {widthFactor} = this.state;
  if (bodyWidth <= initialCellsWidth && widthFactor !== 1) {
    this.setState({ widthFactor: 1 });
  } else if (bodyWidth > initialCellsWidth ) {
    let _widthFactor = bodyWidth / initialCellsWidth;
    if (Math.abs(widthFactor - _widthFactor) > 0.001) {
      this.setState({ widthFactor: _widthFactor });
    }
  }
}

function getHeaderRef(key, th) {
  this[key] = th;
}

function getBodyRef(key, tb) {
  this[key] = tb;
}

function syncScroll(key, e) {
  if (this[key] && this[key].scrollLeft !== e.currentTarget.scrollLeft) {
    this[key].scrollLeft = e.currentTarget.scrollLeft;
  }
}

export {getColumnDescriptions,
  handleFiltersChange, handleSortsChange, handleAdjustBody,
  getHeaderRef, getBodyRef, syncScroll}