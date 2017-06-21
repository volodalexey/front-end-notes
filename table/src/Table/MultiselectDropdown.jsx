import React, { Component } from 'react'
import styles from './multiselectDropdown.css'

class MultiselectToggle extends Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    const { link } = this.props;

    return (
      <button type="button" onClick={this.props.onClick} ref={link}
              className={styles.multiselectToggle} >
        {this.props.children}
      </button>
    );
  }
}

class MultiselectMenu extends Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    const { children, link, style } = this.props;

    return (
      <div className={styles.multiselectMenu} ref={link} style={style} >
        <span className={styles.multiselectMenuTitle}>Filter by</span>
        <ul className={styles.multiselectMenuList}>
          {children}
        </ul>
      </div>
    );
  }
}

function getNewActiveFilters(activeFilters, dataField, value) {
  const
    foundFilter = activeFilters.find(activeFilter => Object.keys(activeFilter)[0] === dataField),
    indexFilter = foundFilter ? activeFilters.indexOf(foundFilter) : -1;
  let newFilterValue, newActiveFilters;
  if (foundFilter) {
    const
      filterValue = foundFilter[dataField],
      indexValue = filterValue.indexOf(value);
    if (indexValue > -1) {
      newFilterValue = filterValue.filter((item, i) => i !== indexValue);
    } else {
      newFilterValue = filterValue.concat([value]);
    }
    if (newFilterValue.length) { // change filter
      newActiveFilters = activeFilters.map((f, i) => {
        if (i === indexFilter) {
          return { [dataField]: newFilterValue }
        }
        return f;
      });
    } else { // remove filter
      newActiveFilters = activeFilters.filter((f, i) => i !== indexFilter);
    }
  } else { // add filter
    newFilterValue = [value];
    newActiveFilters = activeFilters.concat({ [dataField]: newFilterValue });
  }
  return newActiveFilters;
}

class MultiselectDropdown extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      open: false,
      top: 0,
      left: 0,
      minWidth: 0,
      maxHeight: 0
    };

    this.$refs = {};

    this.toggleState = this.toggleState.bind(this);
    this.handleDocumentClick = this.handleDocumentClick.bind(this);

    this.handleCheckedChange = this.handleCheckedChange.bind(this);
  }

  calcVisiblePosition() {
    let rect = this.$refs.multiselectToggle.getBoundingClientRect();
    return {
      top: rect.top + rect.height, left: rect.left,
      minWidth: rect.width,
      maxHeight: window.innerHeight - (rect.top + rect.height + 5)
    }
  }

  toggleState(toggle) {
    let state = { open: toggle };
    if (toggle) {
      let result = this.calcVisiblePosition();
      state.top = result.top; state.left = result.left;
      state.minWidth = result.minWidth; state.maxHeight = result.maxHeight;
    }
    this.setState(state);
  }

  handleCheckedChange(value) {
    const {activeFilters, dataField} = this.props;
    const newActiveFilters = getNewActiveFilters(activeFilters, dataField, value);
    this.props.onFiltersChange(newActiveFilters, value);
  }

  isChecked(dataField, foundFilter, value) {
    if (foundFilter) {
      return foundFilter[dataField].indexOf(value) > -1;
    }
    return false;
  }

  render() {
    const {open, top, left, minWidth, maxHeight} = this.state;
    const {items, title, activeFilters, dataField} = this.props;
    const foundFilter = activeFilters.find(activeFilter => Object.keys(activeFilter)[0] === dataField);
    return (
      <div open={open} className={`${styles.multiselectDropdown} ${open ? 'open' : ''} ${foundFilter ? 'active': ''}`}
           ref={(el) => this.$refs.root = el}>
        <MultiselectToggle link={(el) => this.$refs.multiselectToggle = el} onClick={() => this.toggleState(!open)}>
          {title + (foundFilter ? ' *' : '')}
        </MultiselectToggle>
        <MultiselectMenu style={{ position: 'fixed', overflowY: 'auto',
                           top: `${top}px`, left: `${left}px`,
                           minWidth: `${minWidth}px`, maxHeight: `${maxHeight}px` }}>
          {items.map(item => {
            const isChecked = this.isChecked(dataField, foundFilter, item.value);
            return <label key={item.value} className={`${styles.multiselectMenuListItem} ${isChecked ? 'active': ''}`}>
              <span>{item.text}</span>
              <input type='checkbox' className={styles.checkBox}
                     checked={isChecked}
                     onChange={ (e) => {this.handleCheckedChange(item.value)} } />
            </label>
          })}
        </MultiselectMenu>
      </div>
    )
  }

  handleDocumentClick(e) {
    const {root} = this.$refs;
    if (!root.contains(e.target)) {
      this.toggleState();
    }
  }

  componentDidMount() {
    window.document.addEventListener('click', this.handleDocumentClick);
  }

  componentWillUnmount() {
    window.document.removeEventListener('click', this.handleDocumentClick);
  }
}

export {MultiselectDropdown, getNewActiveFilters}
export default MultiselectDropdown;