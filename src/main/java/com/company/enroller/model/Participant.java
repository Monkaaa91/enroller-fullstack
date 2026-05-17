package com.company.enroller.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "participant")
public class Participant {

    @Id
    private String login;

    @Column
    private String password;

    @ManyToMany(mappedBy = "participants")
    @JsonIgnore
    private Set<Meeting> meetings = new HashSet<>();

    public String getLogin() {
        return login;
    }

    public void setLogin(String login) {
        this.login = login;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
