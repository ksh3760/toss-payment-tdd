// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'

// Polyfill for Next.js Request/Response
import { TextEncoder, TextDecoder } from 'util'

Object.assign(global, {
  TextEncoder,
  TextDecoder,
  Request: class Request {},
  Response: class Response {},
  Headers: class Headers {},
})

// Mock Buffer if not available
if (typeof Buffer === 'undefined') {
  global.Buffer = require('buffer').Buffer
}
