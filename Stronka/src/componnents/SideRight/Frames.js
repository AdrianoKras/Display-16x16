import { useEffect, useState } from "react"
import style from './Frames.module.css'
import {motion} from 'framer-motion'
import Frame from "./Frame";
let canvas = document.createElement('canvas')
let context =  canvas.getContext('2d');
export default function Frames({data,setActualFrame}) {
    const [file,setFile] = useState([]);

    useEffect(()=>{
        let array = [];
        for(let i = 0; i<data.length; i++){
            array.push(dataToImg(data[i]))
        }
        setFile(array);
    },[data])
    useEffect(() => {

    }, [file])

    function dataToImg(pixels) {
        canvas.height = 16;
        canvas.width = 16;
        let index = 0;
        for(let i = 0; i<16; i++) {
            for(let j = 0; j<16; j++) {
                context.fillStyle = `rgb(${pixels[index].r},${pixels[index].g},${pixels[index].b})`;
                context.fillRect(j, i, 1, 1);
                index++;
            }
        }
        return canvas.toDataURL()
    }


    return (
        <motion.div className={style.main}>
            {file.map((foto, index) => {
                return(
                    <Frame key={index} foto={foto} index={index} setActualFrame={setActualFrame} />
                )
            })}
        </motion.div>
    )
}