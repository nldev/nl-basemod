import { BASE_BACKDROP } from '../constants'
import { Frame, Element, Component, ComponentOptions } from '../app'
import { Rgb } from '../types'
import { rgb } from '../utils'

export interface ButtonOptions extends ComponentOptions {
  text: string
  width: number
  color?: Rgb
  onClick?: (frame: Element<any, any>) => void
}

export const Button: Component<ButtonOptions> = options => {
  const f = Frame({ ...options })
  const color = options.color || [0, 0, 0]

  f.ref.SetBackdrop(BASE_BACKDROP)
  f.ref.SetBackdropColor(...rgb(...color), 1)
  f.ref.SetSize(options.width, 30)

  f.ref.SetScript('OnLeave', (_, button) => {
    f.ref.SetBackdropColor(...rgb(...color), 1)
  })

  f.ref.SetScript('OnEnter', (_, button) => {
    f.ref.SetBackdropColor(...rgb(color[0] * 0.8, color[1] * 0.8, color[2] * 0.8), 1)
  })

  f.ref.SetScript('OnMouseDown', (_, button) => {
    f.ref.SetBackdropColor(...rgb(color[0] * 0.6, color[1] * 0.6, color[2] * 0.6), 1)
    if (options.onClick)
      options.onClick(f)
  })

  f.ref.SetScript('OnMouseUp', (_, button) => {
    f.ref.SetBackdropColor(...rgb(color[0] * 0.8, color[1] * 0.8, color[2] * 0.8), 1)
  })

  const button = CreateFrame('Button', options.name + '-inner', f.ref)

  button.SetSize(options.width, 30)
  button.SetParent(f.ref)
  button.SetText(options.text)
  button.SetPoint('CENTER')

  f.inner = button

  return f
}

