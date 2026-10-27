const sendEmail = require("./sendEmail");


const sendTicketEmail = async (
    userEmail,
    userName,
    ticket
) => {

    const html = `

<!DOCTYPE html>

<html>

<head>

    <meta charset="UTF-8">

    <meta name="viewport"
        content="width=device-width, initial-scale=1.0">

    <title>EventBook Digital Ticket</title>

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

                <table width="100%" cellpadding="0"
                    cellspacing="0">

                    <tr>

                        <td>

                            <div style="
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
                            ">
                                EB
                            </div>

                            <span style="
                                margin-left:10px;
                                color:#f5f3ed;
                                font-size:20px;
                                font-weight:bold;
                                vertical-align:top;
                                line-height:42px;
                            ">
                                EventBook
                            </span>

                        </td>

                    </tr>

                </table>

            </div>


            <!-- SUCCESS MESSAGE -->

            <div style="
                padding:35px 30px 15px;
            ">

                <p style="
                    margin:0 0 8px;
                    color:#e2c766;
                    font-size:11px;
                    font-weight:bold;
                    letter-spacing:2px;
                ">
                    BOOKING CONFIRMED
                </p>


                <h1 style="
                    margin:0 0 12px;
                    color:#f5f3ed;
                    font-size:30px;
                ">
                    Your ticket is ready.
                </h1>


                <p style="
                    margin:0;
                    color:#aaa69d;
                    font-size:14px;
                    line-height:1.7;
                ">
                    Hi ${userName || "there"}, your booking has
                    been successfully confirmed. Keep this email
                    safe and present the QR code at the event
                    entrance.
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
                    ${ticket.event}
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
                            style="
                                padding:12px 5px;
                            ">

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
                                ${new Date(ticket.date).toLocaleDateString(
                                    "en-IN",
                                    {
                                        day: "numeric",
                                        month: "long",
                                        year: "numeric"
                                    }
                                )}
                            </div>

                        </td>


                        <td width="50%"
                            style="
                                padding:12px 5px;
                            ">

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
                                ${ticket.time}
                            </div>

                        </td>

                    </tr>


                    <tr>

                        <td width="50%"
                            style="
                                padding:12px 5px;
                            ">

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
                                ${ticket.location}
                            </div>

                        </td>


                        <td width="50%"
                            style="
                                padding:12px 5px;
                            ">

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
                                ${ticket.bookingId}
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
                                SEAT(S)
                            </div>


                            <div>

                                ${ticket.seats.map(seat => `

                                    <span style="
                                        display:inline-block;
                                        margin-right:7px;
                                        padding:8px 12px;
                                        background:#252930;
                                        border:1px solid #4a4530;
                                        border-radius:6px;
                                        color:#e2c766;
                                        font-size:13px;
                                        font-weight:bold;
                                    ">
                                        ${seat}
                                    </span>

                                `).join("")}

                            </div>

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
                                TOTAL
                            </div>

                            <div style="
                                color:#e2c766;
                                font-size:24px;
                                font-weight:bold;
                            ">
                                ₹${ticket.totalAmount}
                            </div>

                        </td>

                    </tr>

                </table>

            </div>


            <!-- QR -->

            <div style="
                padding:30px;
                text-align:center;
            ">

                <h3 style="
                    margin:0 0 8px;
                    color:#f5f3ed;
                    font-size:19px;
                ">
                    Scan to verify your ticket
                </h3>


                <p style="
                    margin:0 auto 20px;
                    max-width:400px;
                    color:#aaa69d;
                    font-size:13px;
                    line-height:1.6;
                ">
                    Present this QR code at the event entrance
                    for ticket verification.
                </p>


                <div style="
                    display:inline-block;
                    padding:12px;
                    background:#ffffff;
                    border-radius:10px;
                ">

                    <img
                        src="cid:eventbook-ticket-qr"
                        width="180"
                        height="180"
                        alt="EventBook QR Code"
                        style="
                            display:block;
                            width:180px;
                            height:180px;
                        "
                    >

                </div>

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
                    Keep this ticket safe for your event.
                </p>

            </div>


        </div>

    </div>

</body>

</html>

`;


    const text = `

EventBook - Booking Confirmed

Hi ${userName || "there"},

Your booking has been successfully confirmed.

EVENT
${ticket.event}

DATE
${new Date(ticket.date).toLocaleDateString(
    "en-IN",
    {
        day: "numeric",
        month: "long",
        year: "numeric"
    }
)}

TIME
${ticket.time}

LOCATION
${ticket.location}

BOOKING ID
${ticket.bookingId}

SEATS
${ticket.seats.join(", ")}

TOTAL
₹${ticket.totalAmount}

Please present the QR code attached to this email
at the event entrance.

Thank you for using EventBook.

`;


    const base64Data =
        ticket.qrCode.replace(
            /^data:image\/png;base64,/,
            ""
        );


    await sendEmail(
        userEmail,
        `EventBook Ticket - ${ticket.event}`,
        text,
        html,
        [
            {
                filename: "eventbook-ticket-qr.png",

                content: Buffer.from(
                    base64Data,
                    "base64"
                ),

                cid: "eventbook-ticket-qr"
            }
        ]
    );

};


module.exports = sendTicketEmail;