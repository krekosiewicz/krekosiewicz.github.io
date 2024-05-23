import { config } from '../data/config.js';

const defaultFooterContent = (config) => `
    <p class="hideOnMobile">If you’re looking for a developer who combines technical skill with creative problem-solving and teamwork, I would love to chat about how I can contribute to your next project!</p>
    <p style="word-wrap:break-word;">Contact: <a href="mailto:${config.contactEmail}">${config.contactEmail}</a></p>
`;

const simpleFooterContent = (config) => `
     <p style="word-wrap:break-word;">Contact: <a href="mailto:${config.contactEmail}">${config.contactEmail}</a></p>

`;

const footerContentMap = {
    advanced: defaultFooterContent,
    simple: simpleFooterContent,
};

export const createFooter = (type = 'simple') => {
    const footer = document.createElement('div');
    footer.className = 'footer';
    const getContent = footerContentMap[type] || footerContentMap['simple'];
    footer.innerHTML = getContent(config);
    return footer;
};