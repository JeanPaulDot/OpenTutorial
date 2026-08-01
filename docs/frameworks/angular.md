# Angular

`@angular/core` is never imported. A decorator like `@Injectable` would pull
Angular into `dependencies` and pin a major version, so the package ships a plain
class you register with a factory provider — which works the same in every
Angular version that supports standalone providers.

## Register

```ts
// app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideOpenTutorial } from '@opentutorial/core/angular';
import { specs } from './tours';

export const appConfig: ApplicationConfig = {
  providers: [
    provideOpenTutorial({ specs, context: { plan: 'trial' } }),
  ],
};
```

Add the stylesheet in `angular.json` or your global styles:

```scss
@import '@opentutorial/core/styles.css';
```

`OpenTutorialService` is its own DI token, so you never need an
`InjectionToken`. Angular destroys the injector, Angular calls `ngOnDestroy`,
and the layer tears itself down.

## Inject

```ts
import { Component, inject } from '@angular/core';
import { OpenTutorialService } from '@opentutorial/core/angular';

@Component({
  selector: 'app-home',
  standalone: true,
  template: `
    <button data-tour="start" (click)="tours.start('welcome')">
      Take the tour
    </button>
  `,
})
export class HomeComponent {
  protected readonly tours = inject(OpenTutorialService);
}
```

## Signals

`state$` is `Observable`-shaped, so `toSignal` accepts it directly:

```ts
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { OpenTutorialService } from '@opentutorial/core/angular';

@Component({
  selector: 'app-tour-status',
  standalone: true,
  template: `
    @if (state().activeId) {
      <span>Step {{ (state().state?.index ?? 0) + 1 }} of {{ state().state?.total }}</span>
    }
  `,
})
export class TourStatusComponent {
  private readonly tours = inject(OpenTutorialService);
  protected readonly state = toSignal(this.tours.state$, {
    initialValue: this.tours.snapshot(),
  });
}
```

The same works with the `async` pipe:

```html
<ng-container *ngIf="tours.state$ | async as tour">
  <span *ngIf="tour.activeId">Tour running</span>
</ng-container>
```

## Service API

| Member | Notes |
|---|---|
| `layer` | The underlying vanilla layer, for anything not delegated. |
| `start(id, stepId?)` / `request(id, stepId?)` | |
| `stop()` / `pause()` / `resume()` | |
| `next()` / `prev()` / `goTo(stepId)` | |
| `hasSeen(id)` / `whyBlocked(id)` | |
| `setContext(patch)` / `setUser(userId)` | |
| `snapshot()` | `{ activeId, state }`, read once. |
| `state$` | Observable-shaped stream of snapshots. |
| `events$` | Observable-shaped stream of `TourEvent`. |
| `ngOnDestroy()` | Called by Angular. |

Anything else lives on `layer`:

```ts
this.tours.layer.exportProgress();
this.tours.layer.setTheme({ accent: '#0f766e' });
```

## Anchors

Plain attributes:

```html
<button data-tour="new-project">New project</button>
```

Or a three-line directive if you prefer:

```ts
import { Directive, ElementRef, Input, inject } from '@angular/core';

@Directive({ selector: '[tourAnchor]', standalone: true })
export class TourAnchorDirective {
  private readonly el = inject(ElementRef<HTMLElement>);
  @Input({ required: true }) set tourAnchor(id: string) {
    this.el.nativeElement.setAttribute('data-tour', id);
  }
}
```

## Router

```ts
import { Router } from '@angular/router';

provideOpenTutorial({
  specs,
  onNavigate: (path) => inject(Router).navigateByUrl(path),
});
```

`route` triggers and `advanceOn: 'url-match'` already observe `history.pushState`,
so Angular Router navigations fire them without extra wiring.

## Guidance surfaces

The surfaces are framework-free factories:

```ts
import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild, inject } from '@angular/core';
import { createChecklist, type ChecklistHandle } from '@opentutorial/core';
import { OpenTutorialService } from '@opentutorial/core/angular';

@Component({
  selector: 'app-onboarding',
  standalone: true,
  template: '<div #host></div>',
})
export class OnboardingComponent implements AfterViewInit, OnDestroy {
  @ViewChild('host') host!: ElementRef<HTMLElement>;
  private readonly tours = inject(OpenTutorialService);
  private checklist?: ChecklistHandle;

  ngAfterViewInit() {
    this.checklist = createChecklist({
      layer: this.tours.layer,
      container: this.host.nativeElement,
      collapsible: true,
    });
  }

  ngOnDestroy() { this.checklist?.destroy(); }
}
```

## Alternative: the Web Component

If you would rather not wire a service at all, `<open-tutorial>` works in Angular
templates once you add `CUSTOM_ELEMENTS_SCHEMA`. See
[Web Component & vanilla](web-component.md).
