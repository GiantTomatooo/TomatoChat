package com.tomato.tomatochat.config;

import com.alibaba.fastjson.JSONObject;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tomato.tomatochat.entity.User;
import com.tomato.tomatochat.security.UserSecurity;
import com.tomato.tomatochat.service.UserService;
import com.tomato.tomatochat.utils.R;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.*;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.security.web.authentication.SavedRequestAwareAuthenticationSuccessHandler;
import org.springframework.security.web.authentication.logout.LogoutSuccessHandler;
import org.springframework.ui.Model;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.io.PrintWriter;

@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {
    public static final Logger logger= LoggerFactory.getLogger(SecurityConfig.class);
    @Override
    protected void configure(HttpSecurity http) throws Exception{
        http
                .authorizeRequests()
                .antMatchers("/libs/**","/register","/test/**","/test","/user/register","/img/**").permitAll()
                .anyRequest().authenticated()
                .and()
                .formLogin()
                .loginPage("/login.html") //表单登录页面地址
                //.passwordParameter("password")//form表单用户名参数名,默认为password
                //.usernameParameter("username") //form表单密码参数名,默认为username
                .loginProcessingUrl("/login")//form表单POST请求url提交地址，默认为/login
                //.defaultSuccessUrl("/index")//如果访问受保护的页面登录成功返回保护页面，否则到/index
                //.successForwardUrl("/index")  //登录成功跳转地址
                //.failureForwardUrl("/login-error") //登录失败跳转地址
                //.failureUrl()
                .failureHandler(loginFailureHandler())
                .successHandler(loginSuccessHandler())
                //.failureUrl("/login?error")
                .permitAll()//允许所有用户都有权限访问登录页面
                .and()
                .logout()
                .logoutSuccessHandler(logoutSuccessHandler())
                .permitAll()
                .invalidateHttpSession(true)
                .and()
                .csrf().disable();
                //.sessionManagement().maximumSessions(10).expiredUrl("/login");
    }
    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(userDetailsService()).passwordEncoder(passwordEncoder());
        auth.inMemoryAuthentication()
                .passwordEncoder(passwordEncoder())//depassowrd:root
                .withUser("root").password("root").roles("USER");
    }
    @Bean
    public UserDetailsService userDetailsService() {    //用户登录实现
        return new UserDetailsService() {
            @Autowired
            private UserService userService;
            @Override
            public UserDetails loadUserByUsername(String s) throws UsernameNotFoundException {
                logger.info("user["+s+"] is logining...");
                User user = userService.findByUsername(s);
                if (user == null) {
                    throw new UsernameNotFoundException("username " + s + " not found");
                }
                logger.info("Get user info from db: "+ user.toString());
                UserSecurity userSecurity=new UserSecurity(user);
                return userSecurity;
            }
        };
    }
    @Bean
    public PasswordEncoder passwordEncoder() { //密码加密
//        return new BCryptPasswordEncoder(4);
        return new PasswordEncoder() {
            @Override
            public String encode(CharSequence charSequence) {
                return charSequence.toString();
            }
            @Override
            public boolean matches(CharSequence charSequence, String s) {
                return s.equals(charSequence.toString());
            }
        };
    }
    @Bean
    public SavedRequestAwareAuthenticationSuccessHandler loginSuccessHandler() { //登入成功处理
        return new SavedRequestAwareAuthenticationSuccessHandler() {
            @Override
            public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
                HttpSession session=request.getSession();
                session.setAttribute("username",authentication.getName());
                PrintWriter out=response.getWriter();
                JSONObject jsonObject=new JSONObject(R.success("成功！"));
                String msg=jsonObject.toJSONString();
                System.out.println(msg);
                out.write(msg);
                out.flush();
                out.close();
                logger.info("USER : " + authentication.getName() + " LOGIN SUCCESS !  ");
            }
        };
    }
    @Bean
    public AuthenticationFailureHandler loginFailureHandler(){//登录失败处理
        return new AuthenticationFailureHandler(){
            @Override
            public void onAuthenticationFailure(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, AuthenticationException e) throws IOException, ServletException {
                httpServletResponse.setContentType("application/json;charset=utf-8");
                String msg=null;
                if (e instanceof UsernameNotFoundException) {
                    msg=R.error("用户名不存在!").toString();
                } else if(e instanceof BadCredentialsException){
                    msg=R.error("密码错误!").toString();
                } else if (e instanceof LockedException) {
                    msg=R.error("账户被锁定，请联系管理员!").toString();
                } else if (e instanceof CredentialsExpiredException) {
                    msg=R.error("密码过期，请联系管理员!").toString();
                } else if (e instanceof AccountExpiredException) {
                    msg=R.error("账户过期，请联系管理员!").toString();
                } else if (e instanceof DisabledException) {
                    msg=R.error("账户被禁用，请联系管理员!").toString();
                } else {
                    msg=R.error("登录失败!").toString();
                }
                PrintWriter out=httpServletResponse.getWriter();
                out.write(msg);
                out.flush();
                out.close();
            }
        };
    }
    @Bean
    public LogoutSuccessHandler logoutSuccessHandler() { //注销处理
        return new LogoutSuccessHandler() {
            @Override
            public void onLogoutSuccess(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, Authentication authentication) throws IOException, ServletException {
                String msg=R.success("注销成功!").toString();
                PrintWriter out=httpServletResponse.getWriter();
                out.write(msg);
                out.flush();
                out.close();
            }
        };
    }
}
