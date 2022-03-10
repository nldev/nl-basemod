import { App, Component, ComponentOptions, Frame } from './app'
import { List } from './components/list'
import { BASE_BACKDROP } from './constants'
import { Movable } from './utils'

interface DropdownItem {
  id: string
  text: string
  value: string | number | boolean | null
}

interface DropdownOptions extends ComponentOptions {
  width?: number
  items?: DropdownItem[]
  selection?: string
  emptyItem?: boolean
  emptyItemText?: string
  onSelect?: (item: DropdownItem) => void
}

export const Dropdown: Component<DropdownOptions> = options => {
  const a = Frame(options)
  a.ref.SetWidth(150)
  a.ref.SetHeight(30)
  a.ref.SetBackdrop(BASE_BACKDROP)
  // const list = List()
  return a
}

export const Checkboxes: Component = () => {
  const a = Frame()
  return a
}

export const Systems: Component = () => {
  const a = Frame({ name: 'systems' })
  const b = Frame({ name: 'systems-inner', parent: a })

  a.ref.SetSize(300, 400)
  a.ref.SetBackdrop(BASE_BACKDROP)
  a.ref.SetBackdropColor(0, 0, 0, 1)
  b.ref.SetSize(300 - 30, 400 - 30)
  b.ref.SetPoint('CENTER')

  Movable(a)

  const dropdown = Dropdown({ name: 'test-dropdown', parent: b })

  dropdown.ref.SetPoint('TOPLEFT')

  return a
}
