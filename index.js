// i fucking hate you groq stop blocking my requests 
const express = require('express')
const fetch = require('node-fetch')
const http = require('http')

const app = express()
const port = 3000
// for docs of how to use this shi contact me on my discord:
//       _  __      _ _ _   
//   ___/ |/ /_  __| (_) |__ 
//  / __| | '_ \/ _` | | '_ \
//  \__ \ | (_) | (_| | | | | 
//  |___/_|\___/\__,_|_|_| |_|

// fixed cors 
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  next()
})
app.get('/generate', async (req, res) => {
  const { prompt, type, model, key } = req.query
// put your api lil vro
  if (!prompt || !key) {
    return res.status(400).json({
      status: 'error',
      message: 'missing prompt or key'
    })
  }

  let selectedModel = model
  let responseText = ''
  const startTime = Date.now()
 // propmpt handlers also if the users dont put a model it uses whatever model i chose lmao 
  try {
    if (type === 'openrouter') {
      const url = 'https://openrouter.ai/api/v1/chat/completions'
      if (!selectedModel) selectedModel = 'mistralai/mistral-7b-instruct'

      const requestBody = {
        model: selectedModel,
        messages: [{ role: 'user', content: prompt }]
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${key}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:3000',
          'X-Title': 'node ai api'
        },
        body: JSON.stringify(requestBody)
      })

      if (!response.ok) {
        const errorDetails = await response.text()
        throw new Error(`openrouter api error: ${response.statusText} - ${errorDetails}`)
      }

      const data = await response.json()
      responseText = data.choices[0].message.content

    } else if (type === 'groq') {
      const url = 'https://api.groq.com/openai/v1/chat/completions'
      if (!selectedModel) selectedModel = 'llama3-8b-8192'

      const requestBody = {
        model: selectedModel,
        messages: [{ role: 'user', content: prompt }]
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${key}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      })

      if (!response.ok) {
        const errorDetails = await response.text()
        throw new Error(`groq api error: ${response.statusText} - ${errorDetails}`)
      }

      const data = await response.json()
      responseText = data.choices[0].message.content

    } else if (type === 'google' || !type) {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${selectedModel || 'gemini-1.5-flash'}:generateContent?key=${key}`

      const requestBody = {
        contents: [{ parts: [{ text: prompt }] }]
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      })

      if (!response.ok) {
        const errorDetails = await response.text()
        throw new Error(`google api error: ${response.statusText} - ${errorDetails}`)
      }

      const data = await response.json()
      responseText = data.candidates[0].content.parts[0].text

    } else {
      return res.status(400).json({
        status: 'error',
        message: 'invalid, use google openrouter or groq'
      })
    }

    const completionTime = Date.now() - startTime

    res.json({
      status: 'success',
      response: responseText,
      completionTime: `${completionTime}ms`
    })

  } catch (error) {
    console.error('server error', error)
    res.status(500).json({
      status: 'error',
      message: `internal error: ${error.message}`
    })
  }
})

const server = http.createServer(app)

server.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`)
})

// graceful shutdown
process.on('SIGINT', () => {
  console.log('shutting down')
  server.close(() => {
    console.log('server closed')
    process.exit(0)
  })
})

process.on('SIGTERM', () => {
  console.log('got sigterm signal')
  server.close(() => {
    console.log('server shut down succesfull')
    process.exit(0)
  })
})
