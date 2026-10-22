import { setupTestEnv } from './helpers/env.js'

setupTestEnv()

// Side-effect: register vi.mock() handlers before test files import createApp()
import './helpers/mocks.js'
