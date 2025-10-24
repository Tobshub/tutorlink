import { env } from "@/env";
import { type MediaConnection, Peer, type PeerOptions } from "peerjs";

export const peerBuildConnection = (id?: string) => {
  const options: PeerOptions = {
    host: env.NEXT_PUBLIC_PEER_HOST,
    port: env.NEXT_PUBLIC_PEER_PORT,
    path: "/peerjs",
    config: env.NEXT_PUBLIC_ICE_SERVER
      ? {
          iceServers: [
            {
              urls: env.NEXT_PUBLIC_ICE_SERVER,
              username: env.NEXT_PUBLIC_ICE_USER,
              credential: env.NEXT_PUBLIC_ICE_CRED,
            },
          ],
        }
      : null,
  };
  return id ? new Peer(id, options) : new Peer(options);
};

export const useVideoStream = (callback: (stream: MediaStream) => void | Promise<void>) => {
  void navigator.mediaDevices
    .getUserMedia({ video: { aspectRatio: 16 / 9 }, audio: true })
    .then(callback);
};

export const placePeerCall = (peer: Peer, peerIdToCall: string, stream: MediaStream, callback: (stream: MediaStream) => void) => {
  const call = peer.call(peerIdToCall, stream);
  call.on("stream", callback);
}

export const terminatePeerCall = (call: MediaConnection) => {
  call.localStream?.getTracks().forEach((track) => track.stop());
  call.close();
}
