import './App.css';
import { useEffect, useState } from 'react';
import Photo from './componnents/Pixels/Photo'
import Input from './componnents/SideLeft/Input';
import DisplayResized from './componnents/Pixels/DisplayResized';
import Tools from './componnents/Tools/Tools'
import Frames from './componnents/SideRight/Frames'
import Submit from './componnents/Tools/Submit'
function App() {
  const [data, setData] = useState([])
  const [type,setType] =  useState(0)  // || 0  - zdjecie ||  1 - gif || 
  const [delay,setDelay] = useState(0);
  const [bright,setBright] = useState(255); 
  const [onOff,setOnOff] = useState(true);
  const [play, setPlay] = useState(false);
  const [actualFrame,setActualFrame] = useState(0)
  const [color, setColor] = useState("#fcba03");
  useEffect(() =>  {
  },[data])
  useEffect(() => {
    document.body.style.height = window.innerHeight;
  },[])

  async function handleSwitch() {
    let on = onOff
    setOnOff(!on);
    console.log(!on);
    await fetch('http://192.168.1.146/onoff', {
      method: "POST",
      body: !on   
    })
  }
  return (
    <div className="App">
      <div className='Display'>
        {data.length === 0 ? <></> : 
        <>
          <div className='Side'>
            <Input name="Brightness" value={bright} onChange={setBright} min={0} max={255} initial={bright} />
            <Input name="Delay" value={delay} onChange={setDelay} initial={delay}/>   
          </div>
          <div className="SideRight">
            <Frames setActualFrame={setActualFrame} data={data}/>
          </div>
        </>}
        <div className='Pixel'>
          {data.length === 0 ? <></> : <DisplayResized bright={bright} color={color} setData={setData} delay={delay} data={data} actualFrame={actualFrame} setActualFrame={setActualFrame} play={play}/>}
        </div>
        <div className='File'>
          <Photo setDelay={setDelay} delay={delay} setType={setType} setData={setData}/>
        </div>
        {data.length === 0 ? <></> : 
        <div>
          <Submit data={data} bright={bright}/>
        </div>
        }

      </div>
      {data.length === 0 ?  <></> : <Tools data={data} setColor={setColor} color={color} setData={setData} actualFrame={actualFrame} setActualFrame={setActualFrame} play={play} setPlay={setPlay}/>}
    </div>
  );
}
  export default App;
