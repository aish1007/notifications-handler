import React, { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import NotificationIcon from '../../assests/icons/bell.png';
import CloseIcon from '../../assests/icons/close.png';
import MoreIcon from '../../assests/icons/more.png';
import MparticleLogo from '../../assests/logo/mparticle.svg';
import Drawer from '../Drawer/Drawer';
import DetailedNotification from '../DetailedNotification/DetailedNotification';
import useApiCall from '../../hooks/api';
import { NotificationProps } from '../Notification/Notification';
import { NotificationContext } from '../../context/NotificationContext';

interface HeaderProps {
  newNotifications?: NotificationProps[];
}

export const Header = ({ newNotifications }: HeaderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const { getNotifications } = useApiCall();
  const [notifications, setAllNotifications] = useState<NotificationProps[]>([]);
  const { updatedNotifications, updateNotificationAsRead } = useContext(NotificationContext);
  const [unreadNotificationCount, setUnReadNotificationCount] = useState(0);

  useEffect(() => {
    //for fetching alreaady read notificaations
    const fetchAllNotifications = async () => {
      try {
        const notificationResults = await getNotifications();
        if (notificationResults && notificationResults.length > 0) {
          notificationResults.forEach((result) => {
            if (result.isRead == true) {
              setAllNotifications((existingNotifications) => [...existingNotifications, ...[result]]);
            }
          });
        }
      } catch (error) {}
    };
    fetchAllNotifications();
  }, []);

  useEffect(() => {
    if (newNotifications && newNotifications.length > 0) {
      setAllNotifications((existingNotifications) => [...newNotifications, ...existingNotifications]);
      setUnReadNotificationCount((prev) => prev + newNotifications.filter((item) => !item.isRead).length);
    }
  }, [newNotifications]);

  useEffect(() => {
    if (notifications && notifications?.length > 0) {
      let notificationReadStatus = [];
      if (notifications && notifications?.length > 0) {
        notificationReadStatus = notifications.filter((notification) => !notification.isRead);
      }
      const notificationCount = notificationReadStatus.length;
      setUnReadNotificationCount(notificationCount);
    }
  }, [notifications]);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const markAllAsRead = async () => {
    const notificationIds = notifications?.map((notification) => {
      return {
        recordId: notification.id
      };
    });
    await updateNotificationAsRead(notificationIds);
    setUnReadNotificationCount(0);
  };

  const clearAll = () => {
    setAllNotifications([]);
    toggleDropdown();
    setIsOpen(!isOpen);
  };

  const handleCloseDrawer = () => {
    setIsOpen(!isOpen);
    setIsDropdownOpen(false);
  };

  const redirectToMetricDetails = (id: number) => {
    toggleReadStatus(id, true);
    //handleCloseDrawer();
    navigate(`/metric/${id}`);
  };

  const toggleReadStatus = async (id: number, readStatus: boolean) => {
    await updateNotificationAsRead([{ recordId: id }]);
  };

  useEffect(() => {
    let notificationItems: NotificationProps[] = [];
    if (updatedNotifications && updatedNotifications.length > 0) {
      updatedNotifications.forEach((updatedNotification) => {
        const notificationElt = notifications.find((notiItem) => notiItem.id === updatedNotification.id);
        if (notificationElt && !notificationElt.isRead) {
          notificationElt.isRead = true;
          notificationItems.push(notificationElt);
        }
      });

      if (notificationItems.length > 0) {
        const result = Array.from(
          [...notifications, ...notificationItems].reduce((acc, item) => acc.set(item.id, item), new Map()).values()
        );

        setAllNotifications(result);
      }
    }
  }, [updatedNotifications]);

  return (
    <nav className='bg-header w-full z-50 h-16'>
      <div className='mx-auto px-2 sm:px-6 lg:px-8'>
        <div className='relative flex flex-col'>
          <div className='flex flex-1 justify-between'>
            <div className='flex flex-shrink-0 items-center cursor-pointer' onClick={() => navigate('/')}>
              <img src={MparticleLogo} alt='mparticle-logo' width={96} height={96} />
            </div>
            <div className='m-4'>
              <img
                src={NotificationIcon}
                alt='notification-icon'
                width={24}
                height={24}
                onClick={() => setIsOpen(!isOpen)}
              />
              <div className='absolute inline-flex items-center justify-center w-6 h-6 text-xs text-white bg-info border rounded-full top-1 end-2'>
                {unreadNotificationCount}
              </div>
            </div>
          </div>
          {isOpen && (
            <Drawer isOpen={isOpen} setIsOpen={handleCloseDrawer}>
              <div className='flex justify-between'>
                <h2 className='text-2xl font-bold m-4'>Notifications</h2>
                <div className='flex mt-1 mr-4'>
                  <button
                    type='button'
                    id='close-button'
                    aria-expanded='true'
                    aria-haspopup='true'
                    onClick={handleCloseDrawer}
                  >
                    <img src={CloseIcon} alt='close-icon' className='w-5 h-5 mr-3' />
                  </button>

                  {notifications && notifications.length > 0 && (
                    <div className='relative inline-block text-left'>
                      <div>
                        <button
                          type='button'
                          className='mt-5'
                          id='menu-button'
                          aria-expanded='true'
                          aria-haspopup='true'
                          onClick={() => {
                            toggleDropdown();
                          }}
                        >
                          <img src={MoreIcon} alt='more-icon' className='w-5 h-5 ml-2' />
                        </button>
                      </div>

                      {isDropdownOpen && (
                        <div
                          className='absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'
                          role='menu'
                          aria-orientation='vertical'
                          aria-labelledby='menu-button'
                        >
                          <div className='py-1' role='none'>
                            {unreadNotificationCount > 0 && (
                              <a
                                href='#'
                                className='hover:bg-gray-200 text-gray-700 block px-4 py-2 text-sm'
                                role='menuitem'
                                id='menu-item-0'
                                onClick={() => markAllAsRead()}
                              >
                                Mark all as read
                              </a>
                            )}
                            <a
                              href='#'
                              className='text-gray-700 block px-4 py-2 text-sm hover:bg-gray-200'
                              role='menuitem'
                              onClick={() => clearAll()}
                              id='menu-item-1'
                            >
                              Clear all
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {notifications &&
                notifications?.length > 0 &&
                notifications.map((notification, index) => (
                  <DetailedNotification
                    key={`${index}-${notification.title}`}
                    {...notification}
                    toggleReadStatus={toggleReadStatus}
                    handleNotificationClick={redirectToMetricDetails}
                  />
                ))}
              {notifications?.length === 0 && (
                <div className='flex justify-center flex-1 items-center'>
                  <div className='bg-white p-4 rounded-lg'>
                    <h2 className='text-xl text-normal'>You are all caught up!</h2>
                    <p className='text-gray-500 items-center ml-8'>Come back soon</p>
                  </div>
                </div>
              )}
            </Drawer>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;
