import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'

// Custom render function that includes providers if needed
export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return render(ui, { ...options })
}

// Re-export everything from testing library
export * from '@testing-library/react'
export { render }
