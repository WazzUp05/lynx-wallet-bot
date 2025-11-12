'use client';

import Plus from '@/components/icons/plus-white.svg';
import React, { useState } from 'react';
import AddFileModal from '@/components/modals/AddFileModal';


const AddFileButton = () => {

    const [showModal, setShowModal] = useState(false);
    const handleClick = ( ) => {
        setShowModal(true);
    }

    return (
        <>
            <button className="w-[3rem] h-[3rem] rounded-[2rem] center glass self-end" onClick={handleClick}>
                <Plus />
            </button>
            <AddFileModal showModal={showModal} setShowModal={setShowModal}  />
        </>

    )
}

export default AddFileButton;