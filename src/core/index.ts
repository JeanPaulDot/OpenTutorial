/**
 * Core entry point — framework-agnostic and React-free.
 *
 * React lives at `@opentutorial/core/react`, Vue at `/vue`, Svelte at `/svelte`,
 * the custom element at `/webcomponent`. Importing this module never pulls a UI
 * framework into your bundle.
 */

// Engine + orchestration
export { TourEngine } from './engine';
export { TourOrchestrator } from './orchestrator';
export type { OrchestratorOptions } from './orchestrator';
export { installTrigger } from './triggers';
export type { TriggerHandle } from './triggers';

// Authoring helpers
export { createTour, createTours, defineSpec, defineStep, extendSpec } from './factory';
export type { SpecStepId } from './factory';

// Validation
export { validateSpec, validateSpecs, assertValidSpec } from './schema';
export { evaluateShowIf, evaluateExpression, checkExpression } from './safeEval';
export type { EvalOptions } from './safeEval';

// Content
export { renderInline, renderMarkdown, hasBlockMarkdown, escapeHtml } from './markdown';
export type { InlineOptions } from './markdown';

export { normalizeContent, renderBlocks, blocksToText } from './content';
export type { RenderBlocksOptions } from './content';

// Experiments — variant assignment for A/B testing tours
export { assignVariant, assignAll } from './experiments';
export type { VariantSpec, VariantInput, AssignOptions } from './experiments';

// Persistence
export { TourPersistence } from './persist';
export type { PersistedRoot, PersistedTour, ActiveRecord } from './persist';
export {
  MemoryStorage,
  createMemoryStorage,
  createCookieStorage,
  createIndexedDBStorage,
  createRemoteStorage,
} from './storage';
export type { RemoteStorageOptions } from './storage/remote';

// DOM utilities
export { resolveTarget, resolveTargets, waitForTarget, waitForElement, safeQuery, queryDeep, isVisible, describeTarget } from './dom/target';
export type { ResolvedTarget } from './dom/target';
export { currentPath, matchPath, onLocationChange } from './dom/navigation';

// Vanilla adapter — no framework required
export { createTutorialLayer } from './adapters/vanilla';
export type { VanillaTutorialLayer, VanillaOptions, VanillaEventName } from './adapters/vanilla';

// Guidance surfaces — framework-free factories, usable from any adapter
export {
  createBanner,
  createAnnouncement,
  createHint,
  createSurvey,
  createChecklist,
  createResourceCenter,
  createChangelog,
  SurfaceState,
} from './surfaces';
export type {
  AnnouncementHandle, AnnouncementOptions,
  BannerHandle, BannerOptions,
  ChangelogEntry, ChangelogHandle, ChangelogOptions,
  ChecklistHandle, ChecklistOptions, ChecklistStatus,
  DismissibleOptions,
  HintHandle, HintOptions,
  ResourceCenterHandle, ResourceCenterOptions, ResourceLink,
  SurfaceHandle,
  SurveyHandle, SurveyKind, SurveyOptions, SurveyResponse,
  TourController,
} from './surfaces';

// Analytics
export {
  createPostHogAdapter,
  createMixpanelAdapter,
  createAmplitudeAdapter,
  createSegmentAdapter,
  createRudderStackAdapter,
  createHeapAdapter,
  createGA4Adapter,
  createDatadogAdapter,
  createDebugAdapter,
  createMultiAdapter,
  createHttpAdapter,
  createFunnelReport,
  createEventCollector,
  filterEvents,
  withSampling,
  withEventTypes,
  shouldSample,
} from './analytics';
export type { HttpAdapterOptions, FunnelReport, FunnelStep, SamplingOptions } from './analytics';

// i18n
export {
  resolveText, interpolate, createKeyResolver, createLocaleResolver,
  resolveLabel, selectPlural, localeDirection, DEFAULT_LABELS,
} from './i18n';
export type { PluralCategory, PluralForms, LabelKey } from './i18n';

// Styles, for shadow-DOM hosts that inject them manually
export { CSS } from './styles';

// Types
export type {
  AdvanceOn,
  AnalyticsAdapter,
  ContentBlock,
  CreateTourOptions,
  Density,
  Direction,
  DisplayMode,
  FrequencyRule,
  I18nContent,
  I18nResolver,
  InteractionMode,
  IssueSeverity,
  KeyValueStorage,
  NextRule,
  NextSpec,
  Placement,
  ProgressRecord,
  SpecError,
  SpecIssue,
  StepAction,
  StepButtons,
  StepContent,
  StepRenderContext,
  ThemeOverrides,
  TourEvent,
  TourEventType,
  TourState,
  TourStatus,
  TourStep,
  TourTarget,
  TourTrigger,
  TutorialSpec,
  ValidationResult,
} from './types';
