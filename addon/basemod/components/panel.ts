import { Get } from '../app'
import { Component, ComponentOptions, Frame, Element } from '../app'
import { Dropdown, DropdownItemOptions } from './dropdown'
import { BASE_BACKDROP } from '../constants'
import { Movable } from '../utils'
import { Mapping } from '../types'

export interface PanelOptions extends ComponentOptions {
  // FIXME
  nav?: DropdownItemOptions[]
  pages?: Mapping<Component>

  defaultSelectionId?: string
  isHiddenOnEmpty?: boolean
  title?: string
}

export const Panel: Component<PanelOptions> = options => {
  const $ = Get()
  const a: Element<PanelOptions> = Frame(options) as any
  const b = Frame({ name: `${a.ref.GetName()}-inner`, parent: a })
  a.inner = b.ref

  a.ref.SetSize(340, 430)
  a.ref.SetBackdrop(BASE_BACKDROP)
  a.ref.SetBackdropColor(0, 0, 0, 1)
  b.ref.SetSize(300 - 30, 400 - 30)
  b.ref.SetPoint('CENTER')

  //dropdown
  const dropdown = Dropdown({
    name: `${a.ref.GetName()}-dropdown`,
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
  dropdown.ref.SetPoint('TOPLEFT', 0, 34)

  // title
  // if (options.title) {
    const title = Frame({
      name: `${a.ref.GetName()}-title`,
    })

    title.ref.SetParent(a.ref)
    title.ref.SetSize(140, 30)
    title.ref.SetBackdrop(BASE_BACKDROP)
    title.ref.SetBackdropColor(0, 0, 0, 1)
    title.ref.SetPoint('TOPRIGHT', 0, 35)
    const titleText = title.ref.CreateFontString(
      'talent-countertext',
      'OVERLAY',
      'GameTooltipText',
    )
    titleText.SetParent(title.ref)
    titleText.SetPoint('CENTER')
    // FIXME
    titleText.SetText('basemod v0.1.0')
    titleText.SetFont('Fonts/FRIZQT__.TTF', 10)
  // }

  Movable(a)

  return a
}
