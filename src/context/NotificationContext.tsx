import React, { createContext, useState, ReactNode, useContext, useEffect } from 'react';
import { NotificationProps } from '../component/Notification/Notification';
import useApiCall, { recordId } from '../hooks/api';

interface NotificationContextType {
  updatedNotifications?: NotificationProps[];
  updateNotificationAsRead: (recordIds: recordId[]) => void;
}

export type Notifications = {
  unreadNotifications: NotificationProps[];
  allNotifications: NotificationProps[];
};

const NotificationContext = createContext<NotificationContextType>({ updateNotificationAsRead: () => {} });

interface NotificationProviderProps {
  children: ReactNode;
}

const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [updatedNotifications, setUpdatedNotifications] = useState<NotificationProps[]>();
  const { markNotificationsAsRead } = useApiCall();

  const updateNotificationAsRead = async (recordIds: recordId[]) => {
    const response = await markNotificationsAsRead(recordIds);
    setUpdatedNotifications(response);
  };

  return (
    <NotificationContext.Provider value={{ updatedNotifications, updateNotificationAsRead }}>
      {children}
    </NotificationContext.Provider>
  );
};

export { NotificationContext, NotificationProvider };
