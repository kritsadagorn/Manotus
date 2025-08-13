import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, XCircle } from "lucide-react";
import moment from "moment-timezone";

const themeColors = {
  background: "#f0f4f8",
  text: "#2d3748",
  available: "#48bb78",
  reserved: "#f56565",
  border: "#e2e8f0",
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

  // ✅ Use environment variable
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // ตรวจสอบสถานะ Login
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      navigate("/login");
      return;
    }
  }, [navigate]);

  // ดึงข้อมูลที่จอดรถ
  useEffect(() => {
    const fetchParkingLots = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/parking-lots`);
        if (response.data && response.data.length > 0) {
          setParkingLots(response.data);
        } else {
          console.log("No parking lots found");
          setParkingLots([]);
        }
      } catch (error) {
        console.error("Failed to fetch parking lots:", error);
        setParkingLots([]);
      }
    };
    fetchParkingLots();
  }, []);

  // ดึงข้อมูลการจองเมื่อเลือกโรงจอดรถ
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !selectedLot) return;

    const fetchReservations = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/api/reservations?parking_lot_id=${selectedLot.id}` // ✅ Updated
        );
        setReservations(response.data);
      } catch (error) {
        console.error("Failed to fetch reservations:", error);
      }
    };
    fetchReservations();
  }, [selectedLot]);

  // ตรวจสอบว่าช่องจอดรถว่างหรือไม่
  const isSlotAvailable = (slot) => {
    return !reservations.some((reservation) => reservation.slot === slot);
  };

  const handleReserve = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.id) {
      alert("กรุณาเข้าสู่ระบบก่อนจอง");
      navigate("/login");
      return;
    }

    if (!selectedSlot || !startTime || !endTime) {
      alert("โปรดเลือกตำแหน่งและเวลาเข้า-เวลาออก");
      return;
    }

    try {
      // ตรวจสอบการจองที่มีอยู่
      const userReservations = await axios.get(
        `${API_URL}/api/user-reservations/${user.id}`
      );

      if (userReservations.data.length > 0) {
        alert("คุณมีการจองที่จอดอยู่แล้ว ไม่สามารถจองเพิ่มได้");
        return;
      }

      // ทำการจอง
      const response = await axios.post(
        `${API_URL}/api/reserve`,
        {
          userId: user.id,
          parkingLotId: selectedLot.id,
          slot: selectedSlot,
          startTime: startTime,
          endTime: endTime,
          vehicleType: vehicleType,
        }
      );

      alert(response.data.message || "จองที่จอดรถเรียบร้อย!");
      setSelectedSlot(null);
      setStartTime("");
      setEndTime("");

      // รีเฟรชข้อมูลการจอง
      if (selectedLot) {
        const res = await axios.get(
          `${API_URL}/api/reservations?parking_lot_id=${selectedLot.id}`
        );
        setReservations(res.data);
      }
    } catch (error) {
      console.error("Reservation failed:", error);
      alert(
        error.response?.data?.message || "การจองผิดพลาด โปรดลองใหม่อีกครั้ง"
      );
    }
  };

  // ตรวจสอบเวลาออกทุกๆ 5 วินาที
  useEffect(() => {
    const interval = setInterval(async () => {
      const now = moment.utc().format("YYYY-MM-DD HH:mm:ss");
      console.log("Check");
      try {
        await axios.post(
          `${API_URL}/api/check-reservations`, // ✅ Updated
          { now }
        );

        if (selectedLot) {
          const res = await axios.get(
            `${API_URL}/api/reservations?parking_lot_id=${selectedLot.id}` // ✅ Updated
          );
          setReservations(res.data);
        }
      } catch (error) {
        console.error("Failed to check reservations:", error);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [selectedLot]);

  useEffect(() => {
    fetch(`${API_URL}/api/reservations`) // ✅ Updated
      .then((res) => res.json())
      .then((data) => {
        console.log("Reservations Data:", data);
        setReservations(data);
      })
      .catch((err) => console.error("Error fetching reservations:", err));
  }, []);

  return (
    <>
      <style>
        {`
        @import url('https://fonts.googleapis.com/css2?family=Kanit:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
      `}
      </style>
      <div
        className="p-6 min-h-screen"
        style={{
          backgroundColor: themeColors.background,
          color: themeColors.text,
          fontFamily: "Kanit, sans-serif",
        }}
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
                className={`p-4 border-2 rounded cursor-pointer ${
                  selectedLot?.id === lot.id ? "bg-gray-400" : "bg-gray-300"
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
                <p className="text-sm">ประเภทยานพาหนะ: {lot.vehicle_type}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* แสดงที่จอดรถและฟอร์มจอง */}
        {selectedLot && (
          <div>
            <h2 className="text-xl mb-4">ตำแหน่งของ {selectedLot.name}</h2>

            {/* แสดงที่จอดรถ */}
            <div className={`p-4 rounded`}>
              <div className="grid grid-cols-5 gap-4 mb-6">
                {Array.from(
                  { length: selectedLot.max_capacity },
                  (_, i) => i + 1
                ).map((slot) => (
                  <motion.div
                    key={slot}
                    className={`p-4 border rounded text-center cursor-pointer flex items-center justify-center ${
                      isSlotAvailable(slot)
                        ? `bg-[${themeColors.available}]`
                        : `bg-[${themeColors.reserved}]`
                    } ${
                      selectedSlot === slot
                        ? `border-4 border-[${themeColors.border}]`
                        : ""
                    }`}
                    onClick={() =>
                      isSlotAvailable(slot) && setSelectedSlot(slot)
                    }
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {isSlotAvailable(slot) ? (
                      <CheckCircle className="text-gray-500" size={24} />
                    ) : (
                      <XCircle className="text-gray-500" size={24} />
                    )}
                    <div className="ml-2">{slot}</div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* ฟอร์มจองที่จอดรถ */}
            <div className={`p-4 rounded`}>
              <h3 className="text-lg mb-2">กรอกข้อมูล เวลาเข้า-เวลาออก</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium">เวลาเข้า</label>
                  <input
                    type="datetime-local"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className={`w-full p-2 border rounded bg-[${themeColors.background}] text-[${themeColors.text}]`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">เวลาออก</label>
                  <input
                    type="datetime-local"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className={`w-full p-2 border rounded bg-[${themeColors.background}] text-[${themeColors.text}]`}
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
                  Bike 🏍️
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
                  Car 🚗
                </label>
                <br />
                <button
                  onClick={handleReserve}
                  className="hover:bg-[#85827c] hover:cursor-pointer text-white p-2 rounded bg-gray-600"
                >
                  จองคิว
                </button>
              </div>
            </div>

            {/* ตารางแสดงรายการจอง */}
            <div className="mt-6">
              <h3 className="text-xl mb-4">รายการจองที่จอดรถ</h3>
              <table
                className={`w-full border-collapse border border-[${themeColors.border}]`}
              >
                <thead>
                  <tr className={`bg-[${themeColors.background}]`}>
                    <th className={`border border-[${themeColors.border}] p-2`}>
                      รหัสนักศึกษา
                    </th>
                    <th className={`border border-[${themeColors.border}] p-2`}>
                      ตำแหน่งช่อง
                    </th>
                    <th className={`border border-[${themeColors.border}] p-2`}>
                      เวลาเข้า
                    </th>
                    <th className={`border border-[${themeColors.border}] p-2`}>
                      เวลาออก
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {reservations.map((reservation) => (
                    <tr
                      key={reservation.id}
                      className={`bg-[${themeColors.background}]`}
                    >
                      <td
                        className={`border border-[${themeColors.border}] p-2`}
                      >
                        {reservation.username || "Unknown"}
                      </td>
                      <td
                        className={`border border-[${themeColors.border}] p-2`}
                      >
                        {reservation.slot || "N/A"}
                      </td>
                      <td
                        className={`border border-[${themeColors.border}] p-2`}
                      >
                        {reservation.start_time}
                      </td>
                      <td
                        className={`border border-[${themeColors.border}] p-2`}
                      >
                        {reservation.end_time}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Reserve;