import { filterAndSortUsers } from "./filterAndSortUsers.js";
import { renderUsersCards } from "./renderUsersCards.js";
import { urlPropsActions } from "./urlPropsActions.js";

const settingsURL = "./settings.json";

let settings,
    usersData,
    filteredAndSortedUsers;

const foundUsersNode = $(".found_users"),
    filtersFormNode = $(".filter_form"),
    textForSearchNode = $(".text_search_input"),
    cssRoot = $(":root");

function urlPropsOnLoadPage(settings) {
    urlPropsActions.set("shownPages", "0");
    colorThemeStateOnLoadPage(settings);
    genderFilterStateOnLoadPage();
}

function colorThemeStateOnLoadPage (settings) {
    let colorTheme = urlPropsActions.get("colorTheme");
    if (colorTheme === null) {
        colorTheme = "light";
        urlPropsActions.set("colorTheme", colorTheme);
    }
    changeColorTheme(colorTheme, settings);
}

function genderFilterStateOnLoadPage () {
    let genderFilter = urlPropsActions.get("gender");
    if (genderFilter !== null && genderFilter !== "none") {
        genderFilter = genderFilter.split(",");
            genderFilter.forEach((filterValue) => {
                Array.from(
                    document.querySelectorAll("input[type=checkbox]")
                ).find((input) => input.value == filterValue).checked = true;
            });
        }
}

(async function onPageLoad() {
    settings = await getData(settingsURL);
    urlPropsOnLoadPage(settings);
    toggleLoaderAnimation();
    usersData = await getUsers(createRequestUrl(settings));
    renderFilteredAndSortedUsers();
    toggleLoaderAnimation();
    addShowMoreUsersButtonEventListener();
})();

function renderFilteredAndSortedUsers() {
    foundUsersNode.innerHTML = "";
    urlPropsActions.set("shownPages", "0");
    const filtersFormData = new FormData(filtersFormNode);
    const filterAndSortSettings = {
        filtersFormData: filtersFormData,
        filtersFields: settings.filtersFields,
        sortTypeDecrypter: settings.sortTypeDecrypter,
        fieldsForSearchText: settings.fieldsForSearchText,
        textForSearch: textForSearchNode.value,
    };
    filteredAndSortedUsers = filterAndSortUsers (usersData, filterAndSortSettings);
    renderNextPageOfUsers(settings.usersPerPage);
    addShowMoreUsersButtonEventListener();
}

function createRequestUrl(settings) {
    const fieldsToFetch = settings.fetchOptions.userFields,
        numberOfTotalUsers = settings.fetchOptions.numberOfTotalUsers,
        nations = settings.fetchOptions.nations.join(",");
    return (
        `${settings.fetchOptions.baseURL}?inc=` +
        Object.keys(fieldsToFetch)
            .filter((key) => fieldsToFetch[key])
            .join(",") +
        `&results=${+numberOfTotalUsers}&nat=${nations}`
    );
}

async function getUsers(url) {
    return (await getData(url)).results;
}

async function getData(requestUrl) {
    try {
        const response = await fetch(requestUrl);
        const json = await response.json();
        return json;
    } catch (error) {
        renderErrorMessage();
    }
}

function renderErrorMessage() {
    if (foundUsersNode) {
        foundUsersNode.innerHTML = `
        <div></div>
        <p class="error_massage">Ooops...</br>Something wrong with internet connection or server is busy.</br>Try later, please.</p>
        <div></div>`;
        toggleLoaderAnimation();
    } else {
    }
}

function toggleLoaderAnimation() {
    $(".lds-ripple").classList.toggle("hide");
}

function $(selector) {
    return document.querySelector(selector);
}

textForSearchNode.addEventListener("input", (e) => {
    renderFilteredAndSortedUsers();
});

filtersFormNode.addEventListener("click", (e) => {
    if (e.target.classList.contains("formSubmit")) {
        updatePropsInURL();
        renderFilteredAndSortedUsers();
    }
});

function updatePropsInURL () {
    const filtersFormData = new FormData(filtersFormNode);
    const searchProps = [...settings.filtersFields, "sorting"];
    searchProps.forEach(field => {
        const filterValues = filtersFormData.getAll(field);
        if (filterValues.length != 0) {
            urlPropsActions.set(field, filterValues.join(","));
        } else {
            urlPropsActions.del(field);
        }
    });
}


$("#filters_menu_input").addEventListener("change", (e) => {
    $(".main_aside").classList.toggle("hide");
    $(".main").classList.toggle("main_filter_hidden");
    $(".main_content").classList.toggle("main_filter_hidden");
});

$(".disable_sort_btn").addEventListener("click", (e) => {
    e.preventDefault();
    e.target.parentNode
        .querySelectorAll("input")
        .forEach((input) => (input.checked = false));
});

foundUsersNode.addEventListener("click", (e) => {
    if (e.target.getAttribute("id") === "user_actions_preview") {
        e.target.classList.toggle("active");
        showMoreUserInfo(e);
    }

    function showMoreUserInfo(e) {
        e.path
            .find((node) => node.classList.contains("user_card"))
            .querySelector(".more_user_info")
            .classList.toggle("hide");
    }
});

$("#theme_change_input_label").addEventListener("click", (e) => {
    const currentColorTheme = urlPropsActions.get("colorTheme");
    let newColorTheme;
    if (currentColorTheme === "light") {
        urlPropsActions.set("colorTheme", "dark");
        newColorTheme = "dark";
        e.target.innerText = "Dark theme";
    } else {
        urlPropsActions.set("colorTheme", "light");
        newColorTheme = "light";
        e.target.innerText = "Light theme";
    }
    changeColorTheme(newColorTheme, settings);
});

function changeColorTheme(newColorTheme, settings) {
    for (const cssVar in settings.themes[newColorTheme]) {
        cssRoot.style.setProperty(
            `--${cssVar}`,
            `${settings.themes[newColorTheme][cssVar]}`
        );
    }
}

function addShowMoreUsersButtonEventListener() {
    $("#show_more")
        .addEventListener("click", () => renderNextPageOfUsers(settings.usersPerPage));
}

function renderNextPageOfUsers (usersPerPage) {
    const shownPagesOfUsersCount = +urlPropsActions.get("shownPages");
        if (
            shownPagesOfUsersCount * usersPerPage <
            filteredAndSortedUsers.length
        ) {
            renderUsersCards(
                filteredAndSortedUsers,
                foundUsersNode,
                usersPerPage
            );
            urlPropsActions.set("shownPages", +shownPagesOfUsersCount + 1);
        }
    }
