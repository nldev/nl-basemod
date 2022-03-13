import { Get } from './app'
import { Component, ComponentOptions, Frame, Element } from './app'
import { List } from './components/list'
import { Dropdown } from './components/dropdown'
import { BASE_BACKDROP } from './constants'
import { Mapping } from './types'
import { Movable } from './utils'

export const Systems: Component = () => {
  const $ = Get()
  const a = Frame({ name: 'systems' })
  const b = Frame({ name: 'systems-inner', parent: a })

  a.ref.SetSize(340, 430)
  a.ref.SetBackdrop(BASE_BACKDROP)
  a.ref.SetBackdropColor(0, 0, 0, 1)
  b.ref.SetSize(300 - 30, 400 - 30)
  b.ref.SetPoint('CENTER')

  Movable(a)

  const dropdown = Dropdown({
    name: 'test-dropdown',
    parent: b,
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

  dropdown.ref.SetPoint('TOPLEFT')

  return a
}
