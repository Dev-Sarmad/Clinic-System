export default function PrescriptionsManagement({ prescriptions, loading }) {
  if (loading) return <p>Loading prescriptions...</p>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Prescriptions</h2>
      <table className="w-full border border-border">
        <thead className="bg-muted">
          <tr>
            <th className="px-4 py-2 text-left">Doctor</th>
            <th className="px-4 py-2 text-left">Patient</th>
            <th className="px-4 py-2 text-left">Diagnosis</th>
            <th className="px-4 py-2 text-left">Date</th>
          </tr>
        </thead>
        <tbody>
          {prescriptions.map((p) => (
            <tr key={p.id} className="border-t hover:bg-muted/40">
              <td className="px-4 py-2">{p.doctor}</td>
              <td className="px-4 py-2">{p.patient}</td>
              <td className="px-4 py-2">{p.diagnosis}</td>
              <td className="px-4 py-2">{new Date(p.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
