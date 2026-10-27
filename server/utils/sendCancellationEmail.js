const sendEmail = require("./sendEmail");


const sendCancellationEmail = async (
    userEmail,
    userName,
    booking
) => {

    const event = booking.event;

    const seats = booking.seats || [];


    const formattedDate = event?.date
        ? new Date(event.date).toLocaleDateString(
            "en-IN",
            {
                day: "numeric",
                month: "long",
                year: "numeric"
            }
        )
        : "—";


    const seatNumbers = seats.map(
        (seat) => seat.seatNumber
    );


    // =====================================================
    // HTML EMAIL
    // =====================================================

    const html = `

<!DOCTYPE html>

<html>

<head>

    <meta charset="UTF-8">

    <meta name="viewport"
        content="width=device-width, initial-scale=1.0">

    <title>EventBook Booking Cancelled</title>

</head>


<body style="
    margin:0;
    padding:0;
    background:#15171c;
    font-family:Arial, Helvetica, sans-serif;
">

    <div style="
        width:100%;
        padding:40px 15px;
        box-sizing:border-box;
    ">

        <div style="
            max-width:650px;
            margin:0 auto;
            background:#1d2026;
            border:1px solid #30343c;
            border-radius:14px;
            overflow:hidden;
        ">


            <!-- HEADER -->

            <div style="
                padding:28px 30px;
                background:#15171c;
                border-bottom:1px solid #30343c;
            ">

                <div style="
                    color:#f5f3ed;
                    font-size:20px;
                    font-weight:bold;
                ">

                    <span style="
                        display:inline-block;
                        width:42px;
                        height:42px;
                        line-height:42px;
                        text-align:center;
                        background:#c9a227;
                        color:#15171c;
                        border-radius:7px;
                        font-size:15px;
                        font-weight:bold;
                        vertical-align:middle;
                    ">
                        EB
                    </span>

                    <span style="
                        margin-left:10px;
                        vertical-align:middle;
                    ">
                        EventBook
                    </span>

                </div>

            </div>


            <!-- MESSAGE -->

            <div style="
                padding:35px 30px 20px;
            ">

                <p style="
                    margin:0 0 8px;
                    color:#e6a3a3;
                    font-size:11px;
                    font-weight:bold;
                    letter-spacing:2px;
                ">
                    BOOKING CANCELLED
                </p>


                <h1 style="
                    margin:0 0 12px;
                    color:#f5f3ed;
                    font-size:30px;
                ">
                    Your booking has been cancelled.
                </h1>


                <p style="
                    margin:0;
                    color:#aaa69d;
                    font-size:14px;
                    line-height:1.7;
                ">
                    Hi ${userName || "there"}, your EventBook
                    booking has been successfully cancelled.
                    The reserved seats have been released.
                </p>

            </div>


            <!-- EVENT -->

            <div style="
                margin:20px 30px;
                padding:25px;
                background:#252930;
                border:1px solid #30343c;
                border-radius:10px;
            ">

                <p style="
                    margin:0 0 8px;
                    color:#e2c766;
                    font-size:10px;
                    font-weight:bold;
                    letter-spacing:2px;
                ">
                    EVENT
                </p>


                <h2 style="
                    margin:0;
                    color:#f5f3ed;
                    font-size:24px;
                ">
                    ${event?.name || "Event"}
                </h2>

            </div>


            <!-- DETAILS -->

            <div style="
                padding:5px 30px 25px;
            ">

                <table width="100%"
                    cellpadding="0"
                    cellspacing="0">

                    <tr>

                        <td width="50%"
                            style="padding:12px 5px;">

                            <div style="
                                color:#aaa69d;
                                font-size:10px;
                                font-weight:bold;
                                letter-spacing:1px;
                                margin-bottom:6px;
                            ">
                                BOOKING ID
                            </div>

                            <div style="
                                color:#f5f3ed;
                                font-size:14px;
                                font-weight:bold;
                            ">
                                ${booking.bookingId}
                            </div>

                        </td>


                        <td width="50%"
                            style="padding:12px 5px;">

                            <div style="
                                color:#aaa69d;
                                font-size:10px;
                                font-weight:bold;
                                letter-spacing:1px;
                                margin-bottom:6px;
                            ">
                                DATE
                            </div>

                            <div style="
                                color:#f5f3ed;
                                font-size:14px;
                                font-weight:bold;
                            ">
                                ${formattedDate}
                            </div>

                        </td>

                    </tr>


                    <tr>

                        <td width="50%"
                            style="padding:12px 5px;">

                            <div style="
                                color:#aaa69d;
                                font-size:10px;
                                font-weight:bold;
                                letter-spacing:1px;
                                margin-bottom:6px;
                            ">
                                TIME
                            </div>

                            <div style="
                                color:#f5f3ed;
                                font-size:14px;
                                font-weight:bold;
                            ">
                                ${event?.time || "—"}
                            </div>

                        </td>


                        <td width="50%"
                            style="padding:12px 5px;">

                            <div style="
                                color:#aaa69d;
                                font-size:10px;
                                font-weight:bold;
                                letter-spacing:1px;
                                margin-bottom:6px;
                            ">
                                LOCATION
                            </div>

                            <div style="
                                color:#f5f3ed;
                                font-size:14px;
                                font-weight:bold;
                            ">
                                ${event?.location || "—"}
                            </div>

                        </td>

                    </tr>

                </table>

            </div>


            <!-- SEATS + AMOUNT -->

            <div style="
                margin:0 30px;
                padding:20px 0;
                border-top:1px solid #30343c;
                border-bottom:1px solid #30343c;
            ">

                <table width="100%"
                    cellpadding="0"
                    cellspacing="0">

                    <tr>

                        <td>

                            <div style="
                                color:#aaa69d;
                                font-size:10px;
                                font-weight:bold;
                                letter-spacing:1px;
                                margin-bottom:10px;
                            ">
                                CANCELLED SEAT(S)
                            </div>


                            ${seatNumbers.map(seat => `

                                <span style="
                                    display:inline-block;
                                    margin-right:7px;
                                    padding:8px 12px;
                                    background:#252930;
                                    border:1px solid #5a3f3f;
                                    border-radius:6px;
                                    color:#e6a3a3;
                                    font-size:13px;
                                    font-weight:bold;
                                ">
                                    ${seat}
                                </span>

                            `).join("")}

                        </td>


                        <td align="right"
                            valign="bottom">

                            <div style="
                                color:#aaa69d;
                                font-size:10px;
                                font-weight:bold;
                                letter-spacing:1px;
                                margin-bottom:5px;
                            ">
                                BOOKING AMOUNT
                            </div>

                            <div style="
                                color:#e2c766;
                                font-size:24px;
                                font-weight:bold;
                            ">
                                ₹${booking.totalAmount}
                            </div>

                        </td>

                    </tr>

                </table>

            </div>


            <!-- STATUS -->

            <div style="
                padding:30px;
                text-align:center;
            ">

                <div style="
                    display:inline-block;
                    padding:10px 18px;
                    background:#3a2525;
                    border:1px solid #694545;
                    border-radius:20px;
                    color:#e6a3a3;
                    font-size:11px;
                    font-weight:bold;
                    letter-spacing:1.5px;
                ">
                    BOOKING CANCELLED
                </div>


                <p style="
                    max-width:430px;
                    margin:18px auto 0;
                    color:#aaa69d;
                    font-size:13px;
                    line-height:1.7;
                ">
                    Your seats are now available for other
                    users to book.
                </p>

            </div>


            <!-- FOOTER -->

            <div style="
                padding:20px 30px;
                background:#15171c;
                border-top:1px solid #30343c;
                text-align:center;
            ">

                <p style="
                    margin:0;
                    color:#e2c766;
                    font-size:12px;
                    font-weight:bold;
                ">
                    EventBook
                </p>


                <p style="
                    margin:6px 0 0;
                    color:#77736c;
                    font-size:11px;
                ">
                    Thank you for using EventBook.
                </p>

            </div>


        </div>

    </div>

</body>

</html>

`;


    // =====================================================
    // PLAIN TEXT VERSION
    // =====================================================

    const text = `

EventBook - Booking Cancelled

Hi ${userName || "there"},

Your booking has been successfully cancelled.

EVENT
${event?.name || "Event"}

BOOKING ID
${booking.bookingId}

DATE
${formattedDate}

TIME
${event?.time || "—"}

LOCATION
${event?.location || "—"}

SEATS
${seatNumbers.join(", ")}

BOOKING AMOUNT
₹${booking.totalAmount}

Your reserved seats have been released.

Thank you for using EventBook.

`;


    await sendEmail(

        userEmail,

        `EventBook Booking Cancelled - ${booking.bookingId}`,

        text,

        html

    );

};


module.exports = sendCancellationEmail;