import {motion} from 'framer-motion'
import { useEffect, useState } from 'react';
import style from './Input.module.css'
export default function Input({name, max, value, onChange,initial =1, min = 1}) {
    const [num,setNum] = useState(0)
    const [prev,setPrev] = useState({x: 0, y: 0})
    useEffect(() => {
        setNum(initial)
    }, [initial])
    function onPan(event, info) {
        let pos = {x: info.point.x, y: info.point.y};
        let numb = num;
        let delta = pos.x - prev.x;
        if(delta >= 0) {            
            if(numb < max || max === undefined) {
                if(delta > 5) {
                    numb += 3;
                }else {
                    numb++;
                }
            }
        }
        if(delta <= 0) {
            if(numb > 1) {
                if(delta < -5) {
                    numb -= 3;
                }else {
                    numb--;
                }       
            }   
            
        }

        setPrev(pos);
        setNum(numb);
        onChange(numb);
    }
    const show = {
        hidden: {y: 100, scale: 0.5, opacity: 1},
        visible: {y: 0, scale: 1, opacity: 1, transition: {
            type: 'spring',  stiffness: 50,  duration: 100
        }}
    }
    return (
        <motion.div variants={show} initial="hidden" animate="visible" className={style.Box}>
            {name}
            <motion.div whileHover={{backgroundColor: 'rgba(197, 218, 252,1)', transition: {  duration: 4}}} className={style.Cont} onPan={onPan}>
                {num}
            </motion.div>
        </motion.div>

    )
}