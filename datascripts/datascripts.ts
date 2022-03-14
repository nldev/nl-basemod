import { Builder } from './basemod'

const $ = new Builder()

$.ProcessMany<string>({
  id: 'hello',
  list: [
    'hello',
    'world',
    'what',
  ],
})

const thing = $.Get<TSSpell>('spells', 'fireball')

$.Process<{ thing: string }>({
  id: 'hello',
  data: { thing: 'hello' },
})

