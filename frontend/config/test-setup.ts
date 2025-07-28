import { cleanup } from '@testing-library/react'
import { expect, afterEach } from 'vitest'
import * as matchers from '@testing-library/jest-dom'

// extends matchers to include dom related testing stuff
expect.extend(matchers)

// remove anything from the dom after each test, so that we always start with a clean slate
afterEach(() => {
	cleanup()
})
