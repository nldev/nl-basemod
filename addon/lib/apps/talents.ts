import '../global'
import { Unique } from '../utils'
import * as TALENTS from '../../data/talents'

const talentsMap: Mapping<Talent> = TALENTS as any

interface Talent {
  id: string
  spellId: number
  cost: number
  icon: string
  class: Mapping<boolean>
  classMask: number
}

function TalentButton (talent: Talent) {
  const frame = CreateFrame('Frame', Unique('testframe'), UIParent)

  frame.SetBackdrop({
    bgFile: 'Interface/Tooltips/UI-Tooltip-Background',
    edgeFile: 'Interface/Tooltips/UI-Tooltip-Border',
    tile: true, tileSize: 16, edgeSize: 16,
    insets: { left: 4, right: 4, top: 4, bottom: 4 },
  })

  const texture = frame.CreateTexture()
  texture.SetTexture(talent.icon)
  texture.SetAllPoints(frame)
  SetDesaturation(texture, true)

  frame.SetBackdropColor(0, 0, 0, 1)

  const counter = CreateFrame('Frame', Unique('testframe-counter'), frame)
  frame.SetSize(50, 50)

  counter.SetBackdrop({
    bgFile: 'Interface/Tooltips/UI-Tooltip-Background',
    edgeFile: 'Interface/Tooltips/UI-Tooltip-Border',
    tile: true, tileSize: 12, edgeSize: 12,
    insets: { left: 0, right: 0, top: 0, bottom: 0 },
  })

  counter.SetBackdropColor(0, 0, 0, 1)
  counter.SetSize(50, 18)
  counter.SetPoint('BOTTOM', 0, -8)
  //  bgFile: 'Interface/Icons/Spell_Frost_WindWalkOn',


  const text = counter.CreateFontString(null, 'OVERLAY', 'GameTooltipText')

  text.SetPoint('CENTER', 0, 0)
  text.SetText(`${talent.cost}`)
  text.SetFont('Fonts\\FRIZQT__.TTF', 11)

  // frame.SetScript('OnLoad', () => console.log('loaded'))
  frame.SetFrameLevel(3)
  // frame.EnableMouse(true)
  // frame.RegisterForClicks('LeftButtonUp')
  // frame.SetScript('OnClick', function () { console.log(`clicked ${talent.spellId}`) })

  frame.SetScript('OnEnter', frame => {
    const unit = UnitGUID('player')
    SetDesaturation(texture, false)
    console.log(`enter ${talent.spellId}`)
    GameTooltip.SetOwner(a, 'ANCHOR_CURSOR')
    GameTooltip.SetHyperlink(`spell:${talent.spellId}`)
    GameTooltip.Show()
  })

  frame.SetScript('OnLeave', frame => {
    SetDesaturation(texture, true)
    console.log(`leave ${talent.spellId}`)
    GameTooltip.Hide()
  })

  return frame
}
