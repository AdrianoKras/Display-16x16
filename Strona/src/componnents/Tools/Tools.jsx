import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import IconButton from '@mui/material/IconButton';
import PauseRoundedIcon from '@mui/icons-material/PauseRounded';
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';
import ColorLensRoundedIcon from '@mui/icons-material/ColorLensRounded';
import SkipPreviousRoundedIcon from '@mui/icons-material/SkipPreviousRounded';
import SkipNextRoundedIcon from '@mui/icons-material/SkipNextRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import {motion} from 'framer-motion'
import { Slider } from '@mui/material'
import style from './Tools.module.css'
export default function Tools({setData,data, setActualFrame,actualFrame, play, setPlay, setColor, color}) {

    function handleSlider(e) {
        setActualFrame(e.target.value-1);
    }
    function handleDelete() {
        let array =  [...data]
        array.splice(actualFrame, 1);
        let frameNum = actualFrame-1
        setActualFrame(frameNum)
        setData(array)
    } 
    function Add() {
        let array = [];
        let datArray = [...data];
        for(let i = 0; i<256; i++) {
            array.push({
                r: 0,
                g: 0,
                b: 0
            })
        }
        datArray.push(array);
        setData(datArray)
    }
    function Plus() {
        let temp = actualFrame;
        if(temp+1 < data.length) {
            temp = temp+1;
        }
        setActualFrame(temp)
    }
    function Minus() {
        let temp = actualFrame;
        if(temp-1 >= 0) {
            temp = temp-1;
        }
        setActualFrame(temp)
    }
    const container  = {
        hidden: { opacity: 0, bottom: -50},
        visible: {
            opacity: 1,
            bottom: 10,
            transition: {
                type: "spring", stiffness: 100, delay: 0.8
            }
        }
    }

    return (
        <motion.div variants={container} animate='visible' initial="hidden" className={style.Container}>
            <div>
                <IconButton style={{marginLeft: 40}}>
                    <label htmlFor="color" style={{height:24, width:24}}>
                        <ColorLensRoundedIcon style={{color: color}}/>
                    </label>
                    <input onChange={(e) => setColor(e.target.value)} name="color" id="color" type="color" style={{visibility: 'hidden', position: 'absolute'}}/>
                </IconButton>
                <IconButton onClick={Minus}>
                    <SkipPreviousRoundedIcon/>
                </IconButton>
                <IconButton onClick={() => setPlay(!play)}>
                    {play ? <PauseRoundedIcon/> : <PlayArrowRoundedIcon/>}
                </IconButton>
                <IconButton onClick={Plus}>
                    <SkipNextRoundedIcon />
                </IconButton>
                <IconButton onClick={Add    }>
                    <AddRoundedIcon/>   
                </IconButton>
                <IconButton onClick={handleDelete}>
                    <DeleteForeverRoundedIcon color='error'/>
                </IconButton>
            </div>
                <Slider
                    defaultValue={1}
                    valueLabelDisplay="auto"
                    shiftStep={2}
                    step={1}
                    onChange={handleSlider}
                    value={actualFrame+1}
                    marks
                    min={1}
                    max={data.length}
                />
            <div>
            </div>
        </motion.div>
    )
}