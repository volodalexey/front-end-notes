const
  FETCH_DATA_REQUEST = 'FETCH_DATA_REQUEST',
  FETCH_DATA_FAILURE = 'FETCH_DATA_FAILURE',
  FETCH_DATA_SUCCESS = 'FETCH_DATA_SUCCESS';

function fetchData(fetch) {
  return {type: FETCH_DATA_REQUEST, fetch}
}

function fetchDataFailure(error) {
  return {type: FETCH_DATA_FAILURE, error}
}

function fetchDataSuccess(data) {
  return {type: FETCH_DATA_SUCCESS, data}
}

export {FETCH_DATA_REQUEST, FETCH_DATA_FAILURE, FETCH_DATA_SUCCESS,
  fetchData, fetchDataFailure, fetchDataSuccess}