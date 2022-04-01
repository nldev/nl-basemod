import { Frame, Element, Component, ComponentOptions } from '../app'

export interface ButtonOptions extends ComponentOptions {
  text: string
  width: number
}

export const Button: Component<ButtonOptions> = options => {
  const f = Frame({ ...options })
  const button = CreateFrame('Button', options.name + '-inner', f.ref, 'UIPanelButtonTemplate')
  f.ref.SetSize(options.width, 30)
  button.SetSize(options.width, 30)
  button.SetParent(f.ref)
  button.SetText(options.text)
  button.SetPoint('CENTER')
  f.inner = button
  return f
}

