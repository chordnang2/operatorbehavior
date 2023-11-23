import {HANDSON_EXCEL} from './action'

const initialState = {
  dateHandson: '',
  totalDataHanson: 0,
  totalHm: '',
  totalKm: '',
}

export const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case HANDSON_EXCEL:
      console.log(action.payload)
      return {
        ...initialState,
        dateHandson: action.payload.dateHandson,
        totalDataHanson: action.payload.totalDataHanson,
      }
    // case SUB_HANDSON_EXCEL:
    //   console.log(action.payload,'subhandson')
    //   return {
    //     ...initialState,
    //     totalDataHanson: action.payload.totalDataHanson,
    //   }

    default:
      return initialState
  }
}
