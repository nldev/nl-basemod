import { Component, ComponentOptions, Frame, Element } from './app'
import { List } from './components/list'
import { BASE_BACKDROP } from './constants'
import { Movable } from './utils'

const DEFAULT_SELECTION = {
  id: '',
  text: '',
  value: null,
}

interface DropdownItem {
  id: string
  text: string
  value: string | number | boolean | null
}

interface DropdownOptions extends ComponentOptions {
  width?: number
  items?: DropdownItem[]
  selection?: string
  isSelectableEmpty?: boolean
  emptyText?: string
  onSelect?: (item: DropdownItem) => void
}

export const Dropdown: Component<DropdownOptions> = options => {
  const items = {
    empty: {
      id: 'empty',
      text: options.emptyText || 'select',
      value: null,
    }
  }
  const autohide = {}
  let timer = 0
  let selection: DropdownItem = { ...DEFAULT_SELECTION }

  const a = Frame(options)

  a.ref.SetWidth(options.width || 200)
  a.ref.SetHeight(30)
  a.ref.SetBackdrop({ ...BASE_BACKDROP, bgFile: 'Interface/Tooltips/UI-Tooltip-Background' })
  a.ref.SetBackdropColor(0, 0, 0, 1)

  autohide['a'] = false

  a.ref.SetScript('OnEnter', () => {
    autohide['a'] = true
    timer = 0
    a.ref.SetBackdropColor(0.21, 0.49, 1, 1)
  })

  a.ref.SetScript('OnLeave', () => {
    autohide['a'] = false
    timer = GetTime() + 2
    a.ref.SetBackdropColor(0, 0, 0, 1)
  })

  // menu
  const p = Frame({ name: 'dropdown-menu-padding', parent: a })
  p.ref.SetPoint('TOP', a.ref, 'BOTTOM', 0, 0)
  p.ref.SetSize(options.width || 200, 3)

  const menu = Frame({ name: 'dropdown-menu', parent: p })
  menu.ref.SetSize(options.width || 200, 0)
  menu.ref.SetPoint('TOP', p.ref, 'BOTTOM', 0, 0)
  menu.ref.SetBackdrop({ ...BASE_BACKDROP, bgFile: 'Interface/Tooltips/UI-Tooltip-Background' })
  menu.ref.SetBackdropColor(0, 0, 0, 1)

  p.ref.Hide()

  autohide['p'] = false
  autohide['menu'] = false

  p.ref.SetScript('OnEnter', () => {
    autohide['p'] = true
  })

  p.ref.SetScript('OnLeave', () => {
    autohide['p'] = false
    timer = GetTime() + 2
  })

  menu.ref.SetScript('OnEnter', () => {
    autohide['menu'] = true
  })

  menu.ref.SetScript('OnLeave', () => {
    autohide['menu'] = false
    timer = GetTime() + 2
  })

  // button
  const button = CreateFrame('Button', 'dropdown-button', a.ref)

  button.SetNormalTexture('Interface\\ChatFrame\\UI-ChatIcon-ScrollDown-Up')
  button.SetHighlightTexture('Interface\\Buttons\\UI-Common-MouseHilight')
  button.SetPushedTexture('Interface\\ChatFrame\\UI-ChatIcon-ScrollDown-Down')
  button.SetDisabledTexture('Interface\\ChatFrame\\UI-ChatIcon-ScrollDown-Disabled')
  button.SetSize(20, 20)
  button.SetPoint('RIGHT', -5, 0)

  autohide['button'] = false

  button.SetScript('OnEnter', () => {
    autohide['button'] = true
    timer = 0
  })

  button.SetScript('OnLeave', () => {
    autohide['button'] = false
    timer = GetTime() + 2
  })

  // toggle
  a.ref.EnableMouse(true)
  a.ref.SetScript('OnMouseDown', () => {
    if (p.ref.IsVisible()) {
      p.ref.Hide()
      button.SetNormalTexture('Interface\\ChatFrame\\UI-ChatIcon-ScrollDown-Up')
      button.SetHighlightTexture('Interface\\Buttons\\UI-Common-MouseHilight')
      button.SetPushedTexture('Interface\\ChatFrame\\UI-ChatIcon-ScrollDown-Down')
      button.SetDisabledTexture('Interface\\ChatFrame\\UI-ChatIcon-ScrollDown-Disabled')
    } else {
      p.ref.Show()
      button.SetNormalTexture('Interface\\ChatFrame\\UI-ChatIcon-ScrollUp-Up')
      button.SetHighlightTexture('Interface\\Buttons\\UI-Common-MouseHilight')
      button.SetPushedTexture('Interface\\ChatFrame\\UI-ChatIcon-ScrollUp-Down')
      button.SetDisabledTexture('Interface\\ChatFrame\\UI-ChatIcon-ScrollUp-Disabled')
    }
  })

  button.SetScript('OnClick', () => {
    if (p.ref.IsVisible()) {
      p.ref.Hide()
      button.SetNormalTexture('Interface\\ChatFrame\\UI-ChatIcon-ScrollDown-Up')
      button.SetHighlightTexture('Interface\\Buttons\\UI-Common-MouseHilight')
      button.SetPushedTexture('Interface\\ChatFrame\\UI-ChatIcon-ScrollDown-Down')
      button.SetDisabledTexture('Interface\\ChatFrame\\UI-ChatIcon-ScrollDown-Disabled')
    } else {
      p.ref.Show()
      button.SetNormalTexture('Interface\\ChatFrame\\UI-ChatIcon-ScrollUp-Up')
      button.SetHighlightTexture('Interface\\Buttons\\UI-Common-MouseHilight')
      button.SetPushedTexture('Interface\\ChatFrame\\UI-ChatIcon-ScrollUp-Down')
      button.SetDisabledTexture('Interface\\ChatFrame\\UI-ChatIcon-ScrollUp-Disabled')
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
  text.SetText(options.emptyText || 'select')

  // list
  const list = List({ name: 'dropdown-menu-list', itemHeight: 30, parent: menu })
  list.ref.SetSize(options.width || 200, 0)

  autohide['list'] = false

  list.ref.SetScript('OnEnter', () => {
    autohide['list'] = true
    timer = 0
  })

  list.ref.SetScript('OnLeave', () => {
    autohide['list'] = false
    timer = GetTime() + 2
  })

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

    w.ref.SetBackdropColor(0, 0, 0, 1)

    w.ref.EnableMouse(true)
    w.ref.SetScript('OnEnter', () => {
      timer = 0
      w.ref.SetBackdrop({ ...BASE_BACKDROP, bgFile: 'Interface/Tooltips/UI-Tooltip-Background', edgeFile: '' })
      w.ref.SetBackdropColor(0.21, 0.49, 1, 1)
      autohide[`item-${i}`] = true
    })

    w.ref.SetScript('OnLeave', () => {
      w.ref.SetBackdrop({ bgFile: '', insets: { left:0, right:0, top:0, bottom:0 } })
      w.ref.SetBackdropColor(0, 0, 0, 1)
      timer = GetTime() + 2
      autohide[`item-${i}`] = false
    })

    w.ref.SetScript('OnMouseDown', () => {
      p.ref.Hide()
      button.SetNormalTexture('Interface\\ChatFrame\\UI-ChatIcon-ScrollDown-Up')
      button.SetHighlightTexture('Interface\\Buttons\\UI-Common-MouseHilight')
      button.SetPushedTexture('Interface\\ChatFrame\\UI-ChatIcon-ScrollDown-Down')
      button.SetDisabledTexture('Interface\\ChatFrame\\UI-ChatIcon-ScrollDown-Disabled')
      Select(options.id)
    })

    list.fns.Attach(options.id, w)

    const i = list.state.items.length

    menu.ref.SetHeight(i * 30)
    list.ref.SetHeight(i * 30)

    autohide[`item-${i}`] = false
    items[`${options.id}`] = w
  }

  // autohide
  const IsMouseEnter = () => {
    let bool = false

    for (const key of Object.keys(autohide)) {
      const isMouseEnter: boolean = autohide[key]
      if (isMouseEnter) {
        bool = true
      }
    }

    return bool
  }

  a.ref.SetScript('OnUpdate', () => {
    if ((timer > 0) && (GetTime() >= timer)) {
      if (!IsMouseEnter())
        p.ref.Hide()
        button.SetNormalTexture('Interface\\ChatFrame\\UI-ChatIcon-ScrollDown-Up')
        button.SetHighlightTexture('Interface\\Buttons\\UI-Common-MouseHilight')
        button.SetPushedTexture('Interface\\ChatFrame\\UI-ChatIcon-ScrollDown-Down')
        button.SetDisabledTexture('Interface\\ChatFrame\\UI-ChatIcon-ScrollDown-Disabled')
    }
  })

  // select
  const Select = (id: string) => {
    const item = items[id]

    selection = {
      id: item.id,
      text: item.text,
      value: item.value,
    }

    console.log(`${item.id}: ${item.value}`)

    text.SetText(item.text)

    // TODO: OnSelect
  }

  // empty
  if (true) {
    Item({
      id: items['empty'].id,
      text: items['empty'].text,
      value: items['empty'].value,
    })
  }

  for (let i = 0; i <= 15; i++)
    Item({
      id: `item-${i}`,
      text: `Item ${i}`,
      value: i,
    })

  // TODO: default selection
  Select('empty')

  return a
}

export const Checkboxes: Component = () => {
  const a = Frame()
  return a
}

export const Systems: Component = () => {
  const a = Frame({ name: 'systems' })
  const b = Frame({ name: 'systems-inner', parent: a })

  a.ref.SetSize(340, 430)
  a.ref.SetBackdrop(BASE_BACKDROP)
  a.ref.SetBackdropColor(0, 0, 0, 1)
  b.ref.SetSize(300 - 30, 400 - 30)
  b.ref.SetPoint('CENTER')

  Movable(a)

  const dropdown = Dropdown({ name: 'test-dropdown', parent: b })

  dropdown.ref.SetPoint('TOPLEFT')

  return a
}
