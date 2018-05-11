import * as actions from './actions'

import * as api from '../../utils/api'

export const getItems = () => {
  return dispatch => {
    dispatch(actions.setPending())
    api
      .getItems()
      .then(payload => {
        dispatch(actions.setSuccessful(payload))
      })
      .catch(error => dispatch(actions.setRejected(error.toString())))
  }
}
