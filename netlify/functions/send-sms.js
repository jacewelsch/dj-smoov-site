exports.handler = async (event) => {
  console.log("send-sms invoked"); // <- should always appear

  try {
    console.log("method:", event.httpMethod);
    console.log("raw body:", event.body);

    // --- your existing code below here ---
    // parse body, call Twilio, etc.

  } catch (err) {
    console.error("send-sms error:", err);

    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ok: false,
        message: err?.message || String(err),
        name: err?.name,
      }),
    };
  }
};
const twilio = require("twilio");

exports.handler = async (event) => {
  try {
    const data = JSON.parse(event.body || "{}");

    const {
      name,
      email,
      client_phone,
      date,
      location,
      start_time,
      end_time,
      package: pkg,
      notes
    } = data;

    if (!name || !client_phone || !date || !location || !start_time || !end_time || !pkg) {
      return { statusCode: 400, body: "Missing required fields." };
    }

    const price = pkg.includes("700") ? "700" : pkg.includes("400") ? "400" : "—";

    const body =
`New DJ Smoov inquiry:
Name: ${name}
Phone: ${client_phone}
Email: ${email || "—"}
Date: ${date}
Location: ${location}
Time: ${start_time}–${end_time}
Package: ${pkg}
Price: $${price}
Notes: ${notes || "—"}`;

    const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

    await client.messages.create({
      body,
      from: process.env.TWILIO_FROM,
      to: process.env.DJ_PHONE
    });

    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  } catch (err) {
    return { statusCode: 500, body: "Server error sending SMS." };
  }
};