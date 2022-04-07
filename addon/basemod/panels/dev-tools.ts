declare function ReloadUI (): void
import { Get } from '../app'
import { Component, Frame } from '../app'
import { Scroll } from '../components/scroll'
import { Section } from '../components/section'
import { Button } from '../components/button'
import { Counter } from '../components/counter'
import { Grid } from '../components/grid'
import { Checkbox } from '../components/checkbox'

export const DevTools: Component = options => {
  const f = Frame({ name: 'devtools', ...options })
  f.ref.SetSize(290, 360)
  f.ref.SetPoint('CENTER')

  const scroll = Scroll({ name: 'devtools-scroll', parent: f, height: 300 })

  // const a = Section({
  //   name: 'positioning',
  //   title: 'Positioning',
  //   parent: scroll,
  //   height: 50,
  // })

  const b = Section({
    name: 'set-level',
    title: 'Character Level',
    parent: scroll,
    // previous: a,
    height: 50,
  })

  const c = Section({
    name: 'tools',
    title: 'Tools',
    parent: scroll,
    previous: b,
    height: 123,
  })

  const d = Section({
    name: 'cheats',
    title: 'Cheats',
    parent: scroll,
    previous: c,
    height: 150,
  })
  // const c = Section({
  //   name: 'c-sect',
  //   title: 'Notes',
  //   parent: scroll,
  //   previous: b,
  //   height: 150,
  // })

  // set level
  const onLevelAccept = (num: number) => {
    if (num !== UnitLevel('player'))
    SendChatMessage(`.char level ${num}`)
  }
  const level = Counter({
    name: 'set-level-counter',
    parent: b,
    initial: UnitLevel('player'),
    min: 1,
    max: 99,
    onAccept: n => onLevelAccept(n),
    onCancel: () => {},
  })
  level.ref.RegisterEvent('PLAYER_LEVEL_UP')
  level.ref.SetPoint('TOPLEFT')

  // utils
  const grid = Grid({ name: 'devtools-utils-grid', parent: c, rowHeight: 35, itemsPerRow: 2 })
  grid.ref.SetSize(c.inner.GetWidth(), c.inner.GetHeight())
  grid.ref.SetPoint('TOPLEFT', -2, 0)

  // reset bags
  const clearInventory = Button({
    name: 'devtools-clear-inventory',
    text: 'Clear Inventory',
    width: 130,
    onClick: () => {
      SendAddonMessage('dev-clear-inventory', '', 'WHISPER', Get().playerInfo.name)
    },
  })
  grid.fns.Attach(clearInventory)

  // recall
  const recall = Button({
    name: 'devtools-recall',
    text: 'Recall',
    width: 130,
    onClick: () => {
    },
  })
  grid.fns.Attach(recall)

  // revive
  const revive = Button({
    name: 'devtools-revive',
    text: 'Revive',
    width: 130,
    onClick: () => {
      SendChatMessage(`.revive`)
    },
  })
  grid.fns.Attach(revive)

  // reset cooldowns
  const resetCooldowns = Button({
    name: 'devtools-reset-cooldowns',
    text: 'Reset Cooldowns',
    width: 130,
    onClick: () => {
      // SendAddonMessage('dev-clear-inventory', '', 'WHISPER', Get().playerInfo.name)
      SendChatMessage(`.cooldown`)
    },
  })
  grid.fns.Attach(resetCooldowns)

  // reload ui
  const reload = Button({
    name: 'devtools-reload-ui',
    text: 'Reload UI',
    width: 130,
    onClick: () => ReloadUI(),
  })
  grid.fns.Attach(reload)

  // cheats
  // speed
  const speed = Checkbox({
    name: 'cheats-speed',
    text: 'x10 Speed',
    parent: d,
    onCheck: () => SendChatMessage('.mod speed 10'),
    onUncheck: () => SendChatMessage('.mod speed 1'),
  })
  speed.ref.SetPoint('TOPLEFT', 0, -2)
  // flight
  const flight = Checkbox({
    name: 'cheats-flight',
    text: 'Flying',
    parent: d,
    onCheck: () => SendChatMessage('.gm fly on'),
    onUncheck: () => SendChatMessage('.gm fly off'),
  })
  flight.ref.SetPoint('TOPLEFT', 0, -26)
  // god mode
  const godMode = Checkbox({
    name: 'cheats-godmode',
    text: 'God Mode',
    parent: d,
    onCheck: () => SendChatMessage('.cheat god on'),
    onUncheck: () => SendChatMessage('.cheat god off'),
  })
  godMode.ref.SetPoint('TOPLEFT', 0, -52)

  // note
  // const $ = Get()
  // const note = Textarea({
  //   name: 'devtools-note',
  //   parent: c,
  //   initial: $.store.Get('CHARACTER', 'devtools-note'),
  //   onAccept: note => {
  //     console.log(note)
  //     $.store.Set('CHARACTER', 'devtools-note', note)
  //   },
  // })
  // note.ref.SetPoint('TOPLEFT')

  return f
}
