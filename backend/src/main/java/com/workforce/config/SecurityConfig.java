package com.workforce.config;

import com.workforce.security.JwtAuthenticationFilter;
import com.workforce.security.JwtAuthorizationFilter;
import com.workforce.security.JwtUtil;
import com.workforce.repository.EmployerRepository;
import com.workforce.repository.JobSeekerRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.*;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.core.GrantedAuthorityDefaults;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.jdbc.JdbcDaoImpl;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import javax.sql.DataSource;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private EmployerRepository employerRepository;

    @Autowired
    private JobSeekerRepository jobSeekerRepository;

    @Bean
    public GrantedAuthorityDefaults grantedAuthorityDefaults() {
        return new GrantedAuthorityDefaults("");
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public UserDetailsService userDetailsService(DataSource dataSource) {
        JdbcDaoImpl jdbc = new JdbcDaoImpl();
        jdbc.setDataSource(dataSource);

        jdbc.setUsersByUsernameQuery(
                "SELECT username, password, enabled FROM users WHERE username = ?"
        );

        jdbc.setAuthoritiesByUsernameQuery(
                "SELECT username, authority FROM authorities WHERE username = ?"
        );

        return jdbc;
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain filterChain(
            HttpSecurity http,
            AuthenticationManager authenticationManager,
            UserDetailsService userDetailsService
    ) throws Exception {

        JwtAuthenticationFilter authFilter =
                new JwtAuthenticationFilter(
                        authenticationManager,
                        jwtUtil,
                        employerRepository,
                        jobSeekerRepository
                );

        authFilter.setFilterProcessesUrl("/auth/login");

        JwtAuthorizationFilter authorizationFilter =
                new JwtAuthorizationFilter(jwtUtil, userDetailsService);

        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> {})
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .authorizeHttpRequests(auth -> auth

            
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                .requestMatchers("/auth/**").permitAll()

                .requestMatchers(HttpMethod.GET,   "/jobseekers/**").hasAnyAuthority("JOB_SEEKER", "EMPLOYER", "ADMIN", "OFFICER")
                .requestMatchers(HttpMethod.POST,  "/jobseekers/**").hasAnyAuthority("JOB_SEEKER", "ADMIN")
                .requestMatchers(HttpMethod.PUT,   "/jobseekers/**").hasAnyAuthority("JOB_SEEKER", "ADMIN")
                .requestMatchers(HttpMethod.PATCH, "/jobseekers/**").hasAnyAuthority("JOB_SEEKER", "ADMIN", "OFFICER")
                .requestMatchers(HttpMethod.DELETE,"/jobseekers/**").hasAnyAuthority("JOB_SEEKER", "ADMIN")

                .requestMatchers(HttpMethod.GET,   "/employers/**").hasAnyAuthority("EMPLOYER", "ADMIN", "OFFICER")
                .requestMatchers(HttpMethod.POST,  "/employers/**").hasAnyAuthority("EMPLOYER", "ADMIN")
                .requestMatchers(HttpMethod.PUT,   "/employers/**").hasAnyAuthority("EMPLOYER", "ADMIN")
                .requestMatchers(HttpMethod.PATCH, "/employers/**").hasAnyAuthority("EMPLOYER", "ADMIN", "OFFICER")
                .requestMatchers(HttpMethod.DELETE,"/employers/**").hasAnyAuthority("EMPLOYER", "ADMIN")

                .requestMatchers(HttpMethod.GET,   "/jobs/**").hasAnyAuthority("JOB_SEEKER", "EMPLOYER", "ADMIN", "OFFICER")
                .requestMatchers(HttpMethod.POST,  "/jobs/**").hasAnyAuthority("EMPLOYER", "ADMIN")
                .requestMatchers(HttpMethod.PUT,   "/jobs/**").hasAnyAuthority("EMPLOYER", "ADMIN")
                .requestMatchers(HttpMethod.PATCH, "/jobs/**").hasAnyAuthority("EMPLOYER", "ADMIN", "OFFICER")
                .requestMatchers(HttpMethod.DELETE,"/jobs/**").hasAnyAuthority("EMPLOYER", "ADMIN")

                .requestMatchers(HttpMethod.POST,  "/applications/**").hasAnyAuthority("JOB_SEEKER")
                .requestMatchers(HttpMethod.GET,   "/applications/job/**").hasAnyAuthority("EMPLOYER", "ADMIN", "OFFICER")
                .requestMatchers(HttpMethod.GET,   "/applications/jobseeker/**").hasAnyAuthority("JOB_SEEKER", "ADMIN", "OFFICER")
                .requestMatchers(HttpMethod.GET,   "/applications/**").hasAnyAuthority("JOB_SEEKER", "EMPLOYER", "ADMIN", "OFFICER")
                .requestMatchers(HttpMethod.PATCH, "/applications/**").hasAnyAuthority("EMPLOYER", "ADMIN", "OFFICER")

    
                .requestMatchers(HttpMethod.POST,  "/interviews/**").hasAnyAuthority("EMPLOYER", "ADMIN")
                .requestMatchers(HttpMethod.GET,   "/interviews/**").hasAnyAuthority("EMPLOYER", "ADMIN", "OFFICER")
                .requestMatchers(HttpMethod.PATCH, "/interviews/**").hasAnyAuthority("EMPLOYER", "ADMIN", "OFFICER")
                .requestMatchers(HttpMethod.DELETE,"/interviews/**").hasAnyAuthority("EMPLOYER", "ADMIN")

          
                .requestMatchers(HttpMethod.POST,  "/placements/**").hasAnyAuthority("EMPLOYER", "ADMIN")
                .requestMatchers(HttpMethod.GET,   "/placements/**").hasAnyAuthority("EMPLOYER", "ADMIN", "OFFICER")
                .requestMatchers(HttpMethod.PATCH, "/placements/**").hasAnyAuthority("EMPLOYER", "ADMIN", "OFFICER")
                .requestMatchers(HttpMethod.DELETE,"/placements/**").hasAnyAuthority("ADMIN")

                .requestMatchers(HttpMethod.GET,   "/training-programs/**").hasAnyAuthority("JOB_SEEKER", "EMPLOYER", "ADMIN", "OFFICER", "PROGRAM_MANAGER")
                .requestMatchers(HttpMethod.POST,  "/training-programs/**").hasAnyAuthority("PROGRAM_MANAGER", "ADMIN")
                .requestMatchers(HttpMethod.PATCH, "/training-programs/**").hasAnyAuthority("PROGRAM_MANAGER", "ADMIN")
                .requestMatchers(HttpMethod.DELETE,"/training-programs/**").hasAnyAuthority("PROGRAM_MANAGER", "ADMIN")


                .requestMatchers(HttpMethod.POST,  "/training-programs/*/enroll").hasAnyAuthority("JOB_SEEKER")
                .requestMatchers(HttpMethod.GET,   "/enrollments/**").hasAnyAuthority("JOB_SEEKER", "ADMIN", "OFFICER", "PROGRAM_MANAGER")
                .requestMatchers(HttpMethod.PATCH, "/enrollments/**").hasAnyAuthority("ADMIN", "OFFICER", "PROGRAM_MANAGER")

                .requestMatchers("/compliance/**").hasAnyAuthority("OFFICER","AUDITOR")
                .requestMatchers("/reports/training").hasAnyAuthority("ADMIN", "PROGRAM_MANAGER","AUDITOR")
                .requestMatchers("/reports/**").hasAnyAuthority("ADMIN", "OFFICER","AUDITOR")

                .requestMatchers("/notifications/**").hasAnyAuthority("JOB_SEEKER", "EMPLOYER", "ADMIN", "OFFICER", "AUDITOR", "PROGRAM_MANAGER")

                .anyRequest().authenticated()
            )
            .formLogin(form -> form.disable())
            .httpBasic(basic -> basic.disable())

            .addFilterBefore(authFilter, UsernamePasswordAuthenticationFilter.class)
            .addFilterBefore(authorizationFilter, JwtAuthenticationFilter.class);

        return http.build();
    }
}