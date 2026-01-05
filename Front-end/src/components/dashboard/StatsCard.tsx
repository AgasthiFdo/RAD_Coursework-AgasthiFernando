
type StatsCardProps ={
    title: string
    value: number
    icon: string
}

export default function StatsCard({title, value, icon}: StatsCardProps) {

    return(

        <div className="p-6 bg-white/10 rounded-xl text-center shadow-md">
            <div className="text-4xl mb-2">{icon}</div>
            <h3 className="text-lg font-medium">{title}</h3>
            <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
        
    )
}