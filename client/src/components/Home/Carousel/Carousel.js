"use client"
// ======================== Imports ========================
import 'flowbite';
import React, { useEffect, useState } from 'react'
import { Carousel } from "flowbite-react";
import FetchCarouselImages from '@/Helper/FetchCarouselImages';
import './Carousel.css'

export function CarouselCompo() {
	const [CarouselImages, setCarouselImages] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			try {
				const res = await FetchCarouselImages();
				if (res.success && res.data.length > 0) {
					setCarouselImages(res.data);
				} else {
					// Fallback to static data if no images from backend
					const fallbackData = [
						{ ImageLink: "/images/collegepic(1).jpg" },
						{ ImageLink: "/images/collegepic(2).jpg" },
						{ ImageLink: "/images/collegepic(9).png" }
					];
					setCarouselImages(fallbackData);
				}
			} catch (error) {
				console.error("Error loading carousel:", error);
				// Fallback to static data on error
				const fallbackData = [
					{ ImageLink: "/images/collegepic(1).jpg" },
					{ ImageLink: "/images/collegepic(2).jpg" },
					{ ImageLink: "/images/collegepic(9).png" }
				];
				setCarouselImages(fallbackData);
			}
			setLoading(false);
		};
		fetchData();
	}, []);


	return (
		<div className="h-80 md:h-[30rem]">
			{loading ? (
				<div className="h-full w-full flex items-center justify-center bg-gray-200">
					<div className="animate-pulse text-gray-500 text-xl">Loading...</div>
				</div>
			) : (
				CarouselImages && CarouselImages.length > 0 && (
					<Carousel>
						{CarouselImages.map((image, index) => (
							<div key={image._id || index} className="relative h-full w-full">
								<img
									src={image.ImageLink}
									alt={`carousel-${index}`}
									className="object-cover h-full w-full"
								/>
							</div>
						))}
					</Carousel>
				)
			)}
		</div>
	);
}