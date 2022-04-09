// ## poc
// - name (input)
// - player status (input)
// - character status (input)
// - about (markdown)
// - class (input)
import { Component, Frame, Get } from '../app'
import { Scroll } from '../components/scroll'
import { Section } from '../components/section'
import { Button } from '../components/button'
import { Counter } from '../components/counter'
import { Grid } from '../components/grid'
import { Checkbox } from '../components/checkbox'

export const Profile: Component = options => {
  const f = Frame({ name: 'profile', ...options })
  f.ref.SetSize(290, 360)
  f.ref.SetPoint('CENTER')

  const scroll = Scroll({ name: 'profile-scroll', parent: f, height: 300 })

  // name
  const name = Section({
    name: 'name',
    title: 'Name',
    parent: scroll,
    height: 50,
  })

  // class
  const cls = Section({
    name: 'class',
    title: 'Class',
    parent: scroll,
    previous: name,
    height: 50,
  })

  // player-status
  const playerStatus = Section({
    name: 'player-status',
    title: 'Player Status',
    parent: scroll,
    previous: cls,
    height: 50,
  })

  // character-status
  const characterStatus = Section({
    name: 'character-status',
    title: 'Character Status',
    parent: scroll,
    previous: playerStatus,
    height: 50,
  })

  // about
  const about = Section({
    name: 'about',
    title: 'About',
    parent: scroll,
    previous: characterStatus,
    height: 50,
  })

  return f
}

