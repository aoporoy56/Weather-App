const http = require("http");
const requests = require("requests");
const fs = require("fs");
const url = require("url");

const send_value = (file,value) => {
    data_send = file.replace("{%temp%}",value.days[0].temp); 
    data_send = data_send.replace("{%max%}",value.days[0].tempmax); 
    data_send = data_send.replace("{%min%}",value.days[0].tempmin);
    data_send = data_send.replace("{%location%}",value.resolvedAddress);
    data_send = data_send.replace("{%precipitation%}",value.days[0].precip);
    data_send = data_send.replace("{%humidity%}",value.days[0].humidity);
    data_send = data_send.replace("{%wind%}",value.days[0].windspeed);
    data_send = data_send.replace("{%condition%}",value.days[0].conditions);
     return data_send

}

let html_data = fs.readFileSync("public/index.html","utf-8");
server = http.createServer( (req,res) => {
    // if(req.url=="/"){
        link = url.parse(req.url,true)
        
        console.log(link.query.city_name)
        requests(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${link.query.city_name}?key=UCVLQEC8VCV5NZFHVGA3D62YU`)
        .on("data", (chank) => {
            // console.log(chank);
            if(chank.includes("Invalid location found. Please check your location parameter")){
                console.log("error here man");
                res.end("Write A Correct Name");
            }else{
                json_data = JSON.parse(chank);
                // console.log(json_data.timezone)
                object = [json_data];

                const realtimeData = object
                .map((val) => {
                    // console.log(send_value(html_data,val))
                    return send_value(html_data,val)
                }).join(" ");
                res.end(realtimeData);
                // console.log(realtimeData)
            }
        })
        .on("end", (err) => {
            console.log(err, "helo");
            if(err){
                console.log("Connection lost for :",err);
            }
        })
        // res.end(html_data)
    // }else{
    //     res.end("error Page")
    // }
})

server.listen(8000,"127.0.0.1", (err) => { 
     console.log("Create...")
})