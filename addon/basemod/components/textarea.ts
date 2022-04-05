import { Get } from '../app'
import { Component, ComponentOptions, Frame, Element } from '../app'
import { Dropdown, DropdownItemOptions } from './dropdown'
import { BASE_BACKDROP } from '../constants'
import { Movable } from '../utils'
import { Mapping } from '../types'
import { Talents } from '../talents'
import { Scroll } from './scroll'
import { Section } from './section'
import { Button } from './button'
import { Rgb } from '../types'
import { rgb } from '../utils'

export interface TextareaOptions extends ComponentOptions {
  initial?: string
  onUpdate?: (text: string) => void
  onChange?: (text: string) => void
  onCancel?: (text: string) => void
  // FIXME: min/max
}

export const Textarea: Component<TextareaOptions> = options => {
  let text = options.initial || ''
  const a = Frame({ ...options })
  a.ref.SetPoint('TOPLEFT')
  a.ref.SetWidth(options.parent.inner.GetWidth())
  a.ref.SetHeight(options.parent.inner.GetHeight())
  a.ref.SetBackdrop(BASE_BACKDROP)
  const b = Frame({ name: `${options.name}-inner`, parent: a })
  b.ref.SetPoint('CENTER')
  b.ref.SetWidth(options.parent.inner.GetWidth() - 20)
  b.ref.SetHeight(options.parent.inner.GetHeight() - 20)
  const s = Scroll({ name: `${options.name}-scroll`, scrollHeight: 50, parent: b })
  const e = CreateFrame('EditBox', `${options.name}-inner`, s.inner)
  e.SetPoint('TOPLEFT')
  e.SetWidth(s.inner.GetWidth() - 10)
  e.SetHeight(s.inner.GetHeight())
  e.SetFont('Fonts/FRIZQT__.TTF', 12)
  e.SetAutoFocus(false)
  e.SetMultiLine(true)
  e.ClearFocus()
  e.SetJustifyH('LEFT')
  s.ref.EnableMouse(true)
  s.ref.SetScript('OnMouseDown', () => {
    e.SetFocus()
  })
  e.SetScript('OnTextChanged', () => {
    s.fns.Height(e.GetHeight())
    text = e.GetText()
    if (options.onChange)
      options.onChange(text)
  })
  e.SetScript('OnTabPressed', () => {
    e.ClearFocus()
    text = e.GetText()
    if (options.onUpdate)
      options.onUpdate(text)
  })
  e.SetScript('OnEnterPressed', () => {
    text = e.GetText()
    if (options.onUpdate)
      options.onUpdate(text)
    e.ClearFocus()
  })
  e.SetScript('OnEscapePressed', () => {
    e.ClearFocus()
    if (options.onCancel)
      options.onCancel(text)
  })
  e.SetPoint('TOPLEFT')

  return s as any
}
