import {getColumnDescriptions,
  handleFiltersChange, handleSortsChange, handleAdjustBody,
  getHeaderRef, getBodyRef, syncScroll} from './Table'
import {TableHeader, FILTER_TYPES} from './TableHeader'
import {TableBody} from './TableBody'
import TableColumn from './TableColumn'
import {MultiselectDropdown, getNewActiveFilters} from './MultiselectDropdown'
import {SortButton, ASC, DESC, getNewActiveSorts} from './SortButton'

function filterByMultipleValues(value, values) {
  if (values.length) {
    return values.indexOf(value) > -1
  }
  return true;
}

function filterBy(rawData, activeFilters) {
  let filteredData = [];
  const
    activeFilterKeys = activeFilters.map(activeFilter => Object.keys(activeFilter)[0]),
    length = activeFilterKeys.length;
  rawData.forEach(row => {
    if (length) {
      let skip = false;
      activeFilterKeys.some((filterKey, index) => {
        const filtered = filterByMultipleValues(row[filterKey], activeFilters[index][filterKey]);
        if (filtered) {
          return false;
        }
        skip = true;
        return true;
      });
      if (!skip) {
        filteredData.push(row);
      }
    } else {
      filteredData.push(row);
    }
  });

  return filteredData;
}

function sortBy(filteredData, activeSorts) {
  let sortedData = filteredData;
  const
    activeSortKeys = activeSorts.map(activeFilter => Object.keys(activeFilter)[0]),
    length = activeSortKeys.length;
  if (length) {
    sortedData = filteredData.sort((a, b) => {
      let notEqual = false, result = 0;
      activeSortKeys.some((sortKey, index) => {
        const multiplicator = activeSorts[index][sortKey] === DESC ? -1 : 1;
        const aValue = a[sortKey], bValue = b[sortKey];
        if ((bValue > 0 && !aValue) || (bValue === 0 && !aValue) || (aValue < bValue)) {
          result = -1 * multiplicator;
          notEqual = true;
        } else if ((aValue > 0 && !bValue) || (aValue === 0 && !bValue) || (aValue > bValue)) {
          result = multiplicator;
          notEqual = true;
        }
        return notEqual;
      });
      return result;
    });
  }
  return sortedData;
}

function twoDigits(value) {
  return (Math.round(Number(value) * 100)/100).toFixed(2)
}

export {
  getColumnDescriptions,
  handleFiltersChange, handleSortsChange, handleAdjustBody, ASC, DESC,
  getHeaderRef, getBodyRef, syncScroll,
  TableHeader, FILTER_TYPES,
  TableBody, filterBy, sortBy,
  TableColumn,
  MultiselectDropdown, getNewActiveFilters,
  SortButton, getNewActiveSorts,
  twoDigits
}