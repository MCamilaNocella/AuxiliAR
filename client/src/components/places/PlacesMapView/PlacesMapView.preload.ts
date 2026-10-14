// Leaflet and its styles are downloaded apart from the app, as soon as the explorer shows (before the map is opened), so the
// map shows with no loading message
const loadPlacesMap = () => import("../PlacesMap/PlacesMap")
let mapDownload: ReturnType<typeof loadPlacesMap> | undefined

/** Downloads the map ahead (once): the explorer calls it as soon as it shows, and the map view waits on the same download */
export const preloadPlacesMap = () => (mapDownload ??= loadPlacesMap())
