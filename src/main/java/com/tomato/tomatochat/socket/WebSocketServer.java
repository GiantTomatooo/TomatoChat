package com.tomato.tomatochat.socket;

import com.alibaba.fastjson.JSONObject;
import com.fasterxml.jackson.databind.util.JSONPObject;
import org.springframework.stereotype.Component;

import javax.websocket.*;
import javax.websocket.server.PathParam;
import javax.websocket.server.ServerEndpoint;
import java.io.IOException;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

@ServerEndpoint("/websocket/{userId}")
@Component
public class WebSocketServer {
    //private Session session;//与某个客户端的连接会话，需要通过它来给客户端发送数据
    public List<Session> sessions = new LinkedList<>();
    private String userId;
    private WebSocketServer otherUser;

    @OnOpen
    public void onOpen(@PathParam("userId") String userId, Session session) {
        System.out.println("user " + userId + " 加入");
        this.userId = userId;
        this.sessions.add(session);
        UserMapServer.add(userId, this);
    }

    @OnMessage
    public void onMessage(String message, Session session) {
        System.out.println("接收到客户端发过来的消息：" + message);
        JSONObject jsonObject=JSONObject.parseObject(message);
        Map<String, Object> map = (Map<String, Object>)jsonObject;
        UserMapServer.sendMessage(map.get("accepter").toString(), message);
    }

    @OnError
    public void onError(Session session, Throwable error) {
        System.out.println("发生错误");
        error.printStackTrace();
    }

    @OnClose
    public void onClose(Session session) {
        System.out.println("有链接关闭");
        UserMapServer.remove(userId, session);
    }

    public void sendMessage(String message) {
        try {
            for (Session session : sessions) {
                session.getBasicRemote().sendText(message);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
