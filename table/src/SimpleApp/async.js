import {fetchData, fetchDataFailure, fetchDataSuccess} from './actions'

import {getData} from './api'
import {parseData} from './data'
import store from './store'

function fetchDataIfNeeded(dispatch) {
  let state = store.getState();
  if (!state.lastDataUpdated && !state.isFetchingData) {
    dispatch(fetchData(true));
    dispatch(fetchDataFailure(''));
    getData()
      .then((rawData) => {
        const data = parseData(rawData);
        dispatch(fetchData(false));
        dispatch(fetchDataSuccess(data));
      }).catch((e) => {
      dispatch(fetchData(false));
      dispatch(fetchDataFailure(e.message));
    });
  }
}

export {fetchDataIfNeeded}