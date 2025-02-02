import { useEffect, useRef } from 'react'
import { useInView, motion } from 'framer-motion'
import style from './Submit.module.css'

export default function Submit({data, bright}) {
    const ref = useRef(null)
    const inView = useInView(ref)

    async function send() {
        let dataToSend = [...data]
        console.log(dataToSend)
;        if(dataToSend.length > 1) {
            for(let i = 0; i<dataToSend.length/2; i++) {
                let another = dataToSend[i*2].concat(dataToSend[(i*2)+1])
                console.log(another);
                await fetch(`http://192.168.0.44/pixel`, {
                    mode: 'cors',
                    headers: {
                      'Content-Type': 'application/json'
                    },
                    method: "POST",
                    body:  JSON.stringify(another),    
                  }).then((res) => {
                    console.log(res.ok)
                  })
                setTimeout(() => {}, 1000);
            }
        }
        else {
            await fetch(`http://192.168.0.44/pixel`, {
                mode: 'cors',
                headers: {
                  'Content-Type': 'application/json'
                },
                method: "POST",
                body:  JSON.stringify(dataToSend[0]),    
              }).then((res) => {
                console.log(res.ok)
              })
        }

    }
    return (
        <motion.div onClick={send} whileHover={{cursor:'pointer'}} style={{scale: inView ? 1 : 0, transition: '1s all ease', y: inView ? 0 : -20}} className={style.Main}  ref={ref}>
            Send
        </motion.div>
    )
}