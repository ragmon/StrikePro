$(function () {
    $(".contact-form").validate({
        rules: {
            name: {
                required: true,
                minlength: 4
            },
            email: {
                required: true,
                email: true,
                minlength: 6
            },
            telephone: {
                required: true,
                minlength: 10,
                number: true
            },
            message: {
                required: true,
                minlength: 15
            }
        },
        messages: {
            name: {
                required: "Имя обязательно для заполнения",
                minlength: "Имя должен быть минимум 4 символа"
            },
            email: {
                required: "Поле Email обязательно для заполнения",
                email: "Адрес электронной почты недействителен"
            },
            telephone: {
                required: "Поле телефон обязательно для заполнения",
                minlength: "Минимальная длинная 10 символов",
                number: "Номер должен содержать только цифры"
            },
            message: {
                required: "Поле сообщение обязательно для заполнения",
                minlength: "Минимальная длинная 15 символов"
            }
        }
    });
});

//# sourceMappingURL=contactForm.js.map
