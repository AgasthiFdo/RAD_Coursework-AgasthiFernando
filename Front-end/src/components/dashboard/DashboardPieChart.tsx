import { useEffect, useState } from "react"
import { getTotalStatusAndCompire } from "../../services/RecipeAPI"
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

const COLORS = ["#fbbf24", "#d97706", "#475569"];

export default function DashboardPieChart() {
    const [data, setData] = useState<any[]>([])

    useEffect(() => {
        const loadData = async () => {
            try {
                const response = await getTotalStatusAndCompire()
                setData(response.data.statusData)
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
        <div className="bg-[#1e293b]/40 backdrop-blur-xl p-8 rounded-[2rem] border border-white/10 shadow-2xl h-[400px] w-full">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-black text-white uppercase tracking-tight">
                    Status <span className="text-[#fbbf24]">Analysis</span>
                </h2>
                <div className="bg-white/5 p-2 rounded-lg">
                    <div className="w-4 h-4 rounded-full border-2 border-[#fbbf24] border-t-transparent animate-spin"></div>
                </div>
            </div>

            <div style={{ width: '100%', height: '280px' }}>
                <ResponsiveContainer>
                    <PieChart>
                        <Pie
                            data={data}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={90}
                            paddingAngle={8}
                            isAnimationActive={true}
                            stroke="none"
                        >
                            {data.map((_, index) => (
                                <Cell 
                                    key={`cell-${index}`} 
                                    fill={COLORS[index % COLORS.length]} 
                                    className="filter drop-shadow-lg transition-all duration-300"
                                />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#0f172a',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '12px',
                                fontSize: '12px',
                                fontWeight: 'bold'
                            }}
                            itemStyle={{ color: '#fff' }}
                        />
                        <Legend 
                            verticalAlign="bottom" 
                            height={36}
                            formatter={(value) => (
                                <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-2">
                                    {value}
                                </span>
                            )}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}