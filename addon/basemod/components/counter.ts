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

export interface CounterOptions extends ComponentOptions {
  width: number
  initial?: number
  onAccept?: (amount: number, element: Element<any, any>) => void
  onCancel?: (amount: number, element: Element<any, any>) => void
}

export const Counter: Component<CounterOptions> = options => {
  let count = options.initial || 0
  const counter = Frame({
    ...options,
    height: options.height || 30,
  })
  counter.ref.SetBackdrop({
    ...BASE_BACKDROP,
  })
  counter.ref.SetBackdropColor(0, 0, 0, 1)
  counter.ref.SetHeight(options.height || 30)

  const width = options.width || options.parent.inner.GetWidth()

  counter.ref.SetWidth(width - 15)

  const input = Frame({
    name: `${options.name}-input`,
    width: counter.ref.GetWidth() - 16,
    height: counter.ref.GetHeight(),
    parent: counter,
  })
  input.ref.SetPoint('CENTER')
  const i = CreateFrame('EditBox', `${options.name}-editbox`, input.ref)
  i.SetAllPoints(input.ref)
  i.SetNumeric()
  i.SetNumber(UnitLevel('player'))
  i.SetPoint('CENTER')
  i.SetAutoFocus(false)
  i.SetFont('Fonts/FRIZQT__.TTF', 12)
  i.ClearFocus()
  i.SetScript('OnTextChanged', () => {
  })
  input.inner = i as any
  counter.ref.EnableMouse(true)
  counter.ref.SetScript('OnMouseDown', () => {
    i.SetFocus()
  })
  i.SetScript('OnTabPressed', () => {
    const current = i.GetNumber()
    i.SetNumber(current)
    count = current
    options.onAccept(count, counter)
  })
  i.SetScript('OnSpacePressed', () => {
    const current = i.GetNumber()
    i.SetNumber(current)
    count = current
    options.onAccept(count, counter)
  })
  i.SetScript('OnEnterPressed', () => {
    const current = i.GetNumber()
    i.SetNumber(current)
    count = current
    options.onAccept(count, counter)
  })
  i.SetScript('OnEscapePressed', () => {
    i.ClearFocus()
    options.onCancel(count, counter)
  })
  const plus = Button({
    name: `${options.name}-plus`,
    parent: input,
    text: '+',
    width: 30,
    fontSize: 20,
    isBordered: false,
    scale: 0.5,
    textXOffset: -2,
    onClick: () => {
      const current = i.GetNumber() + 1
      i.SetNumber(current)
      count = current
      options.onAccept(count, counter)
    },
  })
  const minus = Button({
    name: `${options.name}-minus`,
    parent: input,
    text: '-',
    width: 30,
    fontSize: 24,
    isBordered: false,
    scale: 0.5,
    textXOffset: 0,
    textYOffset: 2,
    onClick: () => {
      const current = i.GetNumber() + 1
      i.SetNumber(current)
      count = current
      options.onAccept(count, counter)
    },
  })
  plus.ref.SetPoint('TOPLEFT', i, 'TOPRIGHT', 15, 0)
  minus.ref.SetPoint('BOTTOMLEFT', i, 'BOTTOMRIGHT', 15, 0)

  return counter
}
