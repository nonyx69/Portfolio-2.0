/*Attend que le HTML soit tous charger*/
document.addEventListener('DOMContentLoaded', () => {

    const header = document.getElementById('header');
    const nav = document.getElementById('nav');
    const curseur = document.getElementById('curseur');

    /*Fait un tableau avec les sections dans la nav-bar*/
    const liens = Array.from(document.querySelectorAll('.lien-nav'));


    /*****Header au scroll*****/


    /*Met et enleve la partis noir quand on descend de 40px*/
    const checkScroll = () => header.classList.toggle('scrolled', window.scrollY > 40);
    checkScroll();
    window.addEventListener('scroll', checkScroll, { passive: true });


    /*****Zone rouge*****/


    /*Rectangle rouge sous les liens avec element / souris ou la navigation*/
    const placerCurseur = (element) => {
        if (!element || !curseur || !nav) return;
        const boxElement = element.getBoundingClientRect();
        const boxNav = nav.getBoundingClientRect();

        /*Récupere la position précise du lien et du menu parent*/
        curseur.style.left = `${boxElement.left - boxNav.left}px`;
        curseur.style.width = `${boxElement.width}px`;

        /*Affiche la zone rouge*/
        curseur.style.opacity = '1';

        /*Affiche la zone rouge si le lien est survolé*/
        liens.forEach(l => l.classList.toggle('survole', l === element));
    };

    /*Cache la zone rouge et remet la couleur de base (rouge)*/
    const cacherCurseur = () => {
        if (!curseur) return;
        curseur.style.opacity = '0';
        liens.forEach(l => l.classList.remove('survole'));
    };


    /*****Survole*****/


    /*Quand souris sur lien la zone rouge ci déplace*/
    liens.forEach(lien => {
        lien.addEventListener('mouseenter', () => placerCurseur(lien));
    });

    /*Vérif souris dessus menu puis recherche lien qui correspond et remet le curseur dessus sinon il le cache*/
    let survolNav = false;
    nav.addEventListener('mouseenter', () => { survolNav = true; });
    nav.addEventListener('mouseleave', () => {
        survolNav = false;
        const lienActif = liens.find(l => l.classList.contains('actif'));
        lienActif ? placerCurseur(lienActif) : cacherCurseur();
    });


    /*****Scroll*****/


    /*Active la zone rouge sur le lien selon la section ou on se trouve (#)*/
    const sections = liens
        .map(lien => document.querySelector(lien.getAttribute('href')))
        .filter(Boolean);

    /*Création d'observer qui controlle l'apparition de sections (#)*/
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = `#${entry.target.id}`;

                /*Met a jour la class '.actif' sur le bon lien*/
                liens.forEach(lien => {
                    lien.classList.toggle('actif', lien.getAttribute('href') === id);
                });

                /*Si le user n'est pas sur menu (a la souris)on pmet la zone rouge automatiquement sur le lien de la section actif*/
                if (!survolNav) {
                    const lienActif = liens.find(l => l.getAttribute('href') === id);
                    placerCurseur(lienActif);
                }
            }
        });
        /*Zone de détection (-45% en haut et en bas)*/
    }, { rootMargin: '-45% 0px -45% 0px' });

    /*Lance l'observation sur chaque section*/
    sections.forEach(sec => observer.observe(sec));
});