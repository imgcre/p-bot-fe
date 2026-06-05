/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */
import { useLoaderData } from "react-router-dom";
import style from './style.module.less';
import { useState } from "react";
import _ from 'lodash';
import { GiNightSleep } from "react-icons/gi";
import dayjs from "dayjs";
import QRCode from "react-qr-code";

interface RankRecord {
    name: string;
    avatar_url: string;
    timespan: number;
    sleeping: boolean;
}

interface RankItem extends RankRecord { }
class RankItem implements RankRecord {
    constructor(rec: RankRecord) {
        Object.assign(this, rec);
    }

    get timespan_str(): string {
        const units = [
            { name: '天', x_next: 24 },
            { name: '小时', x_next: 60 },
            {  name: '分', x_next: 60 },
            { name: '秒', x_next: 1 },
        ];

        let x_curr = units.reduce((a, curr) => a * curr.x_next, 1);
        const ss = [];
        let remains = this.timespan;

        for(const unit of units) {
            const curr_val = Math.floor(remains / x_curr);
            if(curr_val > 0) {
                ss.push(`${curr_val}${unit.name}`);
            }
            remains %= x_curr;
            x_curr /= unit.x_next;
        }

        return ss.join('');   
    }
}


export default function RestRank() {
    const rank = ((useLoaderData() as RankRecord[]) ?? getMockData()).map(el => new RankItem(el));

    const max_val = rank[0]?.timespan ?? 9999999;

    const first_10_of_rank = rank.slice(0, 10);
    // const rest_of_rank = rank.slice(10);

    return (
        <div 
            className={style.list} 
            id="target" 
            style={useBackground()}
        >
            <span className={style.title}>睡觉榜💤</span>
            {first_10_of_rank.map(rec => {
                return (
                    <div className={style.item} key={rec.name} style={{
                        '--extra-width-ratio': `${(rec.timespan / max_val) ** 2}`
                    } as React.CSSProperties}>
                        <div className={style.avatar}>
                            <img src={rec.avatar_url} />
                            {rec.sleeping && <GiNightSleep className={style.status} />}
                        </div>
                        
                        <div className={style.desc}>
                            <span className={style.name}>
                                {rec.name}
                            </span>
                            <span className={style.value}>
                                {rec.timespan_str}
                            </span>
                        </div>
                    </div>
                );
            })}
            <div className={style.footer}>
                *睡觉时长每天最多累积8小时
                <br/>
                - {dayjs().format('YYYY/MM/DD HH:mm:ss')} -
            </div>
            {/* <div className={style.rest_items}>
                {rest_of_rank.map(rec => {
                    return (
                        <div className={style.item}>
                            <img 
                                src={rec.avatar_url} 
                                className={style.avatar}
                            />
                        </div>
                    );
                })}
            </div> */}
            <div className={style.extra_info}>
                <QRCode
                    // size={256}
                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                    value={'https://qm.qq.com/q/IV3HpmWfCu'}
                    bgColor="#ffffff00"
                    fgColor="#000000bb"
                />
            </div>
            <div id="done" />
        </div>
    )
}


const getMockData = (): RankRecord[] => [...Array(10).keys()].map(
    i => ({name: `修猫纳延${i}`, avatar_url: "http://q4.qlogo.cn/g?b=qq&nk=755188173&s=140", timespan: 18001 + (9 - i) * 24 * 60 * 60, sleeping: i % 3 == 0})
);

function useBackground(): React.CSSProperties {
    const [ background_img ] = useState(() => _.sample([
        '/images/rest-rank/0.webp',
        '/images/rest-rank/1.webp',
        '/images/rest-rank/2.webp',
        '/images/rest-rank/3.webp',
        '/images/rest-rank/4.webp',
        '/images/rest-rank/5.webp',
        '/images/rest-rank/6.webp',
    ]));

    return {
        backgroundImage: `url('${background_img}')`
    };
}
