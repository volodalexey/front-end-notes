import React, { Component } from 'react'

import styles from './sortButton.css'

const ASC = 'ASC', DESC = 'DESC';

function getNewActiveSorts(activeSorts, dataField, multiple) {
  const foundSort = activeSorts.find(activeSort => Object.keys(activeSort)[0] === dataField),
    indexSort = foundSort ? activeSorts.indexOf(foundSort) : -1,
    sortValue = foundSort ? foundSort[dataField] : '';
  let newSortValue = '';
  switch (sortValue) {
    case '':
      newSortValue = ASC;
      break;
    case ASC:
      newSortValue = DESC;
      break;
    case DESC:
      newSortValue = '';
      break;
  }
  let newActiveSorts;
  if (newSortValue) {
    if (foundSort) { // change sort
      newActiveSorts = activeSorts.map((s, i) => {
        if (i === indexSort) {
          return { [dataField]: newSortValue }
        }
        return s;
      });
    } else { // add sort
      if (multiple) {
        newActiveSorts = activeSorts.concat([{ [dataField]: newSortValue }]);
      } else {
        newActiveSorts = [{ [dataField]: newSortValue }];
      }
    }
  } else if (foundSort && indexSort >= 0) { // remove sort
    newActiveSorts = activeSorts.filter((s, i) => i !== indexSort);
  }
  return newActiveSorts;
}

class SortButton extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleSortChange = this.handleSortChange.bind(this);
  }

  handleSortChange() {
    const {activeSorts, dataField, multiple} = this.props;
    const newActiveSorts = getNewActiveSorts(activeSorts, dataField, multiple);
    this.props.onSortsChange(newActiveSorts);
  }

  renderIcon(dataField, foundSort) {
    if (foundSort) {
      const sortValue = foundSort[dataField];
      if (sortValue === ASC) {
        return '  /\\'
      } else if (sortValue === DESC) {
        return '  \\/'
      }
    }
    return '  |'
  }

  render() {
    const {title, activeSorts, dataField, className} = this.props;
    const foundSort = activeSorts.find(activeSort => Object.keys(activeSort)[0] === dataField);
    return (
      <button type="button" className={`${styles.sortButton} ${className} ${foundSort ? 'active' : ''}`}
              onClick={this.handleSortChange}>
        {title}
        {this.renderIcon(dataField, foundSort)}
      </button>
    )
  }
}

export {SortButton, ASC, DESC, getNewActiveSorts}
export default SortButton;