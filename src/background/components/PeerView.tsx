import React from 'react'
import { PeerId } from 'hypermerge/dist/NetworkPeer'
import PeerConnection from 'hypermerge/dist/PeerConnection'
import Info, { humanBytes } from './Info'
import { useSample, useRepo } from '../BackgroundHooks'

interface Props {
  peerId: PeerId
}

export default function PeerView({ peerId }: Props) {
  useSample(1000)
  const repo = useRepo()
  const peer = repo.network.peers.get(peerId)

  if (!peer) return <div>Peer not found: {peerId}</div>

  return (
    <div>
      <Info
        log={peer}
        peerId={peerId}
        connection={connectionInfo(peer.connection)}
        closedConnections={peer.closedConnectionCount}
      />
      {Array.from(peer.pendingConnections).map((conn, i) => (
        <Info key={String(i)} log={conn} {...connectionInfo(conn)} />
      ))}
    </div>
  )
}

export function connectionInfo(conn: PeerConnection) {
  const rawConn = conn as any

  return {
    type: conn.type,
    isConnected: conn.isOpen,
    host: rawConn.rawSocket.remoteAddress,
    port: rawConn.rawSocket.remotePort,
    sent: humanBytes(rawConn.rawSocket.bytesWritten),
    received: humanBytes(rawConn.rawSocket.bytesRead),
  }
}