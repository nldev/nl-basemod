import { Task } from '.'

export interface SpellOptions {}

export interface CreateSpellOptions {
  foo: 'bar'
  bar: 'baz'
  baz: 'hello'
}

export const CreateSpell: Task<SpellOptions, CreateSpellOptions> = {
  id: 'create-spell',
  setup: ($, options) => {
  },
  process: ($, template, options) => {
  },
}

