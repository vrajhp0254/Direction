const socket = io();

if(navigator.geolocation) {
    navigator.geolocation.watchPosition((position) => {
        const { latitude, longitude } = position.coords;
        console.log(latitude, longitude);
        socket.emit('send-Location', { latitude, longitude });
    },
(error)=>{console.log(error)},{
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
}
);
}


const map = L.map("map").setView([0, 0], 10);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

const marker ={}

socket.on("recieve-Location", (coords) => {
    const { id, latitude, longitude } = coords;
    map.setView([latitude, longitude], 10);
    if(marker[id]){
        marker[id].setLatLng([latitude, longitude]);
    }
    else{
        marker[id] = L.marker([latitude, longitude]).addTo(map);
    }
})

socket.on("user-disconnected", (id) => {
    map.removeLayer(marker[id]);
    delete marker[id];  
})