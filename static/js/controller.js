/*
 * controller.js
 *
 * Write all your code here.
 */

$(document).ready(function () {
    // ############################# //
    //            PART 1             //
    // ############################# //

    function validateUsername() {
        const username = $("#username").val();
        const regex = /^[a-zA-Z0-9_]{6,}$/;

        if (!regex.test(username)) {
            $("#username").css("background-color", "red");
            $("#username_notification").text("Username is invalid");
            return false;
        } else {
            $("#username").css("background-color", "");
            $("#username_notification").text("");
            return true;
        }
    }

    function validatePassword() {
        const password = $("#password1").val();
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;

        if (!regex.test(password)) {
            $("#password1").css("background-color", "red");
            $("#password1_notification").text("Password is invalid");
            return false;
        } else {
            $("#password1").css("background-color", "");
            $("#password1_notification").text("");
            return true;
        }
    }

    function validateRepeatPassword() {
        const password1 = $("#password1").val();
        const password2 = $("#password2").val();

        if (password1 !== password2) {
            $("#password2").css("background-color", "red");
            $("#password2_notification").text("Passwords don't match");
            return false;
        } else {
            $("#password2").css("background-color", "");
            $("#password2_notification").text("");
            return true;
        }
    }

    function validateEmail() {
        const email = $("#email").val();
        const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if (email !== "" && !regex.test(email)) {
            $("#email").css("background-color", "red");
            $("#email_notification").text("Email is invalid");
            return false;
        } else {
            $("#email").css("background-color", "");
            $("#email_notification").text("");
            return true;
        }
    }

    function validatePhone() {
        const phone = $("#phone").val();
        const regex = /^\d{3}-\d{3}-\d{4}$/;

        if (phone !== "" && !regex.test(phone)) {
            $("#phone").css("background-color", "red");
            $("#phone_notification").text("Phone is invalid");
            return false;
        } else {
            $("#phone").css("background-color", "");
            $("#phone_notification").text("");
            return true;
        }
    }

    // Event handler for input changes
    $("input").on("input", function () {
        validateUsername();
        validatePassword();
        validateRepeatPassword();
        validateEmail();
        validatePhone();
    });

    // Event handler for form submission
    $("#register").on("click", function () {
        const isValidUsername = validateUsername();
        const isValidPassword = validatePassword();
        const isValidRepeatPassword = validateRepeatPassword();
        const isValidEmail = validateEmail();
        const isValidPhone = validatePhone();

        // If any field is invalid, show an error message
        if (
            !isValidUsername ||
            !isValidPassword ||
            !isValidRepeatPassword ||
            !isValidEmail ||
            !isValidPhone
        ) {
            $("#notification").text(
                "At least one field is invalid. Please correct it before proceeding."
            );
        } else {
            // If all fields are valid, send the request
            const requestData = {
                username: $("#username").val(),
                password1: $("#password1").val(),
                password2: $("#password2").val(),
                email: $("#email").val(),
                phone: $("#phone").val(),
            };

            $.ajax({
                url: "/register",
                method: "POST",
                contentType: "application/json",
                data: JSON.stringify(requestData),
                success: function () {
                    $("#notification").text("User added");
                },
                statusCode: {
                    400: function () {
                        $("#notification").text("Unknown error occurred");
                    },
                    405: function () {
                        $("#notification").text("Method not allowed.");
                    },
                    409: function () {
                        $("#notification").text("");
                        $("#username_notification").text("Username has already been taken");
                    },
                },
            });
        }
    });

    // ############################# //
    //            PART 2             //
    // ############################# //

    let cartItems = [];

    function getCartItems() {
        return cartItems;
    }

    function getCartItemByName(name) {
        return cartItems.find((item) => item.name === name);
    }

    function addCartItem(item) {
        const existingItem = getCartItemByName(item.name);

        if (existingItem) {
            existingItem.quantity += item.quantity;
            existingItem.total = existingItem.price * existingItem.quantity;
        } else {
            cartItems.push(item);
        }
    }

    function increaseCartItem(itemName) {
        existingItem = getCartItemByName(itemName);
        existingItem.quantity += 1;
        existingItem.total = existingItem.price * existingItem.quantity;
    }

    function decreaseCartItem(itemName) {
        existingItem = getCartItemByName(itemName);
        existingItem.quantity = Math.max(0, existingItem.quantity - 1);
        existingItem.total = existingItem.price * existingItem.quantity;
    }

    function removeCartItem(itemName) {
        cartItems = cartItems.filter((item) => item.name !== itemName);
    }

    function updateCartTable() {
        const cartItems = getCartItems();

        $("#cart-items tbody").empty();

        let subtotal = 0;
        const taxRate = 0.13;

        // Iterate through the cart items and update the table
        cartItems.forEach((item) => {
            const itemId = item.name.replace(/ /g, "_");
            const price = parseFloat(item.price);
            const quantity = parseInt(item.quantity);
            const totalPrice = price * quantity;

            // Update subtotal
            subtotal += parseFloat(totalPrice);

            // Create a new row for the item
            const newRow = $("<tr>")
                .attr("id", itemId)
                .append($("<td>").text(item.name))
                .append($("<td>").text("$" + price.toFixed(2)))
                .append($("<td>").text(quantity))
                .append($("<td>").text("$" + totalPrice.toFixed(2)))
                .append(
                    $("<td>").append($("<button>").addClass("btn decrease").text("-"))
                )
                .append(
                    $("<td>").append($("<button>").addClass("btn increase").text("+"))
                )
                .append(
                    $("<td>").append($("<button>").addClass("btn delete").text("delete"))
                );

            // Append the new row to the table
            $("#cart-items tbody").append(newRow);
        });

        // Update subtotal, taxes, and grand total
        const taxes = subtotal * taxRate;
        const grandTotal = subtotal + taxes;

        // Update the corresponding elements with the calculated values
        $("#subtotal").text(subtotal.toFixed(2));
        $("#taxes").text(taxes.toFixed(2));
        $("#grand_total").text(grandTotal.toFixed(2));
    }

    // Event handler for Add/Update Item button
    $("#add_update_item").on("click", function () {
        const itemName = $("#name").val().trim();
        const price = $("#price").val();
        const quantity = $("#quantity").val();

        // Validate input
        if (
            !itemName ||
            !price ||
            !quantity ||
            isNaN(parseFloat(price)) ||
            isNaN(parseInt(quantity))
        ) {
            $("#item_notification").text("Name, price, or quantity is invalid");
            return;
        }

        // Clear error message and input fields
        $("#item_notification").text("");
        $("#name").val("");
        $("#price").val("");
        $("#quantity").val("");

        addCartItem(new Item(itemName, parseFloat(price), parseInt(quantity)));
        updateCartTable();
    });

    // Event delegation for the decrease, increase, and delete buttons
    $("#cart-items").on("click", ".btn.decrease", function () {
        const itemName = $(this).closest("tr").attr("id").replace(/_/g, " ");
        decreaseCartItem(itemName);
        updateCartTable();
    });

    $("#cart-items").on("click", ".btn.increase", function () {
        const itemName = $(this).closest("tr").attr("id").replace(/_/g, " ");
        increaseCartItem(itemName);
        updateCartTable();
    });

    $("#cart-items").on("click", ".btn.delete", function () {
        const itemName = $(this).closest("tr").attr("id").replace(/_/g, " ");
        removeCartItem(itemName);
        updateCartTable();
    });

    updateCartTable();

    // ############################# //
    //            PART 3             //
    // ############################# //
    const NUM_PARAGRAPH_PER_REQUEST = 5;
    let page = 1;
    let next = true;
    let fetchingData = false;

    function fetchData() {
        if (fetchingData) return;

        if (!next) {
            renderEndMessage();
            return;
        }

        fetchingData = true;

        $.ajax({
            url: `/text/data?paragraph=${page}`,
            method: "GET",
            success: function (response) {
                renderData(response.data);
                page += NUM_PARAGRAPH_PER_REQUEST;
                next = response.next;
            },
            error: function () {
                console.log("Error fetching data");
            },
            complete: function () {
                fetchingData = false;
            },
        });
    }

    function renderData(data) {
        const dataContainer = $("#data");

        data.forEach((item) => {
            const paragraphId = `paragraph_${item.paragraph}`;
            const div = $(`<div id="${paragraphId}"></div>`);
            const paragraphContent = `<p>${item.content} <b>(Paragraph: ${item.paragraph})</b></p>`;
            const likeButton = `<button class="btn like">Likes: ${item.likes}</button>`;

            div.append(paragraphContent);
            div.append(likeButton);
            dataContainer.append(div);

            $(`#${paragraphId} .like`).click(function () {
                const paragraphNumber = item.paragraph;

                // Send an AJAX request to update likes
                $.ajax({
                    url: '/text/like',
                    method: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify({ "paragraph": paragraphNumber }),
                    success: function (response) {
                        // Update the likes count in the button
                        $(`#${paragraphId} .like`).text(`${response.data.likes} likes`);
                    },
                    error: function (error) {
                        console.error('Error updating likes:', error);
                    }
                });
            });
        });
    }

    function renderEndMessage() {
        if ($("#endMessage").length === 0) {
            const endMessage =
                '<p id="endMessage"><b>You have reached the end.</b></p>';
            $("#data").append(endMessage);
        }
    }

    // Scroll event listener to fetch data when user reaches the bottom
    $(window).scroll(function () {
        if (
            $(window).scrollTop() + $(window).height() >=
            $(document).height() - 1
        ) {
            fetchData();
        }
    });

    // Initial fetch of data
    fetchData();
});
