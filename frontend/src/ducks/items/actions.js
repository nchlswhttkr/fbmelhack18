import * as types from './types'

export const setPending = () => ({
  type: types.PENDING
})

export const setSuccessful = payload => ({
  type: types.SUCCESSFUL,
  payload
})

export const setRejected = error => ({
  type: types.REJECTED,
  error
})
