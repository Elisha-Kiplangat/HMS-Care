package com.hms.app.telemedicine

import io.socket.client.IO
import io.socket.client.Socket
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class SignalingClient @Inject constructor() {
    private var socket: Socket? = null

    fun connect(baseUrl: String, token: String, roomId: String) {
        val options = IO.Options().apply {
            query = "token=$token&roomId=$roomId"
        }
        socket = IO.socket("$baseUrl/signaling", options)
        socket?.connect()
    }

    fun emitOffer(sdp: String) {
        socket?.emit("offer", sdp)
    }

    fun emitAnswer(sdp: String) {
        socket?.emit("answer", sdp)
    }

    fun disconnect() {
        socket?.disconnect()
        socket = null
    }
}
