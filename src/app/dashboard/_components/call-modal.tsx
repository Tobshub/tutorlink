'use client';

import { Button } from '@/components/ui/button';

interface CallModalProps {
  callerName: string;
  onAnswer: () => void;
  onDeny: () => void;
}

export function CallModal({ callerName, onAnswer, onDeny }: CallModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">{callerName} is calling...</h2>
        <div className="flex justify-end gap-4">
          <Button variant="destructive" onClick={onDeny}>
            Deny
          </Button>
          <Button variant="success" onClick={onAnswer}>
            Answer
          </Button>
        </div>
      </div>
    </div>
  );
}
