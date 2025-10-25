/* eslint-disable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return */
import { env } from "@/env";
import { type MediaConnection, Peer, type PeerOptions } from "peerjs";

export const peerBuildConnection = (id?: string): Peer => {
  const options: PeerOptions = {
    host: env.NEXT_PUBLIC_PEER_HOST,
    port: env.NEXT_PUBLIC_PEER_PORT,
    path: "/peerjs",
    config: env.NEXT_PUBLIC_ICE_SERVER
      ? {
        iceServers: [
          {
            urls: env.NEXT_PUBLIC_STUN_SERVER,
          },
          {
            urls: env.NEXT_PUBLIC_ICE_SERVER,
            username: env.NEXT_PUBLIC_ICE_USER,
            credential: env.NEXT_PUBLIC_ICE_CRED,
          },
        ],
      }
      : undefined,
  };
  try {
    return id ? new Peer(id, options) : new Peer(options);
  } catch (error) {
    console.error("Error creating peer connection:", error);
    throw error;
  }
};

export const startVideoStream = (callback: (stream: MediaStream) => void | Promise<void>): void => {
  navigator.mediaDevices
    .getUserMedia({ video: { aspectRatio: 16 / 9 }, audio: true })
    .then(callback)
    .catch((error) => {
      console.error("Error accessing media devices:", error);
    });
};

export const placePeerCall = (peer: Peer, peerIdToCall: string, stream: MediaStream, callback: (stream: MediaStream) => void): void => {
  try {
    const call = peer.call(peerIdToCall, stream);
    call.on("stream", callback);
  } catch (error) {
    console.error("Error placing peer call:", error);
  }
};

export const terminatePeerCall = (call: MediaConnection): void => {
  try {
    call.localStream?.getTracks().forEach((track) => track.stop());
    call.close();
  } catch (error) {
    console.error("Error terminating peer call:", error);
  }
};

export const toggleAudio = (stream: MediaStream, status: boolean) => {
  stream.getAudioTracks().forEach((track) => (track.enabled = status));
};

export const toggleVideo = (stream: MediaStream, status: boolean) => {
  stream.getVideoTracks().forEach((track) => (track.enabled = status));
};
