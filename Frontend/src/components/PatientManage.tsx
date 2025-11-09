
export default function PatientsManage({ patients, loading }) {
  if (loading) return <p>Loading patients...</p>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Patients List</h2>
      <table className="w-full border border-border">
        <thead className="bg-muted">
          <tr>
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">Email</th>
            <th className="px-4 py-2 text-left">Phone</th>
            <th className="px-4 py-2 text-left">Gender</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((p) => (
            <tr key={p.id} className="border-t hover:bg-muted/40">
              <td className="px-4 py-2">{p.name}</td>
              <td className="px-4 py-2">{p.email}</td>
              <td className="px-4 py-2">{p.phone}</td>
              <td className="px-4 py-2">{p.gender}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
