import { BASE_MOUNT_SPEED, CREATE_MOUNT_TASK, QUERY_ICON, QUERY_MOUNT_NPC } from '../constants'
import { createTemplates } from '../task'
import { MountOptions } from '../tasks/create-mount'

export const MOUNTS = createTemplates<MountOptions>(CREATE_MOUNT_TASK, [
  {
    name: 'Black Horse',
    icon: { query: QUERY_ICON, subquery: 'SPELL', id: 472 },
    npc: { query: QUERY_MOUNT_NPC, subquery: 'SPELL', id: 470 },
    speed: BASE_MOUNT_SPEED,
  },

  {
    name: 'White Horse',
    icon: { query: QUERY_ICON, subquery: 'SPELL', id: 472 },
    npc: { query: QUERY_MOUNT_NPC, subquery: 'SPELL', id: 16083 },
    speed: BASE_MOUNT_SPEED,
  },

  {
    name: 'Pinto Horse',
    icon: { query: QUERY_ICON, subquery: 'SPELL', id: 472 },
    npc: { query: QUERY_MOUNT_NPC, subquery: 'SPELL', id: 472 },
    speed: BASE_MOUNT_SPEED,
  },

  {
    name: 'Brown Horse',
    icon: { query: QUERY_ICON, subquery: 'SPELL', id: 472 },
    npc: { query: QUERY_MOUNT_NPC, subquery: 'SPELL', id: 458 },
    speed: BASE_MOUNT_SPEED,
  },

  {
    name: 'Chestnut Horse',
    icon: { query: QUERY_ICON, subquery: 'SPELL', id: 472 },
    npc: { query: QUERY_MOUNT_NPC, subquery: 'SPELL', id: 6648 },
    speed: BASE_MOUNT_SPEED,
  },

  {
    name: 'Palomino Horse',
    icon: { query: QUERY_ICON, subquery: 'SPELL', id: 472 },
    npc: { query: QUERY_MOUNT_NPC, subquery: 'SPELL', id: 16082 },
    speed: BASE_MOUNT_SPEED,
  },

  {
    name: 'Battlestrider',
    icon: { query: QUERY_ICON, subquery: 'SPELL', id: 23223 },
    npc: { query: QUERY_MOUNT_NPC, subquery: 'SPELL', id: 63638 },
    duration: [5],
    speed: 1000,
  },

  {
    name: 'Superstrider',
    icon: { query: QUERY_ICON, subquery: 'SPELL', id: 23223 },
    npc: { query: QUERY_MOUNT_NPC, subquery: 'SPELL', id: 23223 },
    duration: [5],
    speed: 2000,
  },

  {
    name: 'Ultrastrider',
    icon: { query: QUERY_ICON, subquery: 'SPELL', id: 23223 },
    npc: { query: QUERY_MOUNT_NPC, subquery: 'SPELL', id: 22719 },
    duration: [5],
    speed: 3000,
  },

  {
    name: 'Magic Rooster',
    icon: { query: QUERY_ICON, subquery: 'ITEM', id: 11110 },
    npc: { query: QUERY_MOUNT_NPC, subquery: 'SPELL', id: 65917 },
    flightSpeed: 0,
    duration: [5],
    isCannotUseInCombat: false,
    isOutdoorsOnly: false,
  },

  {
    name: 'Riding Turtle',
    npc: { query: QUERY_MOUNT_NPC, subquery: 'SPELL', id: 30174 },
    duration: [0, 10],
    swimSpeed: 150,
  },

  {
    name: 'Sea Turtle',
    npc: { query: QUERY_MOUNT_NPC, subquery: 'SPELL', id: 64731 },
    duration: [0, 10],
    swimSpeed: 300,
  },

  {
    name: 'Flying Machine',
    npc: { query: QUERY_MOUNT_NPC, subquery: 'SPELL', id: 44153 },
    duration: [0, 10],
    speed: 40,
    flightSpeed: 40,
  },

  {
    name: 'Bronze Drake',
    npc: { query: QUERY_MOUNT_NPC, subquery: 'SPELL', id: 59569 },
    duration: [0, 10],
    speed: 100,
    flightSpeed: 300,
  },

  {
    name: 'Blue Drake',
    npc: { query: QUERY_MOUNT_NPC, subquery: 'SPELL', id: 59568 },
    duration: [0, 10],
    speed: 100,
    flightSpeed: 300,
  },

  {
    name: 'Red Drake',
    npc: { query: QUERY_MOUNT_NPC, subquery: 'SPELL', id: 59570 },
    duration: [0, 10],
    speed: 100,
    flightSpeed: 300,
  },

  {
    name: 'White Drake',
    npc: { query: QUERY_MOUNT_NPC, subquery: 'SPELL', id: 60025 },
    duration: [0, 10],
    speed: 100,
    flightSpeed: 300,
  },

  {
    name: 'Black Drake',
    npc: { query: QUERY_MOUNT_NPC, subquery: 'SPELL', id: 59650 },
    duration: [0, 10],
    speed: 100,
    flightSpeed: 300,
  },

  {
    name: 'Green Drake',
    npc: 27692,
    duration: [0, 10],
    speed: 100,
    flightSpeed: 300,
  },
])
