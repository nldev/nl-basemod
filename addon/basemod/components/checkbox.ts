import { Component, ComponentOptions, Frame, Element } from '../app'
import { BASE_BACKDROP } from '../constants'
export interface CheckButton extends WoWAPI.Frame {
  GetChecked: () => boolean
  SetChecked: (isChecked: boolean) => void
  SetText: (text: string) => void
}

export interface CheckboxOptions extends ComponentOptions {
  text: string
  onChange?: (isChecked: boolean, element: Element<any, any>) => void
  onCheck?: (element: Element<any, any>) => void
  onUncheck?: (element: Element<any, any>) => void
  // FIXME: min/max
}

export const Checkbox: Component<CheckboxOptions> = options => {
  const f = Frame({ ...options }) as Element<any, any>

  const check = CreateFrame('CheckButton' as any, `${options.name}-checkbutton`, f.ref, 'ChatConfigCheckButtonTemplate') as CheckButton
  check.SetPoint('TOPLEFT')
  check.SetChecked(true)
  check.SetText('hello world')
  const t = check.CreateFontString(`${options.name}-checkbutton-text`, 'OVERLAY', 'GameTooltipText')
  t.SetFont('Fonts/FRIZQT__.TTF', 12)
  t.SetText('Hello World')
  t.SetParent(check)
  t.SetPoint('LEFT', check, 'RIGHT', 1, 0)

  check.SetScript('OnClick', () => {
    console.log('hello world')
  })

  return f
}

