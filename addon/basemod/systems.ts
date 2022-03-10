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

  a.ref.SetWidth(200)
  a.ref.SetHeight(30)
  a.ref.SetBackdrop(BASE_BACKDROP)

  //
  const button = CreateFrame('Button', 'dropdown-button', a.ref)

  //
  button.SetNormalTexture('Interface\\ChatFrame\\UI-ChatIcon-ScrollDown-Up')
  button.SetHighlightTexture('Interface\\Buttons\\UI-Common-MouseHilight')
  button.SetPushedTexture('Interface\\ChatFrame\\UI-ChatIcon-ScrollDown-Down')
  button.SetDisabledTexture('Interface\\ChatFrame\\UI-ChatIcon-ScrollDown-Disabled')
  button.SetSize(20, 20)
  button.SetPoint('RIGHT', -5, 0)

  //
  const menu = Frame({ name: 'dropdown-menu', parent: a })

  menu.ref.SetPoint('TOP', a.ref, 'BOTTOM', 0, -3)
  menu.ref.SetSize(200, 300)
  menu.ref.SetBackdrop(BASE_BACKDROP)
  menu.ref.SetBackdropColor(0, 0, 0, 1)

  const list = List({ name: 'dropdown-menu-list', itemHeight: 30, parent: menu })

  // counter
  const counterTextName = `${a.ref.GetName()}-label`
  const counterText = a.ref.CreateFontString(
    counterTextName,
    'OVERLAY',
    'GameTooltipText',
  )

  counterText.SetParent(a.ref)
  counterText.SetPoint('LEFT', 10, 0)
  counterText.SetFont('Fonts/FRIZQT__.TTF', 10)
  counterText.SetText('bustaz talkin sh*t')

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
