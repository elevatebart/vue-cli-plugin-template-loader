jest.setTimeout(20000)

const create = require('@vue/cli-test-utils/createTestProject')
const path = require('path')
const cwd = path.resolve(__dirname, '../../../test')

async function createAndInstall (name, options) {
  const project = await create(
    name,
    {
      plugins: {
        '@vue/cli-plugin-typescript': options,
        '@vue/cli-plugin-unit-mocha': {}
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

describe('invoke', () => {
  test('tsconfig should have no types', async () => {
    const project = await createAndInstall(`invoke-tsconfig`, {})
    await project.run(`${require.resolve('@vue/cli/bin/vue')} invoke vue-cli-plugin-template-loader`)
    expect(JSON.parse(await project.read('tsconfig.json')).include).toBeUndefined()
  })

  test('HelloWorld.vue should become HelloWorld/index.ts', async () => {
    const project = await createAndInstall(`invoke-vuefile`, {})
    expect(project.has('src/components/HelloWorld.vue')).toBe(true)
    await project.run(`${require.resolve('@vue/cli/bin/vue')} invoke vue-cli-plugin-template-loader`)
    expect(project.has('src/components/HelloWorld.vue')).toBe(false)
    expect(project.has('src/components/HelloWorld/index.ts')).toBe(true)
  })
})

describe('invoke with classComponent', () => {
  test('invoke with classComponent', async () => {
    const project = await createAndInstall(`invoke-class-component`, { classComponent: true })
    await project.run(`${require.resolve('@vue/cli/bin/vue')} invoke vue-cli-plugin-template-loader`)
  })
})
