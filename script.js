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
const settings = {
    baseURL: "https://randomuser.me/api/",
    numberOfUsers: 6,
    nations: ["ua"],
    fieldsToFetch: {
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
    },
};

var usersData;

function createRequestUrl(baseURL, fieldsToFetch) {
    return Object.keys(fieldsToFetch)
        .reduce((addition, key) => {
            if (fieldsToFetch[key]) {
                addition += "," + key;
            }
            return addition;
        }, `${baseURL}?inc=`);
}

async function getUsers(url, numberOfUsers) {
    url += `&results=${+numberOfUsers}&nat=ua`;
    usersData = (await getData(url)).results;
}

async function getData(requestUrl) {
    try {
        const response = await fetch(requestUrl);
        const json = await response.json();
        return json;
    } catch (error) {
        showErrorMessage();
    }
}

function showErrorMessage() {
    document.querySelector(".found_users").innerHTML = `
        Ooops...</br>Something wrong with internet connection or server is busy.</br>Try later, please.`;
    toggleLoaderAnimation();
}

async function searchFriends() {
    await getUsers(createRequestUrl(settings.baseURL, settings.fieldsToFetch), settings.numberOfUsers);
    renderUserCards(usersData, document.querySelector(".found_users"));
    console.log(usersData);
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

document.querySelector("#search_friends").addEventListener("click", async function (e) {
    toggleLoaderAnimation();
    e.target.classList.remove("notclicked_yet");
    document.querySelector("#filters_menu_btn").classList.remove("hide");
    document.querySelector(".main_content").classList.remove("hide");
    document.querySelector(".main").classList.remove("hide");
    await searchFriends();
    toggleLoaderAnimation();
});

document.querySelector("#filters_menu_btn").addEventListener("click", (e) => {
    document.querySelector(".main_aside").classList.toggle("hide");
    document.querySelector(".main").classList.toggle("main_filter_hidden");
    document
        .querySelector(".main_content")
        .classList.toggle("main_filter_hidden");
});

function filteringFoundUsers(usersData) {
    const filtersInputsValues = parseFiltersInputs();
    console.log(filtersInputsValues);
    let filteredUsers = usersData;
    filtersInputsValues.forEach((filtersValues) => {
        if (filtersValues.length != 0) {
            filteredUsers = filterUserWithFiltersGroup(
                filteredUsers,
                filtersValues
            );
        } else {
            return usersData;
        }
    });
    return filteredUsers;
}

function toggleLoaderAnimation () {
    document.querySelector(".lds-ripple").classList.toggle("hide");
}

function filterUserWithFiltersGroup(users, filtersValues) {
    const arrayOfFilters = makeFiltersFunctions(filtersValues);
    return users.filter((user) => {
        const isRelatedByAnyFilter = arrayOfFilters
            .map((filter) => filter(user))
            .indexOf(true);
        return isRelatedByAnyFilter === -1 ? false : true;
    });
}

function parseFiltersInputs() {
    let filters = [];
    document.querySelectorAll(".filters_group").forEach((filtersGroup) => {
        filters.push(
            Array.from(filtersGroup.querySelectorAll(".filtering:checked"))
            .map((filter) => [filter.name, filter.value])
        );
    });
    return filters;
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

function createFilter(field, value, valueMax) {
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
}

document.querySelector(".main_aside").addEventListener("click", (e) => {
    if (e.target.classList.contains("filtering")) {
        renderUserCards(
            filteringFoundUsers(usersData),
            document.querySelector(".found_users")
        );
    }
});
