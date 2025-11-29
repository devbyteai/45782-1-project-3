import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { VacationStats } from '../../models/Vacation';
import './LikesChart.css';

interface LikesChartProps {
    data: VacationStats[];
}

function LikesChart({ data }: LikesChartProps) {
    return (
        <div className="likes-chart">
            <ResponsiveContainer width="100%" height={400}>
                <BarChart
                    data={data}
                    margin={{ top: 20, right: 30, left: 20, bottom: 100 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="destination"
                        angle={-45}
                        textAnchor="end"
                        interval={0}
                        height={100}
                        tick={{ fontSize: 12 }}
                    />
                    <YAxis
                        label={{
                            value: 'Number of Likes',
                            angle: -90,
                            position: 'insideLeft',
                            style: { textAnchor: 'middle' }
                        }}
                        allowDecimals={false}
                    />
                    <Tooltip
                        formatter={(value: number) => [value, 'Likes']}
                        labelFormatter={(label) => `Destination: ${label}`}
                    />
                    <Bar
                        dataKey="likesCount"
                        fill="#007bff"
                        name="Likes"
                        radius={[4, 4, 0, 0]}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

export default LikesChart;
