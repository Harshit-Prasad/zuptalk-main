import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useSocket } from "../../providers/SocketProvider";
import { useUserInfoStore } from "../../services/store";
import toast from "react-hot-toast";
import LiveStream from "../../components/LiveStream";
import LiveChat from "../../components/LiveChat";
import { Hand } from "lucide-react";
import WebRTCPeer from "../../services/webRTC";
import MediaPlayer from "../../components/MediaPlayer";
// import AmountSlider from "../../components/AmountSlider";

export default function MainStream() {
  const userInfo = useUserInfoStore((state) => state);
  const params = useParams();
  const [adminId, streamId] = params.roomId.split(":");
  const socket = useSocket();
  const [toggleRaiseHand, setToggleRaiseHand] = useState(false);
  const [webRTCPeer, setWebRTCPeer] = useState(new WebRTCPeer());
  const [localStream, setLocalStream] = useState();
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [remoteStream, setRemoteStream] = useState();
  const [callStarted, setCallStarted] = useState(false);

  const userConnected = useCallback(() => {
    socket.emit("user-connected", {
      userInfo: {
        id: userInfo.id,
        name: userInfo.name,
        handRaised: toggleRaiseHand,
        picture: userInfo.picture,
        role: userInfo.role,
      },
      adminId,
      streamId: params.roomId,
    });
  }, [
    toggleRaiseHand,
    socket,
    userInfo.id,
    userInfo.name,
    userInfo.role,
    userInfo.picture,
    adminId,
    params.roomId,
  ]);

  const adminConnected = useCallback(() => {
    toast.success("Admin connected");
  }, []);

  const adminDisconnected = useCallback(() => {
    toast.error("Admin disconnected");
  }, []);

  const handleRaiseHand = useCallback(() => {
    // setStartPaymentProcess(true);
    socket.emit("hand-raised", {
      id: userInfo.id,
      adminId,
      handRaised: !toggleRaiseHand,
    });

    setToggleRaiseHand(!toggleRaiseHand);
  }, [toggleRaiseHand, socket, adminId, userInfo.id]);

  useEffect(() => {
    socket.on("connect", userConnected);
    socket.on("admin-connected", adminConnected);
    socket.on("admin-disconnected", adminDisconnected);

    return () => {
      socket.off("connect", userConnected);
      socket.off("admin-connected", adminConnected);
      socket.off("admin-disconnected", adminDisconnected);
    };
  }, [userConnected, adminConnected, adminDisconnected, socket]);

  useEffect(() => {
    return () => {
      socket.disconnect();
    };
  }, [socket]);

  // WebRTC

  const handleIncomingCall = useCallback(
    async ({ from, offer }) => {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: false,
        audio: true,
      });
      const audioTrack = stream.getAudioTracks()[0];
      audioTrack.applyConstraints({
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      });
      setLocalStream(stream);
      const answer = await webRTCPeer.getAnswer(offer);
      setSelectedAdmin(from);
      socket.emit("call-accepted", { answer, to: from, from: userInfo.id });
    },
    [webRTCPeer, socket, userInfo.id]
  );

  const sendStream = useCallback(() => {
    for (const track of localStream.getTracks()) {
      webRTCPeer.peer.addTrack(track, localStream);
    }
  }, [localStream, webRTCPeer]);

  const handleAnswerCall = useCallback(() => {
    sendStream();
    setCallStarted(true);
  }, [sendStream]);

  const handleNegotiationNeeded = useCallback(async () => {
    const offer = await webRTCPeer.getOffer();
    socket.emit("nego-needed", {
      offer,
      to: selectedAdmin,
      from: userInfo.id,
    });
  }, [webRTCPeer, selectedAdmin, socket, userInfo.id]);

  const handleNegotiationIncoming = useCallback(
    async ({ from, offer }) => {
      const answer = await webRTCPeer.getAnswer(offer);
      socket.emit("nego-done", { to: from, answer, from: userInfo.id });
    },
    [webRTCPeer, socket, userInfo.id]
  );

  const handleNegotiationFinal = useCallback(
    async ({ answer }) => {
      await webRTCPeer.setLocalDescription(answer);
    },
    [webRTCPeer]
  );

  const handleIncomingTracks = useCallback(
    (e) => {
      const [stream] = e.streams;
      setRemoteStream(stream);
    },
    [setRemoteStream]
  );

  const handleCallEnded = useCallback(() => {
    const tracks = localStream.getTracks();
    tracks.forEach((track) => {
      track.stop();
    });
    setRemoteStream(null);
    setLocalStream(null);
    webRTCPeer.peer.close();
    setCallStarted(false);
    setToggleRaiseHand(false);
    setSelectedAdmin(null);
    setWebRTCPeer(new WebRTCPeer());
  }, [webRTCPeer, localStream]);

  useEffect(() => {
    socket.on("incoming-call", handleIncomingCall);
    socket.on("nego-incoming", handleNegotiationIncoming);
    socket.on("nego-final", handleNegotiationFinal);
    socket.on("admin-ended-call", handleCallEnded);

    webRTCPeer.peer.addEventListener(
      "negotiationneeded",
      handleNegotiationNeeded
    );
    webRTCPeer.peer.addEventListener("track", handleIncomingTracks);

    return () => {
      socket.off("incoming-call", handleIncomingCall);
      socket.off("nego-incoming", handleNegotiationIncoming);
      socket.off("nego-final", handleNegotiationFinal);
      socket.off("admin-ended-call", handleCallEnded);

      webRTCPeer.peer.removeEventListener(
        "negotiationneeded",
        handleNegotiationNeeded
      );
      webRTCPeer.peer.removeEventListener("track", handleIncomingTracks);
    };
  }, [
    webRTCPeer,
    handleIncomingCall,
    handleNegotiationNeeded,
    handleNegotiationFinal,
    handleIncomingTracks,
    handleCallEnded,
    handleNegotiationIncoming,
    socket,
  ]);

  // Media Controls

  const handleEndCall = useCallback(() => {
    const tracks = localStream.getTracks();
    tracks.forEach((track) => {
      track.stop();
    });

    setRemoteStream(null);
    setLocalStream(null);
    setCallStarted(false);
    webRTCPeer.peer.close();
    setToggleRaiseHand(false);
    socket.emit("user-end-call", { from: userInfo.id, to: selectedAdmin });

    setSelectedAdmin(null);
    setWebRTCPeer(new WebRTCPeer());
  }, [selectedAdmin, socket, userInfo.id, webRTCPeer.peer, localStream]);

  return (
    <>
      <Link to="/welcome" className="button bg-slate-800 hover:bg-slate-950">
        To Home
      </Link>
      <LiveStream streamId={streamId} />
      <button
        onClick={handleRaiseHand}
        className="button bg-slate-800 hover:bg-slate-950 flex items-center justify-center gap-3"
      >
        Hand Raised
        <span
          className={`flex justify-center items-center p-1 rounded-full border-2 border-solid ${
            toggleRaiseHand ? "border-white" : "border-transparent"
          }`}
        >
          <Hand />
        </span>
      </button>
      {selectedAdmin && (
        <button
          onClick={handleAnswerCall}
          className="button bg-slate-800 hover:bg-slate-950"
        >
          Start Call
        </button>
      )}

      {localStream && <MediaPlayer muted={true} url={localStream} />}
      {remoteStream && <MediaPlayer muted={false} url={remoteStream} />}
      {callStarted && (
        <>
          <button className="button bg-slate-800 hover:bg-slate-950">
            Mute
          </button>
          <button
            onClick={handleEndCall}
            className="button bg-red-700 hover:bg-red-500"
          >
            End Call
          </button>
        </>
      )}
      <LiveChat streamId={streamId} />
    </>
  );
}