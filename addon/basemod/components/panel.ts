import { Get } from './app'
import { Component, ComponentOptions, Frame, Element } from './app'
import { List } from './components/list'
import { Dropdown } from './components/dropdown'
import { BASE_BACKDROP } from './constants'
import { Mapping } from './types'
import { Movable } from './utils'

export const Panel: Component = options => {
  const $ = Get()
  const a = Frame(options)
  const b = Frame({ name: `${a.ref.GetName()}-inner`, parent: a })

  a.ref.SetSize(340, 430)
  a.ref.SetBackdrop(BASE_BACKDROP)
  a.ref.SetBackdropColor(0, 0, 0, 1)
  b.ref.SetSize(300 - 30, 400 - 30)
  b.ref.SetPoint('CENTER')

  Movable(a)

  return a
}
