const foundFriendsDOM = document.querySelector(".found_users"),
    filtersFormDOM = document.querySelector(".filter_form"),
    textForSearch = document.querySelector(".text_search_input");

document.querySelector("#search_friends").addEventListener("click", searchFriendsButtonAction);

document.querySelector("#filters_menu_btn").addEventListener("click", (e) => {
    document.querySelector(".main_aside").classList.toggle("hide");
    document.querySelector(".main").classList.toggle("main_filter_hidden");
    document
        .querySelector(".main_content")
        .classList.toggle("main_filter_hidden");
});


filtersFormDOM.addEventListener("click", (e) => {
    if (e.target.classList.contains("formSubmit")) {
        renderFilteredAndSortedUsers();
    }
});

document.querySelector(".disable_filter_btn").addEventListener("click", (e) => {
    e.preventDefault();
    e.target.parentNode
        .querySelectorAll("input")
        .forEach((input) => (input.checked = false));
    renderFilteredAndSortedUsers();
});

document
    .querySelector("#theme_change_input_label")
    .addEventListener("click", (e) => {
        lightColorTheme = !lightColorTheme;
        e.target.classList.toggle("dark");
        const cssRoot = document.querySelector(":root");
        let theme;
        if (e.target.classList.contains("dark")) {
            theme = settings.themes.dark;
        } else {
            theme = settings.themes.light;
        }
        for (const cssVar in theme) {
            cssRoot.style.setProperty(`--${cssVar}`, `#${theme[cssVar]}`);
        }

        document.querySelectorAll("img").forEach((img) => {
            if (!img.classList.contains("user_avatar")) {
                img.src =
                    img.src.slice(0, -5) +
                    (lightColorTheme ? "l.png" : "d.png");
            }
        });
    });


    

    
foundFriendsDOM.addEventListener("click", (e) => {
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

textForSearch.addEventListener("input", (e) => {
    renderFilteredAndSortedUsers();
});
