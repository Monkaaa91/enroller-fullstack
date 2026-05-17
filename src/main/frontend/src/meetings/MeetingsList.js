export default function MeetingsList({meetings, username, onDelete, onJoin, onLeave}) {
    return (
        <table>
            <thead>
            <tr>
                <th>Nazwa spotkania</th>
                <th>Opis</th>
                <th>Uczestnicy</th>
                <th>Akcje</th>
            </tr>
            </thead>
            <tbody>
            {meetings.map((meeting) => (
                <tr key={meeting.id}>
                    <td>{meeting.title}</td>
                    <td>{meeting.description}</td>
                    <td>
                        {meeting.participants?.map(p => p.login).join(", ") || "Brak"}
                    </td>

                    <td className="meeting-actions">
                        {meeting.participants?.some(p => p.login === username)
                            ? <button className="button" onClick={(e) => {
                                onLeave(meeting);
                                e.target.blur();
                            }}>Wypisz się</button>
                            : <button className="button" onClick={(e) => {
                                onJoin(meeting);
                                e.target.blur();   // ⭐ usuwa focus
                            }}
                            >Zapisz się</button>
                        }

                        <button className="button-danger" onClick={(e) => {
                            onDelete(meeting);
                            e.target.blur();
                        }}
                         >
                            Usuń
                        </button>
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    );
}
