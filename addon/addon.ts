const talents = CreateFrame('Frame', 'foo')
console.log('hello world')

talents.SetWidth(800)
talents.SetHeight(800)

talents.SetMovable(true)

talents.SetBackdropColor(0, 0, 0, 1)

talents.SetPoint('CENTER', 'UIParent', 'CENTER', 0, 0)
talents.Show()


SendChatMessage('hello world', 'SAY')

