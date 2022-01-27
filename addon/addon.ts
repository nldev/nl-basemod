const btn = CreateFrame('Button', null, UIParent, 'UIPanelButtonTemplate')

btn.SetPoint('TOPLEFT')
btn.SetSize(100, 40)
btn.SetText('Click me')
btn.SetScript('OnClick', (_, button) => {
  console.log('You clicked me with ' + button)
})

// -----

const talents = CreateFrame('Frame', 'foo', UIParent)

talents.SetBackdrop({
  bgFile: 'Interface/Tooltips/UI-Tooltip-Background',
  edgeFile: 'Interface/Tooltips/UI-Tooltip-Border',
  tile: true, tileSize: 16, edgeSize: 16,
  insets: { left: 4, right: 4, top: 4, bottom: 4 },
})

talents.SetBackdropColor(0, 0, 0, 1)
talents.SetSize(800, 800)
talents.SetPoint('CENTER')

// -----

const counter = CreateFrame('Frame', null, talents)

counter.SetBackdrop({
  bgFile: 'Interface/Tooltips/UI-Tooltip-Background',
  edgeFile: 'Interface/Tooltips/UI-Tooltip-Border',
  tile: true, tileSize: 16, edgeSize: 16,
  insets: { left: 0, right: 0, top: 0, bottom: 0 },
})

counter.SetBackdropColor(0, 0, 0, 1)
counter.SetSize(20, 20)
counter.SetPoint('TOPLEFT')

// -----
//
const num = counter.CreateFontString()
num.SetText('1')
num.SetPoint('CENTER')

// -----

console.log('addon loaded')


