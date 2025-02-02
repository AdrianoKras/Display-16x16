import {motion, useInView} from 'framer-motion'
import { useEffect, useRef } from 'react'
import style from './Frames.module.css'
export default function Frame({index,foto, setActualFrame}) {
    const ref = useRef(null);
    const inView = useInView(ref)
    const click = (e) => {
        let frameToDisplay = e.target.id
        setActualFrame(parseInt(frameToDisplay))
    }
    return (
        <motion.div onClick={click} ref={ref}>
            <img style={{display: 'flex',  x: inView ? 0 : -20 ,opacity: inView ? 1 : 0, transition: '1s all ease'}} className={style.foto} id={index} src={foto}/>
        </motion.div>
    )
}