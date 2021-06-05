const axios = require('axios');
const fs = require('fs');


const clientID = '';
const secretKey = '';
// let tokenType = '';

// const desinationStream = 7106516;
const destHub = 118754;
// const outputFile = 'unqork';
// const toppage = 15;
const ogData = require('./source.js');
const totalItems = ogData.length;



const auth = async (key, secret) => {
    return axios.post('https://v2.api.uberflip.com/authorize', {
        grant_type:	'client_credentials',
        client_id: key,
        client_secret: secret
    })
    .catch(function (error) {
        console.log(error);
        })
    .then(function (response) {
        // tokenType = response.data.token_type;
         const token = response.data.access_token;
        // console.log(token);
        return token;
    });

}


const updateStream = async (token, stream) => {
    
    return axios.post(`https://v2.api.uberflip.com/hubs/${destHub}/streams/${stream.id}/options`,{
        "visible_in_shout": stream.visible_in_shout,
        // "pinned_in_shout": stream.pinned_in_shout,
        // "hide_publish_date": stream.hide_publish_date,
        // "enable_preview_mode": stream.enable_preview_mode, // When checked, the Items in this Stream will be shortened and displayed with a 'Continue Reading' button
        // "paused": stream.paused,
        // allow_style: 0, //Allow insline styling
        // canonical_redirect: 1,
        // apply_tags: 0, // create tags from category in rss
        // author_match: 0,
        // canonical_meta: 0,
        // exclude_from_search: 1,
        // muted: 1, // exclude from latest content feed
    },
    {
        headers: {
            "Authorization": `Bearer ${token}`,
            "User-Agent": "NP Script",
            "Content-Type": "application/json",
        }
    })
    .then(res => {
        const data = res.data;
        const formatted = {
            stream: data.id
        };
        return formatted;
    })
    .catch(err => {
        console.log(err.response);
        console.log(`error in updating a stream`);
    })
};

const makeLoop = async (token, array) => {
    let runItems = 0;
    array.forEach(async (stream) => {
        const value = await updateStream(token, stream);
        runItems += 1;
        console.log(`item: ${value.stream} updated ${runItems} of ${totalItems}`);
    })

}

const run = async function(){
    const token = await auth(clientID, secretKey);
    // console.log(token);
    console.log('token created');
    const data = await makeLoop(token,ogData);
    console.log('complete');


};
run();


