const twilio = require('twilio')
const express = require('express')
require('dotenv').config()

const VoiceResponse = twilio.twiml.VoiceResponse
const client = new twilio(process.env.ACCOUNT_ID, process.env.AUTH_TOKEN)
const app = express()

const TWILLIO_URL = 'http://demo.twilio.com/docs/voice.xml'

// Make a simple phone call
app.get('/make/:phone_number', (req, res) => {
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

// Recieve a phone call
app.get('/recieve', (req, res) => {
  const twiml = new VoiceResponse()

  twiml.say('電話してくれてありがとう')

  res.status(200).header({ 'Content-Type': 'text/xml' }).send(twiml.toString())
})

const PORT = process.env.PORT || 8080
app.listen(PORT, console.log('listen on port ' + PORT))
