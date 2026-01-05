import { useEffect, useState } from "react"
import { getRecipeGrowth } from "../../services/RecipeAPI"
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

export default function DashboardLineChart() {
    const [data, setData] = useState<any[]>([])

    useEffect(() => {
        const loadData = async () => {
            try {
                const res = await getRecipeGrowth()
                setData(res.data.data)
            } catch (error) {
                console.error(error)
            }
        }
        loadData()
        const interval = setInterval(() => {
            loadData()
        }, 5000)
        return () => clearInterval(interval)
    }, [])

    return (
        <div className="bg-[#1e293b]/40 backdrop-blur-xl rounded-[2rem] p-8 border border-white/10 shadow-2xl">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-black text-white uppercase tracking-tight">
                    Recipe <span className="text-[#fbbf24]">Growth</span>
                </h2>
                <div className="flex items-center gap-2">
                    <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#fbbf24] opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-[#fbbf24]"></span>
                    </span>
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Live Updates</span>
                </div>
            </div>

            <ResponsiveContainer width="100%" height={280}>
                <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                        <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#fbbf24" />
                            <stop offset="100%" stopColor="#d97706" />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis 
                        dataKey="day" 
                        stroke="rgba(255,255,255,0.3)" 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: 'bold' }}
                        dy={10}
                    />
                    <YAxis 
                        stroke="rgba(255,255,255,0.3)" 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }}
                    />
                    <Tooltip 
                        contentStyle={{ 
                            backgroundColor: '#0f172a', 
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '12px',
                            color: '#fff'
                        }}
                        itemStyle={{ color: '#fbbf24', fontWeight: 'bold' }}
                    />
                    <Line
                        type="monotone"
                        dataKey="recipes"
                        stroke="url(#lineGradient)"
                        strokeWidth={4}
                        dot={{ r: 6, fill: '#0f172a', stroke: '#fbbf24', strokeWidth: 2 }}
                        activeDot={{ r: 8, fill: '#fbbf24', stroke: '#fff', strokeWidth: 2 }}
                        animationDuration={1500}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}