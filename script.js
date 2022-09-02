const fetchingFields = {
    "gender": true,
    "name": true,
    "location": true,
    "email": true,
    "login": false,
    "registered": false,
    "dob": true,
    "phone": false,
    "cell": false,
    "id": false,
    "picture": true,
    "nat": false
};

const baseURL = "https://randomuser.me/api/?inc=";
const nOfUsers = 10;
let usersData;

const requestUrl = createRequestUrl(baseURL, fetchingFields);

getUsers (createRequestUrl(baseURL, fetchingFields), nOfUsers);

function createRequestUrl (baseURL, fieldsObject) {
    return baseURL + Object.keys(fieldsObject).reduce((addition, key) => {
        if (fieldsObject[key]) {
            addition += "," + key;
        }
        return addition;
    });
}

async function getUsers (url, numberOfUsers) {
    url += `&results=${+numberOfUsers}&nat=ua`;
    console.log(url);
    usersData = (await getData (url)).results;
    console.log(usersData);
}

async function getData (requestUrl) {
    try {
        const response = await fetch(requestUrl);
        const json = await response.json();
        return json;
    } catch (error) {
        console.log(error);
    }
}

