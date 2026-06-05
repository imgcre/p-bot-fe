import { useCallback, useMemo, useState } from 'react';
import { useLoaderData } from 'react-router-dom';
import ReactECharts from 'echarts-for-react';
import classes from './style.module.less';


interface Rich {
    name: string;
    avatar_url: string;
    value: string;
}

interface RichData {
    richs: Rich[];
    total: string;
    total_member: number;
}

const getMockData = (): RichData => ({
    total: '5',
    total_member: 6,
    richs: [
        {
            name: '我',
            avatar_url: 'http://q4.qlogo.cn/g?b=qq&nk=755188173&s=140',
            value: '3'
        },
        {
            name: '你',
            avatar_url: 'http://q4.qlogo.cn/g?b=qq&nk=3975852001&s=140',
            value: '1.5'
        }
    ]
})

export default function RichList() {
    const _data = useLoaderData();
    const data = useMemo(() => (_data ?? getMockData()) as RichData, [_data]);
    //'{b}: {c}张券, 占{d}%'
    const option = useMemo(() => ({
        animation: false,
        series: [
            {
              type: 'pie',
              roseType: 'radius',
              label: {
                formatter: ({ name, value, percent, dataIndex }: {name: string, value: string, percent: string, dataIndex: number}) => {
                    if(name === '其他') {
                        return `${name}(${data.total_member - data.richs.length}人): ${parseFloat(value).toFixed(3).replace(/\.?0+$/, '')}根, 占${parseFloat(percent).toFixed(1).replace(/\.?0+$/, '')}%`
                    } else {
                        return `#${dataIndex + 1} ${name}: ${parseFloat(value).toFixed(3).replace(/\.?0+$/, '')}根, 占${parseFloat(percent).toFixed(1).replace(/\.?0+$/, '')}%`
                    }
                    
                },
                fontSize: '6rem',
              },
              data: [
                ...data.richs.map(r => ({
                    name: r.name,
                    value: r.value,
                })),
                {
                    name: `其他`,
                    value: parseFloat(data.total) - data.richs.map(r => parseFloat(r.value)).reduce((a, b) => a + b, 0),
                    itemStyle: {
                        color: 'lightgrey' // 红色
                    }
                }
              ]
            }
          ]
    }), [data]);

    const [done, setDone] = useState(false);

    const onReady = useCallback(() => {
        setDone(true);
    }, []);

    return (
        <div className={classes.root} id="target">
            <ReactECharts 
                option={option}
                className={classes.chart}
                onChartReady={onReady}
            />
            市面上一共流通了{data.total}根猫条
            {done && <div id="done" />}
        </div>
    )
}
