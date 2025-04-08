import { X } from 'lucide-react';
import React from 'react';
const Modal = ({
  onClose,
  children,
}: {
  onClose: () => void;
  children: React.ReactNode;
}) => {
  return (
    <div className='fixed inset-0 bg-gray-50 bg-opacity-50 flex items-center justify-center '>
      <div className='bg-white p-8 rounded-lg min-w-lg m-auto min-h-1/3'>
        <div className='flex justify-end'>
          <button
            onClick={onClose}
            className='hover:bg-gray-100 p-2 rounded-full'
          >
            <X />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;
