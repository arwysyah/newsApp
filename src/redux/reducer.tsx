import {GET_DATA} from './stringType';

const initialState = {
  data: [],
};

const reducer = (state = initialState, action: {value: any; type: any}) => {
  switch (action.type) {
    case GET_DATA:
      return {...state, data: action.value};

    default:
      return state;
  }
};

export {reducer};
