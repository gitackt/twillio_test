const twilio = require('twilio')
const express = require('express')
const bodyParser = require('body-parser')
require('dotenv').config()

const client = new twilio(process.env.ACCOUNT_ID, process.env.AUTH_TOKEN)
const app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

const calcFullUrl = (req) => {
  const host = req.get('host')
  const isLocal = host.includes('localhost')
  return isLocal ? 'http://' + host : 'https://' + host
}

const twiML = (content) => `<Response>${content}</Response>`
const gatherTemplate = (content, path) => `<Gather action="${path}">${content}</Gather>`

const manSpeakingTemplate = (content) => {
  return `
        <Say language="ja-JP" voice="Polly.Takumi">
            <prosody rate="fast" volume="soft" pitch="x-low">
                ${content}
            </prosody>
        </Say>
    `
}

const womanSpeakingTemplate = (content) => {
  return `
        <Say language="ja-JP" voice="Polly.Mizuki">
            <prosody rate="x-fast" volume="x-loud" pitch="high">
                ${content}
            </prosody>
        </Say>
    `
}

// Make a simple phone call
app.get('/make/:phone_number', (req, res) => {
  const line1 = 'おいコラ。金返せコラ。クズが。'
  const line2 = 'え！すぐにそんな大金用意できません！もう少しだけ待ってくれませんか？？'
  const line3 = 'という方は1を。直ぐにお支払いが可能な方は2を押してください。'
  const line4 = 'なんか言え。'

  const twiml = twiML(
    manSpeakingTemplate(line1) +
      womanSpeakingTemplate(line2) +
      gatherTemplate(manSpeakingTemplate(line3), calcFullUrl(req) + '/gather') +
      manSpeakingTemplate(line4)
  )

  if (req.params.phone_number) {
    const params = {
      twiml,
      record: true,
      to: req.params.phone_number,
      from: process.env.PHONE_NUMBER,
      statusCallbackMethod: 'POST',
      statusCallback: calcFullUrl(req) + 'statusCallback',
      statusCallbackEvent: ['initiated', 'answered', 'completed'],
      recordingStatusCallback: calcFullUrl(req) + 'recordingCallback',
    }
    client.calls
      .create(params)
      .then((call) => res.send(call.sid))
      .catch((e) => res.status(500).send(e))
  } else {
    res.status(500).send('phone_number is not set.')
  }
})

app.post('/statusCallback', (req, res) => {
  console.log('statusCallback')
  console.log(req.body)
  res.status(200)
})

app.post('/recordingCallback', (req, res) => {
  console.log('recordingCallback')
  console.log(req.body)
  res.status(200)
})

app.post('/gather', (req, res) => {
  const route1 = 'もしもし婆ちゃん？俺だけど、なんかやばいことに巻き込まれちゃってさー。いま直ぐ¥10くれない？'
  const route2 = 'ここに振り込んでおいて！'
  const routeE = 'エラーです。'

  const param = req.body.Digits

  if (param) {
    switch (param) {
      case '1':
        res.send(twiML(manSpeakingTemplate(route1)))
        break
      case '2':
        res.send(twiML(manSpeakingTemplate(route2)))
        break
      default:
        res.send(twiML(manSpeakingTemplate(routeE)))
        break
    }
  } else {
    res.send(twiML(manSpeakingTemplate(routeE)))
  }
})

const PORT = process.env.PORT || 8080
app.listen(PORT, console.log('listen on port ' + PORT))
