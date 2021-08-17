import {GET_DATA} from './stringType';
import {INews} from '../screen/utils/index';
export const SET_GET_DATA = (params: INews) => {
  return {
    type: GET_DATA,
    value: {...params},
  };
};
