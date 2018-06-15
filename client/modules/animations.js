module.exports = {
    // dispatcher => apply animation on selector
    dispatch: (selector, animation) => {
        let animationClass = `${animation}`;
        if (selector.hasClass(animationClass)) {
            selector.removeClass(animationClass);
            setTimeout(() => {
                selector.addClass(animationClass);
            }, 0);
            return;
        }
        selector.addClass(animationClass);
    },
    // animation presets
    presets: {
        errorShake: 'animated shake error-border',
        rotate: 'rotating',
    },
};