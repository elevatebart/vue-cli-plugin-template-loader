const sfcSplitter = require('../sfcSplitter')
describe('sfcSplitter', () => {
  let sut
  describe('simple', () => {
    beforeEach(() => {
      const template = `<template>
    <div>this is a template</div>
</template>
<script>
export default {
    data: () => {}
}
</script>
<style>
.myClass{ 
    color: white;
}
</style>`
      sut = sfcSplitter(template)
    })
    it('should extract the template', async () => {
      expect(sut.template).toEqual('<div>this is a template</div>')
    })

    it('should extract the script', async () => {
      expect(sut.script)
        .toEqual(`import WithRender from './template.html?style=./style.css'

export default WithRender({
    data: () => {}
}
)`)
    })

    it('should extract the style', async () => {
      expect(sut.style).toEqual(
        `.myClass{ 
    color: white;
}`
      )
    })
  })

  describe('languages', () => {
    beforeEach(() => {
      const template = `<template lang="pug">
    div this is a template
</template>
<script lang="ts">
export default Vue.extend({
    data: () => {}
})
</script>
<style lang="scss">
.myClass{ 
    color: white;
}
</style>`
      sut = sfcSplitter(template)
    })
    it('should extract the template', async () => {
      expect(sut.template).toEqual('div this is a template')
      expect(sut.templateExt).toEqual('pug')
    })

    it('should extract the script', async () => {
      expect(sut.script)
        .toEqual(`import WithRender from './template.pug?style=./style.scss'

export default WithRender({
    data: () => {}
})`)
      expect(sut.scriptExt).toEqual('ts')
    })

    it('should extract the style', async () => {
      expect(sut.styleExt).toEqual('scss')
      expect(sut.style).toEqual(`.myClass{ 
    color: white;
}`)
    })
  })

  describe('classComponent', () => {
    it('should render scripts with the @WithRender if classComponent in typescript', () => {
      const template = `<template>
    <div>this is a template</div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-class-component';

@Component
export default class Comp extends Vue {
    test: string
}
</script>
<style>
.myClass{ 
    color: white;
}
</style>`

      sut = sfcSplitter(template, true)
      expect(sut.script).toEqual(
        `import WithRender from './template.html?style=./style.css'

import { Component, Vue } from 'vue-class-component';

@Component
@WithRender
export default class Comp extends Vue {
    test: string
}`
      )
    })

    it('should render scripts with the @WithRender if classComponent in javascript with babel', () => {
      const template = `<template>
    <div>this is a template</div>
</template>
<script>
import { Component, Vue } from 'vue-class-component';

@Component
export default class test extend Vue {
    data: () => {}
}
</script>
<style>
.myClass{ 
    color: white;
}
</style>`
      sut = sfcSplitter(template, true)
      expect(sut.script)
        .toEqual(`import WithRender from './template.html?style=./style.css'

import { Component, Vue } from 'vue-class-component';

@Component
@WithRender
export default class test extend Vue {
    data: () => {}
}`)
    })

    it('should render scripts with the @WithRender if classComponent with extra component', () => {
      const template = `<template>
    <div>this is a template</div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-class-component';
import HelloWorld from '../HelloWorld'

@Component({
    components: {
        HelloWorld,
    }
})
export default class Comp extends Vue {
    test: string
}
</script>`

      sut = sfcSplitter(template, true)
      expect(sut.script).toEqual(
        `import WithRender from './template.html'

import { Component, Vue } from 'vue-class-component';
import HelloWorld from '../HelloWorld'

@Component({
    components: {
        HelloWorld,
    }
})
@WithRender
export default class Comp extends Vue {
    test: string
}`
      )
    })
  })
})
