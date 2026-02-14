const twilio = require("twilio");


exports.handler = async (event) => {
  try {
    // --- Parse body safely ---
    let data = {};
    try {
      data = event.body ? JSON.parse(event.body) : {};
    } catch (e) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ok: false,
          error: "Invalid JSON body",
          bodySample: (event.body || "").slice(0, 200),
        }),
      };
    }

    // --- Env var checks (this catches the #1 issue immediately) ---
    const {
      TWILIO_ACCOUNT_SID,
      TWILIO_AUTH_TOKEN,
      TWILIO_PHONE_NUMBER,
    } = process.env;

    if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE_NUMBER) {
      return {
        statusCode: 500,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ok: false,
          error: "Missing Twilio env vars on Netlify",
          missing: {
            TWILIO_ACCOUNT_SID: !TWILIO_ACCOUNT_SID,
            TWILIO_AUTH_TOKEN: !TWILIO_AUTH_TOKEN,
            TWILIO_PHONE_NUMBER: !TWILIO_PHONE_NUMBER,
          },
        }),
      };
    }

    const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

    // Example: pull values from your form/body
    const to = process.env.TWILIO_TO_NUMBER;
    if (!to) {
  return {
    statusCode: 500,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ok: false, error: "Missing TWILIO_TO_NUMBER" }),
  };
}
    const message = data.message || "New inquiry received.";

    const result = await client.messages.create({
      from: TWILIO_PHONE_NUMBER,
      to,
      body: message,
    });

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ok: true, sid: result.sid }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ok: false,
        error: err?.message || String(err),
        name: err?.name,
        code: err?.code,
        moreInfo: err?.moreInfo,
      }),
    };
  }
};
