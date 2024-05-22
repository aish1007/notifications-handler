import React, { useEffect, useState, useContext } from 'react';
import './App.css';
import { useNavigate } from 'react-router-dom';
import Header from './component/Header/Header';
import Notification, { NotificationProps } from './component/Notification/Notification';
import useApiCall from './hooks/api';
import { NotificationContext } from './context/NotificationContext';

interface NotificationVisibility extends NotificationProps {
  shouldShow: Boolean;
}

function App() {
  let index = 0;
  const { getNotifications } = useApiCall();
  const [visibleNotifications, setVisibleNotifications] = useState<NotificationVisibility[]>([]);
  const [notificationQueue, setNotificationQueue] = useState<NotificationProps[]>([]);
  const [timeouts, setTimeOuts] = useState<any[]>([]);
  const { updatedNotifications, updateNotificationAsRead } = useContext(NotificationContext);
  const navigate = useNavigate();

  // polling the service periodically to check if there are new notifications
  useEffect(() => {
    const fetchNewNotifications = async (intervalId: any) => {
      try {
        const notificationResults = await getNotifications({ unread: true, index: index });
        index++;
        if (notificationResults?.length === 0) {
          clearInterval(intervalId);
          setNotificationQueue([]);
        } else {
          setNotificationQueue((prevNotifications) => [...prevNotifications, notificationResults[0]]);
        }
      } catch (error) {
        setNotificationQueue([]);
      }
    };

    const intervalId = setInterval(() => {
      fetchNewNotifications(intervalId);
    }, 2000);

    return () => {
      clearInterval(intervalId);
      timeouts?.forEach((timeeout) => clearTimeout(timeeout));
    };
  }, []);

  useEffect(() => {
    if (notificationQueue.length > 0) {
      const currentNotification: NotificationVisibility = { ...notificationQueue[0], shouldShow: true };

      // Show the notification
      setVisibleNotifications((prevNotifications) => {
        if (prevNotifications && prevNotifications.length > 0) {
          return [...prevNotifications, currentNotification];
        } else {
          return [currentNotification];
        }
      });

      // Remove the notification from the queue
      setNotificationQueue((prevQueue) => prevQueue.slice(1));

      // Hide the notification
      const hideTimeout = setTimeout(() => {
        setVisibleNotifications((prevNotifications) =>
          prevNotifications.map((notification) => {
            if (notification.id === notificationQueue[0]?.id) {
              notification.shouldShow = false;
            }
            return notification;
          })
        );
      }, 10000);
      setTimeOuts([...timeouts, hideTimeout]);
    }
  }, [notificationQueue]);

  useEffect(() => {
    let newVisibleNotifications: NotificationVisibility[] = [];
    if (updatedNotifications && updatedNotifications.length > 0) {
      updatedNotifications.forEach((notification) => {
        const matchingNotification = visibleNotifications.find(
          (visibleNotification) => visibleNotification.id === notification.id
        );
        if (matchingNotification && !matchingNotification.isRead) {
          matchingNotification.shouldShow = false;
          matchingNotification.isRead = true;

          newVisibleNotifications.push(matchingNotification);
        }
      });
      if (newVisibleNotifications.length > 0) {
        const result = Array.from(
          [...visibleNotifications, ...newVisibleNotifications]
            .reduce((acc, item) => acc.set(item.id, item), new Map())
            .values()
        );

        setVisibleNotifications(result);
      }
    }
  }, [updatedNotifications]);

  const markNotificationsAsRead = async (id: number, redirectTo?: boolean) => {
    await updateNotificationAsRead([{ recordId: id }]);
    if (redirectTo) {
      navigate(`/metric/${id}`);
    }
  };

  return (
    <div id='app' className='bg-body'>
      <Header newNotifications={notificationQueue} />
      <div>
        {visibleNotifications.map(
          (props) =>
            props.shouldShow && (
              <div>
                <Notification handleNotificationClick={markNotificationsAsRead} {...props} />
              </div>
            )
        )}
      </div>
    </div>
  );
}

export default App;
