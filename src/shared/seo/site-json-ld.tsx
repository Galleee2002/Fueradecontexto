import { SITE_NAME, SITE_URL } from '@/shared/config/site'

const graph = [
  {
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
  },
  {
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/productos?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  },
]

export function SiteJsonLd() {
  const json = {
    '@context': 'https://schema.org',
    '@graph': graph,
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  )
}
