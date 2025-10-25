"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { peerBuildConnection, placePeerCall, terminatePeerCall, toggleAudio, toggleVideo, startVideoStream } from "@/peer/utils";
import { useUser } from "@clerk/nextjs";
import { type Peer, type MediaConnection } from "peerjs";
import { useEffect, useRef, useState } from "react";

export default function CallsPage() {
  const { user } = useUser();
  const [peer, setPeer] = useState<Peer | null>(null);
  const [peerId, setPeerId] = useState<string>("");
  const [remotePeerId, setRemotePeerId] = useState<string>("");
  const [call, setCall] = useState<MediaConnection | null>(null);
  const [isAudioEnabled, setIsAudioEnabled] = useState<boolean>(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState<boolean>(true);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!user) {
      return;
    }

    const peerInstance = peerBuildConnection(user.id);
    setPeer(peerInstance);

    peerInstance.on("open", (id) => {
      setPeerId(id);
      startVideoStream((stream) => {
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        const params = new URLSearchParams(window.location.search);
        const remoteId = params.get('userId');
        if (remoteId) {
          setRemotePeerId(remoteId);
          const outgoingCall = peerInstance.call(remoteId, stream);
          outgoingCall.on("stream", (remoteStream) => {
            if (remoteVideoRef.current) {
              remoteVideoRef.current.srcObject = remoteStream;
            }
          });
          setCall(outgoingCall);
        }
      });
    });

    peerInstance.on("call", (incomingCall) => {
      startVideoStream((stream) => {
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        incomingCall.answer(stream);
        incomingCall.on("stream", (remoteStream) => {
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = remoteStream;
          }
        });
        setCall(incomingCall);
      });
    });

    return () => {
      peerInstance.destroy();
    };
  }, [user]);

  const handleCall = () => {
    startVideoStream((stream) => {
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      if (peer) {
        const outgoingCall = peer.call(remotePeerId, stream);
        outgoingCall.on("stream", (remoteStream) => {
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = remoteStream;
          }
        });
        setCall(outgoingCall);
      }
    });
  };

  const handleEndCall = () => {
    if (call) {
      terminatePeerCall(call);
      setCall(null);
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = null;
      }
    }
  };

  const handleToggleAudio = () => {
    if (call) {
      const newAudioState = !isAudioEnabled;
      toggleAudio(call.localStream, newAudioState);
      setIsAudioEnabled(newAudioState);
    }
  };

  const handleToggleVideo = () => {
    if (call) {
      const newVideoState = !isVideoEnabled;
      toggleVideo(call.localStream, newVideoState);
      setIsVideoEnabled(newVideoState);
    }
  };

  return (
    <div className="flex h-full flex-col items-center justify-center gap-8 p-4">
      <h1 className="text-xl font-semibold text-neutral-900">Calls</h1>
      <p>Your Peer ID: {peerId}</p>
      <div className="flex items-center gap-2">
        <Input
          type="text"
          value={remotePeerId}
          onChange={(e) => setRemotePeerId(e.target.value)}
          placeholder="Remote Peer ID"
        />
        <Button onClick={handleCall} disabled={!remotePeerId || !!call}>
          Call
        </Button>
        <Button onClick={handleEndCall} disabled={!call} variant="destructive">
          End Call
        </Button>
      </div>
      <div className="flex gap-4">
        <Button onClick={handleToggleAudio} disabled={!call}>
          {isAudioEnabled ? "Mute Audio" : "Unmute Audio"}
        </Button>
        <Button onClick={handleToggleVideo} disabled={!call}>
          {isVideoEnabled ? "Mute Video" : "Unmute Video"}
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <video ref={localVideoRef} autoPlay playsInline muted className="aspect-video w-full rounded-md bg-neutral-200" />
        <video ref={remoteVideoRef} autoPlay playsInline className="aspect-video w-full rounded-md bg-neutral-200" />
      </div>
    </div>
  );
}
