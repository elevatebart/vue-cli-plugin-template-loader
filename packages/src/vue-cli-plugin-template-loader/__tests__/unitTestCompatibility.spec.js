jest.setTimeout(20000)

const create = require('@vue/cli-test-utils/createTestProject')
const path = require('path')
const cwd = path.resolve(__dirname, '../../../../test')

test('mocha', async () => {
  const project = await create(
    'ts-unit-mocha',
    {
      plugins: {
        '@vue/cli-plugin-typescript': {},
        '@vue/cli-plugin-unit-mocha': {},
        'vue-cli-plugin-template-loader': {}
      }
    },
    cwd
  )
  await project.run(`vue-cli-service test`)
})

test('mocha with class-component', async () => {
  const project = await create(
    'ts-unit-mocha-class-component',
    {
      plugins: {
        '@vue/cli-plugin-typescript': { classComponent: true },
        '@vue/cli-plugin-unit-mocha': {},
        'vue-cli-plugin-template-loader': {}
      }
    },
    cwd
  )
  await project.run(`vue-cli-service test`)
})

// for now not compatible with jest
xtest('jest', async () => {
  const project = await create(
    'ts-unit-jest',
    {
      plugins: {
        '@vue/cli-plugin-typescript': {},
        '@vue/cli-plugin-unit-jest': {},
        'vue-cli-plugin-template-loader': {}
      }
    },
    cwd
  )
  await project.run(`vue-cli-service test`)
})
