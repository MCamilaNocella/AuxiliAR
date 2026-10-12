/**
 * Backend base URL: VITE_API_URL (a repo variable in the GitHub Pages build, or client/.env locally),
 * the local Spring server if it's unset or empty. No trailing slash, so paths join cleanly.
 */
export const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:8080").replace(/\/+$/, "")
