/**
 * Module that contains the helper methods that are shared among
 * the scripts
 */
module.exports = {
    // renders the context using the selector to get the template
    render: (selector, context, clear = false) => {
        // if clear is set to true empty the DOM
        if (clear) {
            $('#root').html('');
        }
        // Retrieve the template data from the HTML (jQuery is used here).
        let template = $(selector).html();
        // Compile the template data into a function
        let templateScript = Handlebars.compile(template);
        // html = 'My name is Ritesh Kumar. I am a developer.'
        let html = templateScript(context);
        // Insert the HTML code into the page
        $('#root').append(html);
    },

    // compile the context using the selector to get the template
    compile: (selector, context) => {
        // Retrieve the template data from the HTML (jQuery is used here).
        let template = $(selector).html();
        // Compile the template data into a function
        let templateScript = Handlebars.compile(template);
        // html = 'My name is Ritesh Kumar. I am a developer.'
        let html = templateScript(context);
        return html;
    },
}