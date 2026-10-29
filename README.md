# Yeganeh Heshmat — Portfolio

A Next.js portfolio built as a fully static site.

## Development

```sh
npm run dev
```

## Languages

English pages live under `/en/` and Persian pages under `/fa/`, for example
`/en/about/`, `/fa/about/`, and `/fa/projects/bilit4u/`. The root `/` redirects
to `/en/`. Both locale trees are generated during static export; no middleware
or server is required. Persian pages use `lang="fa"` and `dir="rtl"`.

Routes share components in `app/[locale]/`. Add translated interface copy to
`messages/en.json` and `messages/fa.json`, then read it in components with
`useTranslations('Namespace')` from `next-intl`. For example,
`const t = useTranslations('Nav')` and `t('about')` display the current language.
Import `Link` and `useRouter` from `@/i18n/navigation` for internal navigation
so the locale stays in the URL. The menu language switcher keeps the same page.

Homepage copy, navigation, contact content, and primary about-page labels have
translations. Detailed project case studies and draft work experience descriptions
retain their existing English content until Persian copy is supplied.

Image descriptions are localized in the `Images` namespace of both message files.
Use `useTranslations('Images')` for meaningful image alt text; for example,
`alt={images('portrait')}`. Project preview, product interface, design evolution,
and UX diagram descriptions live under `Images.projects.<slug>`. Each rendered
image has one alt value in the current language. Decorative artwork and icons
whose meaning is already given by nearby text keep `alt=""`.

## Build and preview

```sh
npm run build
npm start
```

The build generates pre-rendered HTML for all pages in `out/`, including every
project returned by `generateStaticParams`. Unknown project slugs return 404.
`npm start` serves the exported files locally at http://localhost:3000; set `PORT`
to change the preview port. It is a local preview server, not a production server.

## Deployment

Deploy the contents of `out/` to a static host or CDN. Use `npm run build` as the
build command and `out` as the publish directory. No Node.js runtime or Next.js
image optimization endpoint is needed in production. Configure the host to serve
directory `index.html` files and use `404.html` for missing pages. Do not configure
an SPA fallback that sends every unknown URL to the homepage.

Content changes and new projects require a rebuild and deployment. Animations,
sliders, and responsive interactions hydrate in the browser after the initial
HTML loads.

## Media

CDN images and videos are fetched by the browser independently of page generation.
`next/image` uses `lib/imagekit-loader.ts` to request resized ImageKit images
directly from the CDN, preserving existing URL query parameters. Existing
`picture`, `img`, and other media URLs continue to load directly as authored.
CDN media updates follow the provider's cache rules; use a new URL or version
parameter when replacing cached assets.

The existing `next/font/google` font requires network access during builds.

## Cloudflare caching

Deploy `out/` to Cloudflare Pages or Workers Static Assets. `public/_headers` is
copied to `out/_headers` during the build; Cloudflare applies these response headers:

- Pages and project navigation payloads: browser storage with revalidation on reuse
  (`max-age=0, must-revalidate`). Cloudflare manages its static asset edge cache.
- Hashed JS, CSS, and generated fonts under `/_next/static/`: one year, immutable.
- Local fonts under `/fonts/`: seven days, then revalidate.
- Local images, SVGs, and favicons: one day, then revalidate.

Only hashed build files are immutable. For immediate updates to a local image or
font before its TTL expires, change its filename or version its URL.

ImageKit URLs belong to a different host: their cache headers are controlled by
ImageKit, not this site's `_headers`. Keep the existing stable/versioned CDN URLs
so browsers can reuse media; replace the URL/version when changing an asset.

The local preview server does not emulate Cloudflare headers. Verify the deployed
site's response headers after deployment. These rules do not alter animation
code, event listeners, hydration, slider state, or video playback.
