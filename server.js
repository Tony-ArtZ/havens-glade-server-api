import express from 'express'
import { Configuration, OpenAIApi } from 'openai'
import * as dotenv from 'dotenv'
import prompt from 'prompt.js'
dotenv.config()

const port = process.env.PORT || 3000
const app = express()
const maxMessageAmount = process.env.MESSAGE_MEMORY

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})

const openAi = new OpenAIApi(config)

let message = [
    {
      role: 'system',
      content: prompt
    }
]

app.use(express.json())
app.get('/', (req, res)=>{
  res.send("Invalid Method")
})

const addToMemory = (data) => {
  if(message.length >= maxMessageAmount){
    message = [message[0]]
  }
  message.push(data)
  console.log(message)
}
  

app.post('/', (req, res) => {

  addToMemory(
    {
      role: 'user',
      content: req.body.message
    }
  )

  openAi
    .createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: message,
    })
    .then((apiRes) => {
      console.log(apiRes.data)
      addToMemory(apiRes.data.choices[0].message)
        res.json(apiRes.data.choices[0].message)
    })
})

app.listen(port, ()=>{console.log(`listening on ${port}`)})
