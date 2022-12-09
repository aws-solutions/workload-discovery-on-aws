// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {
  useNotificationContext,
  useNotificationDispatch
} from "../components/Contexts/NotificationContext"
import { Alert } from "@awsui/components-react"
import React, { useEffect } from "react"

export const Notifications = ({ maxNotifications = 3 }) => {
  const {
    state: { notifications }
  } = useNotificationContext()
  const { clearNotification } = useNotificationDispatch()

  useEffect(() => {
    const toRemove = [
      ...Array(Math.max(0, notifications.length - maxNotifications)).keys()
    ]
    toRemove.forEach((_, idx) => clearNotification(idx))
  }, [notifications, maxNotifications, clearNotification])

  return (
    <>
      {notifications.map((notification, idx) => (
        <Alert
          key={idx}
          dismissible={true}
          type={notification.type}
          header={notification.header}
          onDismiss={() => clearNotification(idx)}
        >
          {notification.content}
        </Alert>
      ))}
    </>
  )
}

export default Notifications
