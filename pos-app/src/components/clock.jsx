import { useState } from "react"


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
    <div>
        <section>{date}</section>
        <section>{time}</section>
    
    </div>
  )
}

export default Clock