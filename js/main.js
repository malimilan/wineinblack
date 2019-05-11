const inspirationsDiv = document.getElementById('inspirations');

prepareLayout = () => {
    for (let i = 1; i <= 6; i++) {
        let element = document.createElement('div');
        element.classList.add('post');
        if( i % 6 == 1 || i % 6 == 0 ){
            element.classList.add('featured');
        }
        inspirationsDiv.appendChild(element)
    }
}

const getInspiration = async () => {
    const result = await fetch('json/inspirations.json')
    const retrievedPosts = await result.json();
    const inspirationPosts = await retrievedPosts['inspirations']

    inspirationArray = Array.from(inspirationPosts);

    // filter specific post type
    const regularPosts = inspirationArray.filter( post => post.isFeatureStory == false );
    const featuredPosts = inspirationArray.filter( post => post.isFeatureStory == true );

    // get all divs
    const postDivs = document.querySelectorAll('.post');

    // filter divs by post type
    const regularDivs = Array.from(postDivs).filter(div => !div.classList.contains('featured'));
    const featuredDivs = Array.from(postDivs).filter(div => div.classList.contains('featured'));
    
    // insert featured posts
    for (let i = 0; i < featuredDivs.length; i++) {
        const element = featuredDivs[i];
        element.innerHTML = `
        <a href="#">
        <div class="img-holder"><img data-src="${featuredPosts[i].image}" alt="${featuredPosts[i].title}"></div>
            <p>${featuredPosts[i].category}</p>
            <h3>${featuredPosts[i].title}</h3>
            <p>${featuredPosts[i].label}</p>
            <div class="button">${featuredPosts[i].buttonText}</div>
        </a>`;
    }
    // insert regular posts
    for (let i = 0; i < regularDivs.length; i++) {
        const element = regularDivs[i];
        element.innerHTML = `
        <a href="#">
            <div class="img-holder"><img data-src="${regularPosts[i].image}" alt="${regularPosts[i].title}"></div>            
            <p>${regularPosts[i].category}</p>
            <h3>${regularPosts[i].title}</h3>
            <p>${regularPosts[i].label}</p>
            <div class="button">${regularPosts[i].buttonText}</div>
        </a>`;
    }
}


prepareLayout();
// if we use only getInspiration() without lazyload, we need to change template literal innerHTML "<img data-src" to "<img src"
// getInspiration();


// Lazyloading images using Intersection observer with offset - if we have lot of posts from .json file
getInspiration().then(() => {
    let images = document.querySelectorAll('#inspirations img');

    const interactSettings = {
    root: document.querySelector('#inspirations'),
    rootMargin: '0px 0px 500px 0px' };


    function onIntersection(imageEntites) {
    imageEntites.forEach(image => {
        if (image.isIntersecting) {
        observer.unobserve(image.target);
        image.target.src = image.target.dataset.src;
        image.target.onload = () => image.target.classList.add('loaded');
        }
    });
    }

    let observer = new IntersectionObserver(onIntersection, interactSettings);

    images.forEach(image => observer.observe(image));
});




