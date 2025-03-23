import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';


@Component({
	selector: 'app-pop-up',
	templateUrl: './pop-up.component.html',
	styleUrls: ['./pop-up.component.css']
})
export class PopUpComponent implements OnInit {

	sliderValue: number = 0;
	emoji: string = "🙂";

	slides = [{ text: `Greetings! <br> Kashifa Khatoon <br><br> Lets Begin 🙂 <br><br>`, nextSlide: 1 },
	{
		text: `How is your mood today? 😶‍🌫️`,
		options: [
			{ imgSrc: 'https://my-images-v1.s3.ap-south-1.amazonaws.com/1741514454716-bad-aparchit.png', nextSlide: 3 },
			{ imgSrc: 'https://my-images-v1.s3.ap-south-1.amazonaws.com/1741514551061-good.png', nextSlide: 2 }
		]
	},
	{
		text: `Awesome 🎉 <br>`,
		imgSrc: 'https://i.pinimg.com/originals/73/cc/a4/73cca45a93f91944b2c9fdd4b05c3c53.gif', nextSlide: 4
	},
	{ text: `How Bad ? 👀`, showSlider: 'true', nextSlide: 5 },
	{ text: `Here's a cute 🐶 video <br> to make it more Awesome 🎆`, video: 'https://my-images-v1.s3.ap-south-1.amazonaws.com/dog-new.mp4', nextSlide: 6 },
	{ text: `Here's a cute 🐱 video <br> to lighten up `, video: 'https://my-images-v1.s3.ap-south-1.amazonaws.com/cat_video.mp4', nextSlide: 6 },
	{ text: `Hope you enjoyed this 😅<br><br> once again... <br> Ramzan Mubarak! 🌙<br> The End!`, video: 'https://my-images-v1.s3.ap-south-1.amazonaws.com/ramzan.mp4', isLast: 'true' }
	];

	currentSlide = 0;
	animatedText = "";
	currentIndex = 0;
	currentSlideIndex = 0;

	showNextButton = false;
	showCursor = true;
	showOptions = false;
	showVideo = false;
	showClose = false;
	showSlider = false;
	showImg = false;


	constructor(
		public dialogRef: MatDialogRef<PopUpComponent>
	) { }

	ngOnInit(): void {
		this.startTypingAnimation();
		this.startCursorBlink();
	}

	resetVariables() {
		this.animatedText = "";
		this.currentIndex = 0;
		this.showNextButton = false;
		this.showOptions = false;
		this.showCursor = true;
		this.showVideo = false;
		this.showSlider = false;
		this.showImg = false;
	}

	startTypingAnimation() {
		this.resetVariables();
		const slide = this.slides[this.currentSlideIndex];

		const interval = setInterval(() => {
			if (this.currentIndex < slide.text.length) {
				this.animatedText += slide.text[this.currentIndex];
				this.currentIndex++;
			} else {
				clearInterval(interval);
				this.showCursor = false;
				if (slide.options) {
					this.showOptions = true;
				} else if (this.currentSlideIndex + 1 < this.slides.length) {
					this.showNextButton = true;
				}
				else {
					this.showNextButton = false;
					this.showClose = true;
				}

				if (slide.video) {
					this.showVideo = true;
				}
				if (slide.showSlider) {
					this.showSlider = true;
				}
				if (slide.imgSrc) {
					this.showImg = true;
				}

			}
		}, 50);
	}

	startCursorBlink() {
		setInterval(() => {
			if (!this.showNextButton) {
				this.showCursor = !this.showCursor;
			}
		}, 500);
	}

	onNextClick() {
		const nextSlideIndex = this.slides[this.currentSlideIndex].nextSlide;
		if (nextSlideIndex !== undefined) {
			this.currentSlideIndex = nextSlideIndex;
			this.startTypingAnimation();
		}
	}

	onOptionClick(nextSlideIndex: number) {
		this.currentSlideIndex = nextSlideIndex;
		this.startTypingAnimation();
	}

	updateEmoji() {
		if (this.sliderValue <= 40) {
			this.emoji = "😑";
		} else if (this.sliderValue > 40 && this.sliderValue <= 65) {
			this.emoji = "😠";
		} else {
			this.emoji = "😡";
		}
	}

	onClose() {
		this.dialogRef.close();
	}

}
