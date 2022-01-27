const talents = CreateFrame('Frame', 'foo', UIParent)

talents.SetMovable(true)

talents.SetBackdrop({
  bgFile: 'Interface/Tooltips/UI-Tooltip-Background',
  edgeFile: 'Interface/Tooltips/UI-Tooltip-Border',
  tile: true, tileSize: 16, edgeSize: 16,
  insets: { left: 4, right: 4, top: 4, bottom: 4 },
})

talents.SetBackdropColor(0,0,0,1)

const btn = CreateFrame('Button', null, UIParent, 'UIPanelButtonTemplate')

btn.SetPoint('CENTER')
btn.SetSize(800, 800)
btn.SetText('Click me')
btn.SetScript('OnClick', (_, button) => {
  console.log('You clicked me with ' + button)
})

talents.SetPoint('CENTER')
talents.SetSize(100, 40)
talents.Show()

SendChatMessage('hello world', 'SAY')

