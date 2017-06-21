import {FETCH_DATA_REQUEST, FETCH_DATA_FAILURE, FETCH_DATA_SUCCESS} from './actions'

const INITIAL_STATE = {
  lastDataUpdated: null,
  data: [],
  isFetchingData: false,
  fetchingDataError: '',
};

const reducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case FETCH_DATA_REQUEST:
      return Object.assign({}, state, {
        isFetchingData: action.fetch,
      });
      break;
    case FETCH_DATA_FAILURE:
      return Object.assign({}, state, {
        fetchingDataError: action.error
      });
      break;
    case FETCH_DATA_SUCCESS:
      return Object.assign({}, state, {
        data: action.data,
        lastDataUpdated: Date.now()
      });
      break;
    default:
      return state;
  }
};

export default reducer;