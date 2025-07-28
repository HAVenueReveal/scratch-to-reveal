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
        
        this.container = document.createElement("figure");
        this.container.className = "venue";

        this.revealCard = document.createElement("canvas");
        this.revealCard.className = "venue-card";
        this.revealCard.style.backgroundImage = `url('${bkgdImg}')`;
        this.revealCard.height = height;
        this.revealCard.width = width;
        this.container.appendChild(revealCard);

        if (caption) {
            this.venueCaption = document.createElement("figcaption");
            this.venueCaption.innerText = caption;
            this.container.appendChild(venueCaption);
        }

        // can try changing this brush size
        this.brushRadius = Math.max(50, (this.revealCard.width / 100) * 5);
        
        const coverImage = new Image();
        coverImage.src = previewImg;
        coverImage.onload = function() {  
            let bridgeCanvas = self.revealCard.getContext("2d");
            bridgeCanvas.drawImage(coverImage, 0, 0, self.revealCard.width, self.revealCard.height);
        }

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
