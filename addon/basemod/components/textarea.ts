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
  OnUpdate?: (text: string) => void
  OnChange?: (text: string) => void
  OnCancel?: (text: string) => void
}

export const Textarea: Component<TextareaOptions> = options => {
  const a = Frame({ ...options })
  a.ref.SetPoint('TOPLEFT')
  a.ref.SetWidth(options.parent.inner.GetWidth())
  a.ref.SetHeight(options.parent.inner.GetHeight())
  const b = Frame({ name: `${options.name}-inner`, parent: a })
  b.ref.SetPoint('CENTER')
  b.ref.SetWidth(options.parent.inner.GetWidth() - 10)
  b.ref.SetHeight(options.parent.inner.GetHeight() - 10)
  const s = Scroll({ name: options.name, scrollHeight: 50, parent: b })
  s.ref.SetBackdrop(BASE_BACKDROP)
  const e = CreateFrame('EditBox', `${options.name}-inner`, s.inner)
  e.SetPoint('TOPLEFT')
  e.SetWidth(s.inner.GetWidth() - 10)
  e.SetHeight(s.inner.GetHeight())
  // level.SetBackdrop(BASE_BACKDROP)
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
    const text = e.GetText()
    if (options.OnChange)
      options.OnChange(text)
  })
  e.SetScript('OnTabPressed', () => {
    e.ClearFocus()
    const text = e.GetText()
    if (options.OnUpdate)
      options.OnUpdate(text)
  })
  e.SetScript('OnEnterPressed', () => {
    const text = e.GetText()
    if (options.OnUpdate)
      options.OnUpdate(text)
    e.ClearFocus()
  })
  e.SetScript('OnEscapePressed', () => {
    e.ClearFocus()
    const text = e.GetText()
    if (options.OnCancel)
      options.OnCancel(text)
  })
  e.Insert('test')
  e.SetPoint('TOPLEFT')
  // bb.SetMaxLetters(138)

  return s as any
}
