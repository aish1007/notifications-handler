import React from 'react';
import SuccessIcon from '../../assests/icons/correct.png';
import ErrorIcon from '../../assests/icons/error.png';
import InfoIcon from '../../assests/icons/info.png';
import WarningIcon from '../../assests/icons/warning.png';
import { NotificationProps } from '../Notification/Notification';

const DetailedNotification: React.FC<NotificationProps> = (props) => {
  const { title, description, timestamp, isRead, type, id } = props;
  const getIconAndColor = () => {
    switch (type) {
      case 'success':
        return { icon: SuccessIcon, color: 'success' };
      case 'warning':
        return { icon: WarningIcon, color: 'warning' };
      case 'info':
        return { icon: InfoIcon, color: 'info' };
      case 'error':
        return { icon: ErrorIcon, color: 'error' };
      default:
        return { icon: null, color: 'gray' };
    }
  };

  const toggleReadStatus = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, readStatus: boolean) => {
    props?.toggleReadStatus?.(id, readStatus);
    event.stopPropagation();
  };

  const handleNotification = () => {
    props?.handleNotificationClick?.(id);
  };

  const { icon, color } = getIconAndColor();

  return (
    <div
      className={`p-3 ${
        !isRead ? 'opacity-50' : ''
      } border-l-2 border-l-${color} border-b border-b-gray-300 text-justify`}
      onClick={handleNotification}
    >
      <div className='flex items-center mb-2'>
        <div className='flex flex-row justify-between mr-2 w-full'>
          <img src={icon} alt='icon' width={24} height={24} />
          {!isRead && (
            <button
              className='text-xs text-gray-500'
              onClick={(e) => {
                toggleReadStatus(e, true);
              }}
            >
              Mark as read
            </button>
          )}
        </div>
      </div>
      <h3 className='text-md font-bold'>{title}</h3>
      <p className='text-sm text-gray-500'>{description}</p>
      <div className='mt-2'>
        <p className='text-xs text-gray-500'>{timestamp}</p>
      </div>
    </div>
  );
};

export default DetailedNotification;
