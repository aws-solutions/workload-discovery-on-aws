import React, { createContext, useContext, useReducer, useMemo } from "react"

const initialState = {
  notifications: []
}

export const NotificationContext = createContext({
  state: initialState
})

const ADD_NOTIFICATION = "ADD_NOTIFICATION"
const CLEAR_NOTIFICATION = "CLEAR_NOTIFICATION"
const CLEAR_ALL_NOTIFICATIONS = "CLEAR_ALL_NOTIFICATIONS"

const reducer = (state, action) => {
  switch (action.type) {
    case ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [...state.notifications, action.payload.notification]
      }
    case CLEAR_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.filter(
          (_, idx) => idx !== action.payload.index
        )
      }
    case CLEAR_ALL_NOTIFICATIONS:
      return {
        ...state,
        notifications: []
      }
    default:
      throw new Error(`Unknown action type: ${action.type}`)
  }
}

export const useNotificationDispatch = () => {
  const { dispatch } = useContext(NotificationContext)
  return {
    addNotification: (notification) => {
      dispatch({
        type: ADD_NOTIFICATION,
        payload: {
          notification
        }
      })
    },
    clearNotification: (index) =>
      dispatch({
        type: CLEAR_NOTIFICATION,
        payload: {
          index
        }
      }),
    clearAllNotifications: () =>
      dispatch({
        type: CLEAR_ALL_NOTIFICATIONS,
        payload: {}
      })
  }
}

export const NotificationProvider = (props) => {
  const [state, dispatch] = useReducer(reducer, initialState, (arg) => arg)
  const contextValue = useMemo(() => {
    return { state, dispatch }
  }, [state, dispatch])

  return (
    <NotificationContext.Provider value={contextValue}>
      {props.children}
    </NotificationContext.Provider>
  )
}

export const useNotificationContext = () => useContext(NotificationContext)
