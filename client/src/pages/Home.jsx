import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

const themeColors = {
  background: "#f0f4f8", // สีพื้นหลังอ่อนๆ เพื่อให้อ่านง่าย
  text: "#2d3748", // สีข้อความเข้มเพื่อความชัดเจน
  available: "#48bb78", // สีเขียวสื่อถึงที่จอดว่าง
  reserved: "#f56565", // สีแดงสื่อถึงที่จอดถูกจองแล้ว
  border: "#e2e8f0", // สีเส้นขอบอ่อนๆ
  loading: "#4a5568", // สีสำหรับสถานะ loading
};

const Home = () => {
  const [parkingLots, setParkingLots] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [parkingResponse, reservationsResponse] = await Promise.all([
          axios.get("http://localhost:5000/api/parking-lots"),
          axios.get("http://localhost:5000/api/reservations_slot"),
        ]);
        setParkingLots(parkingResponse.data);
        setReservations(reservationsResponse.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getParkingStatus = (parkingLot) => {
    const totalSlots = parkingLot.max_capacity;
    const reservedSlots = reservations.filter(
      (reservation) => reservation.parking_lot_id === parkingLot.id
    ).length;
    const availableSlots = totalSlots - reservedSlots;

    return { totalSlots, reservedSlots, availableSlots };
  };

  if (loading) {
    return (
      <div
        className="flex items-center justify-center min-h-screen"
        style={{ backgroundColor: themeColors.background }}
      >
        <Loader2 className="animate-spin" size={40} color={themeColors.loading} />
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="flex items-center justify-center min-h-screen"
        style={{ backgroundColor: themeColors.background, color: themeColors.text }}
      >
        <p>เกิดข้อผิดพลาด: {error}</p>
      </div>
    );
  }

  return (
    <>
    <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Kanit:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
        `}
      </style>
      <div
        className="p-6 min-h-screen rounded-xl"
        style={{
          backgroundColor: themeColors.background,
          color: themeColors.text,
          fontFamily: 'Kanit, sans-serif'
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

        {parkingLots.length === 0 ? (
          <p className="text-center">ไม่มีข้อมูลที่จอดรถ</p>
        ) : (
          parkingLots.map((lot) => {
            const { totalSlots, reservedSlots, availableSlots } =
              getParkingStatus(lot);

            return (
              <motion.div
                key={lot.id}
                className="mb-8 p-4 rounded-lg shadow-lg"
                style={{ backgroundColor: themeColors.border }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="w-full h-60 bg-gray-300 rounded-lg mb-4 flex items-center justify-center">
                  <img
                    src={lot.image_url || "https://via.placeholder.com/400"}
                    alt={`Parking Lot ${lot.name}`}
                    className="w-full h-40 object-contain rounded-lg mb-4"
                  />
                </div>
                <h2 className="text-2xl font-semibold mb-2">{lot.name}</h2>
                <p>
                  ที่จอดทั้งหมด: {totalSlots} | ที่จอดว่าง: {availableSlots} |
                  จองแล้ว: {reservedSlots}
                </p>

                <div className="grid grid-cols-5 gap-4 mt-4">
                  {Array.from({ length: totalSlots }, (_, i) => i + 1).map(
                    (slot) => {
                      const isReserved = reservations.some(
                        (reservation) =>
                          reservation.parking_lot_id === lot.id &&
                          reservation.slot === slot
                      );

                      return (
                        <motion.div
                          key={slot}
                          className="p-4 rounded-lg text-center text-white font-bold flex flex-col items-center"
                          style={{
                            backgroundColor: isReserved
                              ? themeColors.reserved
                              : themeColors.available,
                          }}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.3 }}
                        >
                          {slot}
                          {isReserved ? (
                            <XCircle size={20} className="mt-2" />
                          ) : (
                            <CheckCircle size={20} className="mt-2" />
                          )}
                        </motion.div>
                      );
                    }
                  )}
                </div>
              </motion.div>
            );
          })
        )}
      </div>
      </>
  );
};

export default Home;