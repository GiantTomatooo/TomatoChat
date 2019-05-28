package com.tomato.tomatochat.socket;

import javax.websocket.Session;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class UserMapServer {
    public static Map<String, WebSocketServer> users = new ConcurrentHashMap<>();

    public static void broadCast(String sender, String message) {
        System.out.println("将要广播的消息:" + message);
        for (Map.Entry<String, WebSocketServer> user : users.entrySet()) {
            if (!user.getKey().equals(sender)) {
                user.getValue().sendMessage(message);
            }
        }
    }

    public static void add(String userId, WebSocketServer user) {
        if (users.containsKey(userId)) {
            users.get(userId).sessions.add(user.sessions.get(0));
        } else {
            users.put(userId, user);//新用户广播
            String message = "{\"state\":\"updateUserList\",\"user\":\"" + userId + "\"}";
            UserMapServer.broadCast(userId, message);//跟其他人说我上线了
            System.out.println("有新连接加入！ 当前总连接数是：" + users.size());
        }
    }

    public static void remove(String userId, Session session) {
        WebSocketServer user = users.get(userId);
        if (user.sessions.size() == 1) {
            users.remove(userId);
            String message = "{\"state\":\"userExit\",\"user\":\"" + userId + "\"}";
            UserMapServer.broadCast(userId, message);//跟其他人说我离线了
            System.out.println("有连接退出！ 当前总连接数是：" + users.size());
        } else {
            user.sessions.remove(session);
        }
    }
    public static void sendMessage(String accepter, String message) {
        WebSocketServer user=users.get(accepter);
        if (user==null){
            System.out.println("用户不在线");
            return;
        }
        user.sendMessage(message);
    }
}
