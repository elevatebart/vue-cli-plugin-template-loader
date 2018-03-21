jest.setTimeout(20000)

const create = require('@vue/cli-test-utils/createTestProject')
const path = require('path')

test('mocha no sfc', async () => {
  const project = await create('ts-unit-mocha-no-sfc', {
    plugins: {
      '@vue/cli-plugin-typescript': {},
      '@vue/cli-plugin-unit-mocha': {},
      'vue-cli-plugin-template-loader': {}
    }
  })
  await project.run(`vue-cli-service test`)
})

test('jest no sfc', async () => {
  const project = await create('ts-unit-jest-no-sfc', {
    plugins: {
      '@vue/cli-plugin-typescript': {},
      '@vue/cli-plugin-unit-jest': {},
      'vue-cli-plugin-template-loader': {}
    }
  })
  await project.run(`vue-cli-service test`)
})
