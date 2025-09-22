import { useParams } from 'next/navigation';
import React, { useState } from 'react';

const SeatMap = () => {

    const { id, date } = useParams();
    // const [seats, setSeats] = useState([]);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [selectedTime, setSelectedTime] = useState(null);
    const [show , setShow] = useState(null);


    const navigate = useNavigate();

    return (
        <>
            
        </>
    );
};

export default SeatMap;