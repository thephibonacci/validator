/**
 *   @author: Fibo <thephibonacci@gmail.com>
 *   @version 1.0.0
 *   @copyright thephibonacci (c) 2023 - all right reserved
 * 
 *   @return {object}
 */
class Validator {
    #errors;

    constructor() {
        this.#errors = {};
    }

    make(data) {
        this.#clearErrors();
        if (typeof data === "object") {
            for (const dataKey in data) {
                let value;
                if (document.getElementsByName(dataKey)[0]) {
                    value = document.getElementsByName(dataKey)[0];
                } else {
                    console.error("Input not found")
                }
                if (Array.isArray(data[dataKey])) {
                    if (data[dataKey].includes("number")) {
                        this.#numberValidation(value, data[dataKey])
                    } else {
                        this.#normalValidation(value, data[dataKey])
                    }
                } else {
                    console.error("The rules must be an array")
                }
            }
            return this.#errors;
        } else {
            console.error("The input of the function must be an object")
        }
    }

    #numberValidation(data, rules) {
        for (let rule of rules) {
            rule = rule.toLowerCase()
            if (rule === "required") {
                if (!data.value || data.value.trim() === "" || typeof data === "undefined") {
                    this.#setError(data.name, "This field is required")
                }
            } else if (rule === "number") {
                if (isNaN(data.value)) {
                    this.#setError(data.name, "This field must be number")
                }
            } else if (rule.startsWith("min:")) {
                let min = rule.replace("min:", "")
                if (Number(data.value) < Number(min)) {
                    this.#setError(data.name, `min number equal or upper than ${min}`);
                }
            } else if (rule.startsWith("max:")) {
                let max = rule.replace("max:", "")
                if (Number(data.value) > Number(max)) {
                    this.#setError(data.name, `max number equal or lower than ${max}`);
                }
            } else if (rule.startsWith("regex:")) {
                let regexStr = rule.replace("regex:", "");
                let regex = new RegExp(regexStr);
                if (!regex.test(data.value)) {
                    this.#setError(data.name, `This pattern is not approved`);
                }
            }
        }
    }

    #normalValidation(data, rules) {
        for (let rule of rules) {
            rule = rule.toLowerCase()
            if (rule === "required") {
                if (!data.value || data.value.trim() === "" || typeof data === "undefined") {
                    this.#setError(data.name, "This field is required")
                }
            } else if (rule.startsWith("min:")) {
                let min = rule.replace("min:", "")
                if (data.value.length < Number(min)) {
                    this.#setError(data.name, `min length equal or upper than ${min}`);
                }
            } else if (rule.startsWith("max:")) {
                let max = rule.replace("max:", "")
                if (data.value.length > Number(max)) {
                    this.#setError(data.name, `max length equal or lower than ${max}`);
                }
            } else if (rule.startsWith("regex:")) {
                let regexStr = rule.replace("regex:", "");
                let regex = new RegExp(regexStr);
                if (!regex.test(data.value)) {
                    this.#setError(data.name, `This pattern is not approved`);
                }
            } else if (rule === "email") {
                if (!isEmail(data.value)) {
                    this.#setError(data.name, `must be email format`);
                }
            }
        }
    }

    #setError(field, message) {
        if (!this.#errors[field]) {
            this.#errors[field] = [];
        }
        this.#errors[field].push(message);
    }

    hasErrors() {
        return Object.keys(this.#errors).length > 0;
    }

    #clearErrors() {
        this.#errors = {};
    }

    isEmail(email) {
        return isEmail(email)
    }
}

const validator = new Validator();

function validation(object) {
    return validator.make(object);
}

function isEmail(email) {
    let regex = /[^\s@]+@[^\s@]+\.[^\s@]+/;
    return regex.test(email);
}