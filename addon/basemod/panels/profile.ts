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

  const a = Section({
    name: 'name',
    title: 'Name',
    parent: scroll,
    height: 40,
  })

  const b = Section({
    name: 'PlayerStatus',
    title: 'Character Level',
    parent: scroll,
    // previous: a,
    height: 50,
  })

  return f
}

