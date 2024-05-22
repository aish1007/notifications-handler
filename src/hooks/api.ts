import { useState } from 'react';
import request from '../request/request';
import { NotificationProps } from '../component/Notification/Notification';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { Notifications } from '../context/NotificationContext';
export type APIOptions = {
  url: string;
  method: string;
  data?: any;
  headers: object;
};

export const ORG_ID = 1;

export type recordId = {
  recordId: number;
};

const unreadNotifications = (): NotificationProps[] => {
  return [
    {
      title: 'System Maintenance',
      description: 'The system will be down for maintenance on May 15th from 2 AM to 4 AM.',
      timestamp: '2023-05-10',
      isRead: false,
      type: 'warning',
      id: 1
    },
    {
      title: 'New Feature Release',
      description: 'A new feature has been released. Use our slack channel if you have more questions.',
      timestamp: '2023-05-01',
      isRead: false,
      type: 'info',
      id: 2
    },
    {
      title: 'Security Update',
      description: 'A critical security update has been applied. Please restart your application.',
      timestamp: '2023-04-28',
      isRead: false,
      type: 'error',
      id: 3
    },
    {
      title: 'Account Details Updated',
      description: 'Your account changes are saved.',
      timestamp: '2024-05-18',
      isRead: false,
      type: 'success',
      id: 4
    }
  ];
};

const allNotifications = (): NotificationProps[] => {
  const notificationsArray: NotificationProps[] = [
    {
      title: 'System Maintenance',
      description: 'The system will be down for maintenance on May 15th from 2 AM to 4 AM.',
      timestamp: '2023-05-10',
      isRead: false,
      type: 'warning',
      id: 1
    },
    {
      title: 'New Feature Release',
      description: 'A new feature has been released. Use our slack channel if you have more questions.',
      timestamp: '2023-05-01',
      isRead: false,
      type: 'info',
      id: 2
    },
    {
      title: 'Security Update',
      description: 'A critical security update has been applied. Please restart your application.',
      timestamp: '2023-04-28',
      isRead: false,
      type: 'error',
      id: 3
    },
    {
      title: 'Account Details Updated',
      description: 'Your account changes are saved.',
      timestamp: '2024-05-18',
      isRead: false,
      type: 'success',
      id: 4
    },
    {
      title: 'Low Disk Space',
      description: 'Your disk space is running low. Please free up some space.',
      timestamp: '2024-05-18',
      isRead: true,
      type: 'warning',
      id: 5
    },
    {
      title: 'Database Connection Failed',
      description: 'Failed to establish connection to the database server.',
      timestamp: '2024-05-18',
      isRead: true,
      type: 'error',
      id: 6
    },
    {
      title: 'New Version Available',
      description: 'A new version of the application is now available. Click here to download.',
      timestamp: '2024-05-18',
      isRead: true,
      type: 'info',
      id: 7
    }
  ];

  return notificationsArray;
};

export default function useApiCall(initialLoading = false) {
  const getNotifications = async (params?: any): Promise<NotificationProps[]> => {
    const { unread, index } = params ?? {};
    let url = `http://localhost:3000/api/anomaly-service/${ORG_ID}`; // TODO: orgId should  come  from env variable
    if (unread) {
      url = `${url}/unread`;
    }
    const options: APIOptions = {
      method: 'GET',
      url,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    try {
      const response: AxiosResponse | AxiosError = await request(options);

      // Since backend does not exist
      if (response.request.status > 400) {
        if (unread && index) {
          const results = unreadNotifications();

          //Return a single notification
          if (results.length > index) {
            return [results[index]];
          }
          return [];
        } else if (unread) {
          const results = unreadNotifications();
          return results;
        }
        const notifications = allNotifications();
        return notifications;
      }

      const { notifications = [] } = response?.data;
      return notifications;
    } catch (error: any) {
      console.log(error);
    }
    return [];
  };

  const markNotificationsAsRead = async (recordIds?: recordId[]): Promise<NotificationProps[]> => {
    let url = `http://localhost:3000/api/anomaly-service/${ORG_ID}/mark-read`; // TODO: orgId should  come  from env variable
    if (recordIds) {
      url = `${url}?messageId=${recordIds}`;
    }
    const options: APIOptions = {
      method: 'POST',
      url: url,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    try {
      const response = await request(options);

      //since backend does not exist
      if (axios.isAxiosError(response)) {
        const notificationsArr = allNotifications();

        let updatedNotifications = recordIds?.map((record) => {
          const notification = notificationsArr.find((notification) => notification.id === record.recordId);
          if (notification) {
            notification.isRead = true;
            return notification;
          }
        });
        if (updatedNotifications && updatedNotifications?.length > 0) {
          return updatedNotifications as NotificationProps[];
        }
        return notificationsArr;
      }
      return [];
    } catch (error: any) {
      console.log('error', error);
      return [];
    }
  };

  return { getNotifications, markNotificationsAsRead };
}
