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

const actionsButtonsImages = [
    {
        id: "user_actions_chat",
        src: "./icons/icon-chat.png",
    },
    {
        id: "user_actions_add",
        src: "./icons/icon-add-friend.png",
    },
    {
        id: "user_actions_preview",
        src: "./icons/icon-preview.png",
    },
];

const baseURL = "https://randomuser.me/api/";
const nOfUsers = 24;
let usersData;

const requestUrl = createRequestUrl(baseURL, fetchingFields);

function createRequestUrl(baseURL, fieldsObject) {
    return (
        baseURL +
        "?inc=" +
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
}

async function getData(requestUrl) {
    try {
        const response = await fetch(requestUrl);
        const json = await response.json();
        return json;
    } catch (error) {
        showError(error);
    }
}

function showError(error) {
    console.log(error);
    document.querySelector(".found_users").innerHTML = `
        Ooops...</br>Something wrong with internet connection or server is busy.</br>Try later, please.`;
    document.querySelector(".lds-ripple").classList.add("hide");
}

async function searchFriends() {
    await getUsers(createRequestUrl(baseURL, fetchingFields), nOfUsers);
    renderUserCards(usersData, document.querySelector(".found_users"));
    console.log(usersData);
    document.querySelector(".lds-ripple").classList.toggle("hide");
}

function renderUserCards(usersData, container) {
    container.innerHTML = usersData
        .map((user) => {
            return (
                `<div class="user_card">` +
                createUserCardAvatarHTML(user) +
                createUserCardLessInfo(user) +
                createUserCardActionsButtons() +
                createUserCardMoreInfo(user) +
                `</div>`
            );
        })
        .join("");
}

function createUserCardAvatarHTML(user) {
    return `<img
            src="${user.picture.large}"
            alt=""
            class="user_avatar"/>`;
}

function createUserCardLessInfo(user) {
    let gSymbol = "";
    switch (user.gender) {
        case "female":
            gSymbol = "&#9792";
            break;
        case "male":
            gSymbol = "&#9794";
            break;
        default:
            break;
    }
    return `<div class="less_user_info">
            <p class="user_nickname">
            ${user.login.username} ${gSymbol};
            </p>
            <p class="user_age">Age: ${user.dob.age}</p>
            </div>`;
}

function createUserCardActionsButtons() {
    return (
        `<div class="user_actions">` +
        actionsButtonsImages
            .map((actionImg) => {
                return `<img
                    src="${actionImg.src}"
                    alt=""
                    class="user_actions_icon"
                    id="${actionImg.id}"
                />`;
            })
            .join("") +
        `</div>`
    );
}

function createUserCardMoreInfo(user) {
    return `<div class="more_user_info hide">
                <p>
                    <span class="extra_field">First name:</span>
                    ${user.name.first}
                </p>
                <p>
                    <span class="extra_field"
                        >Second name:</span
                    >
                    ${user.name.last}
                </p>
                <p>
                    <span class="extra_field"
                        >Day OF Birth:</span
                    >
                    ${dobOfUser(user.dob.date)}
                </p>
                <p>
                    <span class="extra_field">Location:</span>
                    ${user.location.city}, ${user.location.country}
                </p>
            </div>`;
}

function dobOfUser(date) {
    return new Date(date).toDateString();
}

document.querySelector("#search_friends").addEventListener("click", (e) => {
    document.querySelector(".lds-ripple").classList.toggle("hide");
    e.target.classList.remove("notclicked_yet");
    document.querySelector("#filters_menu_btn").classList.remove("hide");
    document.querySelector(".main_content").classList.remove("hide");
    document.querySelector(".main").classList.remove("hide");
    searchFriends();
});

document.querySelector("#filters_menu_btn").addEventListener("click", (e) => {
    document.querySelector(".main_aside").classList.toggle("hide");
    document.querySelector(".main").classList.toggle("main_filter_hidden");
    document
        .querySelector(".main_content")
        .classList.toggle("main_filter_hidden");

});

function filteringFoundUsers(usersData) {
    const filtersInputs = parseFiltersInputs();
    if (filtersInputs.length != 0) {
        const arrayOfFilters = makeFiltersFunctions(filtersInputs),
            filteredUsers = usersData.filter((user) => {
                const isRelatedByAnyFilter = arrayOfFilters
                    .map((filter) => filter(user))
                    .indexOf(true);
                return isRelatedByAnyFilter === -1 ? false : true;
            });
        return filteredUsers;
    } else {
        return usersData;
    }
}

function parseFiltersInputs() {
    return Array.from(document.querySelectorAll(".filtering"))
        .filter((filter) => filter.checked === true)
        .map((filter) => {
            return [filter.name, filter.value];
        });
}

function makeFiltersFunctions(filters) {
    return filters.map((filter) => {
        switch (filter[0]) {
            case "gender":
                return createFilter("gender", filter[1]);
            case "age":
                return createFilter(
                    "age",
                    filter[1].split(" ")[0],
                    filter[1].split(" ")[1]
                );
            default:
                break;
        }
    });
}

document.querySelectorAll(".disable_filter_btn").forEach((button) =>
    button.addEventListener("click", (e) => {
        e.target.parentNode
            .querySelectorAll("input")
            .forEach((input) => (input.checked = false));
    })
);

document.querySelector(".found_users").addEventListener("click", (e) => {
    if (e.target.getAttribute("id") === "user_actions_preview") {
        e.target.src = e.target.classList.contains("active")
            ? "./icons/icon-preview.png"
            : "./icons/icon-hidden.png";
        e.path
            .find((node) => node.classList.contains("user_card"))
            .querySelector(".more_user_info")
            .classList.toggle("hide");
        e.target.classList.toggle("active");
    }
});

function createFilter(field, value, valueMax = undefined) {
    return function (user) {
        return checkField(user);

        function checkField(object) {
            for (let prop in object) {
                if (typeof object[prop] === "object") {
                    if (checkField(object[prop])) {
                        return true;
                    }
                } else if (
                    prop === field &&
                    (valueMax === undefined
                        ? object[prop] === value
                        : object[prop] >= value && object[prop] <= valueMax)
                ) {
                    return true;
                }
            }
            return false;
        }
    };
    /*
        for (let prop in user) {
            if (typeof prop === "object") {
                return this(prop);
            } else {
                if (
                    prop === field &&
                    (valueMax === undefined
                        ? user[prop] === value
                        : user[prop] >= value && user[prop] <= valueMax)
                ) {
                    return true;
                } else {
                    continue;
                }
            }
            return false;
        }
    };
     */
}

document.querySelector(".main_aside").addEventListener("click", (e) => {
    console.log(e.target);
    if (e.target.classList.contains("f_element")) {
        renderUserCards(filteringFoundUsers(usersData), document.querySelector(".found_users"));
    }
})
