import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {schemaTypes} from './schemas'

export default defineConfig({
  name: 'lanfintech-studio',
  title: 'Lanfintech Studio',

  projectId: 'l4fw3vb6',
  dataset: 'production',

  plugins: [structureTool()],

  schema: {
    types: schemaTypes,
  },
})
