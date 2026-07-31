import type { SpecIssue, TutorialSpec, ValidationResult } from './types';
export declare function validateSpec(input: unknown): ValidationResult;
export declare function assertValidSpec(input: unknown): TutorialSpec;
/** Validate a set of specs together, catching cross-spec problems. */
export declare function validateSpecs(specs: unknown[]): {
    ok: boolean;
    issues: Array<SpecIssue & {
        specId?: string;
    }>;
};
