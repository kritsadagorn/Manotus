import React, { useEffect, useState } from "react";

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [parkingLots, setParkingLots] = useState([]);
  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    role: "student",
  });
  const [newParkingLot, setNewParkingLot] = useState({
    name: "",
    max_capacity: 0,
    allowed_roles: "both",
    vehicle_type: "All",
    image_url: "",
  });

  // ✅ Use environment variable
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchReservations();
    fetchParkingLots();

    // ✅ ตั้งให้โหลดข้อมูลใหม่ทุก 5 วินาที (5000ms)
    const interval = setInterval(() => {
      fetchReservations();
    }, 5000);

    return () => clearInterval(interval); // ล้าง interval เมื่อ component ออกจาก DOM
  }, []);

  // โหลดข้อมูลการจอง
  const fetchReservations = async () => {
    try {
      const res = await fetch(`${API_URL}/api/reservations_slot`); // ✅ Updated
      const data = await res.json();
      setReservations(data);
    } catch (error) {
      console.error("Error fetching reservations:", error);
    }
  };

  // โหลดข้อมูล parking_lots
  const fetchParkingLots = async () => {
    try {
      const res = await fetch(`${API_URL}/api/parking-lots`); // ✅ Updated
      const data = await res.json();
      setParkingLots(data);
    } catch (error) {
      console.error("Error fetching parking lots:", error);
    }
  };

  // ฟังก์ชันเพิ่ม User
  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/admin/add-user`, { // ✅ Updated
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });
      const data = await res.json();
      alert(data.message);
      setNewUser({ username: "", password: "", role: "student" });
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  // ฟังก์ชันลบรายการจอง
  const handleDeleteReservation = async (id) => {
    try {
      const res = await fetch(
        `${API_URL}/api/admin/delete-reservation/${id}`, // ✅ Updated
        {
          method: "DELETE",
        }
      );
      const data = await res.json();
      alert(data.message);
      fetchReservations(); // โหลดข้อมูลใหม่หลังจากลบ
    } catch (error) {
      console.error("Error deleting reservation:", error);
    }
  };

  // ฟังก์ชันเพิ่ม Parking Lot
  const handleAddParkingLot = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/admin/add-parking-lot`, { // ✅ Updated
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newParkingLot),
      });
      const data = await res.json();
      alert(data.message);
      setNewParkingLot({
        name: "",
        max_capacity: 0,
        allowed_roles: "both",
        vehicle_type: "All",
        image_url: "",
      });
      fetchParkingLots();
    } catch (error) {
      console.error("Error adding parking lot:", error);
    }
  };

  // ฟังก์ชันลบ Parking Lot
  const handleDeleteParkingLot = async (id) => {
    try {
      const res = await fetch(
        `${API_URL}/api/admin/delete-parking-lot/${id}`, // ✅ Updated
        {
          method: "DELETE",
        }
      );
      const data = await res.json();
      alert(data.message);
      fetchParkingLots();
    } catch (error) {
      console.error("Error deleting parking lot:", error);
    }
  };

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Kanit:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
        `}
      </style>
      <div
        className="container mx-auto p-6"
        style={{ fontFamily: "Kanit, sans-serif" }}
      >
        <h1 className="text-3xl font-bold mb-4">Admin Panel</h1>

        {/* ฟอร์มเพิ่ม User */}
        <div className="bg-gray-100 p-4 rounded-lg shadow-md mb-6">
          <h2 className="text-2xl font-semibold mb-3">เพิ่มข้อมูล USER</h2>
          <form onSubmit={handleAddUser} className="space-y-3">
            <input
              type="text"
              placeholder="Username"
              value={newUser.username}
              onChange={(e) =>
                setNewUser({ ...newUser, username: e.target.value })
              }
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={newUser.password}
              onChange={(e) =>
                setNewUser({ ...newUser, password: e.target.value })
              }
              className="w-full p-2 border rounded"
              required
            />
            <select
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
              className="w-full p-2 border rounded  "
            >
              <option value="student">student</option>
              <option value="teacher">teacher</option>
            </select>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded"
            >
              Add User
            </button>
          </form>
        </div>

        {/* ฟอร์มเพิ่ม Parking Lot */}
        <div className="bg-gray-100 p-4 rounded-lg shadow-md mb-6">
          <h2 className="text-2xl font-semibold mb-3">Add New Parking Lot</h2>
          <form onSubmit={handleAddParkingLot} className="space-y-3">
            <input
              type="text"
              placeholder="Name"
              value={newParkingLot.name}
              onChange={(e) =>
                setNewParkingLot({ ...newParkingLot, name: e.target.value })
              }
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="number"
              placeholder="Max Capacity"
              value={newParkingLot.max_capacity}
              onChange={(e) =>
                setNewParkingLot({
                  ...newParkingLot,
                  max_capacity: e.target.value,
                })
              }
              className="w-full p-2 border rounded"
              required
            />
            <select
              value={newParkingLot.allowed_roles}
              onChange={(e) =>
                setNewParkingLot({
                  ...newParkingLot,
                  allowed_roles: e.target.value,
                })
              }
              className="w-full p-2 border rounded"
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
              <option value="both">Both</option>
            </select>
            <select
              value={newParkingLot.vehicle_type}
              onChange={(e) =>
                setNewParkingLot({
                  ...newParkingLot,
                  vehicle_type: e.target.value,
                })
              }
              className="w-full p-2 border rounded"
            >
              <option value="Bike">Bike</option>
              <option value="Car">Car</option>
              <option value="All">All</option>
            </select>
            <input
              type="text"
              placeholder="Image URL"
              value={newParkingLot.image_url}
              onChange={(e) =>
                setNewParkingLot({
                  ...newParkingLot,
                  image_url: e.target.value,
                })
              }
              className="w-full p-2 border rounded"
            />
            <button
              type="submit"
              className="w-full bg-green-500 text-white py-2 rounded"
            >
              Add Parking Lot
            </button>
          </form>
        </div>

        {/* ตารางแสดงรายการ Parking Lots */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <h2 className="text-2xl font-semibold mb-3">Parking Lots</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border">
              <thead>
                <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                  <th className="py-2 px-4 border">Name</th>
                  <th className="py-2 px-4 border">Max Capacity</th>
                  <th className="py-2 px-4 border">Allowed Roles</th>
                  <th className="py-2 px-4 border">Vehicle Type</th>
                  <th className="py-2 px-4 border">Image URL</th>
                  <th className="py-2 px-4 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {parkingLots.map((lot) => (
                  <tr key={lot.id} className="border-b">
                    <td className="py-2 px-4 border">{lot.name}</td>
                    <td className="py-2 px-4 border">{lot.max_capacity}</td>
                    <td className="py-2 px-4 border">{lot.allowed_roles}</td>
                    <td className="py-2 px-4 border">{lot.vehicle_type}</td>
                    <td className="py-2 px-4 border">{lot.image_url}</td>
                    <td className="py-2 px-4 border">
                      <button
                        onClick={() => handleDeleteParkingLot(lot.id)}
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

        {/* ตารางแสดงรายการจอง */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-3">Reservations</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border">
              <thead>
                <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                  <th className="py-2 px-4 border">ID</th>
                  <th className="py-2 px-4 border">Slot</th>
                  <th className="py-2 px-4 border">Reserved User</th>
                  <th className="py-2 px-4 border">Start Time</th>
                  <th className="py-2 px-4 border">End Time</th>
                  <th className="py-2 px-4 border">Vehicle Type</th>
                  <th className="py-2 px-4 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map((res) => (
                  <tr key={res.id} className="border-b">
                    <td className="py-2 px-4 border">{res.lot_name}</td>
                    <td className="py-2 px-4 border">{res.slot}</td>
                    <td className="py-2 px-4 border">{res.username}</td>
                    <td className="py-2 px-4 border">{res.start_time}</td>
                    <td className="py-2 px-4 border">{res.end_time}</td>
                    <td className="py-2 px-4 border">{res.vehicle_type}</td>
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
      <a href="https://pic.in.th/?lang=th">Upload Picture</a>
    </>
  );
};

export default Admin;