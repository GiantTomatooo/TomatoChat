package com.tomato.tomatochat.mapper;

import com.tomato.tomatochat.entity.Friend;

import java.util.List;

public interface FriendMapper {
    int deleteByPrimaryKey(Integer id);

    int insert(Friend record);

    int insertSelective(Friend record);

    Friend selectByPrimaryKey(Integer id);

    int updateByPrimaryKeySelective(Friend record);

    int updateByPrimaryKey(Friend record);

    List<Friend> selectByUserId(Integer userid);
}