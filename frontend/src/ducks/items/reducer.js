import * as types from './types'

const INITIAL_STATE = {
  payload: [],
  isPending: true,
  isErrored: false,
  error: ''
}

const reducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.PENDING:
      return {
        ...state,
        isPending: true,
        isErrored: false,
        error: ''
      }
    case types.SUCCESSFUL:
      return { ...state, isPending: false, payload: action.payload }
    case types.REJECTED:
      return {
        ...state,
        isPending: false,
        isErrored: true,
        error: action.error
      }
    default:
      return state
  }
}

export default reducer
