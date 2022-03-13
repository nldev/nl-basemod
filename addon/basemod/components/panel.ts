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

  // title
  const title: Element<PanelOptions> = Frame(options) as any

  title.ref.SetSize(168, 30)
  title.ref.SetBackdrop({ ...BASE_BACKDROP, bgFile: 'Interface/Tooltips/UI-Tooltip-Background' })
  title.ref.SetBackdropColor(0, 0, 0, 1)
  title.ref.SetPoint('CENTER', 0, 0)

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

  // panel
  const a = Frame({ name: `${title.ref.GetName()}-panel`, parent: title })

  a.ref.SetSize(340, 410)
  a.ref.SetBackdrop({ ...BASE_BACKDROP, bgFile: 'Interface/Tooltips/UI-Tooltip-Background' })
  a.ref.SetBackdropColor(0, 0, 0, 1)
  a.ref.SetPoint('TOP', title.ref, 'BOTTOMLEFT', -2, -3)

  // panel-inner
  const b = Frame({ name: `${title.ref.GetName()}-inner`, parent: a })

  b.ref.SetSize(300 - 30, 400 - 30)
  b.ref.SetPoint('CENTER')

  title.inner = b.ref

  //dropdown
  const dropdown = Dropdown({
    name: `${a.ref.GetName()}-dropdown`,
    width: 168,
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
    onSelect: ({ id }) => {
      // FIXME
      $.store.Set('CHARACTER', 'test-dropdown-id', id)

      if (id === 'empty') {
        a.ref.Hide()
      } else {
        a.ref.Show()
      }
    },
  })

  dropdown.ref.SetParent(title.ref)
  dropdown.ref.SetPoint('RIGHT', title.ref, 'LEFT', -4, -1)

  Movable(title)

  return title
}
