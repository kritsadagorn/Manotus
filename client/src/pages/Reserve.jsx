import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, XCircle } from "lucide-react";

const themeColors = {
  background: "#6a4c34",
  text: "#ffffff",
  available: "#9c7434",
  reserved: "#b2a162",
  border: "#a39384",
};

const Reserve = () => {
  const [parkingLots, setParkingLots] = useState([]);
  const [selectedLot, setSelectedLot] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [vehicleType, setVehicleType] = useState("Car");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const navigate = useNavigate();

  // ตรวจสอบสถานะ Login
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      navigate("/login"); // ถ้าไม่ได้ล็อกอิน ให้ไปที่หน้า Login
      return; // หยุดการทำงานของ useEffect
    }
  }, [navigate]);

  // ดึงข้อมูลที่จอดรถ
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return; // ถ้าไม่ได้ล็อกอิน ไม่ต้องดึงข้อมูล

    const fetchParkingLots = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/parking-lots"
        );
        setParkingLots(response.data);
      } catch (error) {
        console.error("Failed to fetch parking lots:", error);
      }
    };
    fetchParkingLots();
  }, []);

  // ดึงข้อมูลการจองเมื่อเลือกโรงจอดรถ
  useEffect(() => {
    const fetchReservations = async () => {
      const response = await axios.get(
        "http://localhost:5000/api/reservations_slot"
      );
      setReservations(response.data);
    };
    fetchReservations();
  }, []);

  // ตรวจสอบว่าช่องจอดรถว่างหรือไม่
  const isSlotAvailable = (slot) => {
    return !reservations.some((reservation) => reservation.slot === slot);
  };

  const handleReserve = async () => {
    if (!selectedSlot || !startTime || !endTime) {
      alert("โปรดเลือกตำแหน่งและเวลาเข้า-เวลาออก.");
      return;
    }

    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      alert("โปรดเข้าสู่ระบบก่อนจอง.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/reserve", {
        userId: user.id,
        parkingLotId: selectedLot.id,
        slot: selectedSlot,
        startTime,
        endTime,
        vehicleType,
      });

      alert("จองที่จอดรถเรียบร้อย!");
      setSelectedSlot(null);
      setStartTime("");
      setEndTime("");

      // Refresh reservations
      const res = await axios.get(
        `http://localhost:5000/api/reservations?parking_lot_id=${selectedLot.id}`
      );
      setReservations(res.data);
    } catch (error) {
      console.error("Reservation failed:", error);
      alert(
        error.response?.data?.message || "การจองผิดพลาด โปรดลองใหม่อีกครั้ง."
      );
    }
  };

  // ตรวจสอบเวลาออกทุกๆ 1 นาที
  // useEffect(() => {
  //   const interval = setInterval(async () => {
  //     const now = new Date().toISOString();
  //     try {
  //       await axios.post("http://localhost:5000/api/check-reservations", {
  //         now,
  //       });
  //       // Refresh reservations
  //       if (selectedLot) {
  //         const res = await axios.get(
  //           `http://localhost:5000/api/reservations?parking_lot_id=${selectedLot.id}`
  //         );
  //         setReservations(res.data);
  //       }
  //     } catch (error) {
  //       console.error("Failed to check reservations:", error);
  //     }
  //   }, 60000); // ตรวจสอบทุก 1 นาที

  //   return () => clearInterval(interval); // ลบ interval เมื่อ component ถูกลบ
  // }, [selectedLot]);

  return (
    <div
      className="p-6 min-h-screen"
      style={{ backgroundColor: "#6a4c34", color: "#ffffff" }}
    >
      <motion.h1
        className="text-3xl font-bold mb-6 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        ตึกศึกษาทั่วไป
      </motion.h1>

      {/* เลือกโรงจอดรถ */}
      <div className="mb-6">
        <h2 className="text-xl mb-2">เลือกตำแหน่งจอดรถ</h2>
        <div className="grid grid-cols-4 gap-4">
          {parkingLots.map((lot) => (
            <motion.div
              key={lot.id}
              className={`p-4 border rounded cursor-pointer ${
                selectedLot?.id === lot.id ? "bg-[#b2a162]" : "bg-[#74543c]"
              }`}
              onClick={() => setSelectedLot(lot)}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-full h-40 bg-gray-300 rounded-lg mb-4 flex items-center justify-center">
                <img
                  src={lot.image_url || "https://via.placeholder.com/400"}
                  alt={`Parking Lot ${lot.name}`}
                  className="w-full h-40 object-cover rounded-lg mb-4"
                />
              </div>
              <h2 className="font-semibold">{lot.name}</h2>
              <p>ความจุ: {lot.max_capacity}</p>
              <p>บทบาท: {lot.allowed_roles}</p>
              <p className="text-sm text-gray-200">
                ประเภทยานพาหนะ: {lot.vehicle_type}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* แสดงที่จอดรถและฟอร์มจอง */}
      {selectedLot && (
        <div>
          <h2 className="text-xl mb-4">ตำแหน่งของ {selectedLot.name}</h2>

          {/* แสดงที่จอดรถ */}
          <div className="grid grid-cols-5 gap-4 mb-6">
            {Array.from(
              { length: selectedLot.max_capacity },
              (_, i) => i + 1
            ).map((slot) => (
              <motion.div
                key={slot}
                className={`p-4 border rounded text-center cursor-pointer flex items-center justify-center ${
                  isSlotAvailable(slot) ? "bg-[#9c7434]" : "bg-[#b2a162]"
                } ${
                  selectedSlot === slot ? "border-4 border-[#f8f246]" : "border"
                }`}
                onClick={() => isSlotAvailable(slot) && setSelectedSlot(slot)}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
              >
                {isSlotAvailable(slot) ? (
                  <CheckCircle className="text-white" size={24} />
                ) : (
                  <XCircle className="text-white" size={24} />
                )}
                <div className="ml-2">{slot}</div>
              </motion.div>
            ))}
          </div>

          {/* ฟอร์มจองที่จอดรถ */}
          <div className="bg-[#a39384] p-4 rounded">
            <h3 className="text-lg mb-2">กรอกข้อมูล เวลาเข้า-เวลาออก</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium">เวลาเข้า</label>
                <input
                  type="datetime-local"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full p-2 border rounded bg-[#a39384] text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">เวลาออก</label>
                <input
                  type="datetime-local"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full p-2 border rounded bg-[#a39384] text-white"
                />
              </div>

              <label className="mr-3">
                <input
                  type="radio"
                  name="vehicleType"
                  value="Bike"
                  checked={vehicleType === "Bike"}
                  onChange={(e) => setVehicleType(e.target.value)}
                  className="mr-3"
                />
                Bike
              </label>
              <label className="mr-2">
                <input
                  type="radio"
                  name="vehicleType"
                  value="Car"
                  checked={vehicleType === "Car"}
                  onChange={(e) => setVehicleType(e.target.value)}
                  className="mr-3"
                />
                Car
              </label>
              <br />
              <button
                onClick={handleReserve}
                className="hover:bg-[#4e402a] text-white p-2 rounded bg-[#9c7434]"
              >
                จองคิว
              </button>
            </div>
          </div>

          {/* ตารางแสดงรายการจอง */}
          <div className="mt-6">
            <h3 className="text-xl mb-4">รายการจองที่จอดรถ</h3>
            <table className="w-full border-collapse border border-[#74543c]">
              <thead>
                <tr className="bg-[#563e2b]">
                  <th className="border border-[#74543c] p-2">รหัสนักศึกษา</th>
                  <th className="border border-[#74543c] p-2">ตำแหน่งช่อง</th>
                  <th className="border border-[#74543c] p-2">เวลาเข้า</th>
                  <th className="border border-[#74543c] p-2">เวลาออก</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map((reservation) => (
                  <tr key={reservation.id} className="bg-[#a39384]">
                    <td className="border border-[#74543c] p-2">
                      {reservation.username || "Unknown"}
                    </td>
                    <td className="border border-[#74543c] p-2">
                      {reservation.slot || "N/A"}
                    </td>
                    <td className="border border-[#74543c] p-2">
                      {new Date(reservation.start_time).toLocaleString()}
                    </td>
                    <td className="border border-[#74543c] p-2">
                      {new Date(reservation.end_time).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reserve;
