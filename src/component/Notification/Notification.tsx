import React, { Fragment } from 'react';

import closeIcon from '../../assests/icons/close.png';
import SuccessIcon from '../../assests/icons/correct.png';
import ErrorIcon from '../../assests/icons/error.png';
import InfoIcon from '../../assests/icons/info.png';
import WarningIcon from '../../assests/icons/warning.png';

export interface NotificationProps {
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  description: string;
  isRead: boolean;
  isDismissed?: boolean;
  id: number;
  timestamp: string;
  toggleReadStatus?: (id: number, readStatus: boolean) => void;
  handleNotificationClick?: (id: number, redirectToMetric?: boolean) => void;
}

const Notification: React.FC<NotificationProps> = ({
  type,
  title,
  description,
  isRead,
  isDismissed = false,
  id,
  handleNotificationClick
}) => {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return SuccessIcon;
      case 'warning':
        return WarningIcon;
      case 'info':
        return InfoIcon;
      case 'error':
        return ErrorIcon;
      default:
        return null;
    }
  };

  const [isDismissedState, setIsDismissedState] = React.useState(isDismissed);
  let offset;

  if (id === 0) {
    offset = 0;
  } else {
    offset = id * 140;
  }

  const markAsRead = (
    id: number,
    redirectToMetric: boolean,
    event?: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    if (handleNotificationClick) {
      handleNotificationClick(id, redirectToMetric);
    }
    setIsDismissedState(true);
    if (event) {
      event.stopPropagation();
    }
  };

  const clearNotification = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    setIsDismissedState(true);
    event.stopPropagation();
  };

  return isDismissedState ? (
    <Fragment></Fragment>
  ) : (
    <div
      className='absolute right-12  w-96 z-99999 '
      style={{ top: `${offset}px` }}
      onClick={() => markAsRead(id, true)}
    >
      <div className={`flex flex-row  p-3 rounded-md border border-gray-300 ${isRead ? 'bg-gray-100' : 'bg-white'}`}>
        <div className='mx-4 my-2'>
          <img src={getIcon()} alt='icon' width={24} height={24} />
        </div>
        <div className='flex flex-col w-72'>
          <h3 className='text-base font-normal'>{title}</h3>
          <p className='text-xs text-gray-500'>{description}</p>
          <div className=' flex flex-row mt-4 text-sm'>
            <div className='mt-2 mr-2'>
              <button className='text-indigo-600 text-sm' onClick={(event) => markAsRead(id, false, event)}>
                Mark as Read
              </button>
            </div>

            <div className='mt-2 ml-2'>
              <button onClick={(event) => clearNotification(event)}>Dismiss</button>
            </div>
          </div>
        </div>

        <div className='m-2'>
          <img src={closeIcon} alt='icon' width={12} height={12} onClick={(event) => clearNotification(event)} />
        </div>
      </div>
    </div>
  );
};

export default Notification;
