export const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
};

export const referalLink = (referralCode: string) => {
    return `${window.location.origin}/${referralCode}`;
};
