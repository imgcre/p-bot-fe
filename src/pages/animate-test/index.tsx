import style from './style.module.less';
import { TypeAnimation } from 'react-type-animation';

export default function AnimateTest() {
    return (
        <div className={style.root} id="target">
            <div id="done"/>
            {/* <div className={style.block}></div> */}
            <TypeAnimation
                sequence={[
                    'Hello GIF!',
                ]}
                style={{ fontSize: '25em', display: 'inline-block' }}
                speed={{
                    type: 'keyStrokeDelayInMs',
                    value: 60,
                }}
            />
        </div>
    )
}
