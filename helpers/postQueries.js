export const postQuery = async(query, token, isAdmin) => {

    const request = {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            'content-Type': 'application/json',
            // 'Authorization': token,
            // 'x-hasura-admin-secret': 'zbBHgSPKclNupJYEF3X3IHevWiTQHMRgeOrvyK8cfZ2c6BcdVtwaN3W6tV74DnD9',
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        body: JSON.stringify(query)
    }

    if(isAdmin){
        request.headers['x-hasura-admin-secret'] = 'zbBHgSPKclNupJYEF3X3IHevWiTQHMRgeOrvyK8cfZ2c6BcdVtwaN3W6tV74DnD9';
    } else {
        request.headers['Authorization'] = token;
    }

    const url = `https://pleasing-stag-47.hasura.app/v1/graphql`;

    const resp = await fetch(url, request);
    
    const {data} = await resp.json();
    // console.log(data);
    
    return data;
}