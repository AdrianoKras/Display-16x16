import { useEffect, useRef } from 'react'
import style from './Submit.module.css'
import { useInView, motion } from 'framer-motion'


export default function Submit({data, bright}) {
    const ref = useRef(null)
    const inView = useInView(ref)

    async function send() {
        let dataToSend = [...data[0]]
        console.log(data)
        await fetch(`http://192.168.1.146/photo`, {
            method: "POST",
            body:  JSON.stringify(dataToSend),    
          })
    }
    return (
        <motion.div onClick={send} whileHover={{cursor:'pointer'}} style={{scale: inView ? 1 : 0, transition: '1s all ease', y: inView ? 0 : -20}}  className={style.main} ref={ref}>
            Send
        </motion.div>
    )
}