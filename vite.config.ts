import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import figlet from 'figlet';

interface SiteConfig {
  title: string;
  links: Record<string, string>;
  accountLink: { label: string; url: string } | null;
}

const configPath = resolve(process.env.SITE_CONFIG || 'site.json');
const entities: Record<string, string> = {
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
};
const escape = (value: string): string =>
  value.replace(/[&<>"']/g, (character) => entities[character]!);

function href(value: string): string {
  const url = new URL(/^[a-z][a-z\d+.-]*:/i.test(value) ? value : `https://${value}`);
  if (!['https:', 'http:'].includes(url.protocol)) {
    throw new Error(`Links must use HTTP or HTTPS: ${value}`);
  }
  return escape(url.href);
}

export default defineConfig({
  base: './',
  plugins: [{
    name: 'page-content',
    configureServer(server) {
      server.watcher.add(configPath);
      server.watcher.on('change', (path) => {
        if (path === configPath) server.ws.send({ type: 'full-reload' });
      });
    },
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        const { title, links, accountLink } = JSON.parse(readFileSync(configPath, 'utf8')) as SiteConfig;
        const content = {
          title: escape(title),
          wordmark: escape(figlet.textSync(title, { font: 'Small' }).trimEnd()),
          links: Object.entries(links).sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0)
            .map(([label, url]) => `<li><a is-="button" variant-="background0" size-="small" href="${href(url)}">${escape(label)}</a></li>`).join('\n'),
          accountLink: accountLink === null ? '' : `<footer><a is-="button" variant-="background0" size-="small" href="${href(accountLink.url)}">${escape(accountLink.label)}</a></footer>`,
        };
        return html.replace(/\{\{(title|wordmark|links|accountLink)\}\}/g,
          (_, key: keyof typeof content) => content[key]);
      },
    },
  }],
});
