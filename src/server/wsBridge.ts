// src/server/wsBridge.ts
import {env} from "@/env";
const WEBSOCKET_URL = env.NEXT_PUBLIC_WEBSOCKET_URL;
const WEBSOCKET_NOTIFICATION_URL = env.NEXT_PUBLIC_WEBSOCKET_NOTIFICATION_URL;

export async function broadcastToTutors(payload: unknown) {
  console.log("Broadcasting to tutors:", payload);
  await fetch(WEBSOCKET_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  console.log("Broadcast to tutors sent.");
}

export async function notifyStudent(studentId: string, payload: unknown) {
  await fetch(`${WEBSOCKET_NOTIFICATION_URL}/${studentId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}
