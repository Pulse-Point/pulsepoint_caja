function formatPhone(input) {
    // Remove all non-numeric characters
    input = input.replace(/\D/g, '');

    // Insert hyphens at desired positions
    return input.replace(/^(\d{3})(\d{3})(\d{4})$/, '$1-$2-$3');
}

module.exports = formatPhone;