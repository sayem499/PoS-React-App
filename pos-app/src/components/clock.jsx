import { useState } from "react"
import '../css/clock.css'
function Clock() {
 let time = new Date().toLocaleTimeString()
 let date = new Date().toLocaleDateString()

 const [ctime, setCTime] = useState(time) 

 const updateTime = () => {
    time = new Date().toLocaleTimeString()
    setCTime(time)
 }

 setInterval(updateTime, 1000)

    return (
    <div className="clock-inner">
        <section>{date}</section>
        <section>{ctime}</section>
    
    </div>
  )
}

export default Clock