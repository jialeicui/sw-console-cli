import { program } from 'commander'
import { getVersion } from './utils'
import { create } from './create'
import { build } from './build'

export const execute = () => {
    program.option('-v', 'Cli Version').action(() => {
        console.log(getVersion())
    })

    program
        .command('create')
        .description('Create plugin')
        .option('--template <string>', 'Template url (optional)')
        .action(create)

    program.command('build').description('Build plugin').action(build)

    program.parse(process.argv)
}
