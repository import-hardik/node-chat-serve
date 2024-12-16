import { WebSocketServer ,WebSocket, CONNECTING} from 'ws';

const wss = new WebSocketServer({ port: 8080 });

interface User {
  socket: WebSocket;
  room: string;
}

let allSockets: User[] =[];
let devices=0;
//@ts-ignore
let fulllog=[];

wss.on("connection",(socket)=>{
  socket.on("close",()=>{
    console.log("SomeOne Disconnected");
    devices-=1;
  })
  socket.on("message",(message)=>{
    //@ts-ignore
    const parsedMessage= JSON.parse(message);
    if(parsedMessage.type =="join"){
      devices+=1;
      console.log("Active Device:"+devices);
      // for(let i=0;i< fulllog.length;i++){
        
      //   console.log(fulllog[i])
      //   //@ts-ignore
      //   socket.send(JSON.stringify(fulllog[i]));
      // }
      allSockets.push({
        socket,
        room:parsedMessage.payload.roomID
      })
    }
    if(parsedMessage.type =="chat"){
      // let constUserRoom=allSockets.find((x)=>x.socket==socket).room
      let constUserRoom=null;
      for(let i=0;i< allSockets.length;i++){
        if(allSockets[i].socket==socket)
          constUserRoom=allSockets[i].room
      }
      fulllog.push(JSON.stringify(parsedMessage));
      console.log("log: "+fulllog);
      for(let i=0;i< allSockets.length;i++){
        if(allSockets[i].room ==constUserRoom){
            // allSockets[i].socket.send(parsedMessage.payload.message)
            allSockets[i].socket.send(JSON.stringify(parsedMessage));
            // allSockets[i].socket.send(JSON.stringify({"type":"condiv",
            //                                           "payload":{"devices":devices}}))
            console.log("Broadcasting: "+JSON.stringify(parsedMessage));
        }
      }
    }
    // if(parsedMessage.type =="chat")
  })
})
