"use client";

import React, { useEffect, useState } from "react";
import { allnotification, markRead } from "@/server-actions/notifications"; // Adjust path as needed
import { X, Bell, Info, CreditCard, Package } from "lucide-react";

export default function NotificationList() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Load notifications on mount
  const fetchNotifications = async () => {
    const res = await allnotification();
    if (res?.success) {
      setNotifications(res.data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkRead = async (id: string) => {
    // Optimistic UI update: remove from state immediately
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    
    const res = await markRead(id);
    if (!res?.success) {
      // If it fails, refresh to get the real state back
      fetchNotifications();
      alert("Failed to delete notification");
    }
  };

  if (loading) return <div className="p-4 text-gray-500">Loading alerts...</div>;

  return (
    <div className="max-w-md mx-auto mt-10 space-y-3">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Bell className="w-5 h-5" /> Notifications
        </h2>
        <span className="bg-blue-100 text-blue-600 text-xs font-bold px-2 py-1 rounded-full">
          {notifications.length}
        </span>
      </div>

      {notifications.length === 0 ? (
        <p className="text-center text-gray-400 py-10 border-2 border-dashed rounded-lg">
          All caught up!
        </p>
      ) : (
        notifications.map((noti) => (
          <div
            key={noti.id}
            className="relative flex items-start gap-3 p-4 bg-white border rounded-xl shadow-sm hover:shadow-md transition-shadow"
          >
            {/* Type-based Icons */}
            <div className="mt-1">
              {noti.type === "payment" ? (
                <CreditCard className="w-5 h-5 text-green-500" />
              ) : (
                <Package className="w-5 h-5 text-orange-500" />
              )}
            </div>

            <div className="flex-1">
              <h4 className="font-semibold text-sm text-gray-900 capitalize">
                {noti.name}
              </h4>
              <p className="text-sm text-gray-600">{noti.message}</p>
            </div>

            {/* Delete Button */}
            <button
              onClick={() => handleMarkRead(noti.id)}
              className="text-gray-400 hover:text-red-500 transition-colors p-1"
              aria-label="Mark as read"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))
      )}
    </div>
  );
}