import type { TutorialSpec } from '../types';
export type ChecklistStatus = 'pending' | 'in_progress' | 'completed';
export interface TourChecklistProps {
    specs: TutorialSpec[];
    getStatus: (id: string) => ChecklistStatus;
    onStart: (id: string) => void;
    className?: string;
    title?: string;
}
export declare function TourChecklist({ specs, getStatus, onStart, className, title, }: TourChecklistProps): import("react").JSX.Element;
