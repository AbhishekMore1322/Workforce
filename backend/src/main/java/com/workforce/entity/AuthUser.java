package com.workforce.entity;

import jakarta.persistence.*;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Set;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class AuthUser {

    @Id
    @EqualsAndHashCode.Include
    private String username;

    private String password;

    private boolean enabled;

    private String provider;

    private String name;

    private String email;

    @OneToMany(
            mappedBy = "authUser",
            cascade = CascadeType.ALL,
            fetch = FetchType.EAGER,
            orphanRemoval = true
    )
    private Set<Authority> authorities;
}
