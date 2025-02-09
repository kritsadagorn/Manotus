import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { CheckCircle, XCircle } from "lucide-react";

const themeColors = {
  background: "#6a4c34",
  text: "#ffffff",
  available: "#9c7434",
  reserved: "#b2a162",
  border: "#a39384",
};

const Home = () => {
  const [parkingLots, setParkingLots] = useState([]);
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    const fetchParkingLots = async () => {
      const response = await axios.get(
        "http://localhost:5000/api/parking-lots"
      );
      setParkingLots(response.data);
    };
    fetchParkingLots();
  }, []);

  useEffect(() => {
    const fetchReservations = async () => {
      const response = await axios.get(
        "http://localhost:5000/api/reservations_slot"
      );
      setReservations(response.data);
    };
    fetchReservations();
  }, []);

  const getParkingStatus = (parkingLot) => {
    const totalSlots = parkingLot.max_capacity;
    const reservedSlots = reservations.filter(
      (reservation) => reservation.parking_lot_id === parkingLot.id
    ).length;
    const availableSlots = totalSlots - reservedSlots;

    return { totalSlots, reservedSlots, availableSlots };
  };

  return (
    <div
      className="p-6 min-h-screen"
      style={{
        backgroundColor: themeColors.background,
        color: themeColors.text,
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

      {parkingLots.map((lot) => {
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
            <div className="w-full h-40 bg-gray-300 rounded-lg mb-4 flex items-center justify-center">
              <img
                src={lot.image_url || "https://via.placeholder.com/400"}
                alt={`Parking Lot ${lot.name}`}
                className="w-full h-40 object-cover rounded-lg mb-4"
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
      })}
    </div>
  );
};

export default Home;
