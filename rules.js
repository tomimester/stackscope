// Technology catalog + rules that run on data only the extension can see
// (HTTP response headers and cookies).
//
// TECH: name -> { cat, implies?, desc? }
//   cat      which category it belongs to (decides the section in the popup)
//   implies  other technologies it brings along (WordPress -> PHP + MySQL)
//   desc     one-liner shown when evidence is on

const TECH = {
  // ---- CMS / platforms ----
  'WordPress': { cat: 'CMS', implies: ['PHP', 'MySQL / MariaDB'], desc: 'Open-source CMS written in PHP — runs ~40% of all websites' },
  'WooCommerce': { cat: 'E-commerce', implies: ['WordPress'], desc: 'E-commerce plugin for WordPress' },
  'Elementor': { cat: 'CMS', implies: ['WordPress'], desc: 'Drag-and-drop page builder plugin for WordPress' },
  'Drupal': { cat: 'CMS', implies: ['PHP'], desc: 'Open-source PHP CMS, popular with governments & universities' },
  'Joomla': { cat: 'CMS', implies: ['PHP', 'MySQL / MariaDB'], desc: 'Open-source PHP CMS' },
  'Ghost': { cat: 'CMS', implies: ['Node.js'], desc: 'Publishing / newsletter CMS built on Node.js' },
  'TYPO3': { cat: 'CMS', implies: ['PHP'], desc: 'Enterprise PHP CMS, big in German-speaking countries' },
  'Craft CMS': { cat: 'CMS', implies: ['PHP'], desc: 'PHP CMS built on the Yii framework' },
  'Blogger': { cat: 'CMS', desc: "Google's hosted blogging platform" },
  'Shopify': { cat: 'E-commerce', desc: 'Hosted e-commerce platform (SaaS) — the shop owner runs no server' },
  'Magento': { cat: 'E-commerce', implies: ['PHP', 'MySQL / MariaDB'], desc: 'Open-source PHP e-commerce platform (Adobe Commerce)' },
  'PrestaShop': { cat: 'E-commerce', implies: ['PHP', 'MySQL / MariaDB'], desc: 'Open-source PHP e-commerce platform' },
  'Wix': { cat: 'Site builder', desc: 'Hosted drag-and-drop website builder (SaaS)' },
  'Squarespace': { cat: 'Site builder', desc: 'Hosted website builder (SaaS)' },
  'Webflow': { cat: 'Site builder', desc: 'Visual, designer-focused website builder (SaaS)' },
  'Framer': { cat: 'Site builder', implies: ['React'], desc: 'Design-tool-turned-site-builder; sites are React under the hood' },
  'Weebly': { cat: 'Site builder', desc: 'Hosted website builder (owned by Square)' },

  // ---- Static site generators ----
  'Hugo': { cat: 'Static site generator', desc: 'Static site generator written in Go — HTML is pre-built, no backend at runtime' },
  'Jekyll': { cat: 'Static site generator', desc: 'Ruby static site generator, the default for GitHub Pages' },
  'Eleventy': { cat: 'Static site generator', desc: 'JavaScript static site generator' },
  'Hexo': { cat: 'Static site generator', desc: 'Node.js static blog generator' },
  'MkDocs': { cat: 'Static site generator', desc: 'Python static generator for documentation' },
  'Docusaurus': { cat: 'Static site generator', implies: ['React'], desc: "Meta's React-based documentation site generator" },
  'VitePress': { cat: 'Static site generator', implies: ['Vue.js'], desc: 'Vue-based documentation site generator' },
  'VuePress': { cat: 'Static site generator', implies: ['Vue.js'], desc: 'Vue-based documentation site generator' },

  // ---- Headless CMS ----
  'Contentful': { cat: 'Headless CMS', desc: 'API-first headless CMS — content delivered as JSON' },
  'Sanity': { cat: 'Headless CMS', desc: 'Headless CMS with real-time content API' },
  'Prismic': { cat: 'Headless CMS', desc: 'Headless CMS' },
  'Storyblok': { cat: 'Headless CMS', desc: 'Headless CMS with a visual editor' },

  // ---- Frontend: meta-frameworks ----
  'Next.js': { cat: 'Meta-framework', implies: ['React', 'Node.js'], desc: 'React framework by Vercel: routing, server rendering, API routes' },
  'Nuxt': { cat: 'Meta-framework', implies: ['Vue.js', 'Node.js'], desc: 'Vue framework: routing, server rendering — the "Next.js of Vue"' },
  'Remix': { cat: 'Meta-framework', implies: ['React'], desc: 'Full-stack React framework (now merged into React Router)' },
  'React Router': { cat: 'Meta-framework', implies: ['React'], desc: 'Routing library / full-stack framework for React' },
  'Gatsby': { cat: 'Meta-framework', implies: ['React'], desc: 'React-based static site framework' },
  'SvelteKit': { cat: 'Meta-framework', implies: ['Svelte'], desc: 'Svelte framework: routing + server rendering' },
  'Astro': { cat: 'Meta-framework', desc: 'Content-focused framework — ships mostly static HTML, little JS' },
  'Qwik': { cat: 'Meta-framework', desc: 'Resumable framework that ships near-zero JS on load' },

  // ---- Frontend: UI frameworks ----
  'React': { cat: 'JavaScript framework', desc: "Meta's component-based UI library — the most popular frontend choice" },
  'Vue.js': { cat: 'JavaScript framework', desc: 'Progressive, approachable component framework' },
  'Angular': { cat: 'JavaScript framework', desc: "Google's full-featured TypeScript framework" },
  'AngularJS': { cat: 'JavaScript framework', desc: 'Angular 1.x — the legacy predecessor of Angular' },
  'Svelte': { cat: 'JavaScript framework', desc: 'Compiler-based UI framework — no virtual DOM' },
  'Preact': { cat: 'JavaScript framework', desc: 'Tiny 3 kB React alternative with the same API' },
  'Ember.js': { cat: 'JavaScript framework', desc: 'Opinionated SPA framework' },
  'Backbone.js': { cat: 'JavaScript framework', desc: 'Early (2010) MVC library for single-page apps' },

  // ---- Frontend: libraries & CSS ----
  'jQuery': { cat: 'JavaScript library', desc: 'Classic DOM-manipulation library (2006)' },
  'Alpine.js': { cat: 'JavaScript library', desc: 'Lightweight library for sprinkling interactivity into HTML' },
  'htmx': { cat: 'JavaScript library', desc: 'HTML attributes that fetch & swap server-rendered HTML' },
  'Hotwire Turbo': { cat: 'JavaScript library', desc: 'HTML-over-the-wire navigation, from the Rails world' },
  'Turbolinks': { cat: 'JavaScript library', desc: 'Predecessor of Turbo, from the Rails world' },
  'Stimulus': { cat: 'JavaScript library', desc: 'Modest JS framework from the Rails world' },
  'Inertia.js': { cat: 'JavaScript library', desc: 'Glue between a server framework (often Laravel) and React/Vue' },
  'Livewire': { cat: 'JavaScript library', implies: ['Laravel'], desc: 'Laravel package for reactive UIs written in PHP' },
  'Tailwind CSS': { cat: 'UI / CSS framework', desc: 'Utility-first CSS framework (class="bg-blue-500 p-4")' },
  'Bootstrap': { cat: 'UI / CSS framework', desc: 'Component CSS framework, originally from Twitter' },

  // ---- Backend frameworks ----
  'Laravel': { cat: 'Backend framework', implies: ['PHP'], desc: 'The most popular PHP web framework' },
  'Symfony': { cat: 'Backend framework', implies: ['PHP'], desc: 'Enterprise PHP framework' },
  'CodeIgniter': { cat: 'Backend framework', implies: ['PHP'], desc: 'Lightweight PHP framework' },
  'Ruby on Rails': { cat: 'Backend framework', implies: ['Ruby'], desc: 'Convention-over-configuration Ruby framework (GitHub, Shopify, Basecamp)' },
  'Django': { cat: 'Backend framework', implies: ['Python'], desc: '"Batteries included" Python web framework (Instagram)' },
  'Flask': { cat: 'Backend framework', implies: ['Python'], desc: 'Minimal Python web framework' },
  'Express': { cat: 'Backend framework', implies: ['Node.js'], desc: 'Minimal web framework for Node.js' },
  'ASP.NET': { cat: 'Backend framework', implies: ['.NET (C#)'], desc: "Microsoft's web framework" },
  'Blazor': { cat: 'Backend framework', implies: ['ASP.NET'], desc: 'Microsoft framework for building web UIs in C#' },
  'Phoenix LiveView': { cat: 'Backend framework', implies: ['Elixir'], desc: 'Real-time server-rendered UIs in Elixir' },

  // ---- Languages & runtimes ----
  'PHP': { cat: 'Programming language', desc: 'Server-side scripting language' },
  'Python': { cat: 'Programming language', desc: 'General-purpose language, popular for web backends & data' },
  'Ruby': { cat: 'Programming language', desc: 'Dynamic language, best known through Rails' },
  'Java': { cat: 'Programming language', desc: 'JVM language, common in enterprise backends' },
  '.NET (C#)': { cat: 'Programming language', desc: "Microsoft's platform / C# language" },
  'Elixir': { cat: 'Programming language', desc: 'Functional language on the Erlang VM' },
  'Node.js': { cat: 'Runtime', desc: 'JavaScript on the server' },

  // ---- Databases / BaaS ----
  'MySQL / MariaDB': { cat: 'Database', desc: 'Relational SQL database — the classic "LAMP" stack database' },
  'PostgreSQL': { cat: 'Database', desc: 'Advanced open-source relational SQL database' },
  'Firebase': { cat: 'Backend-as-a-Service', desc: "Google's backend-as-a-service: NoSQL DB (Firestore), auth, hosting" },
  'Supabase': { cat: 'Backend-as-a-Service', implies: ['PostgreSQL'], desc: 'Open-source Firebase alternative built on PostgreSQL' },

  // ---- Web servers ----
  'Nginx': { cat: 'Web server', desc: 'Fast web server / reverse proxy' },
  'Apache': { cat: 'Web server', desc: 'The classic web server (the "A" in LAMP)' },
  'IIS': { cat: 'Web server', implies: ['Windows Server'], desc: "Microsoft's web server" },
  'LiteSpeed': { cat: 'Web server', desc: 'Apache-compatible web server, common on shared hosting' },
  'Caddy': { cat: 'Web server', desc: 'Web server with automatic HTTPS, written in Go' },
  'OpenResty': { cat: 'Web server', desc: 'Nginx + Lua scripting' },
  'Gunicorn': { cat: 'Web server', implies: ['Python'], desc: 'Python application server' },
  'Uvicorn': { cat: 'Web server', implies: ['Python'], desc: 'Async Python server (FastAPI, Starlette)' },
  'Werkzeug': { cat: 'Web server', implies: ['Python'], desc: "Python dev server — usually Flask's" },
  'Kestrel': { cat: 'Web server', implies: ['.NET (C#)'], desc: 'ASP.NET Core built-in web server' },
  'Apache Tomcat': { cat: 'Web server', implies: ['Java'], desc: 'Java servlet container' },
  'Jetty': { cat: 'Web server', implies: ['Java'], desc: 'Java web server' },
  'Puma': { cat: 'Web server', implies: ['Ruby'], desc: 'Ruby application server (Rails default)' },
  'Phusion Passenger': { cat: 'Web server', desc: 'App server for Ruby, Python and Node.js' },
  'Envoy': { cat: 'Web server', desc: 'Cloud-native proxy, often in Kubernetes setups' },
  'Varnish': { cat: 'Web server', desc: 'HTTP caching proxy' },

  // ---- Operating systems ----
  'Ubuntu': { cat: 'Operating system' },
  'Debian': { cat: 'Operating system' },
  'CentOS': { cat: 'Operating system' },
  'Red Hat': { cat: 'Operating system' },
  'Windows Server': { cat: 'Operating system' },

  // ---- Hosting / CDN ----
  'Cloudflare': { cat: 'CDN', desc: 'CDN, DDoS protection & reverse proxy in front of ~20% of the web' },
  'Amazon CloudFront': { cat: 'CDN', desc: "AWS's CDN" },
  'Fastly': { cat: 'CDN', desc: 'Edge CDN (GitHub, Reddit, NYTimes)' },
  'Akamai': { cat: 'CDN', desc: 'One of the oldest & largest CDNs' },
  'Bunny.net': { cat: 'CDN', desc: 'Budget-friendly European CDN' },
  'Vercel': { cat: 'Hosting / PaaS', desc: 'Frontend cloud from the makers of Next.js' },
  'Netlify': { cat: 'Hosting / PaaS', desc: 'Hosting for static sites & Jamstack apps' },
  'GitHub Pages': { cat: 'Hosting / PaaS', desc: 'Free static hosting from GitHub' },
  'Heroku': { cat: 'Hosting / PaaS', desc: 'Classic platform-as-a-service' },
  'Fly.io': { cat: 'Hosting / PaaS', desc: 'Runs app containers close to users' },
  'Render': { cat: 'Hosting / PaaS', desc: 'Modern platform-as-a-service' },
  'Railway': { cat: 'Hosting / PaaS', desc: 'Platform-as-a-service' },
  'AWS': { cat: 'Hosting / PaaS', desc: 'Amazon Web Services' },
  'Amazon S3': { cat: 'Hosting / PaaS', desc: 'AWS object storage, often serving static sites' },
  'Google Cloud': { cat: 'Hosting / PaaS', desc: "Google's cloud platform" },
  'Microsoft Azure': { cat: 'Hosting / PaaS', desc: "Microsoft's cloud platform" },
  'WP Engine': { cat: 'Hosting / PaaS', implies: ['WordPress'], desc: 'Managed WordPress hosting' },
  'Kinsta': { cat: 'Hosting / PaaS', implies: ['WordPress'], desc: 'Managed WordPress hosting' },

  // ---- Analytics & services ----
  'Google Analytics': { cat: 'Analytics' },
  'Google Tag Manager': { cat: 'Tag manager' },
  'Meta Pixel': { cat: 'Analytics', desc: 'Facebook/Instagram ad tracking' },
  'Hotjar': { cat: 'Analytics', desc: 'Heatmaps & session recordings' },
  'Microsoft Clarity': { cat: 'Analytics', desc: 'Free heatmaps & session recordings' },
  'Plausible': { cat: 'Analytics', desc: 'Privacy-friendly analytics' },
  'Segment': { cat: 'Analytics', desc: 'Customer data pipeline' },
  'Stripe': { cat: 'Payments' },
  'PayPal': { cat: 'Payments' },
  'Sentry': { cat: 'Monitoring', desc: 'Error tracking' },
  'Algolia': { cat: 'Search', desc: 'Hosted search API' },
  'HubSpot': { cat: 'Marketing', desc: 'Marketing automation & CRM' },
  'Intercom': { cat: 'Marketing', desc: 'Customer chat widget' },
};

// How categories are grouped into the popup's sections.
const SECTIONS = [
  { id: 'platform', title: 'CMS / Platform', cats: ['CMS', 'E-commerce', 'Site builder', 'Static site generator', 'Headless CMS'] },
  { id: 'frontend', title: 'Frontend', cats: ['Meta-framework', 'JavaScript framework', 'UI / CSS framework', 'JavaScript library'],
    empty: 'No JavaScript framework found — likely plain server-rendered HTML.' },
  { id: 'backend', title: 'Backend', cats: ['Backend framework', 'Programming language', 'Runtime'],
    empty: 'Not visible from the browser — this server hides its backend.' },
  { id: 'database', title: 'Database', cats: ['Database', 'Backend-as-a-Service'],
    empty: 'Not visible — databases sit behind the server and are rarely exposed.' },
  { id: 'infra', title: 'Server & Hosting', cats: ['Web server', 'Operating system', 'Hosting / PaaS', 'CDN'],
    empty: 'No server or hosting headers exposed.' },
  { id: 'services', title: 'Analytics & Services', cats: ['Analytics', 'Tag manager', 'Payments', 'Monitoring', 'Search', 'Marketing'] },
];

// ---------- HTTP response headers ----------
function analyzeHeaders(headers, add) {
  const h = (name) => headers[name] || '';
  const server = h('server');
  const powered = h('x-powered-by');
  const via = h('via');

  if (server) {
    const serverRules = [
      [/apache-coyote|tomcat/i, 'Apache Tomcat'],
      [/^apache\/?([\d.]+)?/i, 'Apache'],
      [/nginx\/?([\d.]+)?/i, 'Nginx'],
      [/openresty\/?([\d.]+)?/i, 'OpenResty'],
      [/microsoft-iis\/?([\d.]+)?/i, 'IIS'],
      [/litespeed/i, 'LiteSpeed'],
      [/caddy/i, 'Caddy'],
      [/cloudflare/i, 'Cloudflare'],
      [/gunicorn\/?([\d.]+)?/i, 'Gunicorn'],
      [/uvicorn/i, 'Uvicorn'],
      [/werkzeug\/?([\d.]+)?/i, 'Werkzeug'],
      [/kestrel/i, 'Kestrel'],
      [/jetty/i, 'Jetty'],
      [/puma/i, 'Puma'],
      [/passenger/i, 'Phusion Passenger'],
      [/envoy/i, 'Envoy'],
      [/varnish/i, 'Varnish'],
      [/vercel/i, 'Vercel'],
      [/netlify/i, 'Netlify'],
      [/amazons3/i, 'Amazon S3'],
      [/awselb|amazon/i, 'AWS'],
      [/cloudfront/i, 'Amazon CloudFront'],
      [/^GitHub\.com$/, 'GitHub Pages'], // case matters: github.com itself sends lowercase
      [/google frontend/i, 'Google Cloud'],
      [/akamai/i, 'Akamai'],
      [/bunnycdn/i, 'Bunny.net'],
      [/^fly\//i, 'Fly.io'],
      [/railway/i, 'Railway'],
      [/squarespace/i, 'Squarespace'],
      [/^pepyaka|wix/i, 'Wix'],
    ];
    for (const [re, name] of serverRules) {
      const m = server.match(re);
      if (m) add(name, `Server: ${server}`, m[1]);
    }
    const os = server.match(/\((Ubuntu|Debian|CentOS|Red Hat|Win64|Win32)\)/i);
    if (os) add(/win/i.test(os[1]) ? 'Windows Server' : os[1], `Server: ${server}`);
  }

  if (powered) {
    const poweredRules = [
      [/php\/?([\d.]+)?/i, 'PHP'],
      [/express/i, 'Express'],
      [/next\.js\s*([\d.]+)?/i, 'Next.js'],
      [/nuxt/i, 'Nuxt'],
      [/asp\.net/i, 'ASP.NET'],
      [/servlet|jsp|jboss|tomcat/i, 'Java'],
      [/wp engine/i, 'WP Engine'],
      [/craft cms/i, 'Craft CMS'],
      [/phusion passenger/i, 'Phusion Passenger'],
      [/kinsta/i, 'Kinsta'],
    ];
    for (const [re, name] of poweredRules) {
      const m = powered.match(re);
      if (m) add(name, `X-Powered-By: ${powered}`, m[1]);
    }
  }

  const has = (name) => name in headers;
  const flag = (cond, name, evidence, version) => { if (cond) add(name, evidence, version); };

  flag(has('cf-ray'), 'Cloudflare', 'cf-ray header');
  flag(has('x-vercel-id') || has('x-vercel-cache'), 'Vercel', 'x-vercel-id header');
  flag(has('x-nf-request-id'), 'Netlify', 'x-nf-request-id header');
  flag(has('x-amz-cf-id') || /cloudfront/i.test(via) || /cloudfront/i.test(h('x-cache')), 'Amazon CloudFront', 'x-amz-cf-id / Via: CloudFront');
  flag(has('x-amz-request-id') || has('x-amz-id-2'), 'AWS', 'x-amz-request-id header');
  flag(has('x-fastly-request-id') || (/cache-[a-z]{3}/i.test(h('x-served-by')) && has('x-cache')), 'Fastly', 'x-served-by: cache-… (Fastly POP)');
  flag(/varnish/i.test(via) || has('x-varnish'), 'Varnish', 'Via / X-Varnish header');
  flag(/vegur/i.test(via), 'Heroku', 'Via: vegur (Heroku router)');
  flag(/google/i.test(via) || has('x-goog-generation') || has('x-guploader-uploadid'), 'Google Cloud', 'Via: google / x-goog-* header');
  flag(has('x-akamai-transformed') || has('akamai-grn'), 'Akamai', 'Akamai header');
  flag(has('x-azure-ref') || has('x-msedge-ref'), 'Microsoft Azure', 'x-azure-ref header');
  flag(has('fly-request-id'), 'Fly.io', 'fly-request-id header');
  flag(has('x-render-origin-server'), 'Render', 'x-render-origin-server header');
  flag(has('x-railway-request-id') || has('x-railway-edge'), 'Railway', 'x-railway-* header');
  flag(has('x-kinsta-cache'), 'Kinsta', 'x-kinsta-cache header');
  flag(has('wpe-backend') || Object.keys(headers).some((k) => k.startsWith('x-wpe-')), 'WP Engine', 'x-wpe-* header');
  flag(has('x-litespeed-cache') || /litespeed/i.test(h('x-turbo-charged-by')), 'LiteSpeed', 'x-litespeed-cache header');
  flag(has('x-shopify-stage') || has('x-shopid') || has('x-sorting-hat-shopid'), 'Shopify', 'x-shopify-* header');
  flag(has('x-wix-request-id'), 'Wix', 'x-wix-request-id header');
  flag(has('x-drupal-cache') || has('x-drupal-dynamic-cache'), 'Drupal', 'x-drupal-cache header');
  flag(/drupal/i.test(h('x-generator')), 'Drupal', `X-Generator: ${h('x-generator')}`);
  flag(has('x-pingback'), 'WordPress', 'x-pingback header (xmlrpc.php)');
  flag(/api\.w\.org/.test(h('link')), 'WordPress', 'Link: <…/wp-json/>; rel="https://api.w.org/"');
  flag(has('x-ghost-cache-status'), 'Ghost', 'x-ghost-cache-status header');
  flag(Object.keys(headers).some((k) => k.startsWith('x-nextjs-')), 'Next.js', 'x-nextjs-* header');
  flag(has('x-aspnet-version'), 'ASP.NET', `X-AspNet-Version: ${h('x-aspnet-version')}`, h('x-aspnet-version'));
  flag(has('x-aspnetmvc-version'), 'ASP.NET', 'X-AspNetMvc-Version header');
  flag(/^\d+(\.\d+)?$/.test(h('x-runtime')), 'Ruby', 'x-runtime header (Ruby / Rack)');
  flag(has('x-hubspot-correlation-id'), 'HubSpot', 'x-hubspot-* header');
}

// ---------- Cookies (names only — values are never read) ----------
function analyzeCookies(names, add) {
  const rules = [
    [/^PHPSESSID$/, 'PHP'],
    [/^laravel_session$/, 'Laravel'],
    [/^ci_session$/, 'CodeIgniter'],
    [/^(sf_redirect|symfony)$/, 'Symfony'],
    [/^JSESSIONID$/, 'Java'],
    [/^(ASP\.NET_SessionId|\.AspNetCore\..+|\.ASPXAUTH)$/, 'ASP.NET'],
    [/^connect\.sid$/, 'Express'],
    [/^(csrftoken|django_language)$/, 'Django'],
    [/^_[a-z0-9_]+_session$/, 'Ruby on Rails'],
    [/^(wordpress_|wp-settings-|wordpress_test_cookie)/, 'WordPress'],
    [/^SESS[a-f0-9]{32}$/, 'Drupal'],
    [/^(mage-cache-sessid|mage-messages)$/, 'Magento'],
    [/^PrestaShop-/, 'PrestaShop'],
    [/^_shopify_/, 'Shopify'],
    [/^(__cf_bm|cf_clearance|__cflb)$/, 'Cloudflare'],
    [/^(AWSALB|AWSALBCORS|AWSELB)$/, 'AWS'],
    [/^sb-.+-auth-token/, 'Supabase'],
    [/^_ga(_|$)/, 'Google Analytics'],
    [/^_fbp$/, 'Meta Pixel'],
    [/^_hj/, 'Hotjar'],
    [/^_clck$/, 'Microsoft Clarity'],
    [/^__stripe_mid$/, 'Stripe'],
    [/^hubspotutk$/, 'HubSpot'],
    [/^ajs_anonymous_id$/, 'Segment'],
  ];
  for (const n of names) {
    for (const [re, name] of rules) if (re.test(n)) add(name, `cookie "${n}"`);
  }
}

if (typeof module !== 'undefined') module.exports = { TECH, SECTIONS, analyzeHeaders, analyzeCookies };
