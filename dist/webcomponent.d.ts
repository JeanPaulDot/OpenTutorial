/**
 * Custom element entry point — `@opentutorial/core/webcomponent`.
 *
 * Importing this module registers `<open-tutorial>` automatically, which is what
 * a plain `<script type="module">` tag needs. Import `defineOpenTutorialElement`
 * from the core entry instead if you want to control the tag name.
 */
export * from './index';
export { OpenTutorialElement, defineOpenTutorialElement } from './adapters/webcomponent';
