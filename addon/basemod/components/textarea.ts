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
  const s = Scroll({ name: `${options.name}-scroll`, height: a.inner.GetHeight() - 10, scrollHeight: 50, parent: a })
  const b = CreateFrame('EditBox', `${options.name}-inner`, s.inner)
  b.SetPoint('TOPLEFT')
  b.SetWidth(s.inner.GetWidth() - 10)
  b.SetHeight(s.inner.GetHeight())
  // level.SetBackdrop(BASE_BACKDROP)
  b.SetFont('Fonts/FRIZQT__.TTF', 12)
  b.SetAutoFocus(false)
  b.SetMultiLine(true)
  b.ClearFocus()
  b.SetJustifyH('LEFT')
  a.ref.EnableMouse(true)
  a.ref.SetScript('OnMouseDown', () => {
    b.SetFocus()
  })
  b.SetScript('OnTextChanged', () => {
    s.fns.Height(b.GetHeight())
    const text = b.GetText()
    if (options.OnChange)
      options.OnChange(text)
  })
  b.SetScript('OnTabPressed', () => {
    b.ClearFocus()
    const text = b.GetText()
    if (options.OnUpdate)
      options.OnUpdate(text)
  })
  b.SetScript('OnEnterPressed', () => {
    const text = b.GetText()
    if (options.OnUpdate)
      options.OnUpdate(text)
    b.ClearFocus()
  })
  b.SetScript('OnEscapePressed', () => {
    b.ClearFocus()
    const text = b.GetText()
    if (options.OnCancel)
      options.OnCancel(text)
  })
  b.Insert('test')
  b.SetPoint('TOPLEFT')
  // bb.SetMaxLetters(138)

  return a
}
