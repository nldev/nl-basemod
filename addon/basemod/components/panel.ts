import { Get } from '../app'
import { Component, ComponentOptions, Frame, Element } from '../app'
import { List } from './list'
import { Dropdown } from './dropdown'
import { BASE_BACKDROP } from '../constants'
import { Mapping } from '../types'
import { Movable } from '../utils'

export const Panel: Component = options => {
  const $ = Get()
  const a = Frame(options)
  const b = Frame({ name: `${a.ref.GetName()}-inner`, parent: a })
  a.inner = b.ref

  const dropdown = Dropdown({
    name: 'test-dropdown',
    parent: a,
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


  a.ref.SetSize(340, 430)
  a.ref.SetBackdrop(BASE_BACKDROP)
  a.ref.SetBackdropColor(0, 0, 0, 1)
  b.ref.SetSize(300 - 30, 400 - 30)
  b.ref.SetPoint('CENTER')

  Movable(a)

  return a
}
