import { ModifierOptions } from './tasks/create-modifier'

export const sql = {
  modifiers: {
    command: {
      init () {
        return `
          create table if not exists noworld_modifiers (
            Id int not null auto_increment primary key,
            Modifier int not null,
            Modified int not null,
            Effect tinyint not null,
            Flags int
          );
        `
      },

      insert (options: ModifierOptions) {
        return `
          insert into noworld_modifiers (Modifier, Modified, Effect, Flags)
          values (
            ${options.modifier},
            ${options.modified},
            ${options.effect || 0},
            ${options.flags || 0}
          );
        `
      },

      clean () {
        return `drop table noworld_modifiers;`
      },
    },
    query: {
      one (options: ModifierOptions) {
        return `
          select * from noworld_modifiers where
            Modifier = ${options.modifier}
            and Modified = ${options.modified}
            and Effect = ${options.effect};
        `
      },
    },
  },
}
