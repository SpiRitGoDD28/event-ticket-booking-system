const QRCode = require("qrcode");

const generateTicket = async (booking) => {

    const ticketData = {
        bookingId: booking.bookingId,
        event: booking.event.name,
        location: booking.event.location,
        date: booking.event.date,
        time: booking.event.time,
        seats: booking.seats.map(seat => seat.seatNumber),
        totalAmount: booking.totalAmount
    };

    const qrCode = await QRCode.toDataURL(
        JSON.stringify(ticketData)
    );

    return {
        bookingId: booking.bookingId,
        event: booking.event.name,
        location: booking.event.location,
        date: booking.event.date,
        time: booking.event.time,
        seats: booking.seats.map(seat => seat.seatNumber),
        totalAmount: booking.totalAmount,
        qrCode: qrCode
    };
};

module.exports = generateTicket;