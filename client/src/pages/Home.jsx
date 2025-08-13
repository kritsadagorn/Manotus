import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Dialog } from "@headlessui/react";

const themeColors = {
  background: "#f0f4f8",
  text: "#2d3748",
  available: "#48bb78",
  reserved: "#f56565",
  border: "#e2e8f0",
  loading: "#4a5568",
};

const Home = () => {
  const [parkingLots, setParkingLots] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  // ✅ Use environment variable
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [parkingResponse, reservationsResponse] = await Promise.all([
          axios.get(`${API_URL}/api/parking-lots`), // ✅ Updated
          axios.get(`${API_URL}/api/reservations_slot`), // ✅ Updated
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
    // แก้ไขการนับจำนวนที่จอดที่ถูกจอง
    const reservedSlots = reservations.filter(
      (reservation) => reservation.lot_name === parkingLot.name
    ).length;
    const availableSlots = totalSlots - reservedSlots;

    return { totalSlots, reservedSlots, availableSlots };
  };

  const openModal = (imageUrl) => {
    setSelectedImage(imageUrl);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setSelectedImage("");
  };

  if (loading) {
    return (
      <div
        className="flex items-center justify-center min-h-screen"
        style={{ backgroundColor: themeColors.background }}
      >
        <Loader2
          className="animate-spin"
          size={40}
          color={themeColors.loading}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="flex items-center justify-center min-h-screen"
        style={{
          backgroundColor: themeColors.background,
          color: themeColors.text,
        }}
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
                    className="w-full h-full object-cover rounded-lg mb-4 cursor-pointer"
                    onClick={() => openModal(lot.image_url)}
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
                      // แก้ไขการตรวจสอบว่าช่องจอดถูกจองหรือไม่
                      const isReserved = reservations.some(
                        (reservation) =>
                          reservation.lot_name === lot.name &&
                          reservation.slot === slot
                      );

                      return (
                        <motion.div
                          key={slot}
                          className={`p-4 rounded-lg text-center text-white font-bold flex flex-col items-center ${
                            isReserved ? 'bg-red-500' : 'bg-green-500'
                          }`}
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

      {/* Modal สำหรับแสดงรูปภาพใหญ่ */}
      <Dialog open={isOpen} onClose={closeModal} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-3xl rounded-lg bg-white p-6">
            <img
              src={selectedImage}
              alt="Selected Parking Lot"
              className="w-full h-full object-cover rounded-lg"
            />
            <button
              onClick={closeModal}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg cursor-pointer"
            >
              ปิด
            </button>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
};

export default Home;
