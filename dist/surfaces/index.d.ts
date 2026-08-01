/**
 * Guidance surfaces beyond step-through tours, as framework-free factories.
 *
 * Each is a function that builds DOM and returns a handle with `destroy()`.
 * The React package wraps these same primitives, so a Vue, Svelte, Angular,
 * Solid, Web Component or plain-script app gets identical markup, styling and
 * persistence behaviour without a React dependency.
 *
 * ```ts
 * import { createChecklist } from '@opentutorial/core';
 *
 * const checklist = createChecklist({ layer, floating: true, collapsible: true });
 * // …later
 * checklist.destroy();
 * ```
 */
export { createBanner } from './banner';
export type { BannerOptions, BannerHandle } from './banner';
export { createAnnouncement } from './announcement';
export type { AnnouncementOptions, AnnouncementHandle } from './announcement';
export { createHint } from './hint';
export type { HintOptions, HintHandle } from './hint';
export { createSurvey } from './survey';
export type { SurveyOptions, SurveyHandle, SurveyKind, SurveyResponse } from './survey';
export { createChecklist } from './checklist';
export type { ChecklistOptions, ChecklistHandle, ChecklistStatus } from './checklist';
export { createResourceCenter } from './resourceCenter';
export type { ResourceCenterOptions, ResourceCenterHandle, ResourceLink } from './resourceCenter';
export { createChangelog } from './changelog';
export type { ChangelogOptions, ChangelogHandle, ChangelogEntry } from './changelog';
export type { TourController } from './controller';
export type { SurfaceHandle, DismissibleOptions } from './shared';
export { SurfaceState } from './shared';
