// Injected into the inspected page (MAIN world, so it can see the page's own JS globals).
// It looks at four kinds of clues and returns what it found, with the evidence for each:
//   1. <meta name="generator"> tags
//   2. URLs of scripts, stylesheets and other loaded resources
//   3. JavaScript globals (window.React, window.__NEXT_DATA__, ...)
//   4. DOM fingerprints (special attributes, element properties, class names)
// The last expression's value is what chrome.scripting.executeScript returns.

(() => {
  const found = {};
  const add = (name, evidence, version) => {
    const f = found[name] || (found[name] = { name, evidence: [], version: null });
    if (evidence && !f.evidence.includes(evidence) && f.evidence.length < 4) f.evidence.push(evidence);
    if (version && !f.version) f.version = String(version);
  };
  const safe = (fn) => { try { fn(); } catch (e) { /* one failing rule must not break the others */ } };
  const $ = (sel) => { try { return document.querySelector(sel); } catch { return null; } };
  const w = window;
  const short = (u) => { try { const x = new URL(u); return x.host + x.pathname.slice(0, 50); } catch { return String(u).slice(0, 60); } };

  // ---------- 1. <meta name="generator"> ----------
  safe(() => {
    const generators = Array.from(document.querySelectorAll('meta[name="generator" i]')).map((m) => m.content || '');
    const rules = [
      [/WordPress\s*([\d.]+)?/i, 'WordPress'],
      [/WooCommerce\s*([\d.]+)?/i, 'WooCommerce'],
      [/Elementor\s*([\d.]+)?/i, 'Elementor'],
      [/Drupal\s*([\d.]+)?/i, 'Drupal'],
      [/Joomla!?\s*([\d.]+)?/i, 'Joomla'],
      [/Ghost\s*([\d.]+)?/i, 'Ghost'],
      [/TYPO3\s*(?:CMS)?\s*([\d.]+)?/i, 'TYPO3'],
      [/Hugo\s*([\d.]+)?/i, 'Hugo'],
      [/Jekyll\s*v?([\d.]+)?/i, 'Jekyll'],
      [/Eleventy\s*v?([\d.]+)?/i, 'Eleventy'],
      [/Hexo\s*([\d.]+)?/i, 'Hexo'],
      [/Gatsby\s*([\d.]+)?/i, 'Gatsby'],
      [/Docusaurus\s*v?([\d.]+)?/i, 'Docusaurus'],
      [/VitePress\s*v?([\d.]+)?/i, 'VitePress'],
      [/VuePress\s*([\d.]+)?/i, 'VuePress'],
      [/mkdocs-?([\d.]+)?/i, 'MkDocs'],
      [/Astro\s*v?([\d.]+)?/i, 'Astro'],
      [/Next\.js\s*([\d.]+)?/i, 'Next.js'],
      [/Nuxt\s*([\d.]+)?/i, 'Nuxt'],
      [/Wix\.com/i, 'Wix'],
      [/Squarespace/i, 'Squarespace'],
      [/Webflow/i, 'Webflow'],
      [/Framer\s*([\w.]+)?/i, 'Framer'],
      [/Weebly/i, 'Weebly'],
      [/Blogger/i, 'Blogger'],
      [/PrestaShop/i, 'PrestaShop'],
      [/Shopify/i, 'Shopify'],
      [/Craft CMS/i, 'Craft CMS'],
    ];
    for (const g of generators) {
      for (const [re, name] of rules) {
        const m = g.match(re);
        if (m) add(name, `<meta name="generator" content="${g.slice(0, 60)}">`, m[1] && /\d/.test(m[1]) ? m[1] : null);
      }
    }
  });

  // ---------- 2. Script / stylesheet / resource URLs ----------
  safe(() => {
    const scripts = Array.from(document.scripts).map((s) => s.src).filter(Boolean);
    const links = Array.from(document.querySelectorAll('link[href]')).map((l) => l.href);
    const resources = performance.getEntriesByType('resource').map((e) => e.name);
    const urls = [...new Set([...scripts, ...links, ...resources])];
    const rules = [
      [/\/wp-content\/|\/wp-includes\//, 'WordPress'],
      [/\/wp-content\/plugins\/woocommerce\//, 'WooCommerce'],
      [/\/wp-content\/plugins\/elementor\//, 'Elementor'],
      [/\/_next\/static\//, 'Next.js'],
      [/\/_nuxt\//, 'Nuxt'],
      [/\/_astro\//, 'Astro'],
      [/cdn\.shopify\.com|\/cdn\/shop\//, 'Shopify'],
      [/static\.wixstatic\.com|static\.parastorage\.com/, 'Wix'],
      [/squarespace(-cdn)?\.com|sqspcdn\.com/, 'Squarespace'],
      [/website-files\.com|webflow\.com\/js/, 'Webflow'],
      [/framerusercontent\.com|framer\.com\/m\//, 'Framer'],
      [/\/sites\/(default|all)\/(files|themes|modules)\/|\/core\/misc\/drupal/, 'Drupal'],
      [/\/media\/jui\/|\/media\/system\/js\/|\/media\/vendor\/joomla/, 'Joomla'],
      [/\/static\/(version\d+\/)?frontend\/[^/]+\/[^/]+\/[a-z]{2}_[A-Z]{2}\//, 'Magento'],
      [/\/livewire\/livewire(\.min)?\.js/, 'Livewire'],
      [/firebaseio\.com|firestore\.googleapis\.com|gstatic\.com\/firebasejs|firebasestorage\.googleapis\.com/, 'Firebase'],
      [/\.supabase\.co/, 'Supabase'],
      [/cdn\.contentful\.com|ctfassets\.net/, 'Contentful'],
      [/cdn\.sanity\.io/, 'Sanity'],
      [/\.prismic\.io|images\.prismic\.io/, 'Prismic'],
      [/storyblok\.com/, 'Storyblok'],
      [/google-analytics\.com|googletagmanager\.com\/gtag\/js/, 'Google Analytics'],
      [/googletagmanager\.com\/gtm\.js/, 'Google Tag Manager'],
      [/connect\.facebook\.net/, 'Meta Pixel'],
      [/static\.hotjar\.com|script\.hotjar\.com/, 'Hotjar'],
      [/clarity\.ms/, 'Microsoft Clarity'],
      [/plausible\.io\/js/, 'Plausible'],
      [/cdn\.segment\.com/, 'Segment'],
      [/js\.stripe\.com/, 'Stripe'],
      [/paypal\.com\/sdk|paypalobjects\.com/, 'PayPal'],
      [/sentry-cdn\.com|ingest\.(\w+\.)?sentry\.io/, 'Sentry'],
      [/algolia\.net|algolianet\.com|cdn\.jsdelivr\.net\/npm\/algoliasearch/, 'Algolia'],
      [/js\.hs-scripts\.com|js\.hs-analytics\.net|js\.hsforms\.net/, 'HubSpot'],
      [/widget\.intercom\.io|js\.intercomcdn\.com/, 'Intercom'],
      [/\/_vercel\/(insights|speed-insights)\//, 'Vercel'],
      [/static\.cloudflareinsights\.com|\/cdn-cgi\//, 'Cloudflare'],
      [/bootstrap(\.bundle)?(\.min)?\.(js|css)/, 'Bootstrap'],
      [/jquery[.-]?(\d[\d.]*)?(\.slim)?(\.min)?\.js/, 'jQuery'],
      [/cdn\.tailwindcss\.com/, 'Tailwind CSS'],
      [/htmx(\.org)?(@[\d.]+)?(\/dist\/htmx)?(\.min)?\.js/, 'htmx'],
      [/alpinejs|\/alpine(\.min)?\.js/, 'Alpine.js'],
    ];
    for (const [re, name] of rules) {
      const u = urls.find((x) => re.test(x));
      if (u) add(name, `loads ${short(u)}`);
    }
  });

  // ---------- 3. JavaScript globals ----------
  safe(() => {
    const has = (k) => typeof w[k] !== 'undefined';
    // Meta-frameworks
    if (has('__NEXT_DATA__')) add('Next.js', 'window.__NEXT_DATA__ (Pages Router)');
    if (has('__next_f')) add('Next.js', 'self.__next_f (App Router streaming)');
    if (w.next && w.next.version) add('Next.js', 'window.next.version', w.next.version);
    if (has('__NUXT__') || has('$nuxt') || $('#__nuxt') || $('script#__NUXT_DATA__')) add('Nuxt', 'window.__NUXT__ / #__nuxt');
    if (has('___gatsby') || $('#___gatsby')) add('Gatsby', '#___gatsby root element');
    if (has('__remixContext')) add('Remix', 'window.__remixContext');
    if (has('__reactRouterContext')) add('React Router', 'window.__reactRouterContext (framework mode)');
    if (Object.keys(w).some((k) => k.startsWith('__sveltekit')) || $('[data-sveltekit-preload-data],[data-sveltekit-hydrate]'))
      add('SvelteKit', '__sveltekit_* global / data-sveltekit-* attribute');
    if ($('astro-island, astro-slot')) add('Astro', '<astro-island> element');
    if ($('[q\\:container]')) add('Qwik', 'q:container attribute');

    // UI frameworks / libraries
    if (w.React) add('React', 'window.React', w.React.version);
    const hook = w.__REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (hook && hook.renderers && hook.renderers.size) {
      for (const r of hook.renderers.values()) add('React', 'React renderer registered', r.version);
    }
    if (w.Vue) add('Vue.js', 'window.Vue', w.Vue.version);
    if (w.angular && w.angular.version) add('AngularJS', 'window.angular', w.angular.version.full);
    if (w.ng && (w.ng.getComponent || w.ng.probe)) add('Angular', 'window.ng debug API');
    const ngv = $('[ng-version]');
    if (ngv) add('Angular', `ng-version="${ngv.getAttribute('ng-version')}" attribute`, ngv.getAttribute('ng-version'));
    if (w.Ember) add('Ember.js', 'window.Ember', w.Ember.VERSION);
    if (w.Backbone) add('Backbone.js', 'window.Backbone', w.Backbone.VERSION);
    if (w.preact) add('Preact', 'window.preact');
    if (w.jQuery && w.jQuery.fn) add('jQuery', 'window.jQuery', w.jQuery.fn.jquery);
    if (w.Alpine) add('Alpine.js', 'window.Alpine', w.Alpine.version);
    if (w.htmx) add('htmx', 'window.htmx', w.htmx.version);
    if (w.Livewire) add('Livewire', 'window.Livewire');
    if (w.Turbo) add('Hotwire Turbo', 'window.Turbo');
    if (w.Turbolinks) add('Turbolinks', 'window.Turbolinks');
    if (w.Stimulus) add('Stimulus', 'window.Stimulus');
    if (w.Blazor) add('Blazor', 'window.Blazor');
    if (w.liveSocket || $('[data-phx-main],[data-phx-session]')) add('Phoenix LiveView', 'data-phx-* attributes / window.liveSocket');
    if ($('#app[data-page]')) add('Inertia.js', '<div id="app" data-page="..."> (Inertia root)');
    const bsVersion = (w.bootstrap && w.bootstrap.Tooltip && w.bootstrap.Tooltip.VERSION) ||
      (w.jQuery && w.jQuery.fn && w.jQuery.fn.tooltip && w.jQuery.fn.tooltip.Constructor && w.jQuery.fn.tooltip.Constructor.VERSION);
    if (bsVersion) add('Bootstrap', 'Bootstrap JS loaded', bsVersion);

    // CMS / platforms
    if (w.Shopify) add('Shopify', 'window.Shopify');
    if (w.wp || w.wpApiSettings || $('link[rel="https://api.w.org/"]')) add('WordPress', 'WordPress REST API link / window.wp');
    if (w.Drupal || w.drupalSettings) add('Drupal', 'window.Drupal');
    if (w.Joomla) add('Joomla', 'window.Joomla');
    if (w.wixBiSession || w.wixDevelopersAnalytics) add('Wix', 'window.wixBiSession');
    if (w.Static && w.Static.SQUARESPACE_CONTEXT) add('Squarespace', 'window.Static.SQUARESPACE_CONTEXT');
    if ($('html[data-wf-site]') || w.Webflow) add('Webflow', 'data-wf-site attribute on <html>');
    if (w.prestashop) add('PrestaShop', 'window.prestashop');
    if (w.Mage || $('script[type="text/x-magento-init"]')) add('Magento', 'text/x-magento-init scripts');

    // Backend hints that leak into the HTML
    const csrfParam = $('meta[name="csrf-param"]');
    if (csrfParam && csrfParam.content === 'authenticity_token') add('Ruby on Rails', '<meta name="csrf-param" content="authenticity_token">');
    if ($('input[name="csrfmiddlewaretoken"]')) add('Django', 'hidden input "csrfmiddlewaretoken" in a form');
    if ($('input[name="__VIEWSTATE"]')) add('ASP.NET', 'hidden input "__VIEWSTATE" (Web Forms)');
    if ($('input[name="__RequestVerificationToken"]')) add('ASP.NET', 'hidden input "__RequestVerificationToken"');

    // Database / Backend-as-a-Service
    if (w.firebase) add('Firebase', 'window.firebase', w.firebase.SDK_VERSION);
    if (has('__FIREBASE_DEFAULTS__')) add('Firebase', 'window.__FIREBASE_DEFAULTS__');
    if (w.supabase) add('Supabase', 'window.supabase');

    // Analytics & services
    if (w.gtag || w.ga || w.GoogleAnalyticsObject) add('Google Analytics', 'window.gtag / window.ga');
    if (w.google_tag_manager) add('Google Tag Manager', 'window.google_tag_manager');
    if (w.fbq) add('Meta Pixel', 'window.fbq');
    if (w.hj) add('Hotjar', 'window.hj');
    if (w.clarity) add('Microsoft Clarity', 'window.clarity');
    if (w.plausible) add('Plausible', 'window.plausible');
    if (w.Stripe) add('Stripe', 'window.Stripe');
    if (w.Sentry || w.__SENTRY__) add('Sentry', 'window.__SENTRY__');
    if (w.Intercom) add('Intercom', 'window.Intercom');
    if (w._hsq) add('HubSpot', 'window._hsq');
    if (w.algoliasearch) add('Algolia', 'window.algoliasearch');
  });

  // ---------- 4. DOM fingerprints ----------
  safe(() => {
    const els = document.querySelectorAll('body, body *');
    const max = Math.min(els.length, 3000);
    for (let i = 0; i < max; i++) {
      const el = els[i];
      for (const k of Object.keys(el)) {
        if (k.startsWith('__reactFiber$') || k.startsWith('__reactContainer$') || k.startsWith('__reactInternalInstance$') || k === '_reactRootContainer')
          add('React', 'React fiber attached to DOM nodes');
        else if (k === '__vue_app__') add('Vue.js', 'Vue 3 app mounted on DOM (__vue_app__)', el.__vue_app__ && el.__vue_app__.version);
        else if (k === '__vue__') {
          const ctor = el.__vue__ && el.__vue__.$root && el.__vue__.$root.constructor;
          add('Vue.js', 'Vue 2 instance on DOM (__vue__)', ctor && (ctor.version || (ctor.super && ctor.super.version)));
        } else if (k === '__vueParentComponent') add('Vue.js', 'Vue component attached to DOM');
        else if (k === '__ngContext__') add('Angular', 'Angular context on DOM (__ngContext__)');
      }
      for (const a of el.getAttributeNames()) {
        if (a.startsWith('data-v-')) { add('Vue.js', `scoped-style attribute ${a}`); }
        else if (a.startsWith('_ngcontent-') || a.startsWith('_nghost-')) add('Angular', `${a.replace(/-\w+$/, '-…')} attribute`);
        else if (a === 'data-reactroot') add('React', 'data-reactroot attribute');
        else if (a.startsWith('wire:')) add('Livewire', `${a} attribute`);
        else if (a === 'x-data') add('Alpine.js', 'x-data attribute');
        else if (/^hx-(get|post|put|delete|patch|swap|target|trigger|boost)$/.test(a)) add('htmx', `${a} attribute`);
      }
      const cls = el.getAttribute('class');
      if (cls && /(^|\s)svelte-[a-z0-9]{4,}(\s|$)/.test(cls)) add('Svelte', 'svelte-xxxx scoped class names');
    }

    // Class names alone are unreliable (Bootstrap also has p-3, md:...), but --tw-* variables are Tailwind's own.
    const rootStyle = getComputedStyle(document.documentElement);
    const twVar = ['--tw-ring-offset-shadow', '--tw-border-spacing-x', '--tw-shadow', '--tw-ring-shadow', '--tw-translate-x',
      '--tw-border-style', '--tw-font-weight', '--tw-leading', '--tw-space-y-reverse', '--tw-outline-style', '--tw-gradient-from']
      .find((v) => rootStyle.getPropertyValue(v) !== '');
    if (twVar) add('Tailwind CSS', `Tailwind CSS variable ${twVar}`);
    if (rootStyle.getPropertyValue('--bs-blue') !== '' || rootStyle.getPropertyValue('--bs-body-bg') !== '')
      add('Bootstrap', 'CSS variables --bs-* on :root (Bootstrap 5)');
  });

  return { url: location.href, found: Object.values(found) };
})();
