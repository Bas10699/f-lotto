import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';

const RptHome = (item) => {
    const data = {
        labels: ['ส่ง', 'รับ'],
        datasets: [
            {
                label: '# of Votes',
                data: [item.sum500, item.sumall-item.sum500],
                backgroundColor: [
                    'rgb(255, 99, 132)',
                    'rgb(54, 162, 235)',
                    'rgb(255, 205, 86)'
                ],
                hoverOffset: 4,


            },
        ],
    };
    return (
        <>
            <div className='header'>
                <h1 className='title'>{item.name}</h1>
            </div>
            <Doughnut
                data={data}
                options={{
                    circumference: 180,
                    rotation: 270,
                    plugins: {
                        datalabels: {
                            display: true,
                            color: 'white',
                            font: {
                                size: 16,
                            }
                        },
                    }
                }
                }
                plugins={[ChartDataLabels]}
            />
        </>
    );
}

export default RptHome;