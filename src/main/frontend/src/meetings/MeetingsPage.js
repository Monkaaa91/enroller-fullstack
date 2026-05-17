import {useEffect, useState} from "react";
import NewMeetingForm from "./NewMeetingForm";
import MeetingsList from "./MeetingsList";

export default function MeetingsPage({username}) {
    const [meetings, setMeetings] = useState([]);
    const [addingNewMeeting, setAddingNewMeeting] = useState(false);

    useEffect(() => {
        const fetchMeetings = async () => {
            const response = await fetch(`/api/meetings`);
            if (response.ok) {
                const meetings = await response.json();
                setMeetings(meetings);
            }
        };
        fetchMeetings();
    }, []);

    async function refreshMeetings() {
        const response = await fetch('/api/meetings');
        if (response.ok) {
            const data = await response.json();
            setMeetings(data);
        }
    }

    async function handleJoin(meeting) {
        const response = await fetch(`/api/meetings/${meeting.id}/participants`, {
            method: 'POST',
            body: JSON.stringify({ login: username }),
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok) {
            refreshMeetings();
        }
    }

    async function handleLeave(meeting) {
        const response = await fetch(`/api/meetings/${meeting.id}/participants/${username}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            refreshMeetings();
        }
    }

    async function handleNewMeeting(meeting) {
        const response = await fetch('/api/meetings', {
            method: 'POST',
            body: JSON.stringify(meeting),
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok) {
            refreshMeetings();
            setAddingNewMeeting(false);
        }
    }

    async function handleDeleteMeeting(meeting) {
        const response = await fetch(`/api/meetings/${meeting.id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            refreshMeetings();
        }
    }

    return (
        <div>
            <h2>Zajęcia ({meetings.length})</h2>

            {addingNewMeeting
                ? <NewMeetingForm onSubmit={handleNewMeeting}/>
                : <button onClick={() => setAddingNewMeeting(true)}>Dodaj nowe spotkanie</button>
            }

            {meetings.length > 0 &&
                <MeetingsList
                    meetings={meetings}
                    username={username}
                    onDelete={handleDeleteMeeting}
                    onJoin={handleJoin}
                    onLeave={handleLeave}
                />
            }
        </div>
    );
}

