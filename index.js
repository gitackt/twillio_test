const twilio = require('twilio')
const express = require('express')
require('dotenv').config()

const client = new twilio(process.env.ACCOUNT_ID, process.env.AUTH_TOKEN)
const app = express()

const TWILLIO_URL = 'http://demo.twilio.com/docs/voice.xml'

// Simple phone call
app.get('/:phone_number', function (req, res) {
  if (req.params.phone_number) {
    const params = {
      url: TWILLIO_URL,
      to: req.params.phone_number,
      from: process.env.PHONE_NUMBER,
    }
    client.calls
      .create(params)
      .then((call) => res.send(call.sid))
      .catch((e) => res.status(500).send(e))
  } else {
    res.status(500).send('phone_number is not set.')
  }
})

app.listen(3000)
