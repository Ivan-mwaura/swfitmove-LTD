require('dotenv').config(); // Import dotenv to use environment variables
const axios = require('axios');
const twilio = require('twilio');

// Safaricom API credentials from .env file
const consumerKey = process.env.CONSUMER_KEY;
const consumerSecret = process.env.CONSUMER_SECRET;

// Twilio credentials from .env file
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const client = new twilio(accountSid, authToken);
let accessToken = '';
let accessTokenExpiry = 0;

// Fetch the access token for M-Pesa
const getAccessToken = async () => {
  const url = 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials';
  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Basic ${auth}`,
      },
    });

    accessToken = response.data.access_token;
    accessTokenExpiry = Date.now() + response.data.expires_in * 1000;
    console.log('Access token refreshed:', accessToken);
  } catch (error) {
    console.error('Error fetching access token:', error);
  }
};

// Check if the token is expired
const isTokenExpired = () => Date.now() >= accessTokenExpiry;

// Function to refresh the token if needed
const refreshTokenIfNeeded = async () => {
  if (isTokenExpired()) {
    console.log('Access token expired. Regenerating...');
    await getAccessToken();
  }
};

// Function to initiate the M-Pesa STK Push
const initiateSTKPush = async (phone, amount) => {
  await refreshTokenIfNeeded(); // Refresh token if expired

  const url = 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest';
  const shortcode = process.env.SAFARICOM_SHORTCODE;
  const passkey = process.env.SAFARICOM_PASSKEY;
  const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14);
  const password = Buffer.from(shortcode + passkey + timestamp).toString('base64');

  const payload = {
    BusinessShortCode: shortcode,
    Password: password,
    Timestamp: timestamp,
    TransactionType: 'CustomerPayBillOnline',
    Amount: amount,
    PartyA: phone,
    PartyB: shortcode,
    PhoneNumber: phone,
    CallBackURL: process.env.CALLBACK_URL,
    AccountReference: 'SWIFTMOVE LTD',
    TransactionDesc: 'Payment for pet products',
  };

  try {
    const response = await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error initiating STK Push:', error);
    throw error;
  }
};

// Controller to handle payment requests
const handlePaymentRequest = async (req, res) => {
  const { phone, amount } = req.body;

  if (!phone || !amount) {
    return res.status(400).json({ error: 'Phone number and amount are required' });
  }

  try {
    const response = await initiateSTKPush(phone, amount);
    console.log('Payment initiated successfully:', response);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: 'Failed to initiate payment' });
  }
};

// Controller to handle M-Pesa callback
const handleCallback = (req, res) => {
  console.log('Callback received:', req.body);
  res.status(200).send('Callback received');
};

// Twilio SMS Function
const sendSms = async (req, res) => {
  try {
    const phone = req.body.phone;
    const message = await client.messages.create({
      body: 'Hello from Twilio!',
      from: process.env.TWILIO_PHONE_NUMBER, // Twilio phone number
      to: phone, // Recipient's phone number
    });
    console.log('Message sent successfully:', message.sid);
    res.status(200).send('SMS sent successfully');
  } catch (error) {
    console.error('Error sending SMS:', error);
    res.status(500).send('Error sending SMS');
  }
};

module.exports = {
  handlePaymentRequest,
  handleCallback,
  sendSms,
};
