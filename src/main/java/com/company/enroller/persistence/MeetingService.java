package com.company.enroller.persistence;

import com.company.enroller.model.Meeting;
import com.company.enroller.model.Participant;
import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.Transaction;
import org.springframework.stereotype.Component;

import java.util.Collection;

@Component("meetingService")
public class MeetingService {

    Session session;

    public MeetingService() {
        session = DatabaseConnector.getInstance().getSession();
    }

    public Collection<Meeting> getAll() {
        String hql = "SELECT DISTINCT m FROM Meeting m LEFT JOIN FETCH m.participants";
        return session.createQuery(hql).list();
    }


    public Meeting findById(long id) {
        return this.session.get(Meeting.class, id);
    }

    public Collection<Meeting> findMeetings(String title, String description, Participant participant, String sortMode) {
        String hql = "SELECT DISTINCT m FROM Meeting m LEFT JOIN FETCH m.participants " +
                "WHERE m.title LIKE :title AND m.description LIKE :description ";
        if (participant != null) {
            hql += " AND :participant in elements(participants)";
        }
        if (sortMode.equals("title")) {
            hql += " ORDER BY title";
        }
        Query query = this.session.createQuery(hql);
        query.setParameter("title", "%" + title + "%").setParameter("description", "%" + description + "%");
        if (participant != null) {
            query.setParameter("participant", participant);
        }
        return query.list();
    }

    public void delete(Meeting meeting) {
        Transaction transaction = this.session.beginTransaction();
        this.session.delete(meeting);
        transaction.commit();
    }

    public void add(Meeting meeting) {
        Transaction transaction = this.session.beginTransaction();
        this.session.save(meeting);
        transaction.commit();
    }

    public void update(Meeting meeting) {
        Transaction transaction = this.session.beginTransaction();
        this.session.merge(meeting);
        transaction.commit();
    }

    public boolean alreadyExist(Meeting meeting) {
        String hql = "FROM Meeting WHERE title=:title AND date=:date";
        Query query = this.session.createQuery(hql);
        Collection resultList = query.setParameter("title", meeting.getTitle()).setParameter("date", meeting.getDate())
                .list();
        return query.list().size() != 0;
    }
    public void addParticipant(Meeting meeting, Participant participant) {
        meeting.getParticipants().add(participant);
        session.beginTransaction();
        session.update(meeting);
        session.getTransaction().commit();
    }

    public void removeParticipant(Meeting meeting, Participant participant) {
        meeting.getParticipants().remove(participant);
        session.beginTransaction();
        session.update(meeting);
        session.getTransaction().commit();
    }


}
