import FileUploadIcon from '@mui/icons-material/FileUpload';
import {useState }  from 'react';
import {motion} from 'framer-motion'
import { GifReader } from "omggif"; 
import style from './Photo.module.css'
let canvas = document.createElement('canvas')
let context =  canvas.getContext('2d');
let info

export default function Photo({setDelay,setData}) {
    const [file, setFile] = useState()
    const [fileName, setFileName] = useState('Wstaw Plik Tutaj Po Lewo!');

    function getPixelImg(foto) {
        let test = []
        let array = [];
        let img = new Image();
        let imgData;

        img.src = foto
        img.onload = () => {
            context.drawImage(img,0,0,16,16);
            for(let i = 0; i<16; i++) {
                for(let j = 0; j<16; j++) {
                    imgData = context.getImageData(j,i,1,1).data;
                    array.push({
                        r: imgData[0],
                        g: imgData[1],
                        b: imgData[2]
                    })
                }
            }   
            test.push(array)

            setData(test)
        }
    }
    const gif = async (url) => {
        const arrayBuffer = await url.arrayBuffer()
        const intArray = new Uint8Array(arrayBuffer);

        const reader = new GifReader(intArray);
        info =  reader.frameInfo(0);

        setDelay(info.delay);
        return new Array(reader.numFrames()).fill(0).map((_, k) => {
            const image = new ImageData(info.width, info.height);
    
            reader.decodeAndBlitFrameRGBA(k, image.data);
            return image
        });
    }
    function getPixelGif(foto) {
        let FotoArray = []

        for(let i = 0; i<foto.length; i++) {
            let array = [];
            let imgData;
            let image = new Image()
            canvas.height = info.height
            canvas.width = info.width
            context.putImageData(foto[i],0,0);
    
            image.src = canvas.toDataURL();
            image.onload = () => {
                context.drawImage(image,0,0,16,16); 
                for(let i = 0; i<16; i++) {
                    for(let j = 0; j<16; j++) {
                        imgData = context.getImageData(j,i,1,1).data;
                        array.push({
                            r: imgData[0],
                            g: imgData[1],
                            b: imgData[2]
                        })
                    }
                }
                FotoArray.push(array);
                setData(FotoArray)

            }
        } 
    }

    async function handleInput(e) {
        let extFile = e.target.files[0].name.split('.').pop();
        setFileName(e.target.files[0].name);
        if(extFile !== "gif") {
            setFile(URL.createObjectURL(e.target.files[0]))
            getPixelImg(URL.createObjectURL(e.target.files[0]));
        }else {
            setFile(URL.createObjectURL(e.target.files[0]))
            const image = await gif(e.target.files[0]);
            getPixelGif(image)
        }

    }
    return (
        <motion.div className={style.Container}>
            <motion.label className={style.Label} htmlFor="file">
                <div className={style.IconBox}>
                    <FileUploadIcon className={style.Icon}/>   
                </div>
                <div className={style.Text}>
                    {fileName}          
                </div>
            </motion.label >
            <input  style={{visibility: 'hidden', position: 'absolute'}} id='file' onChange={handleInput} type="file"/>
        </motion.div>
    )
}