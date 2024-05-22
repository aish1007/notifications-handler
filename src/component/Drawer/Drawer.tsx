import React from 'react';
import CloseIcon from '../../assests/icons/close.png';

type DrawerProps = {
  children: React.ReactNode;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  width?: string;
  backgroundColor?: string;
};

const Drawer = ({ children, isOpen, setIsOpen, width, backgroundColor }: DrawerProps) => {
  return (
    <main
      className={
        'fixed overflow-hidden z-50  bg-opacity-25 inset-0 transform ease-in-out' +
        (isOpen ? ' transition-opacity opacity-100 duration-50 translate-x-0 ' : 'opacity-0 translate-x-full') +
        'bg-white'
      }
    >
      <section
        className={
          'absolute shadow-2xl delay-200 duration-200 ease-in-out transition-all transform rounded-2xl w-screen max-w-lg bg-white right-0 top-0 bottom-0' +
          (isOpen ? ' translate-x-0 ' : ' translate-x-full') +
          ' ' +
          ''
        }
      >
        <article className={'relative pb-10 flex flex-col overflow-y-scroll h-full  w-screen max-w-lg'}>
          {/* <div className='mx-4 mt-4'>
            <img
              src={CloseIcon}
              alt='close-icon'
              width={18}
              height={18}
              onClick={() => {
                setIsOpen(false);
              }}
            />
          </div> */}
          {children}
        </article>
      </section>
      <section
        className=' w-screen h-full cursor-pointer '
        onClick={() => {
          setIsOpen(false);
        }}
      ></section>
    </main>
  );
};

export default Drawer;
