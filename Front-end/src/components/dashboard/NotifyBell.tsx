import { useEffect, useState, useRef } from "react";
import { getAllNotifications, markAsRead } from "../../services/NotifyAPI";
import { io } from 'socket.io-client';
import { IoMdNotificationsOutline } from "react-icons/io";

interface NotificationItem {
    _id: string;
    recipeTitle: string;
    foodName: string;
    userName: string;
    createdAt: string;
    read: boolean;
}

const NotifyBell = () => {
    const [notifications, setNotifications] = useState<NotificationItem[]>([])
    const [unReadCount, setUnReadCount] = useState(0)
    const [isOpen, setIsOpen] = useState(false)
    const socket = useRef<any>(null)

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await getAllNotifications()
                setNotifications(response.data.data.notification)
                setUnReadCount(response.data.data.unReadNotify)
            } catch (error) {
                console.error(error)
            }
        }
        fetchNotifications()

        socket.current = io("http://localhost:5000")

        socket.current.on("connect", () => {
            socket.current.emit("join_admin_room")
        })

        socket.current.on("New Pending Recipe", (payload: any) => {
            const newNotification = {
                _id: payload.data.recipeId,
                recipeTitle: payload.data.recipeTitle,
                foodName: payload.data.foodName,
                userName: payload.data.userName,
                createdAt: new Date().toISOString(),
                read: false
            }
            setNotifications((prev) => [newNotification, ...prev])
            setUnReadCount((prev) => prev + 1)
        })
        return () => {
            socket.current.disconnect()
        }
    }, [])

    const handleDropDown = async () => {
        if (!isOpen && unReadCount > 0) {
            try {
                await markAsRead()
                setUnReadCount(0)
            } catch (error) {
                console.error(error)
            }
        }
        setIsOpen(!isOpen)
    }

    return (
        <div className="relative">
            <button
                className={`relative p-2.5 rounded-2xl transition-all duration-300 ${
                    isOpen ? "bg-[#fbbf24] text-[#0f172a]" : "bg-white/5 text-white hover:bg-white/10"
                }`}
                onClick={handleDropDown}
            >
                <IoMdNotificationsOutline className="text-2xl" />
                {unReadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-[#0f172a] animate-bounce">
                        {unReadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-4 w-96 bg-[#1e293b] border border-white/10 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-[100] overflow-hidden backdrop-blur-xl">
                    <div className="p-6 border-b border-white/5 flex justify-between items-center">
                        <h3 className="text-sm font-black uppercase tracking-widest text-white">
                            Notifications
                        </h3>
                        <span className="text-[10px] bg-[#fbbf24]/10 text-[#fbbf24] px-2 py-1 rounded-md font-bold">
                            Live
                        </span>
                    </div>

                    <div className="max-h-[450px] overflow-y-auto custom-scrollbar">
                        {notifications.length === 0 ? (
                            <div className="p-10 text-center">
                                <p className="text-gray-500 text-xs font-bold uppercase tracking-tighter">
                                    All caught up!
                                </p>
                            </div>
                        ) : (
                            notifications.map((notify, index) => (
                                <div
                                    key={index}
                                    className={`p-5 border-b border-white/5 transition duration-300 hover:bg-white/[0.02] ${
                                        !notify.read ? 'bg-[#fbbf24]/5' : ''
                                    }`}
                                >
                                    <div className="mb-3">
                                        <span className="text-[10px] font-black text-[#fbbf24] uppercase tracking-widest block mb-1">
                                            New Submission
                                        </span>
                                        <div className="text-white font-bold text-sm leading-tight">
                                            {notify.recipeTitle}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 bg-black/20 p-3 rounded-xl border border-white/5">
                                        <div>
                                            <span className="text-[9px] text-gray-500 uppercase font-black block">Food</span>
                                            <span className="text-xs text-gray-300 font-medium">{notify.foodName || "N/A"}</span>
                                        </div>
                                        <div>
                                            <span className="text-[9px] text-gray-500 uppercase font-black block">User</span>
                                            <span className="text-xs text-gray-300 font-medium">{notify.userName}</span>
                                        </div>
                                    </div>

                                    <div className="text-[9px] text-gray-600 font-bold text-right mt-3 uppercase tracking-tighter">
                                        {new Date(notify.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                    
                    <div className="p-4 bg-white/[0.02] text-center border-t border-white/5">
                        <button className="text-[10px] font-black text-gray-500 uppercase tracking-widest hover:text-[#fbbf24] transition-colors">
                            Clear All
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default NotifyBell;