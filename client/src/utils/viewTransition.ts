/*
 * view-transition-name for the parts shared between a category card and its screen:
 * the browser morphs each one from its old position to the new one when navigating.
 * Names must be unique on the page, hence the category id.
 */
export const categoryIconTransition = (id: string) => `category-icon-${id}`
export const categoryTitleTransition = (id: string) => `category-title-${id}`
