export default function PatientAppointments({ appointments, loading }) {
  if (loading) return <p>Loading appointments...</p>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Appointments</h2>
      <table className="w-full border border-border">
        <thead className="bg-muted">
          <tr>
            <th className="px-4 py-2 text-left">Date</th>
            <th className="px-4 py-2 text-left">Time Slot</th>
            <th className="px-4 py-2 text-left">Doctor</th>
            <th className="px-4 py-2 text-left">Patient</th>
            <th className="px-4 py-2 text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((a) => (
            <tr key={a.id} className="border-t hover:bg-muted/40">
              <td className="px-4 py-2">{new Date(a.date).toLocaleDateString()}</td>
              <td className="px-4 py-2">{a.timeSlot.start} - {a.timeSlot.end}</td>
              <td className="px-4 py-2">{a.doctor}</td>
              <td className="px-4 py-2">{a.patient}</td>
              <td className="px-4 py-2">{a.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
