# s16.ai 
[DEPRECATED] shitty proxy for ai api services like groq, openerouter and gemini (barebones for testing do not use it its highly recomended you use the official api services)

A third party tool for proxy sites that aims to be a potential alternative to direct api key usage providing clean json responses with almost 50 models and blazing speeds

## Features

* **Google Generative Models** gemini api keys supported
* **Groq** blazing fast inference
* **OpenRouter** almost 50 models available
* **No Data Saved** your privacy is key
* **Concise Clear Responses** easy to parse
* **Response Time Included** know your speed

## Usage

Third party api key service to extend the capacity of ai api keys

### Endpoints

`/generate`

### Parameters

* `prompt` your prompt
* `type` service provider type (`google` `groq` `openrouter`)
* `model` specific model name based on service
* `key` your api key for the provider you chose

### Example Requests

#### OpenRouter Model

`/generate?prompt=hello&type=openrouter&model=mistralai/mistral-7b-instruct&key=open router api key`

#### Google Model

`/generate?prompt=hello&type=google&model=gemini-2.5-flash-lite&key=google generative language models api key/gemini apikey (for gemini models)`

#### Groq Model

`/generate?prompt=prompt&type=groq&model=qwen/qwen3-32b&key=grok api key`

## Responses

Prompt: Whats the capital of france (used gemini 2.5 flash)

```json
{
  "status": "success",
  "response": "The capital of France is Paris.",
  "completionTime": "509ms"
}
