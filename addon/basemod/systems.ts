import { App, Component, Frame } from './app'
import { BASE_BACKDROP } from './constants'
import { Movable } from './utils'

export const Systems: Component = () => {
  const a = Frame({ name: 'systems' })
  const b = Frame({ name: 'systems-inner', parent: a })

  a.ref.SetSize(300, 400)
  a.ref.SetBackdrop(BASE_BACKDROP)
  a.ref.SetBackdropColor(0, 0, 0, 1)
  b.ref.SetSize(300 - 30, 400 - 30)
  b.ref.SetPoint('CENTER')

  Movable(a)

  const dropdown = Frame({ name: 'systems-dropdown', parent: b })
  UIDropDownMenu_Initialize(dropdown.ref, (self, level, menuList) => {
    UIDropDownMenu_AddButton({ text: 'hello', checked: true })
    UIDropDownMenu_SetWidth(self, 500)
    self.SetPoint('TOPLEFT')
  })

  return a
}
