# Third-Party Software Licenses

This document lists the open-source libraries used by **UnitTo** along with their license types.

Generated from `package.json` (production + dev dependencies).  
Last updated: 2026-07-12.

---

## Production Dependencies

| Package | Version | License | Source |
|---------|---------|---------|--------|
| `next` | 16.2.10 | MIT | [github.com/vercel/next.js](https://github.com/vercel/next.js) |
| `react` | 19.2.4 | MIT | [github.com/facebook/react](https://github.com/facebook/react) |
| `react-dom` | 19.2.4 | MIT | [github.com/facebook/react](https://github.com/facebook/react) |

---

## Development Dependencies

| Package | Version | License | Source |
|---------|---------|---------|--------|
| `@tailwindcss/postcss` | ^4 | MIT | [github.com/tailwindlabs/tailwindcss](https://github.com/tailwindlabs/tailwindcss) |
| `@types/node` | ^20 | MIT | [github.com/DefinitelyTyped/DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped) |
| `@types/react` | ^19 | MIT | [github.com/DefinitelyTyped/DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped) |
| `@types/react-dom` | ^19 | MIT | [github.com/DefinitelyTyped/DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped) |
| `eslint` | ^9 | MIT | [github.com/eslint/eslint](https://github.com/eslint/eslint) |
| `eslint-config-next` | 16.2.10 | MIT | [github.com/vercel/next.js](https://github.com/vercel/next.js) |
| `tailwindcss` | ^4 | MIT | [github.com/tailwindlabs/tailwindcss](https://github.com/tailwindlabs/tailwindcss) |
| `typescript` | ^5 | Apache-2.0 | [github.com/microsoft/TypeScript](https://github.com/microsoft/TypeScript) |
| `vitest` | ^4.1.10 | MIT | [github.com/vitest-dev/vitest](https://github.com/vitest-dev/vitest) |

---

## Fonts

| Font | License | Source |
|------|---------|--------|
| Geist Sans | MIT | [vercel.com/font](https://vercel.com/font) |
| Geist Mono | MIT | [vercel.com/font](https://vercel.com/font) |

---

## Notes

- All production dependencies are **MIT-licensed**, permitting free commercial use without attribution requirements in the UI.
- `typescript` is **Apache-2.0**, which is also permissive and compatible with commercial projects.
- No GPL or LGPL packages are included. No copyleft obligations apply.

> To regenerate this file automatically, run:
> ```bash
> npx license-checker --production --csv > third-party-licenses.csv
> ```
