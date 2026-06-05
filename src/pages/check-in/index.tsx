import QRCode from 'react-qr-code';
import style from './style.module.less';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as iq from 'image-q';
import dayjs from 'dayjs';
import clsx from 'clsx';
import Color from 'color';
import _ from 'lodash';
import { getDaysOfMonth } from './utilities';
import { useLoaderData } from 'react-router-dom';
import { sample } from 'lodash';
import motoA from './moto_a.json';
import { TypeAnimation } from 'react-type-animation';

interface CheckInData {
    ranking: number;
    checkin_ts_this_month: number[];
    avatar_url: string;
}

const getMockData = (): CheckInData => ({
    ranking: 1,
    checkin_ts_this_month: [
        dayjs().subtract(6, 'day').unix(), 
        dayjs().subtract(5, 'day').unix(), 
        dayjs().subtract(4, 'day').unix(), 
        dayjs().subtract(3, 'day').unix(), 
        dayjs().subtract(1, 'day').unix(), 
        dayjs().unix(),
        ...Array.from(Array(30).keys()).map(k => dayjs().add(k+1, 'day').unix()),
        // dayjs().add(1, 'day').unix(), 
        // dayjs().add(2, 'day').unix(), 
        // dayjs().add(3, 'day').unix(), 
        // dayjs().add(4, 'day').unix(), 
        // dayjs().add(5, 'day').unix(), 
    ],
    avatar_url: 'http://q4.qlogo.cn/g?b=qq&nk=755188173&s=140'
});

function getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
  }


export default function CheckIn() {
    const _data = useLoaderData();
    const data = useMemo(() => (_data ?? getMockData()) as CheckInData, [_data]);

    const check_in_text = String.raw`
         $$$$$$\  $$\                           $$\             $$$$$$\           
        $$  __$$\ $$ |                          $$ |            \_$$  _|          
        $$ /  \__|$$$$$$$\   $$$$$$\   $$$$$$$\ $$ |  $$\         $$ |  $$$$$$$\  
        $$ |      $$  __$$\ $$  __$$\ $$  _____|$$ | $$  |$$$$$$\ $$ |  $$  __$$\ 
        $$ |      $$ |  $$ |$$$$$$$$ |$$ /      $$$$$$  / \______|$$ |  $$ |  $$ |
        $$ |  $$\ $$ |  $$ |$$   ____|$$ |      $$  _$$<          $$ |  $$ |  $$ |
        \$$$$$$  |$$ |  $$ |\$$$$$$$\ \$$$$$$$\ $$ | \$$\       $$$$$$\ $$ |  $$ |
         \______/ \__|  \__| \_______| \_______|\__|  \__|      \______|\__|  \__|
    `.replaceAll(/^( {4})+/mg, '');

    const viewBox = {
        x: 500,
        y: 300,
    };

    const avatarRef = useRef<HTMLImageElement>(null);
    const [avatarReady, setAvatarReady] = useState(false);

    useEffect(() => {
        setAvatarReady(avatarRef.current!.complete);
        avatarRef.current!.onload = () => {
            setAvatarReady(true);
        };
    }, []);

    const [avatarColors, setAvatarColors] = useState<iq.utils.Point[]>([]);

    const now = useMemo(() => dayjs(), []);
    const days = useMemo(() => {
        const days = getDaysOfMonth(now.year(), now.month() + 1);
        return days;
    }, [now]);

    const checkedInDays = useMemo(() => {
        return new Map(data.checkin_ts_this_month
            .map(ts => dayjs(ts * 1000))
            .filter(t => t.month() == now.month())
            .map(t => [t.date(), true]))
    }, [now, data]);

    const [ranking, setRanking] = useState(0);

    // https://tuapi.eees.cc/api.php?category=biying&type=json

    const [checkList, setChecklist] = useState({
        background: true,
        moto: false,
        themeColor: false,
    })

    const allDone = useMemo(() => {
        console.log({checkList});
        return Object.values(checkList).every(i => i);
    }, [checkList]);

    const [backgroundVideoUrl] = useState(`/videos/check-in/${getRandomInt(284 + 1)}.mp4`);

    useEffect(() => {
        (async () => {
            // for(let i = 0; i< 3; i++) {
            //     try {
            //         const resp = await axios.get('https://tuapi.eees.cc/api.php?category=biying&type=json', {
            //             timeout: 1000,
            //         });
            //         setBackgroundImgUrl(resp.data.img);
            //         break;
            //     } catch {}
            // }
            setChecklist(cl => ({...cl, background: true}));
        })();
    }, []);

    //https://cdn.jsdelivr.net/gh/hitokoto-osc/sentences-bundle@1.0.393/sentences/
    const [moto, setMoto] = useState('');

    const [rankAnimationStarted, setRankAnimationStarted] = useState(false);

    useEffect(() => {
        if(!rankAnimationStarted) return;

        let _moto = '喵喵喵'
        for(let i = 0; i < 100; i++) {
            const currMoto = sample(motoA)!.hitokoto;
            if(currMoto.length > 9 && currMoto.length < 28) {
                _moto = currMoto;
                break;
            }
        }

        setMoto(_moto);
    }, [rankAnimationStarted]);

    useEffect(() => {
        
        setChecklist(cl => ({...cl, moto: true}));
        
        // (async () => {
        //     for(let i = 0; i< 3; i++) {
        //         try {
        //             const resp = await axios.get('https://v1.hitokoto.cn/', {
        //                 timeout: 1000
        //             });
        //             setMoto(resp.data.hitokoto);
        //             break;
        //         } catch {}
        //     }
        //     setChecklist(cl => ({...cl, moto: true}));
        // })();
    }, []);

    const themeColor = useMemo(() => {
        for(const c of avatarColors) {
            const hslColor = Color(_.pick(c, ['r', 'g', 'b'])).hsl();
            if(!hslColor.isLight()) continue;
            if(hslColor.saturationl() < 50) continue;
            if(hslColor.l() > 90) continue;
            return hslColor;
        }
        return null;
    }, [avatarColors]);

    useEffect(() => {
        if(!avatarReady) return;
        (async() => {
            const pointContainer = iq.utils.PointContainer.fromHTMLImageElement(avatarRef.current!);
            const palette = await iq.buildPalette([pointContainer], {
                colorDistanceFormula: 'manhattan-bt709',
                paletteQuantization: 'wuquant',
                colors: 11,
              });
            const colors = palette.getPointContainer().getPointArray();
            setAvatarColors(colors);
            setChecklist(cl => ({...cl, themeColor: true}));
            // console.log(
            //     `${Array(colors.length).fill('%c■').join('')}`, 
            //     ...colors.map(c => `color: rgb(${c.r}, ${c.g}, ${c.b}); font-size: 50px;text-shadow: 0 0 2px #000000;padding: 2px`)
            // );
        })()
    }, [avatarReady]);

    const videoRef = useRef<HTMLVideoElement | null>(null);

    useEffect(() => {
        videoRef.current!.load();
    }, []);
    
    return (
        <div className={style.root} id="target" style={{
            '--hightlight-color': themeColor?.toString()
        } as React.CSSProperties} onAnimationStart={() => {
            
        }}>
            {allDone && <div id="done"/>}
            {/* <img className={style.bg} src={backgroundImgUrl}/> */}
            <video ref={videoRef} autoPlay className={style.bg} muted src={backgroundVideoUrl}/>
            <div className={style.content}></div>
            <div className={style.moto_ani} onAnimationStart={() => {
                setRankAnimationStarted(true);
            }} />
            <div className={style.rank} onAnimationStart={() => {
                console.log('ani start');
                
                videoRef.current!.play();
                (async () => {
                    for(let i = 0; i < 20; i++) {
                        setRanking(getRandomInt(100));
                        await new Promise(res => setTimeout(res, 50 + Math.pow(i, 1.7)));
                    }
                    setRanking(data.ranking);
                })();
            }}>
                <div>
                    #{`${ranking}`.padStart(2, '0')}
                </div>
            </div>
            <svg className={style.svg} viewBox={`0 0 ${viewBox.x} ${viewBox.y}`}>
                <defs>
                    <filter id="blur" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="30" />
                    </filter>
                    <clipPath id="myClip">
                        <path d="m89,-79c145,82 76,219 45,277c-31,58 -4,174 95,191c96,17 -277,-8 -277,-8c0,0 -20,-411 -20,-411c0,0 12,-131 157,-49z"/>
                    </clipPath>
                    <clipPath id="testClip">
                        <circle cx="80" cy="80" r="50" />
                    </clipPath>
                    <clipPath id="rankClip">
                    <text dominant-baseline="hanging" dy="23rem" font-family="Cyberpunks" font-size="170rem">#{`${ranking}`.padStart(2, '0')}</text>
                    </clipPath>
                </defs>
                
                {
                    // avatarColors.map(c => {
                    //     const cx = Math.random() * viewBox.x / 3;
                    //     const cy = Math.random() * viewBox.y;
                    //     return (
                    //         <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="50" clipPath="url(#myClip)" filter="url(#blur)" fill={`rgba(${c.r}, ${c.g}, ${c.b}, ${c.a / 255 * 0.2})`}/>
                    //     )
                    // })
                }
                {/* <text dominant-baseline="hanging" text-anchor="middle" x="50%" y="0em" font-family="Cyberpunks" font-size="170rem">#{`${data.ranking}`.padStart(2, '0')}</text> */}
                <path d="m89,-79c145,82 76,219 45,277c-31,58 -4,174 95,191c96,17 -277,-8 -277,-8c0,0 -20,-411 -20,-411c0,0 12,-131 157,-49z" opacity="undefined" fill="#ffffff55"/>
                
            </svg>
            <div className={style.avatar_layer}>
                <div className={style.calendar}>
                    {
                        days.map((d, i) => (
                            <div 
                                key={d.format('MM-DD')} 
                                className={clsx({
                                    [style.hidden]: d.month() != now.month(),
                                    [style.checked]: checkedInDays.has(d.date()),
                                })}
                                style={{
                                    animationDelay: `${2000 + i * 40}ms`
                                }}
                            ></div>
                        ))
                    }
                </div>
                <div className={style.frame}>
                    <div className={style.img}>
                        <img ref={avatarRef} src={data.avatar_url}></img>
                    </div>
                    
                    
                </div>
            </div>
            <div className={style.sidebar}>
                <span className={style.title}>
                {check_in_text}
                </span>
                <span className={style.date}>
                    {now.format('YYYY/MM/DD')}
                </span>
            </div>
            <div className={style.extra_info}>
                <QRCode
                    // size={256}
                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                    value={'https://qm.qq.com/q/IV3HpmWfCu'}
                    bgColor="#ffffff00"
                    fgColor="#000000bb"
                />
            </div>
            <div className={style.moto}>
                <TypeAnimation
                    key={moto}
                    sequence={[
                        500,
                        moto,
                    ]}
                    style={{
                        fontFamily: 'HYLiShengHongXiaKeXing'
                      }}
                    speed={{
                        type: 'keyStrokeDelayInMs',
                        value: 90,
                    }}
                    wrapper='div'
                    cursor={false}
                    splitter={s => s.split(/(.[，,。\.？\?]?)/).filter(c => c != '')}
                />
            </div>
        </div>
    )
}
