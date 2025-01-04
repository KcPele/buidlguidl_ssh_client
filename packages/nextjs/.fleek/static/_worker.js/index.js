
		const sharedGlobalProperties = new Set([
			'_nextOriginalFetch',
			'fetch',
			'__incrementalCache',
		]);

		function getProxyFor(route) {
			const existingProxy = globalThis.__nextOnPagesRoutesIsolation._map.get(route);
			if (existingProxy) {
				return existingProxy;
			}

			const newProxy = createNewRouteProxy();
			globalThis.__nextOnPagesRoutesIsolation._map.set(route, newProxy);
			return newProxy;
		}

		function createNewRouteProxy() {
			const overrides = new Map();

			return new Proxy(globalThis, {
				get: (_, property) => {
					if (overrides.has(property)) {
						return overrides.get(property);
					}
					return Reflect.get(globalThis, property);
				},
				set: (_, property, value) => {
					if (sharedGlobalProperties.has(property)) {
						// this property should be shared across all routes
						return Reflect.set(globalThis, property, value);
					}
					overrides.set(property, value);
					return true;
				},
			});
		}

		globalThis.__nextOnPagesRoutesIsolation ??= {
			_map: new Map(),
			getProxyFor,
		};

		const originalFetch = globalThis.fetch;

		function setRequestUserAgentIfNeeded(request) {
			if (!request.headers.has('user-agent')) {
				request.headers.set(`user-agent`, `Next.js Middleware`);
			}
		}

		const patchFlagSymbol = Symbol.for('next-on-pages fetch patch');

		async function handleInlineAssetRequest(request) {
			if (request.url.startsWith('blob:')) {
				try {
					const url = new URL(request.url);
					const pathname = url.pathname;
					const noExt = pathname.replace(/.html$/, '');
					const withExt = `${noExt.replace(/^\/$/, '/index')}.html`;

					const builtUrl = `https://${process.env.ASSETS_CID}.ipfs.flk-ipfs.xyz/_worker.js/__next-on-fleek-dist__/assets/${pathname}`;
					
					const response = await fetch(
						builtUrl,
					);
					return Promise.resolve(response);
				} catch (error) {
					// eslint-disable-next-line no-console
					console.log('Failed to fetch from IPFS');
					// eslint-disable-next-line no-console
					console.error(error);
				}
			}
			return null;
		}

		globalThis.fetch = async (...args) => {
			const request = new Request(...args);

			const response = await handleInlineAssetRequest(request);
			if (response) return response;

			setRequestUserAgentIfNeeded(request);

			return originalFetch(request);
		};

		globalThis.ASSETS = {
			fetch: async req => {
				try {
					let pathname;
					if (req instanceof URL) {
						pathname = new URL(req).pathname;
					} else {
						pathname = new URL(req.url).pathname;
					}

					let assetPath = pathname;
					if (!/\.[^.]+$/.test(assetPath)) {
						const noExt = pathname.replace(/.html$/, '');
						assetPath = `${noExt.replace(/\/$/, '/index')}.html`;
					}

					const response = await fetch(
						`https://${process.env.ASSETS_CID}.ipfs.flk-ipfs.xyz${assetPath}`,
					);
					return Promise.resolve(response);
				} catch (error) {
					return Promise.reject(error);
				}
			},
		};

		import('node:buffer').then(({ Buffer }) => {
			globalThis.Buffer = Buffer;
		})
		.catch(() => null);
	

// <define:__BUILD_METADATA__>
var define_BUILD_METADATA_default = { collectedLocales: [] };

// <define:__CONFIG__>
var define_CONFIG_default = { version: 3, routes: { none: [{ src: "^/_next/__private/trace$", dest: "/404", status: 404, continue: true }, { src: "^/404/?$", status: 404, continue: true }, { src: "^(?:/((?:[^/]+?)(?:/(?:[^/]+?))*))/$", headers: { Location: "/$1" }, status: 308 }], filesystem: [{ src: "^/_next/data/(.*)$", dest: "/_next/data/$1", check: true }, { src: "^/_next/data/(.*)$", status: 404 }], miss: [{ src: "^/_next/static/(?:[^/]+/pages|pages|chunks|runtime|css|image|media)/.+$", status: 404, check: true, dest: "$0" }], rewrite: [], resource: [{ src: "^/.*$", status: 404 }], hit: [{ src: "^/_next/static/(?:[^/]+/pages|pages|chunks|runtime|css|image|media|XSMMsmE_WrJLhVdCbzS1I)/.+$", headers: { "cache-control": "public,max-age=31536000,immutable" }, continue: true, important: true }], error: [{ status: 404, src: "^.*$", dest: "/404" }] }, images: { domains: [], sizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840, 16, 32, 48, 64, 96, 128, 256, 384], remotePatterns: [], minimumCacheTTL: 60, formats: ["image/webp"], dangerouslyAllowSVG: false, contentSecurityPolicy: "script-src 'none'; frame-src 'none'; sandbox;", contentDispositionType: "inline" }, overrides: { "404.html": { path: "404", contentType: "text/html; charset=utf-8" }, "blockexplorer.html": { path: "blockexplorer", contentType: "text/html; charset=utf-8" }, "blockexplorer/address/0x0000000000000000000000000000000000000000.html": { path: "blockexplorer/address/0x0000000000000000000000000000000000000000", contentType: "text/html; charset=utf-8" }, "blockexplorer/transaction/0x0000000000000000000000000000000000000000.html": { path: "blockexplorer/transaction/0x0000000000000000000000000000000000000000", contentType: "text/html; charset=utf-8" }, "connection.html": { path: "connection", contentType: "text/html; charset=utf-8" }, "dashboard.html": { path: "dashboard", contentType: "text/html; charset=utf-8" }, "dashboard/setup/mac.html": { path: "dashboard/setup/mac", contentType: "text/html; charset=utf-8" }, "dashboard/setup/ubuntu.html": { path: "dashboard/setup/ubuntu", contentType: "text/html; charset=utf-8" }, "dashboard/setup/ubuntu/new.html": { path: "dashboard/setup/ubuntu/new", contentType: "text/html; charset=utf-8" }, "dashboard/setup/windows.html": { path: "dashboard/setup/windows", contentType: "text/html; charset=utf-8" }, "debug.html": { path: "debug", contentType: "text/html; charset=utf-8" }, "index.html": { path: "index", contentType: "text/html; charset=utf-8" } }, framework: { version: "14.2.22" }, crons: [] };

// ../../../../../../tmp/functions-qvdk3ljatt.js
var __BUILD_OUTPUT__ = { "/404.html": {
  type: "override",
  path: "/404.html",
  headers: { "content-type": "text/html; charset=utf-8" }
}, "/_next/static/XSMMsmE_WrJLhVdCbzS1I/_buildManifest.js": { type: "static" }, "/_next/static/XSMMsmE_WrJLhVdCbzS1I/_ssgManifest.js": { type: "static" }, "/_next/static/chunks/1267.0db3394996e35f05.js": { type: "static" }, "/_next/static/chunks/1351.f3985ec57b7a1208.js": { type: "static" }, "/_next/static/chunks/1358.4d84912b97049ae8.js": { type: "static" }, "/_next/static/chunks/1453.5ee4265b1ff21192.js": { type: "static" }, "/_next/static/chunks/1511.276125cc7be3e065.js": { type: "static" }, "/_next/static/chunks/1591-7b71382e9bd90faf.js": { type: "static" }, "/_next/static/chunks/1730.0a4ba0e9137ac60d.js": { type: "static" }, "/_next/static/chunks/1735.57e8b71615464a3c.js": { type: "static" }, "/_next/static/chunks/1739.ba5177e2afb158f1.js": { type: "static" }, "/_next/static/chunks/1922.5b0277c8221bb3fa.js": { type: "static" }, "/_next/static/chunks/1975.e875a145e3dcf7e4.js": { type: "static" }, "/_next/static/chunks/1982.c4bdc22fe54a3530.js": { type: "static" }, "/_next/static/chunks/2117-2a9961f39071532e.js": { type: "static" }, "/_next/static/chunks/2140.3747f8f75f757e08.js": { type: "static" }, "/_next/static/chunks/2289.f5eea99e917f38bf.js": { type: "static" }, "/_next/static/chunks/2331-bc9f454e10060797.js": { type: "static" }, "/_next/static/chunks/2333.f908fb46dc546bb0.js": { type: "static" }, "/_next/static/chunks/2393.6607520097224d9d.js": { type: "static" }, "/_next/static/chunks/2489.6dc1384bfd4f2499.js": { type: "static" }, "/_next/static/chunks/255.84e45466976e8f26.js": { type: "static" }, "/_next/static/chunks/264.cfee16d0cd926a3c.js": { type: "static" }, "/_next/static/chunks/2673.31ccbd3be2ddbc21.js": { type: "static" }, "/_next/static/chunks/2756-6ebd0d432bd35840.js": { type: "static" }, "/_next/static/chunks/2826.64f7b21bd97547ca.js": { type: "static" }, "/_next/static/chunks/2955.e4b83e3e6e07d735.js": { type: "static" }, "/_next/static/chunks/2957.0a5d46af79a4942e.js": { type: "static" }, "/_next/static/chunks/2972-93d8df0dbb94bd20.js": { type: "static" }, "/_next/static/chunks/3140.8f2e5faa38d26d48.js": { type: "static" }, "/_next/static/chunks/3170.6af58d3105e21bd7.js": { type: "static" }, "/_next/static/chunks/334.caa41e09ffb30f80.js": { type: "static" }, "/_next/static/chunks/3432.14948bf02329e26d.js": { type: "static" }, "/_next/static/chunks/3463.3f52daadc4a749f0.js": { type: "static" }, "/_next/static/chunks/3506.74358e06331f5ca4.js": { type: "static" }, "/_next/static/chunks/3586.d9f54abd687cbfd9.js": { type: "static" }, "/_next/static/chunks/374.2cb18118f48949c4.js": { type: "static" }, "/_next/static/chunks/3871.06c119c56e31d19d.js": { type: "static" }, "/_next/static/chunks/3944.356ca62a6dee268a.js": { type: "static" }, "/_next/static/chunks/4071.3bb73eee7ad6e656.js": { type: "static" }, "/_next/static/chunks/4278.157fa31bd6c38e56.js": { type: "static" }, "/_next/static/chunks/428.cfd7442f41a28940.js": { type: "static" }, "/_next/static/chunks/4320.6a972e285c207fd9.js": { type: "static" }, "/_next/static/chunks/4501.2035e7a052682607.js": { type: "static" }, "/_next/static/chunks/4556.f0425da95b05a571.js": { type: "static" }, "/_next/static/chunks/4616.8d7f338b52fcf4ff.js": { type: "static" }, "/_next/static/chunks/4678.87f3ccf58f75e535.js": { type: "static" }, "/_next/static/chunks/4707-34b5e3b1367a3931.js": { type: "static" }, "/_next/static/chunks/4726.bee0a88a8d1ac927.js": { type: "static" }, "/_next/static/chunks/4868.ea9e8f87ae1d612a.js": { type: "static" }, "/_next/static/chunks/4886.408456926777edb3.js": { type: "static" }, "/_next/static/chunks/4897-bcf70c6b78a75f4c.js": { type: "static" }, "/_next/static/chunks/4978.f19de5daea982214.js": { type: "static" }, "/_next/static/chunks/4e88bc13-f7f4bd91965c799c.js": { type: "static" }, "/_next/static/chunks/5026-073eefd2922bd8c9.js": { type: "static" }, "/_next/static/chunks/5075.bf20870c8ddc62e4.js": { type: "static" }, "/_next/static/chunks/5134.02dba0b0c380eff6.js": { type: "static" }, "/_next/static/chunks/5539.c35141e1a9ff9159.js": { type: "static" }, "/_next/static/chunks/5581.90e528a1c0bfdffc.js": { type: "static" }, "/_next/static/chunks/5685.6d23c65ff108ff31.js": { type: "static" }, "/_next/static/chunks/5800.3d0f4f05c39b505d.js": { type: "static" }, "/_next/static/chunks/5931.d8c217d8a5acfca6.js": { type: "static" }, "/_next/static/chunks/5ab80550.b2fdda6a6b038460.js": { type: "static" }, "/_next/static/chunks/6275.1a02d83600f7ab51.js": { type: "static" }, "/_next/static/chunks/6412.789bdd2d795e76ed.js": { type: "static" }, "/_next/static/chunks/6520.8f32c390829273bd.js": { type: "static" }, "/_next/static/chunks/707.69c64a32cb42ecee.js": { type: "static" }, "/_next/static/chunks/7121-686d785d8f9aa5f5.js": { type: "static" }, "/_next/static/chunks/7353.89cd9e8913c6254c.js": { type: "static" }, "/_next/static/chunks/7364.91a00033be57cbca.js": { type: "static" }, "/_next/static/chunks/7434.a89ae5ff2b45515b.js": { type: "static" }, "/_next/static/chunks/7460.e2cf638d802c23b3.js": { type: "static" }, "/_next/static/chunks/7725.b767cd2b9883960f.js": { type: "static" }, "/_next/static/chunks/7850.5aa36703f66f58fa.js": { type: "static" }, "/_next/static/chunks/7913.d6f8213535a4475b.js": { type: "static" }, "/_next/static/chunks/7950.4392fb6e79ffe4e9.js": { type: "static" }, "/_next/static/chunks/8032.54921831b00850d8.js": { type: "static" }, "/_next/static/chunks/8080.1e93791fa6b4ca50.js": { type: "static" }, "/_next/static/chunks/8458.64aee33179a97009.js": { type: "static" }, "/_next/static/chunks/8488-6de222d6bc40fd1c.js": { type: "static" }, "/_next/static/chunks/8494.a98e44ed439f84eb.js": { type: "static" }, "/_next/static/chunks/8510.968e942cd4913b48.js": { type: "static" }, "/_next/static/chunks/8759.aa54ac398b379848.js": { type: "static" }, "/_next/static/chunks/8910.845c03d95c19c4f6.js": { type: "static" }, "/_next/static/chunks/8933.1bcca0f70f75e719.js": { type: "static" }, "/_next/static/chunks/8969.2fab388a056c0c7d.js": { type: "static" }, "/_next/static/chunks/8e1d74a4-f58da72fb5195c91.js": { type: "static" }, "/_next/static/chunks/9109.1a580a9eabd556e9.js": { type: "static" }, "/_next/static/chunks/9206-cace1eaaf2077a92.js": { type: "static" }, "/_next/static/chunks/9525.1124e5273ac70c92.js": { type: "static" }, "/_next/static/chunks/9542.f23f0aba07bbe6e3.js": { type: "static" }, "/_next/static/chunks/9602.dffd82c32cbc2bec.js": { type: "static" }, "/_next/static/chunks/9867.1bc8ad857ded3939.js": { type: "static" }, "/_next/static/chunks/app/_not-found/page-ffff7fb43911c51a.js": { type: "static" }, "/_next/static/chunks/app/blockexplorer/address/[address]/page-56e663f6df4a0b12.js": { type: "static" }, "/_next/static/chunks/app/blockexplorer/layout-cb2397679be653f0.js": { type: "static" }, "/_next/static/chunks/app/blockexplorer/page-106267c7c7724a1c.js": { type: "static" }, "/_next/static/chunks/app/blockexplorer/transaction/[txHash]/page-3fb9c1d64c6d04a3.js": { type: "static" }, "/_next/static/chunks/app/connection/page-eab17aa5fa3daa2f.js": { type: "static" }, "/_next/static/chunks/app/dashboard/layout-a1dd09fa78f0a9a3.js": { type: "static" }, "/_next/static/chunks/app/dashboard/page-658867fef2879b7a.js": { type: "static" }, "/_next/static/chunks/app/dashboard/setup/mac/page-8408acd01e1c780f.js": { type: "static" }, "/_next/static/chunks/app/dashboard/setup/ubuntu/layout-91650ed3e3e3a311.js": { type: "static" }, "/_next/static/chunks/app/dashboard/setup/ubuntu/new/page-5671d958cf8c4b46.js": { type: "static" }, "/_next/static/chunks/app/dashboard/setup/ubuntu/page-6c5cf32ef59966f0.js": { type: "static" }, "/_next/static/chunks/app/dashboard/setup/windows/page-ce46e127c062156c.js": { type: "static" }, "/_next/static/chunks/app/debug/page-5abcb73b08a1554c.js": { type: "static" }, "/_next/static/chunks/app/layout-f6ba95183d3ffd49.js": { type: "static" }, "/_next/static/chunks/app/not-found-b8d93ddf6bb9b734.js": { type: "static" }, "/_next/static/chunks/app/page-9db8b741520c40e8.js": { type: "static" }, "/_next/static/chunks/ee560e2c-9f8cf2b147e49eb8.js": { type: "static" }, "/_next/static/chunks/fd9d1056-7ef211a81d09af37.js": { type: "static" }, "/_next/static/chunks/framework-8e0e0f4a6b83a956.js": { type: "static" }, "/_next/static/chunks/main-1e6e9f27a29aa1f8.js": { type: "static" }, "/_next/static/chunks/main-app-83e413ed3de732fe.js": { type: "static" }, "/_next/static/chunks/pages/_app-3c9ca398d360b709.js": { type: "static" }, "/_next/static/chunks/pages/_error-cf5ca766ac8f493f.js": { type: "static" }, "/_next/static/chunks/polyfills-42372ed130431b0a.js": { type: "static" }, "/_next/static/chunks/webpack-4b4bbe8d087a7512.js": { type: "static" }, "/_next/static/css/0738926a3ac249a0.css": { type: "static" }, "/_next/static/css/b30489573339f853.css": { type: "static" }, "/blockexplorer/address/0x0000000000000000000000000000000000000000.html": {
  type: "override",
  path: "/blockexplorer/address/0x0000000000000000000000000000000000000000.html",
  headers: { "content-type": "text/html; charset=utf-8" }
}, "/blockexplorer/address/0x0000000000000000000000000000000000000000.txt": { type: "static" }, "/blockexplorer/transaction/0x0000000000000000000000000000000000000000.html": {
  type: "override",
  path: "/blockexplorer/transaction/0x0000000000000000000000000000000000000000.html",
  headers: { "content-type": "text/html; charset=utf-8" }
}, "/blockexplorer/transaction/0x0000000000000000000000000000000000000000.txt": { type: "static" }, "/blockexplorer.html": {
  type: "override",
  path: "/blockexplorer.html",
  headers: { "content-type": "text/html; charset=utf-8" }
}, "/blockexplorer.txt": { type: "static" }, "/connection.html": {
  type: "override",
  path: "/connection.html",
  headers: { "content-type": "text/html; charset=utf-8" }
}, "/connection.txt": { type: "static" }, "/dashboard/setup/mac.html": {
  type: "override",
  path: "/dashboard/setup/mac.html",
  headers: { "content-type": "text/html; charset=utf-8" }
}, "/dashboard/setup/mac.txt": { type: "static" }, "/dashboard/setup/ubuntu/new.html": {
  type: "override",
  path: "/dashboard/setup/ubuntu/new.html",
  headers: { "content-type": "text/html; charset=utf-8" }
}, "/dashboard/setup/ubuntu/new.txt": { type: "static" }, "/dashboard/setup/ubuntu.html": {
  type: "override",
  path: "/dashboard/setup/ubuntu.html",
  headers: { "content-type": "text/html; charset=utf-8" }
}, "/dashboard/setup/ubuntu.txt": { type: "static" }, "/dashboard/setup/windows.html": {
  type: "override",
  path: "/dashboard/setup/windows.html",
  headers: { "content-type": "text/html; charset=utf-8" }
}, "/dashboard/setup/windows.txt": { type: "static" }, "/dashboard.html": {
  type: "override",
  path: "/dashboard.html",
  headers: { "content-type": "text/html; charset=utf-8" }
}, "/dashboard.txt": { type: "static" }, "/debug.html": {
  type: "override",
  path: "/debug.html",
  headers: { "content-type": "text/html; charset=utf-8" }
}, "/debug.txt": { type: "static" }, "/favicon.png": { type: "static" }, "/index.html": {
  type: "override",
  path: "/index.html",
  headers: { "content-type": "text/html; charset=utf-8" }
}, "/index.txt": { type: "static" }, "/logo.svg": { type: "static" }, "/manifest.json": { type: "static" }, "/thumbnail.jpg": { type: "static" }, "/404": {
  type: "override",
  path: "/404.html",
  headers: { "content-type": "text/html; charset=utf-8" }
}, "/blockexplorer": {
  type: "override",
  path: "/blockexplorer.html",
  headers: { "content-type": "text/html; charset=utf-8" }
}, "/blockexplorer/address/0x0000000000000000000000000000000000000000": {
  type: "override",
  path: "/blockexplorer/address/0x0000000000000000000000000000000000000000.html",
  headers: { "content-type": "text/html; charset=utf-8" }
}, "/blockexplorer/transaction/0x0000000000000000000000000000000000000000": {
  type: "override",
  path: "/blockexplorer/transaction/0x0000000000000000000000000000000000000000.html",
  headers: { "content-type": "text/html; charset=utf-8" }
}, "/connection": {
  type: "override",
  path: "/connection.html",
  headers: { "content-type": "text/html; charset=utf-8" }
}, "/dashboard": {
  type: "override",
  path: "/dashboard.html",
  headers: { "content-type": "text/html; charset=utf-8" }
}, "/dashboard/setup/mac": {
  type: "override",
  path: "/dashboard/setup/mac.html",
  headers: { "content-type": "text/html; charset=utf-8" }
}, "/dashboard/setup/ubuntu": {
  type: "override",
  path: "/dashboard/setup/ubuntu.html",
  headers: { "content-type": "text/html; charset=utf-8" }
}, "/dashboard/setup/ubuntu/new": {
  type: "override",
  path: "/dashboard/setup/ubuntu/new.html",
  headers: { "content-type": "text/html; charset=utf-8" }
}, "/dashboard/setup/windows": {
  type: "override",
  path: "/dashboard/setup/windows.html",
  headers: { "content-type": "text/html; charset=utf-8" }
}, "/debug": {
  type: "override",
  path: "/debug.html",
  headers: { "content-type": "text/html; charset=utf-8" }
}, "/index": {
  type: "override",
  path: "/index.html",
  headers: { "content-type": "text/html; charset=utf-8" }
}, "/": {
  type: "override",
  path: "/index.html",
  headers: { "content-type": "text/html; charset=utf-8" }
} };

// ../../../../.nvm/versions/node/v22.12.0/lib/node_modules/@fleek-platform/next/node_modules/@fleek-platform/next-on-fleek/templates/_worker.js/index.ts
import { AsyncLocalStorage } from "node:async_hooks";

// ../../../../.nvm/versions/node/v22.12.0/lib/node_modules/@fleek-platform/next/node_modules/@fleek-platform/next-on-fleek/templates/_worker.js/utils/pcre-to-regexp.ts
function createPCRE(pattern, namedCaptures = []) {
  pattern = String(pattern || "").trim();
  const originalPattern = pattern;
  let delim;
  let flags = "";
  const hasDelim = /^[^a-zA-Z\\\s]/.test(pattern);
  if (hasDelim) {
    delim = pattern[0];
    const lastDelimIndex = pattern.lastIndexOf(delim);
    flags += pattern.substring(lastDelimIndex + 1);
    pattern = pattern.substring(1, lastDelimIndex);
  }
  let numGroups = 0;
  pattern = replaceCaptureGroups(pattern, (group) => {
    if (/^\(\?[P<']/.test(group)) {
      const match = /^\(\?P?[<']([^>']+)[>']/.exec(group);
      if (!match) {
        throw new Error(
          `Failed to extract named captures from ${JSON.stringify(group)}`
        );
      }
      const capture = group.substring(match[0].length, group.length - 1);
      if (namedCaptures) {
        namedCaptures[numGroups] = match[1];
      }
      numGroups++;
      return `(${capture})`;
    }
    if (group.substring(0, 3) === "(?:") {
      return group;
    }
    numGroups++;
    return group;
  });
  pattern = pattern.replace(
    /\[:([^:]+):\]/g,
    (characterClass, name) => {
      return characterClasses[name] || characterClass;
    }
  );
  return new PCRE(pattern, flags, namedCaptures, originalPattern, flags, delim);
}
function replaceCaptureGroups(pattern, fn) {
  let start = 0;
  let depth = 0;
  let escaped = false;
  for (let i = 0; i < pattern.length; i++) {
    const cur = pattern[i];
    if (escaped) {
      escaped = false;
      continue;
    }
    switch (cur) {
      case "(":
        if (depth === 0) {
          start = i;
        }
        depth++;
        break;
      case ")":
        if (depth > 0) {
          depth--;
          if (depth === 0) {
            const end = i + 1;
            const l = start === 0 ? "" : pattern.substring(0, start);
            const r = pattern.substring(end);
            const v = String(fn(pattern.substring(start, end)));
            pattern = l + v + r;
            i = start;
          }
        }
        break;
      case "\\":
        escaped = true;
        break;
      default:
        break;
    }
  }
  return pattern;
}
var PCRE = class extends RegExp {
  namedCaptures;
  pcrePattern;
  pcreFlags;
  delimiter;
  constructor(pattern, flags, namedCaptures, pcrePattern, pcreFlags, delimiter) {
    super(pattern, flags);
    this.namedCaptures = namedCaptures;
    this.pcrePattern = pcrePattern;
    this.pcreFlags = pcreFlags;
    this.delimiter = delimiter;
  }
};
var characterClasses = {
  alnum: "[A-Za-z0-9]",
  word: "[A-Za-z0-9_]",
  alpha: "[A-Za-z]",
  blank: "[ \\t]",
  cntrl: "[\\x00-\\x1F\\x7F]",
  digit: "\\d",
  graph: "[\\x21-\\x7E]",
  lower: "[a-z]",
  print: "[\\x20-\\x7E]",
  punct: "[\\]\\[!\"#$%&'()*+,./:;<=>?@\\\\^_`{|}~-]",
  space: "\\s",
  upper: "[A-Z]",
  xdigit: "[A-Fa-f0-9]"
};

// ../../../../.nvm/versions/node/v22.12.0/lib/node_modules/@fleek-platform/next/node_modules/@fleek-platform/next-on-fleek/templates/_worker.js/utils/pcre.ts
function matchPCRE(expr, val, caseSensitive) {
  if (val === null || val === void 0) {
    return { match: null, captureGroupKeys: [] };
  }
  const flag = caseSensitive ? "" : "i";
  const captureGroupKeys = [];
  const matcher = createPCRE(`%${expr}%${flag}`, captureGroupKeys);
  const match = matcher.exec(val);
  return { match, captureGroupKeys };
}
function applyPCREMatches(rawStr, match, captureGroupKeys, { namedOnly } = {}) {
  return rawStr.replace(/\$([a-zA-Z0-9_]+)/g, (originalValue, key) => {
    const index = captureGroupKeys.indexOf(key);
    if (namedOnly && index === -1) {
      return originalValue;
    }
    return (index === -1 ? match[parseInt(key, 10)] : match[index + 1]) || "";
  });
}

// ../../../../.nvm/versions/node/v22.12.0/lib/node_modules/@fleek-platform/next/node_modules/@fleek-platform/next-on-fleek/templates/_worker.js/utils/matcher.ts
function checkhasField(has, { url, cookies, headers, routeDest }) {
  switch (has.type) {
    case "host": {
      return { valid: url.hostname === has.value };
    }
    case "header": {
      if (has.value !== void 0) {
        return getHasFieldPCREMatchResult(
          has.value,
          headers.get(has.key),
          routeDest
        );
      }
      return { valid: headers.has(has.key) };
    }
    case "cookie": {
      const cookie = cookies[has.key];
      if (cookie && has.value !== void 0) {
        return getHasFieldPCREMatchResult(has.value, cookie, routeDest);
      }
      return { valid: cookie !== void 0 };
    }
    case "query": {
      if (has.value !== void 0) {
        return getHasFieldPCREMatchResult(
          has.value,
          url.searchParams.get(has.key),
          routeDest
        );
      }
      return { valid: url.searchParams.has(has.key) };
    }
  }
}
function getHasFieldPCREMatchResult(hasValue, foundValue, routeDest) {
  const { match, captureGroupKeys } = matchPCRE(hasValue, foundValue);
  if (routeDest && match && captureGroupKeys.length) {
    return {
      valid: !!match,
      newRouteDest: applyPCREMatches(routeDest, match, captureGroupKeys, {
        namedOnly: true
      })
    };
  }
  return { valid: !!match };
}

// ../../../../.nvm/versions/node/v22.12.0/lib/node_modules/@fleek-platform/next/node_modules/@fleek-platform/next-on-fleek/templates/_worker.js/utils/request.ts
function adjustRequestForVercel(request) {
  const adjustedHeaders = new Headers(request.headers);
  if (request.cf) {
    adjustedHeaders.set(
      "x-vercel-ip-city",
      encodeURIComponent(request.cf.city)
    );
    adjustedHeaders.set("x-vercel-ip-country", request.cf.country);
    adjustedHeaders.set(
      "x-vercel-ip-country-region",
      request.cf.regionCode
    );
    adjustedHeaders.set("x-vercel-ip-latitude", request.cf.latitude);
    adjustedHeaders.set(
      "x-vercel-ip-longitude",
      request.cf.longitude
    );
  }
  return new Request(request, { headers: adjustedHeaders });
}

// ../../../../.nvm/versions/node/v22.12.0/lib/node_modules/@fleek-platform/next/node_modules/@fleek-platform/next-on-fleek/templates/_worker.js/utils/http.ts
function applyHeaders(target, source, pcreMatch) {
  const entries = source instanceof Headers ? source.entries() : Object.entries(source);
  for (const [key, value] of entries) {
    const lowerKey = key.toLowerCase();
    const newValue = pcreMatch?.match ? applyPCREMatches(value, pcreMatch.match, pcreMatch.captureGroupKeys) : value;
    if (lowerKey === "set-cookie") {
      target.append(lowerKey, newValue);
    } else {
      target.set(lowerKey, newValue);
    }
  }
}
function isUrl(url) {
  return /^https?:\/\//.test(url);
}
function applySearchParams(target, source) {
  for (const [key, value] of source.entries()) {
    const nxtParamMatch = /^nxtP(.+)$/.exec(key);
    const nxtInterceptMatch = /^nxtI(.+)$/.exec(key);
    if (nxtParamMatch?.[1]) {
      target.set(key, value);
      target.set(nxtParamMatch[1], value);
    } else if (nxtInterceptMatch?.[1]) {
      target.set(nxtInterceptMatch[1], value.replace(/(\(\.+\))+/, ""));
    } else if (!target.has(key) || !!value && !target.getAll(key).includes(value)) {
      target.append(key, value);
    }
  }
}
function createRouteRequest(req, path) {
  const newUrl = new URL(path, req.url);
  applySearchParams(newUrl.searchParams, new URL(req.url).searchParams);
  newUrl.pathname = newUrl.pathname.replace(/\/index.html$/, "/").replace(/\.html$/, "");
  return new Request(newUrl, req);
}
function createMutableResponse(resp) {
  return new Response(resp.body, resp);
}
function parseAcceptLanguage(headerValue) {
  return headerValue.split(",").map((val) => {
    const [lang, qual] = val.split(";");
    const quality = parseFloat((qual ?? "q=1").replace(/q *= */gi, ""));
    return [lang.trim(), isNaN(quality) ? 1 : quality];
  }).sort((a, b) => b[1] - a[1]).map(([locale]) => locale === "*" || locale === "" ? [] : locale).flat();
}

// ../../../../.nvm/versions/node/v22.12.0/lib/node_modules/@fleek-platform/next/node_modules/@fleek-platform/next-on-fleek/templates/_worker.js/utils/routing.ts
function getNextPhase(phase) {
  switch (phase) {
    case "none": {
      return "filesystem";
    }
    case "filesystem": {
      return "rewrite";
    }
    case "rewrite": {
      return "resource";
    }
    case "resource": {
      return "miss";
    }
    default: {
      return "miss";
    }
  }
}
async function runOrFetchBuildOutputItem(item, { request, assetsFetcher, ctx }, { path, searchParams }) {
  let resp = void 0;
  const url = new URL(request.url);
  applySearchParams(url.searchParams, searchParams);
  const req = new Request(url, request);
  try {
    switch (item?.type) {
      case "function":
      case "middleware": {
        const edgeFunction = item.handler;
        try {
          resp = await edgeFunction.default(req, ctx);
        } catch (e) {
          const err = e;
          if (err.name === "TypeError" && err.message.endsWith("default is not a function")) {
            throw new Error(
              `An error occurred while evaluating the target edge function (${item.entrypoint})`
            );
          }
          throw e;
        }
        break;
      }
      case "override": {
        resp = createMutableResponse(
          await assetsFetcher.fetch(createRouteRequest(req, item.path ?? path))
        );
        if (item.headers) {
          applyHeaders(resp.headers, item.headers);
        }
        break;
      }
      case "static": {
        resp = await assetsFetcher.fetch(createRouteRequest(req, path));
        break;
      }
      default: {
        resp = new Response("Not Found", { status: 404 });
      }
    }
  } catch (e) {
    console.error(e);
    return new Response("Internal Server Error", { status: 500 });
  }
  return createMutableResponse(resp);
}
function isLocaleTrailingSlashRegex(src, locales) {
  const prefix = "^//?(?:";
  const suffix = ")/(.*)$";
  if (!src.startsWith(prefix) || !src.endsWith(suffix)) {
    return false;
  }
  const foundLocales = src.slice(prefix.length, -suffix.length).split("|");
  return foundLocales.every((locale) => locales.has(locale));
}

// ../../../../.nvm/versions/node/v22.12.0/lib/node_modules/@fleek-platform/next/node_modules/@fleek-platform/next-on-fleek/templates/_worker.js/utils/images.ts
function isRemotePatternMatch(url, { protocol, hostname, port, pathname }) {
  if (protocol && url.protocol.replace(/:$/, "") !== protocol)
    return false;
  if (!new RegExp(hostname).test(url.hostname))
    return false;
  if (port && !new RegExp(port).test(url.port))
    return false;
  if (pathname && !new RegExp(pathname).test(url.pathname))
    return false;
  return true;
}
function getResizingProperties(request, config) {
  if (request.method !== "GET")
    return void 0;
  const { origin, searchParams } = new URL(request.url);
  const rawUrl = searchParams.get("url");
  const width = Number.parseInt(searchParams.get("w") ?? "", 10);
  const quality = Number.parseInt(searchParams.get("q") ?? "75", 10);
  if (!rawUrl || Number.isNaN(width) || Number.isNaN(quality))
    return void 0;
  if (!config?.sizes?.includes(width))
    return void 0;
  if (quality < 0 || quality > 100)
    return void 0;
  const url = new URL(rawUrl, origin);
  if (url.pathname.endsWith(".svg") && !config?.dangerouslyAllowSVG) {
    return void 0;
  }
  const isProtocolRelative = rawUrl.startsWith("//");
  const isRelative = rawUrl.startsWith("/") && !isProtocolRelative;
  if (!isRelative && !config?.domains?.includes(url.hostname) && !config?.remotePatterns?.find((pattern) => isRemotePatternMatch(url, pattern))) {
    return void 0;
  }
  const acceptHeader = request.headers.get("Accept") ?? "";
  const format = config?.formats?.find((format2) => acceptHeader.includes(format2))?.replace("image/", "");
  return {
    isRelative,
    imageUrl: url,
    options: { width, quality, format }
  };
}
function formatResp(resp, imageUrl, config) {
  const newHeaders = new Headers();
  if (config?.contentSecurityPolicy) {
    newHeaders.set("Content-Security-Policy", config.contentSecurityPolicy);
  }
  if (config?.contentDispositionType) {
    const fileName = imageUrl.pathname.split("/").pop();
    const contentDisposition = fileName ? `${config.contentDispositionType}; filename="${fileName}"` : config.contentDispositionType;
    newHeaders.set("Content-Disposition", contentDisposition);
  }
  if (!resp.headers.has("Cache-Control")) {
    newHeaders.set(
      "Cache-Control",
      `public, max-age=${config?.minimumCacheTTL ?? 60}`
    );
  }
  const mutableResponse = createMutableResponse(resp);
  applyHeaders(mutableResponse.headers, newHeaders);
  return mutableResponse;
}
async function handleImageResizingRequest(request, { buildOutput, assetsFetcher, imagesConfig }) {
  const opts = getResizingProperties(request, imagesConfig);
  if (!opts) {
    return new Response("Invalid image resizing request", { status: 400 });
  }
  const { isRelative, imageUrl } = opts;
  const imgFetch = isRelative && imageUrl.pathname in buildOutput ? assetsFetcher.fetch.bind(assetsFetcher) : fetch;
  const imageResp = await imgFetch(imageUrl);
  return formatResp(imageResp, imageUrl, imagesConfig);
}

// ../../../../.nvm/versions/node/v22.12.0/lib/node_modules/@fleek-platform/next/node_modules/@fleek-platform/next-on-fleek/templates/_worker.js/routes-matcher.ts
function decode(str) {
  return str.indexOf("%") !== -1 ? decodeURIComponent(str) : str;
}
function tryDecode(str, decode2) {
  try {
    return decode2(str);
  } catch (e) {
    return str;
  }
}
function parse(str, options) {
  if (typeof str !== "string") {
    throw new TypeError("argument str must be a string");
  }
  const obj = {};
  const opt = options || {};
  const dec = opt.decode || decode;
  let index = 0;
  while (index < str.length) {
    const eqIdx = str.indexOf("=", index);
    if (eqIdx === -1) {
      break;
    }
    let endIdx = str.indexOf(";", index);
    if (endIdx === -1) {
      endIdx = str.length;
    } else if (endIdx < eqIdx) {
      index = str.lastIndexOf(";", eqIdx - 1) + 1;
      continue;
    }
    const key = str.slice(index, eqIdx).trim();
    if (void 0 === obj[key]) {
      let val = str.slice(eqIdx + 1, endIdx).trim();
      if (val.charCodeAt(0) === 34) {
        val = val.slice(1, -1);
      }
      obj[key] = tryDecode(val, dec);
    }
    index = endIdx + 1;
  }
  return obj;
}
var RoutesMatcher = class {
  constructor(routes, output, reqCtx, buildMetadata, wildcardConfig) {
    this.routes = routes;
    this.output = output;
    this.reqCtx = reqCtx;
    this.url = new URL(reqCtx.request.url);
    this.cookies = parse(reqCtx.request.headers.get("cookie") || "");
    this.path = this.url.pathname || "/";
    this.headers = { normal: new Headers(), important: new Headers() };
    this.searchParams = new URLSearchParams();
    applySearchParams(this.searchParams, this.url.searchParams);
    this.checkPhaseCounter = 0;
    this.middlewareInvoked = [];
    this.wildcardMatch = wildcardConfig?.find(
      (w) => w.domain === this.url.hostname
    );
    this.locales = new Set(buildMetadata.collectedLocales);
  }
  url;
  cookies;
  wildcardMatch;
  path;
  status;
  headers;
  searchParams;
  body;
  checkPhaseCounter;
  middlewareInvoked;
  locales;
  checkRouteMatch(route, {
    checkStatus,
    checkIntercept
  }) {
    const srcMatch = matchPCRE(route.src, this.path, route.caseSensitive);
    if (!srcMatch.match)
      return;
    if (route.methods && !route.methods.map((m) => m.toUpperCase()).includes(this.reqCtx.request.method.toUpperCase())) {
      return;
    }
    const hasFieldProps = {
      url: this.url,
      cookies: this.cookies,
      headers: this.reqCtx.request.headers,
      routeDest: route.dest
    };
    if (route.has?.find((has) => {
      const result = checkhasField(has, hasFieldProps);
      if (result.newRouteDest) {
        hasFieldProps.routeDest = result.newRouteDest;
      }
      return !result.valid;
    })) {
      return;
    }
    if (route.missing?.find((has) => checkhasField(has, hasFieldProps).valid)) {
      return;
    }
    if (checkStatus && route.status !== this.status) {
      return;
    }
    if (checkIntercept && route.dest) {
      const interceptRouteRegex = /\/(\(\.+\))+/;
      const destIsIntercept = interceptRouteRegex.test(route.dest);
      const pathIsIntercept = interceptRouteRegex.test(this.path);
      if (destIsIntercept && !pathIsIntercept) {
        return;
      }
    }
    return { routeMatch: srcMatch, routeDest: hasFieldProps.routeDest };
  }
  processMiddlewareResp(resp) {
    const overrideKey = "x-middleware-override-headers";
    const overrideHeader = resp.headers.get(overrideKey);
    if (overrideHeader) {
      const overridenHeaderKeys = new Set(
        overrideHeader.split(",").map((h) => h.trim())
      );
      for (const key of overridenHeaderKeys.keys()) {
        const valueKey = `x-middleware-request-${key}`;
        const value = resp.headers.get(valueKey);
        if (this.reqCtx.request.headers.get(key) !== value) {
          if (value) {
            this.reqCtx.request.headers.set(key, value);
          } else {
            this.reqCtx.request.headers.delete(key);
          }
        }
        resp.headers.delete(valueKey);
      }
      resp.headers.delete(overrideKey);
    }
    const rewriteKey = "x-middleware-rewrite";
    const rewriteHeader = resp.headers.get(rewriteKey);
    if (rewriteHeader) {
      const newUrl = new URL(rewriteHeader, this.url);
      const rewriteIsExternal = this.url.hostname !== newUrl.hostname;
      this.path = rewriteIsExternal ? `${newUrl}` : newUrl.pathname;
      applySearchParams(this.searchParams, newUrl.searchParams);
      resp.headers.delete(rewriteKey);
    }
    const middlewareNextKey = "x-middleware-next";
    const middlewareNextHeader = resp.headers.get(middlewareNextKey);
    if (middlewareNextHeader) {
      resp.headers.delete(middlewareNextKey);
    } else if (!rewriteHeader && !resp.headers.has("location")) {
      this.body = resp.body;
      this.status = resp.status;
    } else if (resp.headers.has("location") && resp.status >= 300 && resp.status < 400) {
      this.status = resp.status;
    }
    applyHeaders(this.reqCtx.request.headers, resp.headers);
    applyHeaders(this.headers.normal, resp.headers);
    this.headers.middlewareLocation = resp.headers.get("location");
  }
  async runRouteMiddleware(path) {
    if (!path)
      return true;
    const item = path && this.output[path];
    if (!item || item.type !== "middleware") {
      this.status = 500;
      return false;
    }
    const resp = await runOrFetchBuildOutputItem(item, this.reqCtx, {
      path: this.path,
      searchParams: this.searchParams,
      headers: this.headers,
      status: this.status
    });
    this.middlewareInvoked.push(path);
    if (resp.status === 500) {
      this.status = resp.status;
      return false;
    }
    this.processMiddlewareResp(resp);
    return true;
  }
  applyRouteOverrides(route) {
    if (!route.override)
      return;
    this.status = void 0;
    this.headers.normal = new Headers();
    this.headers.important = new Headers();
  }
  applyRouteHeaders(route, srcMatch, captureGroupKeys) {
    if (!route.headers)
      return;
    applyHeaders(this.headers.normal, route.headers, {
      match: srcMatch,
      captureGroupKeys
    });
    if (route.important) {
      applyHeaders(this.headers.important, route.headers, {
        match: srcMatch,
        captureGroupKeys
      });
    }
  }
  applyRouteStatus(route) {
    if (!route.status)
      return;
    this.status = route.status;
  }
  applyRouteDest(route, srcMatch, captureGroupKeys) {
    if (!route.dest)
      return this.path;
    const prevPath = this.path;
    let processedDest = route.dest;
    if (this.wildcardMatch && /\$wildcard/.test(processedDest)) {
      processedDest = processedDest.replace(
        /\$wildcard/g,
        this.wildcardMatch.value
      );
    }
    this.path = applyPCREMatches(processedDest, srcMatch, captureGroupKeys);
    const isRscIndex = /\/index\.rsc$/i.test(this.path);
    const isPrevAbsoluteIndex = /^\/(?:index)?$/i.test(prevPath);
    const isPrevPrefetchRscIndex = /^\/__index\.prefetch\.rsc$/i.test(prevPath);
    if (isRscIndex && !isPrevAbsoluteIndex && !isPrevPrefetchRscIndex) {
      this.path = prevPath;
    }
    const isRsc = /\.rsc$/i.test(this.path);
    const isPrefetchRsc = /\.prefetch\.rsc$/i.test(this.path);
    const pathExistsInOutput = this.path in this.output;
    if (isRsc && !isPrefetchRsc && !pathExistsInOutput) {
      this.path = this.path.replace(/\.rsc/i, "");
    }
    const destUrl = new URL(this.path, this.url);
    applySearchParams(this.searchParams, destUrl.searchParams);
    if (!isUrl(this.path))
      this.path = destUrl.pathname;
    return prevPath;
  }
  applyLocaleRedirects(route) {
    if (!route.locale?.redirect)
      return;
    const srcIsRegex = /^\^(.)*$/.test(route.src);
    if (!srcIsRegex && route.src !== this.path)
      return;
    if (this.headers.normal.has("location"))
      return;
    const {
      locale: { redirect: redirects, cookie: cookieName }
    } = route;
    const cookieValue = cookieName && this.cookies[cookieName];
    const cookieLocales = parseAcceptLanguage(cookieValue ?? "");
    const headerLocales = parseAcceptLanguage(
      this.reqCtx.request.headers.get("accept-language") ?? ""
    );
    const locales = [...cookieLocales, ...headerLocales];
    const redirectLocales = locales.map((locale) => redirects[locale]).filter(Boolean);
    const redirectValue = redirectLocales[0];
    if (redirectValue) {
      const needsRedirecting = !this.path.startsWith(redirectValue);
      if (needsRedirecting) {
        this.headers.normal.set("location", redirectValue);
        this.status = 307;
      }
      return;
    }
  }
  getLocaleFriendlyRoute(route, phase) {
    if (!this.locales || phase !== "miss") {
      return route;
    }
    if (isLocaleTrailingSlashRegex(route.src, this.locales)) {
      return {
        ...route,
        src: route.src.replace(/\/\(\.\*\)\$$/, "(?:/(.*))?$")
      };
    }
    return route;
  }
  async checkRoute(phase, rawRoute) {
    const localeFriendlyRoute = this.getLocaleFriendlyRoute(rawRoute, phase);
    const { routeMatch, routeDest } = this.checkRouteMatch(localeFriendlyRoute, {
      checkStatus: phase === "error",
      checkIntercept: phase === "rewrite"
    }) ?? {};
    const route = { ...localeFriendlyRoute, dest: routeDest };
    if (!routeMatch?.match)
      return "skip";
    if (route.middlewarePath && this.middlewareInvoked.includes(route.middlewarePath)) {
      return "skip";
    }
    const { match: srcMatch, captureGroupKeys } = routeMatch;
    this.applyRouteOverrides(route);
    this.applyLocaleRedirects(route);
    const success = await this.runRouteMiddleware(route.middlewarePath);
    if (!success)
      return "error";
    if (this.body !== void 0 || this.headers.middlewareLocation) {
      return "done";
    }
    this.applyRouteHeaders(route, srcMatch, captureGroupKeys);
    this.applyRouteStatus(route);
    const prevPath = this.applyRouteDest(route, srcMatch, captureGroupKeys);
    if (route.check && !isUrl(this.path)) {
      if (prevPath === this.path) {
        if (phase !== "miss") {
          return this.checkPhase(getNextPhase(phase));
        }
        this.status = 404;
      } else if (phase === "miss") {
        if (!(this.path in this.output) && !(this.path.replace(/\/$/, "") in this.output)) {
          return this.checkPhase("filesystem");
        }
        if (this.status === 404) {
          this.status = void 0;
        }
      } else {
        return this.checkPhase("none");
      }
    }
    if (!route.continue) {
      return "done";
    }
    const isRedirect = route.status && route.status >= 300 && route.status <= 399;
    if (isRedirect) {
      return "done";
    }
    return "next";
  }
  async checkPhase(phase) {
    if (this.checkPhaseCounter++ >= 50) {
      console.error(
        `Routing encountered an infinite loop while checking ${this.url.pathname}`
      );
      this.status = 500;
      return "error";
    }
    this.middlewareInvoked = [];
    let shouldContinue = true;
    for (const route of this.routes[phase]) {
      const result = await this.checkRoute(phase, route);
      if (result === "error") {
        return "error";
      }
      if (result === "done") {
        shouldContinue = false;
        break;
      }
    }
    if (phase === "hit" || isUrl(this.path) || this.headers.normal.has("location") || !!this.body) {
      return "done";
    }
    if (phase === "none") {
      for (const locale of this.locales) {
        const localeRegExp = new RegExp(`/${locale}(/.*)`);
        const match = this.path.match(localeRegExp);
        const pathWithoutLocale = match?.[1];
        if (pathWithoutLocale && pathWithoutLocale in this.output) {
          this.path = pathWithoutLocale;
          break;
        }
      }
    }
    let pathExistsInOutput = this.path in this.output;
    if (!pathExistsInOutput && this.path.endsWith("/")) {
      const newPath = this.path.replace(/\/$/, "");
      pathExistsInOutput = newPath in this.output;
      if (pathExistsInOutput) {
        this.path = newPath;
      }
    }
    if (phase === "miss" && !pathExistsInOutput) {
      const should404 = !this.status || this.status < 400;
      this.status = should404 ? 404 : this.status;
    }
    let nextPhase = "miss";
    if (pathExistsInOutput || phase === "miss" || phase === "error") {
      nextPhase = "hit";
    } else if (shouldContinue) {
      nextPhase = getNextPhase(phase);
    }
    return this.checkPhase(nextPhase);
  }
  async run(phase = "none") {
    this.checkPhaseCounter = 0;
    const result = await this.checkPhase(phase);
    if (this.headers.normal.has("location") && (!this.status || this.status < 300 || this.status >= 400)) {
      this.status = 307;
    }
    return result;
  }
};

// ../../../../.nvm/versions/node/v22.12.0/lib/node_modules/@fleek-platform/next/node_modules/@fleek-platform/next-on-fleek/templates/_worker.js/handleRequest.ts
async function handleRequest(reqCtx, config, output, buildMetadata) {
  const matcher = new RoutesMatcher(
    config.routes,
    output,
    reqCtx,
    buildMetadata,
    config.wildcard
  );
  const match = await findMatch(matcher);
  return generateResponse(reqCtx, match, output);
}
async function findMatch(matcher, phase = "none", skipErrorMatch = false) {
  const result = await matcher.run(phase);
  if (result === "error" || !skipErrorMatch && matcher.status && matcher.status >= 400) {
    return findMatch(matcher, "error", true);
  }
  return {
    path: matcher.path,
    status: matcher.status,
    headers: matcher.headers,
    searchParams: matcher.searchParams,
    body: matcher.body
  };
}
async function generateResponse(reqCtx, { path = "/404", status, headers, searchParams, body }, output) {
  const locationHeader = headers.normal.get("location");
  if (locationHeader) {
    if (locationHeader !== headers.middlewareLocation) {
      const paramsStr = [...searchParams.keys()].length ? `?${searchParams.toString()}` : "";
      headers.normal.set("location", `${locationHeader ?? "/"}${paramsStr}`);
    }
    return new Response(null, { status, headers: headers.normal });
  }
  let resp;
  if (body !== void 0) {
    resp = new Response(body, { status });
  } else if (isUrl(path)) {
    const url = new URL(path);
    applySearchParams(url.searchParams, searchParams);
    resp = await fetch(url, reqCtx.request);
  } else {
    resp = await runOrFetchBuildOutputItem(output[path], reqCtx, {
      path,
      status,
      headers,
      searchParams
    });
  }
  const newHeaders = headers.normal;
  applyHeaders(newHeaders, resp.headers);
  applyHeaders(newHeaders, headers.important);
  resp = new Response(resp.body, {
    ...resp,
    status: status || resp.status,
    headers: newHeaders
  });
  return resp;
}

// ../../../../.nvm/versions/node/v22.12.0/lib/node_modules/@fleek-platform/next/node_modules/@fleek-platform/next-on-fleek/templates/_worker.js/index.ts
async function main(fleekRequest) {
  globalThis.AsyncLocalStorage = AsyncLocalStorage;
  const envAsyncLocalStorage = new AsyncLocalStorage();
  const requestContextAsyncLocalStorage = new AsyncLocalStorage();
  globalThis.process = {
    env: new Proxy(
      {},
      {
        ownKeys: () => Reflect.ownKeys(envAsyncLocalStorage.getStore()),
        getOwnPropertyDescriptor: (_, ...args) => Reflect.getOwnPropertyDescriptor(
          envAsyncLocalStorage.getStore(),
          ...args
        ),
        get: (_, property) => Reflect.get(envAsyncLocalStorage.getStore(), property),
        set: (_, property, value) => Reflect.set(
          envAsyncLocalStorage.getStore(),
          property,
          value
        )
      }
    )
  };
  globalThis[Symbol.for("__fleek-request-context__")] = new Proxy(
    {},
    {
      ownKeys: () => Reflect.ownKeys(requestContextAsyncLocalStorage.getStore()),
      getOwnPropertyDescriptor: (_, ...args) => Reflect.getOwnPropertyDescriptor(
        requestContextAsyncLocalStorage.getStore(),
        ...args
      ),
      get: (_, property) => Reflect.get(
        requestContextAsyncLocalStorage.getStore(),
        property
      ),
      set: (_, property, value) => Reflect.set(
        requestContextAsyncLocalStorage.getStore(),
        property,
        value
      )
    }
  );
  const request = await adaptFleekRequestToFetch(fleekRequest);
  return envAsyncLocalStorage.run({}, async () => {
    return requestContextAsyncLocalStorage.run({ request }, async () => {
      const url = new URL(request.url);
      if (url.pathname.startsWith("/_next/image")) {
        const res2 = await handleImageResizingRequest(request, {
          buildOutput: __BUILD_OUTPUT__,
          assetsFetcher: globalThis.ASSETS,
          imagesConfig: define_CONFIG_default.images
        });
        return adaptFetchResponseToFleekResponse(res2);
      }
      const adjustedRequest = adjustRequestForVercel(request);
      const res = await handleRequest(
        {
          request: adjustedRequest,
          ctx: globalThis.CONTEXT,
          assetsFetcher: globalThis.ASSETS
        },
        define_CONFIG_default,
        __BUILD_OUTPUT__,
        define_BUILD_METADATA_default
      );
      const response = await adaptFetchResponseToFleekResponse(res);
      return response;
    });
  });
}
async function adaptFleekRequestToFetch(fleekRequest) {
  let url;
  if (fleekRequest.headers?.["origin"]) {
    url = new URL(`${fleekRequest.headers["origin"]}${fleekRequest.path}`);
  } else {
    url = new URL(`http://0.0.0.0${fleekRequest.path}`);
  }
  for (const [key, value] of Object.entries(fleekRequest.query ?? {})) {
    url.searchParams.append(key, value);
  }
  return new Request(url, {
    method: fleekRequest.method,
    headers: fleekRequest.headers,
    body: !fleekRequest.body ? null : typeof fleekRequest.body === "object" ? JSON.stringify(fleekRequest.body) : fleekRequest.body
  });
}
async function adaptFetchResponseToFleekResponse(response) {
  const headers = {};
  response.headers.forEach((value, key) => {
    headers[key] = value;
  });
  return {
    status: response.status,
    headers,
    body: await response.bytes()
  };
}
export {
  main
};
