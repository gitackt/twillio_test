const twilio = require('twilio')
const express = require('express')
require('dotenv').config()

const client = new twilio(process.env.ACCOUNT_ID, process.env.AUTH_TOKEN)
const VoiceResponse = twilio.twiml.VoiceResponse
const app = express()

// Make a simple phone call
app.get('/make/:phone_number', (req, res) => {
  const twiml = `
    <Response>
        <Say language="ja-JP" voice="Polly.Takumi">
            <prosody rate="fast" volume="soft" pitch="x-low">
                おいコラ。金返せコラ。
                死にてぇなら生命保険に加入してからにしろ。
                クズが。返済がまだ終わってねえだろうが。
                お客様のお支払い頂く金額は遅延損害金を含めまして
                ¥102481となります。
            </prosody>
        </Say>
        <Say language="ja-JP" voice="Polly.Mizuki">
            <prosody rate="x-fast" volume="x-loud" pitch="high">
                え！すぐにそんな大金用意できません！
                もう少しだけ待ってくれませんか？？
            </prosody>
        </Say>
        <Gather action="${req.protocol + '://' + req.get('host') + '/gather'}">
            <Say language="ja-JP" voice="Polly.Takumi">
                <prosody rate="fast" volume="soft" pitch="x-low">
                    という方は1を。直ぐにお支払いが可能な方は2を押してください。
                </prosody>
            </Say>
        </Gather>
    </Response>
  `

  if (req.params.phone_number) {
    const params = {
      twiml,
      record: true,
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

app.post('/gather', (req, res) => {
  const routeOne = `
    <Response>
        <Say language="ja-JP" voice="Polly.Takumi">
            <prosody rate="fast" volume="soft" pitch="x-low">
                もしもし婆ちゃん？俺だけど、なんかやばいことに巻き込まれちゃってさー。
                いま直ぐ¥10くれない？
            </prosody>
        </Say>
    </Response>
  `

  const routeTwo = `
  <Response>
      <Say language="ja-JP" voice="Polly.Takumi">
          <prosody rate="fast" volume="soft" pitch="x-low">
              ここに振り込んでおいて！
          </prosody>
      </Say>
  </Response>
`

  const routeError = `
<Response>
    <Say language="ja-JP" voice="Polly.Takumi">
        <prosody rate="fast" volume="soft" pitch="x-low">
            エラーです。
        </prosody>
    </Say>
</Response>
`

  if (request.body.Digits) {
    switch (request.body.Digits) {
      case '1':
        res.status(200).header({ 'Content-Type': 'text/xml' }).send(routeOne.toString())
        break
      case '2':
        res.status(200).header({ 'Content-Type': 'text/xml' }).send(routeTwo.toString())
        break
      default:
        res.status(200).header({ 'Content-Type': 'text/xml' }).send(routeError.toString())
        break
    }
  } else {
    res.status(200).header({ 'Content-Type': 'text/xml' }).send(routeError.toString())
  }
})

const PORT = process.env.PORT || 8080
app.listen(PORT, console.log('listen on port ' + PORT))
