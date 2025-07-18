import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {schemaTypes} from './schemas'

// Custom structure for better post management
const structure = (S) =>
  S.list()
    .title('Content Management')
    .items([
      // Posts organized by status for easy review workflow
      S.listItem()
        .title('📝 Posts by Status')
        .child(
          S.list()
            .title('Posts by Status')
            .items([
              S.listItem()
                .title('🔍 Pending Review')
                .child(
                  S.documentList()
                    .title('Posts Pending Review')
                    .filter('_type == "post" && status == "pending"')
                    .defaultOrdering([{field: 'submittedAt', direction: 'desc'}])
                ),
              S.listItem()
                .title('📄 Drafts')
                .child(
                  S.documentList()
                    .title('Draft Posts')
                    .filter('_type == "post" && status == "draft"')
                    .defaultOrdering([{field: '_createdAt', direction: 'desc'}])
                ),
              S.listItem()
                .title('✅ Published')
                .child(
                  S.documentList()
                    .title('Published Posts')
                    .filter('_type == "post" && status == "published"')
                    .defaultOrdering([{field: 'publishedAt', direction: 'desc'}])
                ),
            ])
        ),

      // All posts view
      S.listItem()
        .title('📚 All Posts')
        .child(
          S.documentList()
            .title('All Blog Posts')
            .filter('_type == "post"')
            .defaultOrdering([{field: '_createdAt', direction: 'desc'}])
        ),

      // Authors section
      S.listItem()
        .title('👥 Authors')
        .child(
          S.documentList()
            .title('Authors')
            .filter('_type == "author"')
        ),

      // Divider
      S.divider(),

      // All other document types
      ...S.documentTypeListItems().filter(
        (listItem) => !['post', 'author'].includes(listItem.getId())
      ),
    ])

export default defineConfig({
  name: 'phil-insights-studio',
  title: 'Phil Insights Studio',

  projectId: 'l4fw3vb6',
  dataset: 'production',

  plugins: [
    structureTool({
      structure,
    }),
  ],

  schema: {
    types: schemaTypes,
  },
})
