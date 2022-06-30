import fetch, { Headers } from 'node-fetch'
import fs from "fs"

var categories = "Track Name , Artist , Streams Per Week ,  Album \n";
fs.writeFile('out.csv', categories, err => {
    if (err) {
        console.error(err);
    }
});

var currentDate = new Date();
var firstday = new Date(currentDate.setDate(currentDate.getDate() - 3 - currentDate.getDay())).toUTCString();
var lastday = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay() + 10)).toUTCString();
console.log(firstday, lastday)

let arr = []

while (lastday.toString() !== "2010-01-07") {
    var currentDate = new Date(firstday);
    var firstday = new Date(currentDate.setDate(currentDate.getDate() - 2 - currentDate.getDay())).toUTCString();
    lastday = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay() + 11)).toISOString().replace(/T.*/, '').split('-').join('-');

    arr.push(lastday);
}

async function grabToken() {
    var myHeaders = new Headers();
    myHeaders.append("authority", "accounts.spotify.com");
    myHeaders.append("accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9");
    myHeaders.append("accept-language", "en-US,en;q=0.9");
    myHeaders.append("cookie", "MANUALLY GET COOKIES FROM WEBSITE");
    myHeaders.append("referer", "https://charts.spotify.com/");
    myHeaders.append("sec-ch-ua", "\".Not/A)Brand\";v=\"99\", \"Google Chrome\";v=\"103\", \"Chromium\";v=\"103\"");
    myHeaders.append("sec-ch-ua-mobile", "?0");
    myHeaders.append("sec-ch-ua-platform", "\"Windows\"");
    myHeaders.append("sec-fetch-dest", "iframe");
    myHeaders.append("sec-fetch-mode", "navigate");
    myHeaders.append("sec-fetch-site", "same-site");
    myHeaders.append("upgrade-insecure-requests", "1");
    myHeaders.append("user-agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36");

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    const response = fetch("MANUALLY GET THIS FROM THE NETWORK TAB SHOULD LOOK SOMETHING LIKE THIS: https://accounts.spotify.com/oauth2/v2/auth?response_type=code&client_id=44407c71b3b24071865aaa4fea948a15&scope=user-read-email+user-read-private+ugc-image-upload&redirect_uri=https%3A%2F%2Fcharts.spotify.com&code_challenge=ztpqHsN82_nJFzCxFh0iNfsqZAu0TDKex18FGXsWMP4&code_challenge_method=S256&state=rJbWPMWbL%7EMulSVDbDBqWOZghYhSN-Qu&response_mode=web_message&prompt=none", requestOptions)
        .then(response => response.text())
        .catch(error => console.log('error', error));

    
    var json = await response;
    var re = /([\w-]+):([^,]+)/g;

    var m;
    var map = {};

    while ((m = re.exec(json)) != null) {
    map[m[1]] = m[2];
    }
    
    var arr = JSON.parse(map["response"] + "}")

    var authtoken = arr["code"];
    console.log(authtoken);


    var Bearer = await grabBearerToken(authtoken);

    return Bearer;
}

var Bearer = await grabToken();

async function grabBearerToken(authToken) {
    var myHeaders = new Headers();
    myHeaders.append("authority", "accounts.spotify.com");
    myHeaders.append("accept", "application/json");
    myHeaders.append("accept-language", "en-US,en;q=0.9");
    myHeaders.append("content-type", "application/x-www-form-urlencoded;charset=UTF-8");
    myHeaders.append("origin", "https://charts.spotify.com");
    myHeaders.append("referer", "https://charts.spotify.com/");
    myHeaders.append("sec-ch-ua", "\".Not/A)Brand\";v=\"99\", \"Google Chrome\";v=\"103\", \"Chromium\";v=\"103\"");
    myHeaders.append("sec-ch-ua-mobile", "?0");
    myHeaders.append("sec-ch-ua-platform", "\"Windows\"");
    myHeaders.append("sec-fetch-dest", "empty");
    myHeaders.append("sec-fetch-mode", "cors");
    myHeaders.append("sec-fetch-site", "same-site");
    myHeaders.append("user-agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36");
    myHeaders.append("Cookie", "__Host-device_id=AQACAgJ_GxDUxyd62gqfm9VcnQubfdkXLhs17_OLSVlgj1qcAXzyQ9j9AfbTZrucXM1pRqOeWNxDdxe84fhGydShLxGAg9pTfWo; __Host-sp_csrf_sid=e9debb2817e96835f0e22d14d7c1ad61020bc092f2b9e654ac941d1c2c8a7397; csrf_token=AQDq7AUYXyJeU2vLQhehVmucpza88tn0phkc1usfBrui0oGmCq05_4S3Xf8kI4uxdp3tjsBud8w6j-2b; sp_sso_csrf_token=013acda71921cc235452979402b55f57823b89edc631363536363033383731343938; sp_tr=false");

    var raw = "grant_type=authorization_code&client_id=44407c71b3b24071865aaa4fea948a15&code=" + authToken + "&redirect_uri=https%3A%2F%2Fcharts.spotify.com&code_verifier=IUhVco5kB4K6536sX3y%7Eg7Q5rY6%7ESFwFIBUQa-8iV25xpdU-Anxz%7EQ2tk7Inm21NtYQ7Nau6zKl4Zr8_9_s-VNUtCnaCoK8cx8gC12IqepK0eBdhqEzEz1cLbDCAZ_rk";


    var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
    };

    const response = fetch("https://accounts.spotify.com/api/token", requestOptions)
    .then(response => response.json())
    .catch(error => console.log('error', error));

    var json = await response;

    return json["access_token"];
}



async function loadNames() {
    for (var x = 0; x < arr.length; x++) {
        var myHeaders = new Headers();
        myHeaders.append("authority", "charts-spotify-com-service.spotify.com");
        myHeaders.append("accept", "application/json");
        myHeaders.append("accept-language", "en-US,en;q=0.9");
        myHeaders.append("app-platform", "Browser");
        myHeaders.append("authorization", "Bearer " + Bearer);
        myHeaders.append("content-type", "application/json");
        myHeaders.append("origin", "https://charts.spotify.com");
        myHeaders.append("referer", "https://charts.spotify.com/");
        myHeaders.append("sec-ch-ua", "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"102\", \"Google Chrome\";v=\"102\"");
        myHeaders.append("sec-ch-ua-mobile", "?0");
        myHeaders.append("sec-ch-ua-platform", "\"Windows\"");
        myHeaders.append("sec-fetch-dest", "empty");
        myHeaders.append("sec-fetch-mode", "cors");
        myHeaders.append("sec-fetch-site", "same-site");
        myHeaders.append("spotify-app-version", "0.0.0.production");
        myHeaders.append("user-agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36");

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        const response = fetch("https://charts-spotify-com-service.spotify.com/auth/v0/charts/regional-global-weekly/" + arr[x], requestOptions)
            .then(response => response.json())
            .catch(error => {
                console.log('Error: Bearer Token is incorrect. Trying to grab a new one...')
                Bearer = "Incorrect";
            });
        
        console.log(Bearer);
        if(Bearer == "Incorrect") {
            Bearer = await grabToken();
        }
        var jsonTxt = await response;
        if(!jsonTxt) {
            x - 1;
            continue;
        }
        //console.log(jsonTxt)

        for (var i = 0; i < jsonTxt["entries"].length; i++) {
            var artists = '';
            for (var c = 0; c < jsonTxt["entries"][i]["trackMetadata"]["artists"].length; c++) {
                artists += jsonTxt["entries"][i]["trackMetadata"]["artists"][c]["name"];
                if (!(c === jsonTxt["entries"][i]["trackMetadata"]["artists"].length - 1)) {
                    artists += "; ";
                }
            }
            var trackName = ''
            var artistName = ''
            var content;

            try {
                trackName = jsonTxt["entries"][i]["trackMetadata"]["trackName"].replaceAll(',', '.')
                artistName = artists.replaceAll(',', '.')

                content = trackName + " , " + artistName + ' , ' + jsonTxt["entries"][i]["chartEntryData"]["rankingMetric"]["value"];

                var albumURL = "https://api.spotify.com/v1/tracks/" + (jsonTxt["entries"][i]["trackMetadata"]["trackUri"].split(":"))[2]

                console.log(albumURL);

                const response = fetch(albumURL, requestOptions)
                    .then(response => response.json())
                    .catch(error => console.log('Error: Bearer Token is incorrect.'));

                var json = await response;


                if (json["album"]["album_type"] == 'album') {
                    if (json["album"]["name"].includes(',')) {
                        var something = json["album"]["name"].replaceAll(',', ';');
                    }
                    else {
                        var something = json["album"]["name"]
                    }
                    content += ', ' + something;
                }

                content += '\n';
                console.log(content);

                fs.appendFile('out.csv', content, err => {
                    if (err) {
                        console.error(err);
                    }
                    // file written successfully
                });
            } catch (error) {
                continue
            }


        }
    }
}
loadNames();


