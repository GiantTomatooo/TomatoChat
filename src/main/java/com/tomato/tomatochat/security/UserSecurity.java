package com.tomato.tomatochat.security;

import com.tomato.tomatochat.entity.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

public class UserSecurity extends User implements UserDetails {
    private static final long serialVersionUID = 1L;
    public UserSecurity(User user){
        if (user!=null){
            this.setId(user.getId());
            this.setUsername(user.getUsername());
            this.setPassword(user.getPassword());
        }
    }
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        List<GrantedAuthority> authorityList=new ArrayList<>();
        authorityList.add(new SimpleGrantedAuthority("USER"));
        return authorityList;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
