import { CREATE_ITEM_TASK } from '../constants'
import { ItemOptions } from '../item'
import { createTemplates } from '../task'

export const ITEMS = createTemplates<ItemOptions>(CREATE_ITEM_TASK, [
  {
    id: 'lesser-health-potion',
    icon: { query: 'query-icon', subquery: 'item', id: 118 },
    name: 'Lesser Health Potion',
    base: 118,
    itemSpells: [
      {
        id: 'on-consume',
        spell: 'lesser-health-potion',
      },
    ],
  },

  {
    id: 'lesser-mana-potion',
    icon: { query: 'query-icon', subquery: 'item', id: 2455 },
    name: 'Lesser Mana Potion',
    base: 118,
    itemSpells: [
      {
        id: 'on-consume',
        spell: 'lesser-mana-potion',
      },
    ],
  },

  {
    id: 'lesser-rejuvenation-potion',
    icon: { query: 'query-icon', subquery: 'item', id: 2458 },
    name: 'Lesser Rejuvenation Potion',
    base: 118,
    itemSpells: [
      {
        id: 'on-consume',
        spell: 'lesser-rejuvenation-potion',
      },
    ],
  },

  {
    id: 'health-potion',
    icon: { query: 'query-icon', subquery: 'item', id: 929 },
    name: 'Lesser Health Potion',
    base: 118,
    itemSpells: [
      {
        id: 'on-consume',
        spell: 'health-potion',
      },
    ],
  },

  {
    id: 'mana-potion',
    icon: { query: 'query-icon', subquery: 'item', id: 3827 },
    name: 'Lesser Mana Potion',
    base: 118,
    itemSpells: [
      {
        id: 'on-consume',
        spell: 'mana-potion',
      },
    ],
  },

  {
    id: 'rejuvenation-potion',
    icon: { query: 'query-icon', subquery: 'item', id: 6048 },
    name: 'Lesser Rejuvenation Potion',
    base: 118,
    itemSpells: [
      {
        id: 'on-consume',
        spell: 'rejuvenation-potion',
      },
    ],
  },

  {
    id: 'greater-health-potion',
    icon: { query: 'query-icon', subquery: 'item', id: 32910 },
    name: 'Lesser Health Potion',
    base: 118,
    itemSpells: [
      {
        id: 'on-consume',
        spell: 'greater-health-potion',
      },
    ],
  },

  {
    id: 'greater-mana-potion',
    icon: { query: 'query-icon', subquery: 'item', id: 6149 },
    name: 'Lesser Mana Potion',
    base: 118,
    itemSpells: [
      {
        id: 'on-consume',
        spell: 'greater-mana-potion',
      },
    ],
  },

  {
    id: 'greater-rejuvenation-potion',
    icon: { query: 'query-icon', subquery: 'item', id: 20007 },
    name: 'Lesser Rejuvenation Potion',
    base: 118,
    itemSpells: [
      {
        id: 'on-consume',
        spell: 'greater-rejuvenation-potion',
      },
    ],
  },
])

