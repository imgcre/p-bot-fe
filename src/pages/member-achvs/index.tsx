import { useLoaderData } from 'react-router-dom';
import classes from './style.module.less';
import { useEffect, useMemo } from 'react';
import { groupBy } from 'lodash';
import clsx from 'clsx';

type Rarity = 'COMMOM' | 'UNCOMMON' | 'RARE' | 'EPIC' | 'LEGEND';

interface AchvInfo {
    aka: string;
    obtained_ts: number | null;
    target_obtained_cnt: number;
    obtained_cnt: number;
    opts: {
        rarity: Rarity;
        is_punish: boolean;
        emoji_display: string | null;
    },
    is_eligible: boolean;
}

interface MemberAchvsData {
    achvs: AchvInfo[];
    name: string;
}

const MAX_TIMESTAMP = 8640000000000000

const getMockData = (): MemberAchvsData => ({
    name: '修猫纳延',
    achvs: [
        {
            aka: '火急火燎',
            obtained_ts: 1726649974,
            target_obtained_cnt: 1,
            obtained_cnt: 1,
            opts: {
                rarity: 'COMMOM',
                is_punish: false,
                emoji_display: null,
            },
            is_eligible: false,
        },
        {
            aka: '连五鞭',
            obtained_ts: 1726649974,
            target_obtained_cnt: 1,
            obtained_cnt: 1,
            opts: {
                rarity: 'UNCOMMON',
                is_punish: false,
                emoji_display: null,
            },
            is_eligible: false,
        },
        {
            aka: '盗梦空间',
            obtained_ts: 1726649974,
            target_obtained_cnt: 1,
            obtained_cnt: 1,
            opts: {
                rarity: 'COMMOM',
                is_punish: false,
                emoji_display: null,
            },
            is_eligible: false,
        },
        {
            aka: '梦呓',
            obtained_ts: 1726649974,
            target_obtained_cnt: 1,
            obtained_cnt: 1,
            opts: {
                rarity: 'COMMOM',
                is_punish: false,
                emoji_display: null,
            },
            is_eligible: false,
        },
        {
            aka: '停不下来',
            obtained_ts: 1726649974,
            target_obtained_cnt: 1,
            obtained_cnt: 1,
            opts: {
                rarity: 'COMMOM',
                is_punish: false,
                emoji_display: '🥵',
            },
            is_eligible: false,
        },
        {
            aka: '首胜',
            obtained_ts: 1726649974,
            target_obtained_cnt: 1,
            obtained_cnt: 1,
            opts: {
                rarity: 'COMMOM',
                is_punish: false,
                emoji_display: null,
            },
            is_eligible: false,
        },
        {
            aka: '灵翼事件',
            obtained_ts: 1726649974,
            target_obtained_cnt: 1,
            obtained_cnt: 1,
            opts: {
                rarity: 'UNCOMMON',
                is_punish: false,
                emoji_display: null,
            },
            is_eligible: false,
        },
        {
            aka: '小孩子不可以看',
            obtained_ts: 1726649974,
            target_obtained_cnt: 1,
            obtained_cnt: 1,
            opts: {
                rarity: 'RARE',
                is_punish: false,
                emoji_display: '🔞',
            },
            is_eligible: true,
        },
        {
            aka: '全勤',
            obtained_ts: 1726649974,
            target_obtained_cnt: 1,
            obtained_cnt: 1,
            opts: {
                rarity: 'RARE',
                is_punish: false,
                emoji_display: '🈵',
            },
            is_eligible: true,
        },
        {
            aka: '繁荣',
            obtained_ts: 1726649974,
            target_obtained_cnt: 1,
            obtained_cnt: 1,
            opts: {
                rarity: 'COMMOM',
                is_punish: false,
                emoji_display: '💣',
            },
            is_eligible: false,
        },
        {
            aka: '逃过一劫',
            obtained_ts: 1726649974,
            target_obtained_cnt: 1,
            obtained_cnt: 1,
            opts: {
                rarity: 'RARE',
                is_punish: false,
                emoji_display: '🍀',
            },
            is_eligible: true,
        },
        {
            aka: '半步轮回境',
            obtained_ts: 1726649974,
            target_obtained_cnt: 1,
            obtained_cnt: 1,
            opts: {
                rarity: 'RARE',
                is_punish: false,
                emoji_display: null,
            },
            is_eligible: true,
        },
        {
            aka: '过饱和溶液',
            obtained_ts: 1726649974,
            target_obtained_cnt: 1,
            obtained_cnt: 1,
            opts: {
                rarity: 'EPIC',
                is_punish: false,
                emoji_display: null,
            },
            is_eligible: true,
        },
        {
            aka: '三连胜',
            obtained_ts: 1726649974,
            target_obtained_cnt: 1,
            obtained_cnt: 1,
            opts: {
                rarity: 'UNCOMMON',
                is_punish: false,
                emoji_display: null,
            },
            is_eligible: false,
        },
        {
            aka: '一百昏',
            obtained_ts: 1726649974,
            target_obtained_cnt: 1,
            obtained_cnt: 1,
            opts: {
                rarity: 'LEGEND',
                is_punish: false,
                emoji_display: '💯',
            },
            is_eligible: false,
        },
        {
            aka: '月饼',
            obtained_ts: 1726649974,
            target_obtained_cnt: 1,
            obtained_cnt: 1,
            opts: {
                rarity: 'RARE',
                is_punish: false,
                emoji_display: '🥮',
            },
            is_eligible: false,
        },
        {
            aka: '仙人球',
            obtained_ts: null,
            target_obtained_cnt: 10000,
            obtained_cnt: 9000,
            opts: {
                rarity: 'LEGEND',
                is_punish: false,
                emoji_display: '🌵',
            },
            is_eligible: false,
        },
        {
            aka: '跌入梦境',
            obtained_ts: null,
            target_obtained_cnt: 100000,
            obtained_cnt: 84272,
            opts: {
                rarity: 'LEGEND',
                is_punish: false,
                emoji_display: null,
            },
            is_eligible: false,
        },
        {
            aka: '灯火通明',
            obtained_ts: null,
            target_obtained_cnt: -1,
            obtained_cnt: 3,
            opts: {
                rarity: 'LEGEND',
                is_punish: false,
                emoji_display: null,
            },
            is_eligible: false,
        },
        {
            aka: '原罪',
            obtained_ts: 1726649974,
            target_obtained_cnt: 1,
            obtained_cnt: 1,
            opts: {
                rarity: 'LEGEND',
                is_punish: true,
                emoji_display: '🔒',
            },
            is_eligible: true,
        },
        {
            aka: '清除预备',
            obtained_ts: 1726649974,
            target_obtained_cnt: 1,
            obtained_cnt: 1,
            opts: {
                rarity: 'LEGEND',
                is_punish: true,
                emoji_display: '⚰️',
            },
            is_eligible: false,
        },
        {
            aka: '管理',
            obtained_ts: 1726649974,
            target_obtained_cnt: 1,
            obtained_cnt: 1,
            opts: {
                rarity: 'LEGEND',
                is_punish: false,
                emoji_display: '🔰',
            },
            is_eligible: false,
        }
    ]
});

type AchvProps = {
    info: AchvInfo
}

type AchvStyle = React.CSSProperties & {
    '--background-color'?: string;
    '--progress'?: string;
}

function Achv({ info }: AchvProps) {
    const mapRarityColor = (rarity: Rarity) => {
        return {
            'COMMOM': '#546e7a',
            'UNCOMMON': '#43a047',
            'RARE': '#1e88e5',
            'EPIC': '#9c27b0',
            'LEGEND': '#fb8c00',
        }[rarity];
    }

    return (
        <div className={classes.achv_wrapper}>
            <div className={clsx(classes.achv, {[classes.punish]: info.opts.is_punish, [classes.obtaining]: info.obtained_ts == null})} style={{
                '--background-color': mapRarityColor(info.opts.rarity),
            } as AchvStyle}>
                <div className={clsx(classes.base_bg, {[classes.opacity]: info.obtained_ts == null})} />
                {
                    info.obtained_ts == null && (
                        <div className={classes.progress_bg} style={{
                            '--progress': `${info.target_obtained_cnt > 0 ? info.obtained_cnt / info.target_obtained_cnt * 100 : 75}%`
                        } as AchvStyle}>

                        </div>
                    )
                }

                <div className={clsx(classes.border, {[classes.eligible_fix]: info.is_eligible})}>

                </div>

                {
                    info.opts.emoji_display != null && (
                        <div className={classes.emoji}>
                            {info.opts.emoji_display}
                        </div>
                    )
                }
                <div className={classes.title}>
                    {info.aka}
                </div>
            </div>
            {
                info.is_eligible && (
                    <div className={classes.eligible}>
                        
                    </div>
                )
            }
        </div>
    )
}

export default function MemberAchvs() {
    const _data = useLoaderData();
    const data = useMemo(() => (_data ?? getMockData()) as MemberAchvsData, [_data]);

    const grouped = useMemo(() => {
        return groupBy(data.achvs, a => a.opts.rarity);
        
    }, [data]);

    useEffect(() => {
        console.log({grouped})
    }, [grouped]);

    const getRarityRank = (rarity: string) => {
        return {
            'COMMOM': 0,
            'UNCOMMON': 1,
            'RARE': 2,
            'EPIC': 3,
            'LEGEND': 4,
        }[rarity as Rarity];
    }

    return (
        <div className={classes.root}  id="target">
            <div className={classes.achvs}>
            {
                [...Object.entries(grouped)].sort(([a], [b]) => getRarityRank(a) - getRarityRank(b)).map(([k, infos]) => (
                    <div key={k} className={classes.group}>
                        {
                            [...infos].sort((a, b) => (a.obtained_ts ?? MAX_TIMESTAMP) - (b.obtained_ts ?? MAX_TIMESTAMP)).map(info => <Achv key={info.aka} info={info} />)
                        }
                    </div>
                ))
            }
            </div>
            
            <div className={classes.footer}>
                <div>
                    @{data.name}
                </div>
            </div>

            <div id="done" />
        </div>
    )
}
