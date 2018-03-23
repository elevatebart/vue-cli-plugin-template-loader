jest.setTimeout(20000)

const create = require('@vue/cli-test-utils/createTestProject')
const path = require('path')
const cwd = path.resolve(__dirname, '../../../test')

async function createAndInstall (name, options) {
  const project = await create(
    name,
    {
      plugins: {
        '@vue/cli-plugin-typescript': options
      }
    },
    cwd
  )
  // mock install
  const pkg = JSON.parse(await project.read('package.json'))
  pkg.devDependencies['vue-cli-plugin-template-loader'] = '*'
  await project.write('package.json', JSON.stringify(pkg, null, 2))
  return project
}

xtest('invoke check tsconfig', async () => {
  const project = await createAndInstall(`invoke`, {})
  await project.run(`${require.resolve('@vue/cli/bin/vue')} invoke vue-cli-plugin-template-loader`)
  expect(JSON.parse(await project.read('tsconfig.json')).include).toBeUndefined()
})

test('invoke with classComponent', async () => {
  const project = await createAndInstall(`invoke-classComponent`, { classComponent: true })
  await project.run(`${require.resolve('@vue/cli/bin/vue')} invoke vue-cli-plugin-template-loader`)
})
