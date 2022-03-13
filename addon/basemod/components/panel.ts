import { Get } from '../app'
import { Component, ComponentOptions, Frame, Element } from '../app'
import { Dropdown, DropdownItemOptions } from './dropdown'
import { BASE_BACKDROP } from '../constants'
import { Movable } from '../utils'
import { Mapping } from '../types'

export interface PanelOptions extends ComponentOptions {
  nav: DropdownItemOptions[]
  pages: Mapping<Component>
  defaultSelectionId?: string
  isHiddenOnEmpty?: boolean
}

export const Panel: Component = options => {
  const $ = Get()
  const a = Frame(options)
  const b = Frame({ name: `${a.ref.GetName()}-inner`, parent: a })
  a.inner = b.ref

  const dropdown = Dropdown({
    name: 'test-dropdown',
    width: 150,
    defaultSelectionId: $.store.Get('CHARACTER', 'test-dropdown-id', 'foo'),
    isSelectableEmpty: true,
    // isTriggerOnInit: true,
    // isTriggerOnReselect: false,
    emptyText: 'select a thing',
    items: [
      {
        id: 'foo',
        text: 'Foo',
        value: 1,
      },
      {
        id: 'bar',
        text: 'Bar',
        value: 2,
      },
      {
        id: 'baz',
        text: 'Baz',
        value: 3,
        tooltip: 'this has a tooltip',
      },
    ],
    onSelect: ({ id }) => $.store.Set('CHARACTER', 'test-dropdown-id', id),
  })

  dropdown.ref.SetParent(a.ref)
  dropdown.ref.SetPoint('TOPLEFT', 0, -40)


  a.ref.SetSize(340, 430)
  a.ref.SetBackdrop(BASE_BACKDROP)
  a.ref.SetBackdropColor(0, 0, 0, 1)
  b.ref.SetSize(300 - 30, 400 - 30)
  b.ref.SetPoint('CENTER')

  Movable(a)

  return a
}
