const fetchingFields = {
    gender: true,
    name: true,
    location: true,
    email: false,
    login: true,
    registered: false,
    dob: true,
    phone: false,
    cell: false,
    id: true,
    picture: true,
    nat: false,
};

const baseURL = "https://randomuser.me/api/?inc=";
const nOfUsers = 10;
let usersData;

const requestUrl = createRequestUrl(baseURL, fetchingFields);

getUsers(createRequestUrl(baseURL, fetchingFields), nOfUsers);

function createRequestUrl(baseURL, fieldsObject) {
    return (
        baseURL +
        Object.keys(fieldsObject).reduce((addition, key) => {
            if (fieldsObject[key]) {
                addition += "," + key;
            }
            return addition;
        })
    );
}

async function getUsers(url, numberOfUsers) {
    url += `&results=${+numberOfUsers}&nat=ua`;
    console.log(url);
    usersData = (await getData(url)).results;
    console.log(usersData);
}

async function getData(requestUrl) {
    try {
        const response = await fetch(requestUrl);
        const json = await response.json();
        return json;
    } catch (error) {
        console.log(error);
    }
}

document.querySelector("#search_friends").addEventListener("click", (e) => {
    document.querySelector("#filters_menu_btn").removeAttribute("disabled");
});

document.querySelector("#filters_menu_btn").addEventListener("click", (e) => {
    document.querySelector(".main_aside").classList.toggle("hide");
    document.querySelector(".main").classList.toggle("main_filter_hidden");
    document
        .querySelector(".main_content")
        .classList.toggle("main_filter_hidden");
    //document.querySelector(".main_info").classList.toggle("hide");
});

document.querySelectorAll(".disable_filter_btn").forEach((button) =>
    button.addEventListener("click", (e) => {
        e.target.parentNode
            .querySelectorAll("input")
            .forEach((input) => (input.checked = false));
    })
);

document.querySelector(".found_users").addEventListener("click", (e) => {
    console.log(e);
    if (e.target.getAttribute("id") === "user_actions_preview") {
        e.target.src = (e.target.classList.contains("active"))
            ? "./icons/icon-preview.png"
            : "./icons/icon-hidden.png";
        e.path
            .find((node) => node.classList.contains("user_card"))
            .querySelector(".more_user_info")
            .classList
            .toggle("hide");
        e.target.classList.toggle("active");

    }
});
