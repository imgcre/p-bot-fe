import { useMemo } from 'react';
import style from './style.module.less';
import { useLoaderData } from 'react-router-dom';
import clsx from 'clsx';
import Fraction from 'fraction.js';

interface Exif {
    make?: string; //Make
    model?: string; //Model
    date_time?: string; //DateTimeOriginal
    focal_length?: number; //FocalLength
    f_number?: number; //FNumber
    exposure_time?: number; //ExposureTime
    iso_speed_ratings?: number; //ISOSpeedRatings
}

interface PicDetailsData {
    img_url: string;
    exif: Exif;
    author: string;
}

const getMockData = (): PicDetailsData => ({
    img_url: '/images/pic_details/test.webp',
    exif: {
        make: 'SONY',
        model: 'ILCE-6400',
        date_time: '2023:10:01 21:35:48',
        focal_length: 35.0,
        f_number: 1.4,
        exposure_time: 0.01,
        iso_speed_ratings: 400
    },
    author: '小水翼龙'
});

interface Map {
    [key: string]: string | undefined
  }

export default function PicDetails() {
    const _data = useLoaderData();
    const data = useMemo(() => (_data ?? getMockData()) as PicDetailsData, [_data]);

    const avatars: Map = useMemo(() => {
        const avatarPathPrefix = '/images/pic_details/make';
        return {
            'SONY': `${avatarPathPrefix}/sony.webp`,
            'XIAOMI': `${avatarPathPrefix}/xiaomi.webp`,
            'NIKON CORPORATION': `${avatarPathPrefix}/nikon.webp`,
            'APPLE': `${avatarPathPrefix}/apple.webp`,
            'UNKNOWN': `${avatarPathPrefix}/unknown.webp`,
        };
    }, []);

    const camera = useMemo(() => {
        if(data.exif.make == null && data.exif.model == null) return '拍摄设备未知'
        let c = '';
        if(data.exif.make != null) {
            c = data.exif.make.split(' ')[0]
        }
        if(data.exif.model != null) {
            if(c != '' && data.exif.model.includes(c)) {
                c = data.exif.model;
            } else {
                c += ` ${data.exif.model}`;
            }
        }
        return c;
    }, [data]);


    const avatar = useMemo(() => {
       return  avatars[(data.exif.make ?? 'UNKNOWN').toUpperCase()] ?? avatars['UNKNOWN'];
    }, [data, avatars]);

    return (
        <div className={style.root} id="target">
            <img src={data.img_url} />
            {
                !(
                    data.author == '未知' 
                    && data.exif.focal_length == null 
                    && data.exif.f_number == null 
                    && data.exif.exposure_time == null 
                    && data.exif.iso_speed_ratings == null 
                    && data.exif.date_time == null
                ) &&
                <div className={style.banner}>
                    <div className={clsx(style.desc)}>
                        <div className={style.title}>
                            {camera}
                        </div>
                        <div className={style.subtitle}>
                            {data.exif.date_time == null && '拍摄时间未知'}
                            {data.exif.date_time}
                        </div>
                    </div>
                    <div className={style.right}>
                        <img className={style.avatar} src={avatar}/>
                        <div className={style.splitter} />
                        <div className={style.desc}>
                            <div className={style.title}>
                                {data.exif.focal_length == null && data.exif.f_number == null && data.exif.exposure_time == null && data.exif.iso_speed_ratings == null && '拍摄参数未知'}
                                {data.exif.focal_length && `${data.exif.focal_length}mm `}
                                {data.exif.f_number && `f/${data.exif.f_number} `}
                                {data.exif.exposure_time && `${new Fraction(data.exif.exposure_time).toFraction()}s `}
                                {data.exif.iso_speed_ratings && `ISO${data.exif.iso_speed_ratings}`}
                                
                            </div>
                            <div className={style.subtitle}>
                                Photo by @{data.author}
                            </div>
                        </div>
                    </div>
                
                </div>
            }
            <div id="done" />
        </div>
    )
}
