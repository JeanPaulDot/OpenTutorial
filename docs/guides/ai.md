# AI & agents

A tour is plain JSON validated by a strict schema, which makes it an unusually
good thing for a language model to write: the output is data, it can be checked
mechanically, and a wrong answer fails closed instead of breaking your app.

The library never calls a model itself. It stays dependency-free and
vendor-neutral — you bring the model, this brings the grounding and the checks.

## The loop

Every reliable setup has the same four steps:

1. **Ground** — give the model the rules and the real selectors on the page.
2. **Generate** — ask for a `TutorialSpec`.
3. **Validate** — run `validateSpec`. Feed errors back and retry.
4. **Run** — `layer.addSpec(spec)` and start it.

```ts
import { validateSpec } from '@opentutorial/core';
import { collectAnchors, createAuthoringPrompt, extractSpec } from '@opentutorial/core/authoring';

async function generateTour(goal: string) {
  const anchors = collectAnchors();                       // 1. real elements
  const system = createAuthoringPrompt({ goal, anchors, contextKeys: ['plan'] });

  let feedback = '';
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const reply = await callYourModel(system, feedback);  // 2. any model
    const spec = extractSpec(reply);
    if (!spec) { feedback = 'Reply with a single JSON object.'; continue; }

    const result = validateSpec(spec);                    // 3. check it
    if (result.ok) return spec;

    feedback = 'Fix these and reply with the full corrected JSON:\n'
      + result.errors.map((e) => `${e.path}: ${e.message}`).join('\n');
  }
  return null;
}

const spec = await generateTour('Show a new user how to create a project');
if (spec) { layer.addSpec(spec); layer.start(spec.id); }   // 4. run it
```

The retry matters more than the prompt. Validation errors are specific
(`$.steps[1].target — required when advanceOn === "target-click"`), and models
fix specific errors well.

## Grounding

### `collectAnchors()`

Left to imagine, a model invents `#submit-button` and the tour breaks on its
first step. Handed real selectors, it picks from them.

```ts
collectAnchors();
// [
//   { selector: '[data-tour="new-project"]', score: 95, tag: 'button',
//     role: 'button', text: 'New project', visible: true },
//   { selector: '#search', score: 78, tag: 'input', role: 'textbox', text: 'Search', visible: true },
//   …
// ]
```

Explicit hooks (`data-tour`, `data-testid`) score highest, generated ids and
CSS-in-JS classes are rejected, and the list is sorted so truncating it drops
the fragile ones first.

| Option | Default | Notes |
|---|---|---|
| `limit` | `60` | Keep the prompt small. |
| `minScore` | `0` | `70` restricts the model to selectors that are safe to ship. |
| `includeHidden` | `false` | Include elements with no box (closed menus, inactive tabs). |

The library's own UI is never offered as a target.

### `createAuthoringPrompt()`

Returns a compact instruction block: the spec's shape, the rules models actually
get wrong (kebab-case ids, required titles, the expression grammar, **never
invent selectors**), your anchors, and the goal.

```ts
createAuthoringPrompt({
  goal: 'Walk a trial user through connecting a data source',
  anchors,
  contextKeys: ['plan', 'daysLeft'],
  maxSteps: 5,
});
```

It is deliberately not the whole schema. For that, send
`dist/spec.schema.json` as a structured-output schema if your model supports
one — it is draft-07, and the spec, step, target and theme objects reject
unknown keys.

### `describeSpec()`

The reverse direction: a spec as plain language, for a human reviewer or for a
second model checking the first.

```ts
describeSpec(spec);
// Tour "Set up billing" (billing) — 2 step(s).
// Starts: on route /billing.
// Audience: plan === 'trial'.
// 1. [open] Add a card · → #add-card · advances on target-click
//    "It takes a minute."
// 2. [confirm] Confirm · (centred)
```

Also available as `npx opentutorial describe specs/`.

## MCP server

For coding agents — Claude Code, Cursor, and anything else that speaks the
[Model Context Protocol](https://modelcontextprotocol.io) — the CLI is also an
MCP server over stdio:

```json
{
  "mcpServers": {
    "opentutorial": { "command": "npx", "args": ["opentutorial", "mcp"] }
  }
}
```

```bash
claude mcp add opentutorial -- npx opentutorial mcp
```

| Tool | What it does |
|---|---|
| `validate_spec` | Errors and warnings for a spec. The agent should call it after every edit. |
| `describe_spec` | Plain-language summary of a spec. |
| `get_spec_schema` | The JSON Schema. |
| `get_authoring_prompt` | The authoring rules, optionally grounded in selectors and a goal. |
| `list_docs` / `read_doc` / `search_docs` | The documentation **for the installed version**. |

Because the docs ship inside the package, the agent reads the guide that matches
the code it is writing against — not whatever version it remembers from
training.

It has no dependencies and no network access: it reads the package's own files
and runs the validator. `read_doc` cannot leave the `docs/` directory.

## Driving a tour from an agent

Commands are plain data, so an agent can operate a tour by emitting JSON:

```ts
layer.dispatch({ type: 'addSpec', spec });
layer.dispatch({ type: 'start', tourId: spec.id });
layer.dispatch({ type: 'setContext', patch: { plan: 'pro' } });
layer.dispatch({ type: 'next' });
```

And read state back the same way:

```ts
layer.store.getSnapshot();
// { activeId: 'welcome', state: { currentStepId: 'intro', index: 0, total: 4, … }, context: { … } }

layer.whyBlocked('billing-setup');
// "audience rule did not match"
```

See [Interactivity & reactivity](interactivity.md#commands-as-data) for the full
command list.

## Checking generated selectors

A spec can be valid and still point at nothing. Two checks close that gap:

```ts
import { auditSelectors } from '@opentutorial/core/authoring';

const selectors = spec.steps.flatMap((s) => s.target?.selector ?? []).flat();
auditSelectors(selectors).filter((r) => !r.ok);
// [{ selector: '#invented', matches: 0, ok: false, note: 'no element matches' }]
```

```bash
npx opentutorial lint-selectors http://localhost:3000 generated/
```

At runtime, a missing target emits `target-not-found` and the tour carries on —
log it, and you know which generated tours to regenerate.

## Safety

Treat a generated spec exactly like user input, because that is what it is.

| Risk | What protects you |
|---|---|
| Markup injection in copy | All text is escaped **before** markdown formatting. A spec cannot emit HTML. |
| `javascript:` links | Script-bearing URL schemes are dropped, including obfuscated forms. |
| Raw HTML blocks | Inert unless **you** set `allowHtml: true`. Leave it off for generated specs. |
| Code execution in conditions | Expressions run in a hand-written parser with no `eval` and no access to `window`. |
| A broken spec | Fail-closed: it disables its own tour and nothing else. |
| `navigate` actions | Paths must be same-origin and start with `/`. Route them through `onNavigate` to add your own allow-list. |

Two things remain yours:

- **`allowHtml`** — never enable it for content a model wrote.
- **Where commands come from** — `dispatch` will happily `addSpec` whatever it is
  given. If commands arrive over `postMessage` or a socket, check the origin.

## `llms.txt`

The documentation site publishes machine-readable indexes:

- `https://jeanpauldot.github.io/opentutorial-web/llms.txt` — a short index of every page
- `https://jeanpauldot.github.io/opentutorial-web/llms-full.txt` — the whole documentation in one file

Offline, the same markdown is at `node_modules/@opentutorial/core/docs/`.

## Prompting tips that hold up

- **Give selectors, not screenshots.** A list from `collectAnchors()` beats a
  description of the page.
- **Cap the steps.** Five or six. Long tours are abandoned, and models pad.
- **Ask for one idea per step.** Otherwise you get paragraphs.
- **State the audience.** "A trial user who has never connected a source"
  produces better copy than "a user".
- **Always validate, always retry with the errors.** Two rounds fix nearly
  everything.
- **Review before shipping.** `describeSpec` makes that a thirty-second read.
