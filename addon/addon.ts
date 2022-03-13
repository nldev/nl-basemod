import { App } from './basemod/app'
import { Talents } from './basemod/talents'
import { EasyLoot } from './basemod/easy-loot'
import { Chests } from './basemod/chests'
import { AllChildren } from './basemod/utils'
import { Panel } from './basemod/components/panel'
import { Dropdown } from './basemod/components/dropdown'

export const app = new App(app => {
  Talents()
  EasyLoot()
  Chests()

  const panel = Panel({ name: 'panel', parent: app.root })
  const dropdown = Dropdown({
    name: 'test-dropdown',
    parent: panel,
    defaultSelectionId: app.store.Get('CHARACTER', 'test-dropdown-id', 'foo'),
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
    onSelect: ({ id }) => app.store.Set('CHARACTER', 'test-dropdown-id', id),
  })

  dropdown.ref.SetPoint('TOPLEFT')

  let txt = ''
  app.root.ref.SetScript('OnUpdate', () => {
    const f = GetMouseFocus()
    if (!f)
      return
    const name = f.GetName()
    if (txt !== name) {
      txt = name
      if (name === 'DropDownList1') {
        const a: WoWAPI.Frame = f as any
        AllChildren(a).forEach(c => console.log(c.GetName()))
      }
    }
  })
})

