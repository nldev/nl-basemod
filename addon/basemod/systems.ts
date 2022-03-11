import { Component, ComponentOptions, Frame, Element } from './app'
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

  // menu
  const p = Frame({ name: 'dropdown-menu-padding', parent: a })
  p.ref.SetPoint('TOP', a.ref, 'BOTTOM', 0, 0)
  p.ref.SetSize(200, 3)

  const menu = Frame({ name: 'dropdown-menu', parent: p })
  menu.ref.SetSize(200, 90)
  menu.ref.SetPoint('TOP', p.ref, 'BOTTOM', 0, 0)
  menu.ref.SetBackdrop({ ...BASE_BACKDROP, bgFile: 'Interface/Tooltips/UI-Tooltip-Background' })
  menu.ref.SetBackdropColor(0, 0, 0, 1)

  p.ref.Hide()

  // button
  const button = CreateFrame('Button', 'dropdown-button', a.ref)

  button.SetNormalTexture('Interface\\ChatFrame\\UI-ChatIcon-ScrollDown-Up')
  button.SetHighlightTexture('Interface\\Buttons\\UI-Common-MouseHilight')
  button.SetPushedTexture('Interface\\ChatFrame\\UI-ChatIcon-ScrollDown-Down')
  button.SetDisabledTexture('Interface\\ChatFrame\\UI-ChatIcon-ScrollDown-Disabled')
  button.SetSize(20, 20)
  button.SetPoint('RIGHT', -5, 0)

  // toggle
  a.ref.EnableMouse(true)
  a.ref.SetScript('OnMouseDown', () => {
    if (menu.ref.IsVisible()) {
      p.ref.Hide()
    } else {
      p.ref.Show()
    }
  })
  button.SetScript('OnClick', () => {
    if (menu.ref.IsVisible()) {
      p.ref.Hide()
    } else {
      p.ref.Show()
    }
  })

  // text
  const textName = `${a.ref.GetName()}-label`
  const text = a.ref.CreateFontString(
    textName,
    'OVERLAY',
    'GameTooltipText',
  )

  text.SetParent(a.ref)
  text.SetPoint('LEFT', 10, 0)
  text.SetFont('Fonts/FRIZQT__.TTF', 10)
  text.SetText('select')

  // list
  const list = List({ name: 'dropdown-menu-list', itemHeight: 30, parent: menu })
  list.ref.SetSize(200, 100)

  // item
  const Item = (options: DropdownItem) => {
    options.id
    options.text
    options.value

    const w = Frame({ name: `${options.id}-wrapper` })
    const t = w.ref.CreateFontString(`${options.id}-wrapper-text`)

    t.SetParent(w.ref)
    t.SetPoint('LEFT', 10, 0)
    t.SetFont('Fonts/FRIZQT__.TTF', 10)
    t.SetText(options.text)

    w.ref.SetBackdropColor(0, 0, 0, 1)

    w.ref.EnableMouse(true)
    w.ref.SetScript('OnEnter', () => {
      console.log(options.text)
      w.ref.SetBackdrop({ ...BASE_BACKDROP, bgFile: 'Interface/Tooltips/UI-Tooltip-Background', edgeFile: '' })
      w.ref.SetBackdropColor(0, 0, 1, 1)
    })
    w.ref.SetScript('OnLeave', () => {
      console.log(options.text)
      w.ref.SetBackdrop({ bgFile: '', insets: { left:0, right:0, top:0, bottom:0 } })
      w.ref.SetBackdropColor(0, 0, 0, 1)
    })

    list.fns.Attach(options.id, w)
  }

  Item({
    id: 'foo-1',
    text: 'aaa',
    value: 1,
  })
  Item({
    id: 'foo-2',
    text: 'bbb',
    value: 2,
  })
  Item({
    id: 'foo-3',
    text: 'ccc',
    value: 3,
  })


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
