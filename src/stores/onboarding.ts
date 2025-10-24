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

export type OnboardingState = {
    role: UserRole;
    goals: Set<LearningGoal>;
    style: Set<LearningStyle>;
    preferredTutorGender: TutorGender;
    // actions
    setRole: (r: UserRole) => void;
    toggleGoal: (g: LearningGoal) => void;
    toggleStyle: (s: LearningStyle) => void;
    setPreferredTutorGender: (g: TutorGender) => void;
    reset: () => void;
};

const initial: Pick<OnboardingState, "role" | "goals" | "style" | "preferredTutorGender"> = {
    role: null,
    goals: new Set<LearningGoal>(),
    style: new Set<LearningStyle>(),
    preferredTutorGender: null,
};

export const useOnboardingStore = create<OnboardingState>()(
    persist(
        (set, get) => ({
            ...initial,
            setRole: (r) => set({ role: r }),
            toggleGoal: (g) => {
                const next = new Set(get().goals);
                next.has(g) ? next.delete(g) : next.add(g);
                set({ goals: next });
            },
            toggleStyle: (s) => {
                const next = new Set(get().style);
                next.has(s) ? next.delete(s) : next.add(s);
                set({ style: next });
            },
            setPreferredTutorGender: (g) => set({ preferredTutorGender: g }),
            reset: () => set({ ...initial, goals: new Set(), style: new Set() }),
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
            }) as any,
            onRehydrateStorage: () => (state) => {
                if (!state) return;
                // Rehydrate arrays back to Sets
                const asAny = state as unknown as {
                    goals?: LearningGoal[];
                    style?: LearningStyle[];
                };
                if (Array.isArray(asAny.goals)) (state as any).goals = new Set(asAny.goals);
                if (Array.isArray(asAny.style)) (state as any).style = new Set(asAny.style);
            },
        }
    )
);
