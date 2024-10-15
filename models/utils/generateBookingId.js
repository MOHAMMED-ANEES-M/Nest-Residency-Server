let bookingCounter = 1000; 

const generateBookingId = () => {
  bookingCounter += 1; 
  return `${(bookingCounter).toString().padStart(6, '0')}`; 
};

module.exports = generateBookingId;