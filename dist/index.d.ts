/**
 * Core entry point — framework-agnostic and React-free.
 *
 * React lives at `@opentutorial/core/react`, Vue at `/vue`, Svelte at `/svelte`,
 * the custom element at `/webcomponent`. Importing this module never pulls a UI
 * framework into your bundle.
 */
export { TourEngine } from './engine';
export { TourOrchestrator } from './orchestrator';
export type { OrchestratorOptions } from './orchestrator';
export { installTrigger } from './triggers';
export type { TriggerHandle } from './triggers';
export { createTour, createTours, defineSpec, defineStep, extendSpec } from './factory';
export type { SpecStepId } from './factory';
export { validateSpec, validateSpecs, assertValidSpec } from './schema';
export { evaluateShowIf, evaluateExpression, checkExpression } from './safeEval';
export type { EvalOptions } from './safeEval';
export { renderInline, renderMarkdown, hasBlockMarkdown, escapeHtml } from './markdown';
export type { InlineOptions } from './markdown';
export { normalizeContent, renderBlocks, blocksToText } from './content';
export type { RenderBlocksOptions } from './content';
export { assignVariant, assignAll } from './experiments';
export type { VariantSpec, VariantInput, AssignOptions } from './experiments';
export { TourPersistence } from './persist';
export type { PersistedRoot, PersistedTour, ActiveRecord } from './persist';
export { MemoryStorage, createMemoryStorage, createCookieStorage, createIndexedDBStorage, createRemoteStorage, } from './storage';
export type { RemoteStorageOptions } from './storage/remote';
export { resolveTarget, resolveTargets, waitForTarget, waitForElement, safeQuery, queryDeep, isVisible, describeTarget } from './dom/target';
export type { ResolvedTarget } from './dom/target';
export { currentPath, matchPath, onLocationChange } from './dom/navigation';
export { createTutorialLayer } from './adapters/vanilla';
export type { VanillaTutorialLayer, VanillaOptions, VanillaEventName } from './adapters/vanilla';
export { createBanner, createAnnouncement, createHint, createSurvey, createChecklist, createResourceCenter, createChangelog, SurfaceState, } from './surfaces';
export type { AnnouncementHandle, AnnouncementOptions, BannerHandle, BannerOptions, ChangelogEntry, ChangelogHandle, ChangelogOptions, ChecklistHandle, ChecklistOptions, ChecklistStatus, DismissibleOptions, HintHandle, HintOptions, ResourceCenterHandle, ResourceCenterOptions, ResourceLink, SurfaceHandle, SurveyHandle, SurveyKind, SurveyOptions, SurveyResponse, TourController, } from './surfaces';
export { createPostHogAdapter, createMixpanelAdapter, createAmplitudeAdapter, createSegmentAdapter, createRudderStackAdapter, createHeapAdapter, createGA4Adapter, createDatadogAdapter, createDebugAdapter, createMultiAdapter, createHttpAdapter, createFunnelReport, createEventCollector, filterEvents, withSampling, withEventTypes, shouldSample, } from './analytics';
export type { HttpAdapterOptions, FunnelReport, FunnelStep, SamplingOptions } from './analytics';
export { resolveText, interpolate, createKeyResolver, createLocaleResolver, resolveLabel, selectPlural, localeDirection, DEFAULT_LABELS, } from './i18n';
export type { PluralCategory, PluralForms, LabelKey } from './i18n';
export { CSS } from './styles';
export type { AdvanceOn, AnalyticsAdapter, ContentBlock, CreateTourOptions, Density, Direction, DisplayMode, FrequencyRule, I18nContent, I18nResolver, InteractionMode, IssueSeverity, KeyValueStorage, NextRule, NextSpec, Placement, ProgressRecord, SpecError, SpecIssue, StepAction, StepButtons, StepContent, StepRenderContext, ThemeOverrides, TourEvent, TourEventType, TourState, TourStatus, TourStep, TourTarget, TourTrigger, TutorialSpec, ValidationResult, } from './types';
