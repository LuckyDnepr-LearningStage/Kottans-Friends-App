const fetchingFields = {
    "gender": true,
    "name": true,
    "location": true,
    "email": false,
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

document.querySelector("#search_friends").addEventListener('click', (e) => {
    document.querySelector("#filters_friends").removeAttribute("disabled");
});

document.querySelector("#filters_friends").addEventListener('click', (e) => {
    document.querySelector(".main_aside").classList.toggle("hide");
    document.querySelector(".main").classList.toggle("main_filter_hidden");
    document.querySelector(".main_content").classList.toggle("main_filter_hidden");
});

document.querySelectorAll(".disable_filter_btn").forEach(button => 
    button.addEventListener('click', (e) => {
        e.target.parentNode.querySelectorAll("input").forEach(input => input.checked = false);
    }
    ));

