const talents = CreateFrame('Frame', 'foo')

talents.SetWidth(800)
talents.SetHeight(800)

talents.SetMovable(true)

talents.SetBackdropColor(0, 0, 0, 1)

const btn = CreateFrame('Button', null, UIParent, 'UIPanelButtonTemplate')
btn.SetPoint('CENTER')
btn.SetSize(100, 40)
btn.SetText('Click me')
btn.SetScript('OnClick', function(self, button) {
  console.log('You clicked me with ' + button)
})

console.log('hello')

talents.SetPoint('CENTER', UIParent, 'CENTER', 0, 0)
talents.Show()

SendChatMessage('hello world', 'SAY')

