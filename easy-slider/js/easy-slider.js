class EasySlider {
    constructor(id, settings) {
        this.windowResizeController = true;
        this.easySlider = document.querySelector(id);
        this.defaultSettings = { ...settings };
        this.settings = settings;
        this.breakpoint = window.innerWidth;
        this.slider =  this.easySlider.querySelector('.easy-slider-list');
        this.slideList =  this.slider.querySelectorAll('.easy-slider-item');
        this.btnLeft = this.easySlider.querySelector('.btn-left');
        this.btnRight = this.easySlider.querySelector('.btn-right');   

        this.activeSlide = 0;
        if (this.slider) this.init();
    }

    autoPlay() {
        if(!this.isDown) {
            this.moveToLeft();
        }
    }

    moveToLeft() {
        console.log('moveToLeft');

        if (this.activeSlide + this.settings.slidesToScroll <= this.slideList.length - this.settings.slidesToShow) {
            this.activeSlide += this.settings.slidesToScroll;
        } else if (this.slideList.length - this.activeSlide - this.settings.slidesToShow <  this.settings.slidesToScroll &&  this.activeSlide + this.settings.slidesToShow < this.slideList.length ) {
            this.activeSlide += this.slideList.length - this.activeSlide - this.settings.slidesToShow;
        }
        else {
            this.activeSlide = 0;
        }

        this.slideList.forEach(item => {
            const curentPosition = (100 / this.settings.slidesToShow).toFixed(2) * this.activeSlide * -1;
            item.style.left = `calc(${curentPosition}% - ${this.activeSlide * (this.settings.interval / this.settings.slidesToShow)}px)`;
        });
    };

    moveToRight() {
        console.log('moveToRight');
        
        if (this.activeSlide < this.settings.slidesToScroll && this.activeSlide !=0 ) {
            this.activeSlide -= this.activeSlide;
        } else if (this.activeSlide > 0) {
            this.activeSlide -= this.settings.slidesToScroll;
        } else {
            this.activeSlide = this.slideList.length - this.settings.slidesToShow;
        }
        
        this.slideList.forEach(item => {
            const curentPosition = (100 / this.settings.slidesToShow).toFixed(2) * this.activeSlide * -1;
            item.style.left = `calc(${curentPosition}% - ${this.activeSlide * (this.settings.interval / this.settings.slidesToShow)}px)`;
        });
    };

    onClickLefrBtn() {
        console.log('clickOnLefrBtn');
        this.moveToRight();
    }
    
    onClickRightBtn() {
        console.log('clickOnRightBtn');
        this.moveToLeft();
    }

    onMouseDown(e) {
        console.log('onMouseDown');
        this.isDown = true;
        this.startClientX = e.clientX;
    }

    onMouseUp(e) {
        this.endClientX =  e.clientX;
        console.log('onMouseUp', this.startClientX, this.endClientX);
        if(this.startClientX == this.endClientX) {
            if (this.openHrefItem.href) {
                if (!this.openHrefItem.target) this.openHrefItem.target = '_self';
                window.open(this.openHrefItem.href, this.openHrefItem.target);
            }
        }
        this.isDown = false;
    }

    onMouseMove(e) {
        if (this.isDown) {
            console.log('onMouseMove');
            e.preventDefault();

            setTimeout(() => {
                if(this.startClientX < e.clientX) this.moveToRight();
                else if(this.startClientX > e.clientX) this.moveToLeft();
                console.log(this.startClientX , e.clientX);
            }, 50);
            this.isDown = false;
        }
    }

    onTouchDown(e) {
        console.log('onTouchDown');
        this.isDown = true;
        this.startClientX = e.touches[0].clientX;
    }

    onTouchUp(e) {
        this.endClientX =  e.changedTouches[0].clientX;
        console.log('onMouseUp', this.startClientX, this.endClientX);
        if(this.startClientX == this.endClientX) {
            if (this.openHrefItem.href) {
                if (!this.openHrefItem.target) this.openHrefItem.target = '_self';
                window.open(this.openHrefItem.href, this.openHrefItem.target);
            }
        }
        this.isDown = false;
    }

    onTouchMove(e) {
        if (this.isDown) {
            console.log('onTouchMove');
            e.preventDefault();

            setTimeout(() => {
                if(this.startClientX < e.touches[0].clientX) this.moveToRight();
                else if(this.startClientX > e.touches[0].clientX) this.moveToLeft();
                console.log(this.startClientX , e.touches[0].clientX);
            }, 50);
            this.isDown = false;
        }
    }

    onResize() {
        console.log('onResize');
        this.settings.responsive.forEach(breakpointItem => {
            if (breakpointItem.breakpoint >  window.innerWidth && breakpointItem.breakpoint != this.breakpoint) {
                this.settings = { ...this.settings, ...breakpointItem.settings };
                this.breakpoint = breakpointItem.breakpoint;
                console.log('New Settings');
                this.windowResizeController = true;
                this.styleBuilder();
            }
        });

        if (this.breakpoint <= window.innerWidth && this.windowResizeController) {
            this.settings =  { ...this.defaultSettings };
            this.windowResizeController = false;
            this.breakpoint = window.innerWidth;
            this.styleBuilder();
        }
    }

    styleBuilder () {
        this.slideList.forEach(item => {
            item.style.minWidth = `calc(${100 / this.settings.slidesToShow}% - ${this.settings.interval - this.settings.interval / this.settings.slidesToShow}px)`;
            item.style.marginRight = this.settings.interval + 'px';
        });
    }
        
    init() {
        this.btnLeft.addEventListener('click', this.onClickLefrBtn.bind(this));
        this.btnRight.addEventListener('click', this.onClickRightBtn.bind(this));

        this.slideList.forEach(item => {
            item.addEventListener('dragstart', (e) => e.preventDefault());
            item.addEventListener('click', (e) => e.preventDefault());
            item.addEventListener('mousedown', () => this.openHrefItem = item);
        });

        this.slider.addEventListener('mousedown', this.onMouseDown.bind(this));
        this.slider.addEventListener('mouseup', this.onMouseUp.bind(this));
        this.slider.addEventListener('mousemove', this.onMouseMove.bind(this));

        this.slider.addEventListener('touchstart', this.onTouchDown.bind(this));
        this.slider.addEventListener('touchend', this.onTouchUp.bind(this));
        this.slider.addEventListener('touchmove', this.onTouchMove.bind(this));

        window.addEventListener('resize', this.onResize.bind(this));
        this.onResize();
        if (this.settings.autoplaySpeed) setInterval(this.autoPlay.bind(this), this.settings.autoplaySpeed);
    }
}

/***********************************************************
# - interval: margins between slides are measured in pixels
# - slidesToShow: number of shown sliders
# - slidesToScroll: number of scrollable sliders
# - arrows: show pagination
# - autoplaySpeed: ms scrolling speed
***********************************************************/ 

// const easySliderSettings = {
//     arrows: false,
//     interval: 10,
//     slidesToShow: 3,
//     slidesToScroll: 3,
//     // autoplaySpeed: 1000,
//     responsive: [
//         {
//             breakpoint: 1024,
//             settings: {
//                 interval: 10,
//                 slidesToShow: 2,
//                 slidesToScroll: 1,
//                 arrows: false,
//             }
//         },
//         {
//             breakpoint: 768,
//             settings: {
//                 slidesToScroll: 1,
//                 slidesToShow: 1,
//                 interval: 0, 
//                 arrows: false,
//             }
//         }
//     ],
// };

// new EasySlider('#easy-slider_1', easySliderSettings);