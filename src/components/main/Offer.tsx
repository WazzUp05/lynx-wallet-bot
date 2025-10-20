'use client';
import Image from 'next/image';
import React from 'react';
import Slider from 'react-slick';
import ExportIcon from '@/components/icons/export.svg';

const Offer = () => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        arrows: false,
        dotsClass: 'slick-dots custom-dots',
    };

    const offers = [
        {
            title: 'Поделиться',
            description: 'Пригласи своих друзей на бета-тестирование',
            image: '/offer-robot.png',
        },
    ];

    return (
        <div className="offer-slider mb-[2.4rem]">
            <Slider {...settings}>
                {offers.map((offer, index) => (
                    <div key={index}>
                        <div className="p-[1.6rem] bg-gradient-to-r from-[#000000] to-[#061BFF] bg-[var(--yellow)] rounded-[2rem] w-full relative overflow-hidden">
                            <h2 className="text-[1.2rem] bg-[var(--dark-gray-secondary)] text-[var(--text-main)] w-fit leading-[130%] mb-[1rem] flex gap-[0.5rem] items-center py-[0.3rem] px-[0.7rem] rounded-[1.5rem] font-medium">
                                {offer.title}
                                <ExportIcon width={13} height={13} className="w-[1.3rem] h-[1.3rem]" />
                            </h2>
                            <p className="text-[1.4rem] leading-[130%] max-w-[16.2rem] text-[var(--text-main)]">
                                {offer.description}
                            </p>
                            <Image
                                src={offer.image}
                                alt="Offer Image"
                                width={234}
                                height={199}
                                className="mx-auto w-[13.4rem] h-[9.9rem] absolute right-0 top-[0.5rem] z-10"
                            />
                            <div className="absolute top-0 right-0 h-[12.8rem] w-[12.8rem] bg-white blur-[6rem] rounded-full" />
                        </div>
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default Offer;
