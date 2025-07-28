function isLeftClick(event) {
    if ("buttons" in event) {
        return event.buttons === 1;
    } else if ("which" in event) {
        return event.which === 1;
    } else {
        return event.button === 1;
    }
}

class VenueReveal {
    constructor(previewImg, bkgdImg, height, width, caption) {
        const self = this;

        this.ready = false;
        this.eventId = `e${Math.random()}`;
        
        this.container = document.createElement("figure");
        this.container.className = "venue";

        this.revealCard = document.createElement("canvas");
        this.revealCard.className = "venue-card";
        this.revealCard.style.backgroundImage = `url('${bkgdImg}')`;
        this.revealCard.height = height;
        this.revealCard.width = width;

        // can try changing this brush size
        this.brushRadius = Math.max(50, (this.revealCard.width / 100) * 5);
        
        this.coverImage = new Image();
        this.coverImage.src = previewImg;
        this.coverImage.addEventListener("load", () => {  
            let bridgeCanvas = self.revealCard.getContext("2d");
            bridgeCanvas.drawImage(self.coverImage, 0, 0, self.revealCard.width, self.revealCard.height);
            self.container.appendChild(self.revealCard);

            if (caption) {
                let venueCaption = document.createElement("figcaption");
                venueCaption.innerText = caption;
                self.container.appendChild(this.venueCaption);
            }
        });

        this.revealCard.addEventListener("mousemove", function(e) {
            if (isLeftClick(e)) {
                let brushPos = self.getBrushPos(e.clientX, e.clientY);
                self.drawDot(brushPos.x, brushPos.y);
            }
        }, false);
        
        this.revealCard.addEventListener("touchmove", function(e) {
            e.preventDefault();
            let touch = e.targetTouches[0];
            if (touch) {
                let brushPos = self.getBrushPos(touch.pageX, touch.pageY);
                self.drawDot(brushPos.x, brushPos.y);
            }
        }, false);
    }

    attach(parent) {
        parent.appendChild(this.container);
    }
    
    getBrushPos(xRef, yRef) {
        let bridgeRect = this.revealCard.getBoundingClientRect();
        return {
            x: Math.floor((xRef-bridgeRect.left)/(bridgeRect.right-bridgeRect.left) * this.revealCard.width),
            y: Math.floor((yRef-bridgeRect.top)/(bridgeRect.bottom-bridgeRect.top) * this.revealCard.height)
        };
    }
          
    drawDot(x, y) {
        let bridgeCanvas = this.revealCard.getContext("2d");
    	bridgeCanvas.beginPath();
        bridgeCanvas.arc(x, y, this.brushRadius, 0, 2 * Math.PI, true);
        bridgeCanvas.fillStyle = "#000";
        bridgeCanvas.globalCompositeOperation = "destination-out";
        bridgeCanvas.fill();
    }
}

const venues = [
    new VenueReveal(
        "ReceptionCover.png",
        "FortedeCruzReveal.jpg",
        465, 750,
        "Hansa & Ajit Wedding Venue Reveal - Scratch to find out!"
    ),
    new VenueReveal(
        "ReceptionCover.png",
        "FortedeCruzReveal.jpg",
        465, 750,
        "Test 2"
    ),
    new VenueReveal(
        "ReceptionCover.png",
        "FortedeCruzReveal.jpg",
        465, 750
    )
];

addEventListener("DOMContentLoaded", (event) => {
    const venueContainer = document.getElementById("venue-container");
    venues.forEach((venue) => venue.attach(venueContainer));
});
