import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import {connect} from 'react-redux'

import './app.css'

import {handleFiltersChange, handleSortsChange, handleAdjustBody,
  getHeaderRef, getBodyRef, syncScroll,
  filterBy, sortBy, getColumnDescriptions,
  TableHeader, TableBody, TableColumn,
  MultiselectDropdown, SortButton, Text,
  ASC, DESC} from '../Table'

import {fetchDataIfNeeded} from './async'
import {Id, Company, Cost, filterItems} from './data'
import store from './store'

class App extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      activeSorts: [ { [Company]: DESC } ],
      activeFilters: [],
      columnsWidth: {
        [Company]: 300, [Cost]: 300
      },
      widthFactor: 1
    };

    this.handleFiltersChange = handleFiltersChange.bind(this);
    this.handleSortsChange = handleSortsChange.bind(this);
    this.handleAdjustBody = handleAdjustBody.bind(this);
    this.getHeaderRef = getHeaderRef.bind(this, 'th');
    this.getBodyRef = getBodyRef.bind(this, 'tb');
    this.syncHeaderScroll = syncScroll.bind(this, 'th');
  }

  getTableColumns() {
    const {activeFilters, activeSorts, columnsWidth} = this.state;
    return [
      <TableColumn row={0} width={[Company, Cost]}>first header row</TableColumn>,
      <TableColumn row={1} dataField={Company} width={columnsWidth[Company]}>
        <MultiselectDropdown title="Company" activeFilters={activeFilters} dataField={Company}
                             items={filterItems} onFiltersChange={this.handleFiltersChange} />
      </TableColumn>,
      <TableColumn row={1} dataField={Cost} width={columnsWidth[Cost]}>
        <SortButton title="Cost" activeSorts={activeSorts} dataField={Cost}
                    onSortsChange={this.handleSortsChange} />
      </TableColumn>,
    ];
  }
  
  render() {
    const {activeFilters, activeSorts, widthFactor} = this.state;
    const {data, fetching} = this.props;
    const 
      descriptions = getColumnDescriptions(this.getTableColumns()),
      filteredData = filterBy(data, activeFilters),
      sortedData = sortBy(filteredData, activeSorts);
    return (
      <div>
        {fetching ? <div>Fetching...</div> : (
          <div>
            <TableHeader descriptions={descriptions} widthFactor={widthFactor}
                         link={this.getHeaderRef} />
            <TableBody data={sortedData} descriptions={descriptions} keyField={Id}
                       link={this.getBodyRef} handleAdjustScroll={this.syncHeaderScroll}
                       handleAdjustBody={this.handleAdjustBody} widthFactor={widthFactor} />
          </div>
        )}
      </div>
    )
  }

  componentDidMount() {
    this.props.loadData();
  }
}

const mapStateToProps = ({data, isFetchingData, fetchingDataError}, props) => {
  return {
    data,
    fetching: isFetchingData,
    fetchingError: fetchingDataError,
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    loadData: (event) => {
      fetchDataIfNeeded(dispatch);
    }
  }
};

const ReduxApp = connect(
  mapStateToProps,
  mapDispatchToProps
)(App);

const mountNode = document.querySelector('#root');
ReactDOM.render(<ReduxApp store={store} />, mountNode);