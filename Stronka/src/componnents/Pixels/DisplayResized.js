import { useState, useEffect } from 'react'
import style from './Display.module.css'

import {motion} from 'framer-motion'

export default function DisplayResized({data,bright,delay, setData, color,actualFrame, setActualFrame, play}) {
    const [dataToDisplay, setDataToDisplay] = useState([])
    const [edit,setEdit] = useState(false);
    const [brightness,setBrightness] =  useState(1);

    useEffect(() => {
      let output = 0 + ((1 - 0) / (255 - 0)) * (bright - 1)
      setBrightness(output)
    },[bright])

    useEffect(() => {
        setActualFrame(0)
        setEdit(false)
    },[])

    useEffect(() => {
        setDataToDisplay(data[actualFrame])
    },[data, actualFrame])

    useEffect(() => {

    },[dataToDisplay])
    useEffect(() => {
        let pause = delay * 10;
        if(play) {
            setTimeout(() => {
                if(actualFrame<data.length-1){
                    setActualFrame(actualFrame+1)
                }else {
                    setActualFrame(0);
                }
            }, pause)
        }
     }, [play, actualFrame,delay,data.length])

    function hexToRgb(hex) {      
        let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        } : null;
    }
    function changeColor(index) {
        let rgb =  hexToRgb(color)
        let array = [...data];
        array[actualFrame][index].r =  rgb.r;
        array[actualFrame][index].g =  rgb.g;
        array[actualFrame][index].b =  rgb.b;
        setData(array)
    }
    const container = {
        hidden: { opacity: 1, scale: 1 },
        visible: {
          opacity: 1,
          scale: 1,
          transition: {
            delayChildren: 0.3,
            staggerChildren:100.5
          }
        }
      };
      
      const item = {
        hidden: {y:  100, scale: 0, opacity: 1,},
        visible: {
          y: 0, 
          scale: 1,
          opacity: 1,
          transition: {
            type: 'spring', stiffness: 50, 
          }
        },  
      };
     return (
        <div className={style.Container}>
                <motion.div 
                  className={style.GridContainer}  
                  variants={container} 
                  initial="hidden"
                  animate="visible"> 
                    {dataToDisplay.map((color, index) => {
                        return (
                              <motion.div 
                              whileHover={{scale: 1.3, borderColor:`rgba(0,0,0,1)`, zIndex: 10}} 
                              onClick={() => changeColor(index)}
                              onMouseDown={() => setEdit(true)} 
                              onHoverStart={() => edit ? changeColor(index) : null}
                              onMouseUp={() => setEdit(false)}
                              className={style.Box} 
                              variants={item} 
                              key={index} 
                              style={{backgroundColor: `rgba(${color.r}, ${color.g}, ${color.b}, ${brightness})`}}/>
                        )
                    })}
                </motion.div>
        </div>
    )
}