package com.tomato.tomatochat.controller;

import com.tomato.tomatochat.entity.User;
import com.tomato.tomatochat.mapper.UserMapper;
import com.tomato.tomatochat.service.UserService;
import com.tomato.tomatochat.utils.R;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import javax.servlet.http.HttpSession;
import java.util.List;
import java.util.Map;

@Controller
public class WebController {
    @Resource
    private UserService userService;

    @RequestMapping("/login.html")
    public String login(){
        return "login";
    }

    @RequestMapping("/register")
    public String register() {
        return "register";
    }

    @RequestMapping(value = "/user/register", produces = {"application/json;charset=UTF-8"})
    public @ResponseBody R register(User user) {
        R message = userService.userRegister(user);
        return message;
    }

    @RequestMapping("/index")
    public String index(Model model, HttpSession httpSession) {
        String username=httpSession.getAttribute("username").toString();
        User user = userService.findByUsername(username);
        model.addAttribute("user", user);
        model.addAttribute("friends",userService.getFriends(user.getId()));
        return "index";
    }

    //test
    @RequestMapping("/test")
    @ResponseBody
    public List<User> test(){
        return userService.getFriends(1);
    }
}
