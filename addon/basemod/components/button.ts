import { BASE_BACKDROP } from '../constants'
import { Frame, Element, Component, ComponentOptions } from '../app'
import { Rgb } from '../types'
import { rgb } from '../utils'

export interface ButtonOptions extends ComponentOptions {
  text: string
  width: number
  fontSize?: number
  isBordered?: boolean
  textOffset?: number
  color?: Rgb
  onClick?: (frame: Element<any, any>) => void
}

export const Button: Component<ButtonOptions> = options => {
  // setup
  const f = Frame({ ...options })
  const color = rgb(...(options.color || [108, 153, 187]))

  if (options.isBordered === false) {
    f.ref.SetBackdrop({ ...BASE_BACKDROP, bgFile: 'Interface/Tooltips/UI-Tooltip-Background', edgeFile: '' })
  } else {
    f.ref.SetBackdrop({ ...BASE_BACKDROP, bgFile: 'Interface/Tooltips/UI-Tooltip-Background' })
  }

  f.ref.SetBackdropColor(...color, 1)
  f.ref.SetSize(options.width, 30)
  f.ref.EnableMouse(true)

  // scripts
  f.ref.SetScript('OnLeave', (e, button) => {
    console.log('leave')
    e.SetBackdropColor(...color, 1)
  })

  f.ref.SetScript('OnEnter', (e, button) => {
    console.log('enter')
    e.SetBackdropColor(color[0] * 0.8, color[1] * 0.8, color[2] * 0.8, 1)
  })

  f.ref.SetScript('OnMouseDown', (e, button) => {
    e.SetBackdropColor(color[0] * 0.6, color[1] * 0.6, color[2] * 0.6, 1)
    if (options.onClick)
      options.onClick(f)
  })

  f.ref.SetScript('OnMouseUp', (e, button) => {
    e.SetBackdropColor(color[0] * 0.8, color[1] * 0.8, color[2] * 0.8, 1)
  })

  // text
  const t = f.ref.CreateFontString(
    `${options.name}-text`,
    'OVERLAY',
    'GameTooltipText',
  )

  t.SetParent(f.ref)
  t.SetPoint('CENTER', options.textOffset || 0, 0)
  t.SetText(options.text)
  t.SetFont('Fonts/FRIZQT__.TTF', options.fontSize || 10)

  return f
}

