package com.tomato.tomatochat.config;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.context.annotation.Configuration;

@Configuration
@MapperScan("com.tomato.tomatochat.mapper")
public class MapperConfig {
}
