const {SerialPort} = require("serialport");

var http = require("http");
var fs = require("fs");

var index = fs.readFileSync("index.html");

var port = new SerialPort( 
{
    path: "COM5",
    baudRate: 9600,
})

const bikes = ["AE960E89", "D0C119A8", "03D33AAA", "EAA315B1"];

var fullMessage = "";

function delay(milliseconds)
{
    return new Promise(resolve =>
    {
        setTimeout(resolve, milliseconds);
    });
}

var app = http.createServer(function(req, res)
{
    res.writeHead(200, {"content-type": "text/html"});
    res.end(index);
});

var io = require("socket.io").listen(app);

io.on = ("connection", function(data)
{
    console.log("Nodejs is listening");
})

port.on('data', async function(data) 
{
    if(data != "" && data != null && data != undefined)
    {
        fullMessage += data;
        await delay(50);
        
        let sendMessage = fullMessage.trim();

        //console.log(sendMessage);

        if(sendMessage != "")
        {
            for(var i = 1; i <= bikes.length; i++)
            {
                if(sendMessage == bikes[i - 1])
                {
                    console.log(sendMessage);
                    io.emit("data", sendMessage);
                    break;
                }
            }
            // console.log(sendMessage);
            // io.emit("data", sendMessage);
        }
        fullMessage = "";
        sendMessage = "";
    }
})

app.listen(3000);