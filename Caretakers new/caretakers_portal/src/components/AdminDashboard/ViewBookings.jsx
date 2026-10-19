import React, { useEffect, useState } from 'react';

const ViewBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = () => {
    setLoading(true);
    fetch("/auth/view_bookings")
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched bookings:", data);
        setBookings(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching bookings:', err);
        setLoading(false);
      });
  };

  const handleCancel = (booking) => {
    console.log("Full booking object:", booking);
    
    // Extract all necessary information from the booking object
    const { booking_id, type, c_id } = booking;
    const hours_worked = booking.hours_worked || 0;
    
    console.log("Canceling with parameters:", { 
      booking_id, 
      type, 
      c_id, 
      hours_worked 
    });
    
    const confirmCancel = window.confirm('Are you sure you want to cancel this booking?');
    
    if (confirmCancel) {
      fetch(`/auth/cancel_booking`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          emp_type: type,
          bookingId: booking_id,
          c_id: c_id,
          hours_worked: hours_worked,
        }),
      })
      .then((response) => {
        if (!response.ok) {
          return response.json().then(err => Promise.reject(err));
        }
        return response.json();
      })
      .then((data) => {
        console.log("Cancellation response:", data);
        // Remove this booking from the local state
        setBookings(prevBookings => 
          prevBookings.filter(b => b.booking_id !== booking_id)
        );
        alert('Booking canceled successfully!');
        // Refetch to ensure data is fresh
        fetchBookings();
      })
      .catch((err) => {
        console.error('Error canceling booking:', err);
        alert(`Error canceling booking: ${err.message || 'Unknown error'}`);
      });
    }
  };

  if (loading) {
    return <div className="p-4 text-center">Loading bookings...</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Your Bookings</h2>
      
      
      {bookings.length === 0 ? (
        <p className="text-gray-500">No bookings found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {bookings.map((booking) => (
            <div key={booking.booking_id} className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
              <div className="flex justify-between items-center mb-3">
                <span className={`px-2 py-1 rounded text-sm ${
                  booking.type === 'Part-time' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                }`}>
                  {booking.type === 'Part-time' ? 'Part-time' : 'Full-time'}
                </span>
                <span className="text-gray-500 text-sm">
                  {new Date(booking.start_date).toLocaleDateString()}
                </span>
              </div>
              
              <div className="mb-3">
                <h3 className="font-medium">Caretaker</h3>
                <p>{booking.caretaker_name}</p>
              </div>
              
              <div className="mb-3">
                <h3 className="font-medium">Customer</h3>
                <p>{booking.customer_name}</p>
              </div>
             
  
                <p className='-translate-y-3 text-gray-500'>{booking.customer_phone_number}</p>
              
              
              <button
                onClick={() => handleCancel(booking)}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2 rounded transition-colors"
              >
                Cancel Booking
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewBookings;