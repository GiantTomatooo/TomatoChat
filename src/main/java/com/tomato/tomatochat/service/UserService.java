package com.tomato.tomatochat.service;

import com.tomato.tomatochat.entity.Friend;
import com.tomato.tomatochat.entity.User;
import com.tomato.tomatochat.utils.R;

import java.util.List;

public interface UserService {
    public User findByUsername(String username);
    public R userRegister(User user);
    public List<User> getFriends(Integer userid);
    public int addFriend(Friend friend);
}
