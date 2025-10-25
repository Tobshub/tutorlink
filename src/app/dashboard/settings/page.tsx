import "server-only";
import { SignOutButton } from "@clerk/nextjs";

export default function SettingsPage() {
    return (
        <div className="flex flex-col gap-6">
            <h1 className="text-xl font-semibold text-neutral-900">Settings</h1>

            <div className="pt-4 border-t border-neutral-200">
                <h2 className="text-lg font-medium text-neutral-900 mb-4">Account</h2>
                <SignOutButton redirectUrl="/">
                    <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                        Sign Out
                    </button>
                </SignOutButton>
            </div>
        </div>
    );
}