'use client'
import { useState } from "react";


interface ButtonProps {
    texto: string;
    click: () => void;
  }
  
export function Button({ texto, click }: ButtonProps) {
    const [active, setActive] = useState(false);
    return (
    <>
    <button className={`mr-3 px-2 py-1 rounded-lg ${ active ? 'bg-[#282B30]':'' }  `} onClick={()=>{setActive(!active); click() }} >{texto}</button>
    </>
    )
}

