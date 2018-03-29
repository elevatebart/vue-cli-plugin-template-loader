---
extend: '@vue/cli-plugin-typescript/generator/template/src/shims.d.ts'
replace: !!js/regexp /declare module '\*\.vue' \{[^]*?\}/
---
<%# REPLACE %>
declare module '*.html' {
    import Vue, { ComponentOptions } from 'vue'
    interface WithRender {
      <V extends Vue>(options: ComponentOptions<V>): ComponentOptions<V>
      <V extends typeof Vue>(component: V): V
    }
    const withRender: WithRender
    export default withRender
}
  
declare module '*.css' {
    import Vue, { ComponentOptions } from 'vue'
    interface WithRender {
      <V extends Vue>(options: ComponentOptions<V>): ComponentOptions<V>
      <V extends typeof Vue>(component: V): V
    }
    const withRender: WithRender
    export default withRender
}
<%# END_REPLACE %>