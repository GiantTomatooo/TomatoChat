package com.tomato.tomatochat.service.impl;

import com.mysql.jdbc.exceptions.MySQLIntegrityConstraintViolationException;
import com.tomato.tomatochat.entity.Friend;
import com.tomato.tomatochat.entity.User;
import com.tomato.tomatochat.mapper.FriendMapper;
import com.tomato.tomatochat.mapper.UserMapper;
import com.tomato.tomatochat.service.UserService;
import com.tomato.tomatochat.utils.R;
import org.springframework.context.annotation.Scope;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.List;
@Scope("prototype")
@Service("userService")
public class UserServiceImpl implements UserService {
    @Resource
    UserMapper userMapper;
    @Resource
    FriendMapper friendMapper;
    @Override
    public User findByUsername(String username) {
        User user=userMapper.selectByUsername(username);
        return user;
    }

    @Override
    public R userRegister(User user) {
        try{
            userMapper.insert(user);
        }catch (DuplicateKeyException e){
            return R.error("注册失败,用户名已被使用");
        }
        return R.success("注册成功！");
    }

    @Override
    public List<User> getFriends(Integer userid) {
        List<Friend> userFriend=friendMapper.selectByUserId(userid);
        List<User> friends=new ArrayList<>();
        for(Friend friend:userFriend){
            Integer id=friend.getFriendid();
            friends.add(userMapper.selectByPrimaryKey(id));
        }
        return friends;
    }

    @Override
    public int addFriend(Friend friend) {
        return friendMapper.insert(friend);
    }
}
