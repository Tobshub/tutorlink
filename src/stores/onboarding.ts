"use client";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type UserRole = "student" | "tutor" | null;
export type LearningGoal =
    | "Exam Prep"
    | "Concept Mastery"
    | "Homework"
    | "Test Readiness"
    | "Revision & Practice"
    | "Long-term Learning"
    | "Test Readiness (WAEC, IELTS, SAT, etc)";

export type LearningStyle =
    | "Visually"
    | "Conceptually"
    | "Practical"
    | "Fast-paced"
    | "Collaborative"
    | "Self-paced";

export type TutorGender = "Male" | "Female" | "Both" | null;

// Tutor-specific types
export type SubjectInterest =
    | "Mathematics"
    | "English"
    | "Physics"
    | "Chemistry"
    | "Biology"
    | "Geography"
    | "Economics"
    | "History"
    | "Computer Science"
    | "Art"
    | "Music"
    | "Physical Education";

export type TeachingLevel = "Primary" | "Secondary" | "Tertiary";

export type TeachingStyle =
    | "Interactive"
    | "Visual"
    | "Practical"
    | "Structured"
    | "Flexible"
    | "Collaborative";

export type SessionType = "Live" | "On-Demand" | "Recorded";

export type OnboardingState = {
    role: UserRole;
    goals: Set<LearningGoal>;
    style: Set<LearningStyle>;
    preferredTutorGender: TutorGender;

    // Tutor-specific fields
    subjectInterests: Set<SubjectInterest>;
    teachingLevels: Set<TeachingLevel>;
    yearsOfExperience: number | null;
    teachingStyle: Set<TeachingStyle>;
    preferredSessionTypes: Set<SessionType>;

    // actions
    setRole: (r: UserRole) => void;
    toggleGoal: (g: LearningGoal) => void;
    toggleStyle: (s: LearningStyle) => void;
    setPreferredTutorGender: (g: TutorGender) => void;

    // Tutor actions
    toggleSubjectInterest: (s: SubjectInterest) => void;
    toggleTeachingLevel: (l: TeachingLevel) => void;
    setYearsOfExperience: (years: number | null) => void;
    toggleTeachingStyle: (s: TeachingStyle) => void;
    toggleSessionType: (t: SessionType) => void;

    reset: () => void;
};

const initial: Pick<OnboardingState, "role" | "goals" | "style" | "preferredTutorGender" | "subjectInterests" | "teachingLevels" | "yearsOfExperience" | "teachingStyle" | "preferredSessionTypes"> = {
    role: null,
    goals: new Set<LearningGoal>(),
    style: new Set<LearningStyle>(),
    preferredTutorGender: null,
    subjectInterests: new Set<SubjectInterest>(),
    teachingLevels: new Set<TeachingLevel>(),
    yearsOfExperience: null,
    teachingStyle: new Set<TeachingStyle>(),
    preferredSessionTypes: new Set<SessionType>(),
};

export const useOnboardingStore = create<OnboardingState>()(
    persist(
        (set, get) => ({
            ...initial,
            setRole: (r) => set({ role: r }),
            toggleGoal: (g) => {
                const next = new Set(get().goals);
                if (next.has(g)) {
                    next.delete(g);
                } else {
                    next.add(g);
                }
                set({ goals: next });
            },
            toggleStyle: (s) => {
                const next = new Set(get().style);
                if (next.has(s)) {
                    next.delete(s);
                } else {
                    next.add(s);
                }
                set({ style: next });
            },
            setPreferredTutorGender: (g) => set({ preferredTutorGender: g }),

            // Tutor actions
            toggleSubjectInterest: (s) => {
                const next = new Set(get().subjectInterests);
                if (next.has(s)) {
                    next.delete(s);
                } else {
                    next.add(s);
                }
                set({ subjectInterests: next });
            },
            toggleTeachingLevel: (l) => {
                const next = new Set(get().teachingLevels);
                if (next.has(l)) {
                    next.delete(l);
                } else {
                    next.add(l);
                }
                set({ teachingLevels: next });
            },
            setYearsOfExperience: (years) => set({ yearsOfExperience: years }),
            toggleTeachingStyle: (s) => {
                const next = new Set(get().teachingStyle);
                if (next.has(s)) {
                    next.delete(s);
                } else {
                    next.add(s);
                }
                set({ teachingStyle: next });
            },
            toggleSessionType: (t) => {
                const next = new Set(get().preferredSessionTypes);
                if (next.has(t)) {
                    next.delete(t);
                } else {
                    next.add(t);
                }
                set({ preferredSessionTypes: next });
            },

            reset: () => set({
                ...initial,
                goals: new Set(),
                style: new Set(),
                subjectInterests: new Set(),
                teachingLevels: new Set(),
                teachingStyle: new Set(),
                preferredSessionTypes: new Set(),
            }),
        }),
        {
            name: "tl-onboarding",
            storage: createJSONStorage(() => sessionStorage),
            // Convert Sets to arrays for persistence
            partialize: (state) => ({
                role: state.role,
                goals: Array.from(state.goals),
                style: Array.from(state.style),
                preferredTutorGender: state.preferredTutorGender,
                subjectInterests: Array.from(state.subjectInterests),
                teachingLevels: Array.from(state.teachingLevels),
                yearsOfExperience: state.yearsOfExperience,
                teachingStyle: Array.from(state.teachingStyle),
                preferredSessionTypes: Array.from(state.preferredSessionTypes),
            }),
            onRehydrateStorage: () => (state) => {
                if (!state) return;
                // Rehydrate arrays back to Sets
                const hydratedState = state as unknown as {
                    goals?: LearningGoal[];
                    style?: LearningStyle[];
                    subjectInterests?: SubjectInterest[];
                    teachingLevels?: TeachingLevel[];
                    teachingStyle?: TeachingStyle[];
                    preferredSessionTypes?: SessionType[];
                };
                if (Array.isArray(hydratedState.goals)) {
                    state.goals = new Set(hydratedState.goals);
                }
                if (Array.isArray(hydratedState.style)) {
                    state.style = new Set(hydratedState.style);
                }
                if (Array.isArray(hydratedState.subjectInterests)) {
                    state.subjectInterests = new Set(hydratedState.subjectInterests);
                }
                if (Array.isArray(hydratedState.teachingLevels)) {
                    state.teachingLevels = new Set(hydratedState.teachingLevels);
                }
                if (Array.isArray(hydratedState.teachingStyle)) {
                    state.teachingStyle = new Set(hydratedState.teachingStyle);
                }
                if (Array.isArray(hydratedState.preferredSessionTypes)) {
                    state.preferredSessionTypes = new Set(hydratedState.preferredSessionTypes);
                }
            },
        }
    )
);
