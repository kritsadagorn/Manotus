import React, { useEffect, useState } from 'react';

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [newUser, setNewUser] = useState({ username: '', password: '', role: 'student' });

  // โหลดข้อมูลการจอง
  const fetchReservations = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/admin/reservations');
      const data = await res.json();
      setReservations(data);
    } catch (error) {
      console.error('Error fetching reservations:', error);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  // ฟังก์ชันเพิ่ม User
  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/admin/add-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });
      const data = await res.json();
      alert(data.message);
      setNewUser({ username: '', password: '', role: 'student' });
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  // ฟังก์ชันลบรายการจอง
  const handleDeleteReservation = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/delete-reservation/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      alert(data.message);
      fetchReservations(); // โหลดข้อมูลใหม่หลังจากลบ
    } catch (error) {
      console.error('Error deleting reservation:', error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Admin Panel</h1>

      {/* ฟอร์มเพิ่ม User */}
      <div className="bg-gray-100 p-4 rounded-lg shadow-md mb-6">
        <h2 className="text-2xl font-semibold mb-3">Add New User</h2>
        <form onSubmit={handleAddUser} className="space-y-3">
          <input
            type="text"
            placeholder="Username"
            value={newUser.username}
            onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={newUser.password}
            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
          <select
            value={newUser.role}
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            className="w-full p-2 border rounded"
          >
            <option value="user">student</option>
            <option value="admin">teacher</option>
          </select>
          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">Add User</button>
        </form>
      </div>

      {/* ตารางแสดงรายการจอง */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-3">Reservations</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead>
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-2 px-4 border">Lot</th>
                <th className="py-2 px-4 border">Slot</th>
                <th className="py-2 px-4 border">Reserved User</th>
                <th className="py-2 px-4 border">Start Time</th>
                <th className="py-2 px-4 border">End Time</th>
                <th className="py-2 px-4 border">Vehicle Type</th>
                <th className="py-2 px-4 border">Status</th>
                <th className="py-2 px-4 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((res) => (
                <tr key={res.id} className="border-b">
                  <td className="py-2 px-4 border">{res.lot}</td>
                  <td className="py-2 px-4 border">{res.slot}</td>
                  <td className="py-2 px-4 border">{res.reserved_user}</td>
                  <td className="py-2 px-4 border">{res.start_time}</td>
                  <td className="py-2 px-4 border">{res.end_time}</td>
                  <td className="py-2 px-4 border">{res.vehicle_type}</td>
                  <td className={`py-2 px-4 border ${res.status === 'Expired' ? 'text-red-500' : 'text-green-500'}`}>
                    {res.status}
                  </td>
                  <td className="py-2 px-4 border">
                    <button
                      onClick={() => handleDeleteReservation(res.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default Admin;
